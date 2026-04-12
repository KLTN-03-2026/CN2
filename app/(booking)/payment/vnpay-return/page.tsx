/* app/payment/vnpay-return/page.tsx */
import { CheckCircle2, XCircle, Home, Calendar, AlertCircle } from "lucide-react";
import Link from "next/link";

// Đã sửa lại cú pháp import chuẩn khớp với file của bạn (bỏ dấu ngoặc nhọn)
// Lưu ý: Nếu file prisma của bạn để ở thư mục khác (vd: utils/prisma), hãy sửa lại đường dẫn "@/lib/prisma" cho đúng nhé.
import prisma from "@/lib/prisma";
import { sendBookingEmail } from "@/lib/mail";

export default async function VNPayReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 1. Lấy dữ liệu VNPay trả về
  const params = await searchParams;
  const responseCode = params["vnp_ResponseCode"] as string;
  const txnRef = params["vnp_TxnRef"] as string; 
  const amount = params["vnp_Amount"] ? Number(params["vnp_Amount"]) / 100 : 0;
  const bookingInfo = (params["vnp_OrderInfo"] as string) || "Thanh toán dịch vụ BonbonCar";

  // Mã "00" có nghĩa là giao dịch thành công
  const isSuccess = responseCode === "00";

  // 2. LOGIC CẬP NHẬT DATABASE (Đã fix lỗi kiểu dữ liệu Int)
  // 2. LOGIC CẬP NHẬT DATABASE VÀ GỬI MAIL
  if (isSuccess && txnRef) {
    try {
      const bookingIdString = txnRef.split("_")[0];
      const bookingId = parseInt(bookingIdString, 10);

      if (!isNaN(bookingId)) {
        // 1. Tìm đơn hàng KÈM THÊM thông tin Khách hàng (user) và Xe (car)
        const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          include: { 
            user: true, 
            car: true 
          }
        });

        if (booking) {
          const isFullPayment = amount >= booking.totalPrice;

          // 2. Tự động duyệt đơn hàng trong Database
          await prisma.booking.update({
            where: { id: bookingId },
            data: {
              paymentMethod: isFullPayment ? "FULL_PAY" : "DEPOSIT",
              paymentStatus: isFullPayment ? "PAID_FULL" : "DEPOSITED", 
              status: "CONFIRMED", 
            }
          });

          // 3. TỰ ĐỘNG GỬI MAIL THÔNG BÁO CHO KHÁCH (MỚI THÊM)
          if (booking.user?.email && booking.car?.name) {
            try {
              // Gọi đúng hàm từ file mail.ts của bạn, truyền vào 4 tham số
              await sendBookingEmail(
                booking.user.email,
                booking.user.name || "Quý khách", 
                booking.car.name,
                "CONFIRMED"
              );
              console.log(`Đã gửi mail xác nhận thành công cho: ${booking.user.email}`);
            } catch (mailError) {
              // Bọc try-catch riêng cho mail để nếu mạng lag gửi mail lỗi, giao diện web vẫn báo thanh toán thành công
              console.error("Lỗi khi gửi email:", mailError);
            }
          }
        }
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật Database:", error);
    }
  }

  // 3. GIAO DIỆN HIỂN THỊ
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-24 pb-20">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* HEADER TRẠNG THÁI */}
        <div className={`p-10 text-center ${isSuccess ? "bg-green-50" : "bg-red-50"}`}>
          {isSuccess ? (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-500 rounded-3xl flex items-center justify-center text-white mb-4 animate-bounce shadow-lg shadow-green-200">
                <CheckCircle2 size={40} />
              </div>
              <h1 className="text-2xl font-black text-green-900 uppercase italic tracking-tighter">
                Thanh toán thành công
              </h1>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-red-500 rounded-3xl flex items-center justify-center text-white mb-4 shadow-lg shadow-red-200">
                <XCircle size={40} />
              </div>
              <h1 className="text-2xl font-black text-red-900 uppercase italic tracking-tighter">
                Giao dịch thất bại
              </h1>
            </div>
          )}
        </div>

        {/* NỘI DUNG CHI TIẾT */}
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-50 pb-4">
              <span className="text-[10px] font-black text-gray-400 uppercase italic tracking-widest">Số tiền</span>
              <span className="font-black text-blue-900 text-xl italic">{amount.toLocaleString()}đ</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-gray-50 pb-4">
              <span className="text-[10px] font-black text-gray-400 uppercase italic tracking-widest">Mã giao dịch</span>
              <span className="font-bold text-gray-600 text-xs">{txnRef}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <span className="text-[10px] font-black text-gray-400 uppercase italic tracking-widest">Nội dung</span>
              <span className="text-xs font-bold text-gray-600 truncate max-w-[180px]">{bookingInfo}</span>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 text-center font-medium leading-relaxed bg-gray-50 p-4 rounded-2xl">
            {isSuccess 
              ? "Cảm ơn bạn đã tin tưởng BonbonCar. Chuyến đi của bạn đã được xác nhận và lưu vào hệ thống." 
              : "Đã có lỗi xảy ra hoặc bạn đã hủy giao dịch. Vui lòng thử lại hoặc liên hệ hỗ trợ."}
          </p>
          {/* --- KHỐI LƯU Ý CHÍNH SÁCH HỦY (Thêm mới) --- */}
<div className="mt-8 bg-orange-50 border border-orange-200 p-5 rounded-[24px] text-left">
  <h3 className="text-orange-800 font-black uppercase italic text-sm mb-3 flex items-center gap-2">
    <AlertCircle size={18} className="text-orange-600" /> 
    Chính sách hủy chuyến & Hoàn tiền
  </h3>
  <ul className="text-orange-700 text-[11px] md:text-xs space-y-2 font-medium">
    <li className="flex gap-2">
      <span className="font-black text-orange-500">•</span>
      <span><strong className="font-black">Miễn phí hủy:</strong> Trước 24 tiếng so với thời gian nhận xe. Hoàn 100% tiền.</span>
    </li>
    <li className="flex gap-2">
      <span className="font-black text-orange-500">•</span>
      <span><strong className="font-black">Phí hủy 30%:</strong> Từ 24 tiếng đến 12 tiếng trước giờ nhận xe.</span>
    </li>
    <li className="flex gap-2">
      <span className="font-black text-orange-500">•</span>
      <span><strong className="font-black">Không hỗ trợ hủy:</strong> Sau 12 tiếng trước khi nhận xe. Vui lòng liên hệ Hotline nếu có sự cố.</span>
    </li>
  </ul>
</div>

          {/* CÁC NÚT ĐIỀU HƯỚNG */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-600 py-4 rounded-2xl font-black uppercase italic text-[10px] tracking-widest hover:bg-gray-200 transition-all"
            >
              <Home size={16} /> Trang chủ
            </Link>
            
            {/* Đã sửa link trỏ về trang /profile của Khoa */}
            <Link 
              href="/profile"
              className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black uppercase italic text-[10px] tracking-widest transition-all shadow-lg ${
                isSuccess 
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200" 
                  : "bg-gray-900 text-white hover:bg-black shadow-gray-200"
              }`}
            >
              <Calendar size={16} /> Lịch sử thuê xe
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}