/* eslint-disable */
// @ts-nocheck
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Lưu ý nhỏ: Thông thường ở Next.js bạn nên dùng 'import prisma from "@/app/lib/prisma";' 
// giống các file khác để tránh lỗi đầy connection pool, nhưng tôi vẫn giữ nguyên cấu trúc của bạn nhé.
const prisma = new PrismaClient();

export async function PATCH(request: Request) {
  try {
    const { bookingId, userEmail, reason } = await request.json();

    if (!bookingId || !userEmail) {
      return NextResponse.json({ error: "Xác thực không hợp lệ" }, { status: 400 });
    }

    // 1. Tìm đơn hàng và kiểm tra quyền sở hữu
    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) },
      include: { user: true }
    });

    if (!booking || booking.user.email !== userEmail) {
      return NextResponse.json({ error: "Bạn không có quyền thực hiện thao tác này" }, { status: 403 });
    }

    // =================================================================
    // 2. LUẬT HỦY ĐƠN MỚI (ĐỒNG BỘ VỚI BỘ NÃO TRUNG TÂM)
    // =================================================================
    
    // 2.1 Từ chối nếu đơn đã bị hủy từ trước (tránh spam API)
    if (booking.status === "CANCELLED") {
      return NextResponse.json({ error: "Đơn hàng này đã được hủy từ trước." }, { status: 400 });
    }

    // 2.2 Nếu đơn ĐÃ DUYỆT, kiểm tra xem có sát giờ quá không (Dưới 24h)
    if (booking.status === "CONFIRMED") {
      const now = Date.now();
      const startDate = new Date(booking.startDate).getTime();
      const hoursUntilStart = (startDate - now) / (1000 * 60 * 60);
      
      // Chặn đứng hành vi hủy sát giờ khởi hành
      if (hoursUntilStart < 24) {
        return NextResponse.json(
          { error: "Không thể tự hủy chuyến đi sát giờ khởi hành (dưới 24h). Vui lòng liên hệ Hotline CSKH." }, 
          { status: 400 }
        );
      }
    }

    // 2.3 Chốt chặn an toàn cuối cùng: Chỉ xử lý PENDING hoặc CONFIRMED hợp lệ
    if (booking.status !== "PENDING" && booking.status !== "CONFIRMED") {
       return NextResponse.json({ error: "Trạng thái đơn hàng không hợp lệ để thực hiện thao tác hủy." }, { status: 400 });
    }
    // =================================================================

    // 3. Vượt qua mọi bài test -> Cập nhật trạng thái và lưu lý do + số tiền hoàn
    const updated = await prisma.booking.update({
      where: { id: Number(bookingId) },
      data: { 
        status: "CANCELLED",
        cancelReason: reason || "Khách hàng chủ động hủy" 
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Lỗi Cancel API:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi xử lý yêu cầu hủy" }, { status: 500 });
  }
}