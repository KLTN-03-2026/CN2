import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) return NextResponse.json({ error: "Thiếu email" }, { status: 400 });

  try {
    const user = await prisma.user.findUnique({
      where: { email }
      // Không cần include wallet nữa vì không dùng đến ở đây
    });
    
    if (!user) return NextResponse.json({ error: "Không tìm thấy user" }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { email, name, phone, currentPassword, newPassword } = body;

    const currentUser = await prisma.user.findUnique({ where: { email } });
    if (!currentUser) return NextResponse.json({ error: "Không tìm thấy tài khoản" }, { status: 404 });

    // Cập nhật thông tin cơ bản
    let updateData: any = { name, phone };

    // Xử lý đổi mật khẩu
    if (currentPassword && newPassword) {
      if (!currentUser.password) {
        return NextResponse.json({ error: "Tài khoản đăng nhập qua Google/Facebook không thể đổi mật khẩu tại đây." }, { status: 400 });
      }
      
      const isPasswordMatch = await bcrypt.compare(currentPassword, currentUser.password);
      if (!isPasswordMatch) {
        return NextResponse.json({ error: "Mật khẩu hiện tại không chính xác!" }, { status: 400 });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedNewPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: updateData
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("Lỗi cập nhật Profile:", error.message);
    return NextResponse.json({ error: "Lỗi khi lưu dữ liệu. Số điện thoại có thể đã tồn tại." }, { status: 500 });
  }
}