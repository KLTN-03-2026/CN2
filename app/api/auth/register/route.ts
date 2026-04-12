/* eslint-disable */
// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, password, email } = body;

    // 1. Kiểm tra dữ liệu đầu vào cơ bản
    if (!name || !phone || !password) {
      return NextResponse.json({ error: "Vui lòng nhập đầy đủ các thông tin bắt buộc!" }, { status: 400 });
    }

    // 2. Xây dựng điều kiện tìm kiếm linh hoạt (Chỉ check email nếu user có nhập)
    const searchConditions = [{ phone: phone }];
    if (email && email.trim() !== "") {
      searchConditions.push({ email: email });
    }

    // 3. Kiểm tra xem SĐT hoặc Email đã tồn tại chưa
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: searchConditions
      }
    });

    if (existingUser) {
      if (existingUser.phone === phone) {
        return NextResponse.json({ error: "Số điện thoại này đã được đăng ký!" }, { status: 400 });
      }
      if (existingUser.email === email) {
        return NextResponse.json({ error: "Email này đã được đăng ký!" }, { status: 400 });
      }
    }

    // 4. Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Lưu thông tin vào Database
    const newUser = await prisma.user.create({
      data: {
        name,
        phone,
        password: hashedPassword,
        // Nếu email rỗng, lưu là null để Database không bị lỗi trùng lặp (Unique constraint)
        email: email && email.trim() !== "" ? email : null, 
        role: "USER", // Mặc định gán quyền USER cho người mới đăng ký
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Đăng ký thành công", 
      user: newUser 
    }, { status: 201 });

  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi đăng ký tài khoản" }, { status: 500 });
  }
}