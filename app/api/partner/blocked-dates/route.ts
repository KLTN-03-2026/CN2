import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// LẤY DANH SÁCH LỊCH BẬN CỦA ĐỐI TÁC
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const blockedDates = await prisma.blockedDate.findMany({
      where: {
        car: { userId: Number(session.user.id) } // Chỉ lấy lịch của xe thuộc sở hữu đối tác này
      },
      include: { car: { select: { name: true, licensePlate: true } } },
      orderBy: { startDate: "asc" }
    });

    return NextResponse.json({ success: true, blockedDates });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}

// THÊM LỊCH BẬN MỚI
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    
    // 🚀 BẬT TÍNH NĂNG THEO DÕI: Xem dữ liệu frontend gửi lên có gì
    console.log("--- DỮ LIỆU MUỐN LƯU ---", body);

    const newBlock = await prisma.blockedDate.create({
      data: {
        carId: Number(body.carId),
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        reason: body.reason
      },
      include: { car: { select: { name: true, licensePlate: true } } }
    });

    return NextResponse.json({ success: true, block: newBlock });
  } catch (error: any) { // 🚀 Bắt chi tiết lỗi
    console.error("❌ LỖI LƯU LỊCH BẬN VÀO DATABASE:", error.message);
    return NextResponse.json({ error: "Lỗi lưu dữ liệu", details: error.message }, { status: 500 });
  }
}