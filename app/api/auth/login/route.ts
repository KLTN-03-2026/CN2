/* eslint-disable */
// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { phone, password } = await request.json();

    const user = await prisma.user.findFirst({
      where: { phone: phone }
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "Tài khoản không đúng!" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Mật khẩu không đúng!" }, { status: 400 });
    }

    // TRẢ VỀ: Đảm bảo lấy trực tiếp trường role từ biến user vừa tìm thấy
    return NextResponse.json({ 
      message: "Đăng nhập thành công", 
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role // Giá trị ADMIN từ DB image_001424.png
      }
    });

  } catch (error) {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}