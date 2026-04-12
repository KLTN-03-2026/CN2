/* eslint-disable */
// @ts-nocheck
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // Đảm bảo đã cài bcryptjs như hướng dẫn trước

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, currentPassword, newPassword } = body;

    // 1. Kiểm tra tính đầy đủ của dữ liệu đầu vào
    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ thông tin mật khẩu" }, 
        { status: 400 }
      );
    }

    // 2. Tìm kiếm người dùng trong Database thông qua Prisma
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Không tìm thấy thông tin tài khoản" }, 
        { status: 404 }
      );
    }

    // 3. XÁC THỰC: So sánh mật khẩu hiện tại với mật khẩu đã mã hóa trong DB
    // Sử dụng String() để đảm bảo dữ liệu truyền vào bcrypt luôn là chuỗi ký tự
    const isMatch = await bcrypt.compare(String(currentPassword), String(user.password));
    
    if (!isMatch) {
      return NextResponse.json(
        { error: "Mật khẩu hiện tại không chính xác" }, 
        { status: 401 }
      );
    }

    // 4. BẢO MẬT: Mã hóa mật khẩu mới trước khi lưu vào Database
    const hashedNewPassword = await bcrypt.hash(String(newPassword), 10);

    // 5. CẬP NHẬT: Ghi mật khẩu mới đã mã hóa vào bảng User
    await prisma.user.update({
      where: { id: Number(userId) },
      data: { password: hashedNewPassword },
    });

    return NextResponse.json({ message: "Cập nhật mật khẩu thành công!" });

  } catch (error) {
    /** * XỬ LÝ LỖI AN TOÀN: 
     * Kiểm tra thực thể của error để tránh lỗi truy cập .message trên biến unknown
     */
    console.error("LỖI API CHANGE PASSWORD:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Đã có lỗi xảy ra tại máy chủ";

    return NextResponse.json(
      { error: "Lỗi hệ thống: " + errorMessage }, 
      { status: 500 }
    );
  }
}