import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Kiểm tra đăng nhập bảo mật
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 });
    }

    const resolvedParams = await params;
    const bookingId = Number(resolvedParams.id);
    const { reason } = await req.json();

    if (!reason) {
      return NextResponse.json({ error: "Thiếu lý do báo cáo." }, { status: 400 });
    }

    // Lấy thông tin đơn hàng hiện tại để kiểm tra quyền
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Không tìm thấy đơn hàng." }, { status: 404 });
    }

    const currentUserId = Number(session.user.id);
    if (existingBooking.userId !== currentUserId) {
      return NextResponse.json({ error: "Bạn không có quyền báo cáo đơn hàng này." }, { status: 403 });
    }

    // Cập nhật trạng thái thành DISPUTED và lưu lý do
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "DISPUTED",
        issueReport: reason,
        issueReportedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error("LỖI BÁO CÁO SỰ CỐ:", error);
    return NextResponse.json({ error: "Lỗi Server." }, { status: 500 });
  }
}