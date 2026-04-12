/* eslint-disable */
// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 });
    }

    const resolvedParams = await params;
    const bookingId = Number(resolvedParams.id);

    if (!bookingId) {
      return NextResponse.json({ error: "ID đơn hàng không hợp lệ" }, { status: 400 });
    }

    // Lấy chi tiết đơn hàng từ DB
    let booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        car: {
          include: { user: true } // Kéo luôn thông tin chủ xe (để lấy SĐT và Tên)
        }
      }
    });

    if (!booking) {
      return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
    }

    // 🚀 BẮT ĐẦU: CHIÊU THỨC LAZY UPDATE (HỦY ĐƠN QUÁ HẠN 20 PHÚT)
    if (booking.status === "PENDING") {
      const createdAtTime = new Date(booking.createdAt).getTime();
      const currentTime = Date.now();
      const EXPIRY_MINUTES = 20;

      // Nếu hiện tại - lúc tạo > 20 phút
      if (currentTime - createdAtTime > EXPIRY_MINUTES * 60 * 1000) {
        // Cập nhật ngầm dưới Database thành Đã hủy
        const updatedBooking = await prisma.booking.update({
          where: { id: bookingId },
          data: { status: "CANCELLED" },
          include: { car: { include: { user: true } } }
        });
        
        // Gán lại dữ liệu mới để trả về cho người dùng
        booking = updatedBooking;
      }
    }
    // 🚀 KẾT THÚC LAZY UPDATE

    // Bảo mật: Chỉ cho phép người đặt xe hoặc chủ xe được xem đơn này
    const isRenter = booking.userEmail === session.user.email;
    const isOwner = booking.car?.user?.email === session.user.email;
    
    if (!isRenter && !isOwner && session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Bạn không có quyền xem đơn hàng này" }, { status: 403 });
    }

    return NextResponse.json({ success: true, booking });

  } catch (error: any) {
    console.error("LỖI LẤY CHI TIẾT ĐƠN HÀNG:", error);
    return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
  }
}