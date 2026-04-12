/* actions/payment.action.ts */
"use server";

import crypto from "crypto";

// 1. Hàm tạo ngày chuẩn múi giờ Việt Nam (GMT+7) cực kỳ khắt khe của VNPay
function getVnTimeFormat() {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
    });
    const parts = formatter.formatToParts(date);
    const p = {} as Record<string, string>;
    parts.forEach(part => { p[part.type] = part.value; });
    return `${p.year}${p.month}${p.day}${p.hour}${p.minute}${p.second}`;
}

// 2. Hàm sắp xếp tham số chính chủ từ tài liệu VNPay
function sortObject(obj: Record<string, string | number>) {
    const sorted: Record<string, string> = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
        // Mã hóa URI chuẩn xác và đổi dấu cách thành dấu +
        sorted[key] = encodeURIComponent(String(obj[key])).replace(/%20/g, "+");
    });
    return sorted;
}

export async function createVNPayUrl(bookingId: string, amount: number, paymentMethod: string) {
    // Đã fallback sẵn mã Sandbox của bạn để test ngay không cần lo file .env bị lỗi
    const tmnCode = process.env.VNPAY_TMN_CODE || "GZ16H6Z8"; 
    const secretKey = process.env.VNPAY_HASH_SECRET || "YQQUTQONNYFYVBLZJXZMIGXXQMQKYQYF";
    const vnpUrl = process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    const returnUrl = process.env.VNPAY_RETURN_URL || "http://localhost:3000/payment/vnpay-return";

    const createDate = getVnTimeFormat();
    
    // Rút gọn ID và thêm timestamp để tránh vượt quá giới hạn 100 ký tự của vnp_TxnRef
    const safeBookingId = bookingId ? bookingId.slice(-8) : "ERR_ID";
    const txnRef = `${safeBookingId}_${new Date().getTime()}`; 

    // 3. Cấu hình các tham số bắt buộc (Đảm bảo định dạng chuẩn)
    const vnp_Params: Record<string, string | number> = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: tmnCode,
        vnp_Locale: "vn",
        vnp_CurrCode: "VND",
        vnp_TxnRef: txnRef,
        // Dùng tiếng Việt không dấu, không chứa ký tự đặc biệt để tránh lỗi 03
        vnp_OrderInfo: `Thanh toan don hang ${safeBookingId}`, 
        vnp_OrderType: "other",
        // VNPay bắt buộc số tiền phải nhân lên 100 lần và phải là SỐ NGUYÊN
        vnp_Amount: Math.floor(amount * 100), 
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: "127.0.0.1",
        vnp_CreateDate: createDate,
    };

    // 4. Sắp xếp tham số
    const sortedParams = sortObject(vnp_Params);

    // 5. Tự nối chuỗi SignData (Triệt tiêu hoàn toàn lỗi double-encode)
    const signData = Object.entries(sortedParams)
        .map(([key, val]) => `${key}=${val}`)
        .join('&');
    
    // 6. Băm dữ liệu tạo chữ ký điện tử HMAC SHA512
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    // 7. Hoàn thiện URL và trả về cho Client
    return `${vnpUrl}?${signData}&vnp_SecureHash=${signed}`;
}