import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// KHACH HANG GỬI TIN NHẮN MỚI
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, message } = body;

    const newMsg = await prisma.contactMessage.create({
      data: { name, phone, email, message }
    });
    return NextResponse.json({ success: true, data: newMsg }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi lưu tin nhắn" }, { status: 500 });
  }
}

// ADMIN LẤY DANH SÁCH TIN NHẮN
export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' } // Mới nhất xếp lên đầu
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi tải dữ liệu" }, { status: 500 });
  }
}

// ADMIN CẬP NHẬT TRẠNG THÁI (Đánh dấu đã xử lý)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    const updatedMsg = await prisma.contactMessage.update({
      where: { id: Number(id) },
      data: { status }
    });
    return NextResponse.json({ success: true, data: updatedMsg });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi cập nhật trạng thái" }, { status: 500 });
  }
}