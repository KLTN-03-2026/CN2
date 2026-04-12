/* app/api/user/update/route.ts */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email, phone } = body;

    if (!id) return NextResponse.json({ error: "Thiếu ID người dùng" }, { status: 400 });

    // Cập nhật thông tin trong Database Prisma
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { 
        name, 
        email, 
        phone 
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Lỗi cập nhật DB:", error);
    return NextResponse.json({ error: "Không thể cập nhật Database" }, { status: 500 });
  }
}