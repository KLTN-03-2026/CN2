/* eslint-disable */
// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; 

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "VUI LÒNG ĐĂNG NHẬP ĐỂ SỬ DỤNG MÃ GIẢM GIÁ" }, 
        { status: 401 }
      );
    }
    
    const currentUserId = Number(session.user.id);
    
    // Lấy thông tin chuyến đi từ Frontend gửi lên
    const { code, startDate, endDate, totalPrice } = await request.json();
    const now = new Date(); 

    // 1. Tìm mã trong hệ thống
    const promo = await prisma.promotion.findUnique({
      where: { code: code.toUpperCase() }
    });

    // 2. Kiểm tra tồn tại và trạng thái
    if (!promo || !promo.isActive) {
      return NextResponse.json({ error: "MÃ GIẢM GIÁ KHÔNG TỒN TẠI HOẶC ĐÃ BỊ VÔ HIỆU HÓA" }, { status: 404 });
    }

    // 3. Kiểm tra Hạn sử dụng của mã
    if (new Date(promo.startDate) > now) {
      return NextResponse.json({ error: `MÃ NÀY CHƯA ĐẾN HẠN. HÃY QUAY LẠI VÀO NGÀY ${new Date(promo.startDate).toLocaleDateString('vi-VN')}` }, { status: 400 });
    }
    if (new Date(promo.expiryDate) < now) {
      return NextResponse.json({ error: "MÃ GIẢM GIÁ NÀY ĐÃ HẾT HẠN SỬ DỤNG" }, { status: 400 });
    }

    // ======================================================================
    // 🛡️ BỨC TƯỜNG LỬA NGHIỆP VỤ (BUSINESS LOGIC) - ĐÃ VÁ LỖ HỔNG
    // ======================================================================

    // 🛡️ CHỐT CHẶN 0: Bắt buộc phải có ngày tháng cho các mã yêu cầu tính toán thời gian
    const requiresDates = ["LONG_TRIP", "WEEKEND", "EARLY_BIRD"].includes(promo.type) || 
                          promo.code.includes("3NGAY") || 
                          promo.code.includes("CUOITUAN") || 
                          promo.code.includes("DATSOM");

    if (requiresDates && (!startDate || !endDate)) {
      return NextResponse.json({ 
        error: "VUI LÒNG CHỌN NGÀY NHẬN VÀ TRẢ XE TRƯỚC KHI ÁP DỤNG MÃ ƯU ĐÃI NÀY!" 
      }, { status: 400 });
    }

    // 🛡️ CHỐT CHẶN 1: Chống dùng lại mã (Mỗi User dùng 1 lần)
    const hasUsedPromo = await prisma.booking.findFirst({
      where: {
        userId: currentUserId,
        promoCode: promo.code,
        status: { not: "CANCELLED" } // Nếu đơn cũ bị hủy thì cho phép dùng lại
      }
    });

    if (hasUsedPromo) {
      return NextResponse.json({ error: "BẠN ĐÃ SỬ DỤNG MÃ ƯU ĐÃI NÀY RỒI!" }, { status: 400 });
    }

    // 🛡️ CHỐT CHẶN 2: Mã Tân Binh (Chỉ cho người chưa từng hoàn thành chuyến nào)
    if (promo.type === "NEW_USER" || promo.code.includes("NEW")) {
      const pastBookingsCount = await prisma.booking.count({
        where: {
          userId: currentUserId,
          status: { not: "CANCELLED" }
        }
      });
      if (pastBookingsCount > 0) {
        return NextResponse.json({ error: "MÃ NÀY CHỈ DÀNH CHO KHÁCH HÀNG ĐẶT CHUYẾN ĐẦU TIÊN!" }, { status: 400 });
      }
    }

    // 🛡️ CHỐT CHẶN 3: Thuê dài ngày (Đúng chuẩn >= 3 ngày, thiếu 1 phút cũng từ chối)
    if (promo.type === "LONG_TRIP" || promo.code.includes("3NGAY")) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      const durationMs = end - start;
      const threeDaysInMs = 3 * 24 * 60 * 60 * 1000; // Chính xác 72 giờ

      if (durationMs < threeDaysInMs) {
        return NextResponse.json({ error: "MÃ NÀY CHỈ ÁP DỤNG CHO CHUYẾN ĐI TỪ ĐỦ 3 NGÀY (72 GIỜ) TRỞ LÊN." }, { status: 400 });
      }
    }

    // 🛡️ CHỐT CHẶN 4: Mã Cuối Tuần (Chỉ nhận xe vào Thứ 7 hoặc Chủ Nhật)
    if (promo.type === "WEEKEND" || promo.code.includes("CUOITUAN")) {
      const startDayOfWeek = new Date(startDate).getDay(); // 0 là Chủ Nhật, 6 là Thứ 7
      if (startDayOfWeek !== 0 && startDayOfWeek !== 6) {
        return NextResponse.json({ error: "MÃ NÀY CHỈ ÁP DỤNG KHI BẮT ĐẦU NHẬN XE VÀO THỨ 7 HOẶC CHỦ NHẬT." }, { status: 400 });
      }
    }

    // 🛡️ CHỐT CHẶN 5: Chuyến đi thứ 5 (Phải có đúng 4 chuyến ĐÃ HOÀN THÀNH trước đó)
    if (promo.type === "LOYALTY_5" || promo.code.includes("LAN5")) {
      const completedBookings = await prisma.booking.count({
        where: {
          userId: currentUserId,
          status: { in: ["COMPLETED", "RETURNED"] } // Chỉ tính những chuyến đi đã thành công
        }
      });
      
      if (completedBookings !== 4) {
        return NextResponse.json({ error: `MÃ NÀY CHỈ ÁP DỤNG CHO ĐƠN HÀNG THỨ 5. BẠN HIỆN ĐÃ HOÀN THÀNH ${completedBookings} CHUYẾN.` }, { status: 400 });
      }
    }

    // 🛡️ CHỐT CHẶN 6: Mã Early Bird (Phải đặt xe trước ít nhất 7 ngày)
    if (promo.type === "EARLY_BIRD" || promo.code.includes("DATSOM")) {
      const start = new Date(startDate).getTime();
      const advanceTimeMs = start - now.getTime();
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

      if (advanceTimeMs < sevenDaysInMs) {
        return NextResponse.json({ error: "MÃ 'ĐẶT SỚM' NÀY YÊU CẦU BẠN PHẢI ĐẶT XE TRƯỚC ÍT NHẤT 7 NGÀY." }, { status: 400 });
      }
    }

    // ======================================================================

    // 5. Vượt qua mọi bài test -> Trả về thông tin mã giảm giá hợp lệ
    return NextResponse.json({
      code: promo.code,
      discount: promo.discount,
      type: promo.type,
      title: promo.title
    });

  } catch (error) {
    console.error("LỖI KIỂM TRA MÃ:", error);
    return NextResponse.json({ error: "LỖI HỆ THỐNG KIỂM TRA MÃ" }, { status: 500 });
  }
}