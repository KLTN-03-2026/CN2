/* eslint-disable */
// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 });
    }

    const { newStatus } = await request.json();
    const resolvedParams = await params;
    const bookingId = Number(resolvedParams.id);

    // 1. Kiểm tra xem đơn hàng này có tồn tại không và có đúng là xe của đối tác này không
    const partner = await prisma.user.findUnique({ where: { email: session.user.email } });
    const booking = await prisma.booking.findUnique({ 
        where: { id: bookingId },
        include: { car: true }
    });

    if (!booking) return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
    if (booking.car.userId !== partner?.id) {
        return NextResponse.json({ error: "Bạn không có quyền sửa đơn hàng của xe người khác!" }, { status: 403 });
    }

    // 2. Cập nhật trạng thái
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: newStatus }
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("LỖI CẬP NHẬT TRẠNG THÁI:", error);
    return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
  }
}