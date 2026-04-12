/* eslint-disable */
// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 });
    }

    // 1. Tìm thông tin của Đối tác hiện tại
    const partner = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!partner) return NextResponse.json({ error: "Không tìm thấy user" }, { status: 404 });

    // 2. Tìm TẤT CẢ đơn hàng được đặt trên CÁC CHIẾC XE của Đối tác này
    const bookings = await prisma.booking.findMany({
      where: {
        car: {
          userId: partner.id // Lọc ra xe của đúng đối tác này
        }
      },
      include: {
        car: true,  // Lấy thông tin xe (tên, hình...)
        user: true, // Lấy thông tin khách hàng (tên, sđt...)
      },
      orderBy: {
        createdAt: 'desc' // Đơn mới nhất xếp lên đầu
      }
    });

    return NextResponse.json({ success: true, bookings });

  } catch (error: any) {
    console.error("LỖI FETCH ĐƠN HÀNG ĐỐI TÁC:", error);
    return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
  }
}