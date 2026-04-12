// app/api/bookings/mine/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email"); // Lấy email từ đường dẫn

  if (!email) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const myBookings = await prisma.booking.findMany({
      where: {
        user: {
            email: email // Chỉ lấy đơn của email này
        }
      },
      include: {
        car: true, // Lấy luôn thông tin xe để hiển thị ảnh
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(myBookings);
  } catch (error) {
    console.log("Lỗi PATCH Admin:", error);
    return NextResponse.json({ error: "Lỗi lấy dữ liệu" }, { status: 500 });
  }
}