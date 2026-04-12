import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
// 1. IMPORT THƯ VIỆN BĂM MẬT KHẨU (Thường dùng bcrypt hoặc bcryptjs)
import bcrypt from "bcryptjs"; 

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId, newPassword } = await req.json();

    if (!userId || !newPassword) {
      return NextResponse.json({ error: "Thiếu thông tin xác thực!" }, { status: 400 });
    }

    // 2. BĂM MẬT KHẨU MỚI RA THÀNH CHUỖI BẢO MẬT
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 3. LƯU MẬT KHẨU ĐÃ BĂM VÀO DATABASE
    await prisma.user.update({
      where: { id: parseInt(userId, 10) }, // Giữ nguyên hàm parseInt lúc nãy
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true, message: "Đổi mật khẩu thành công!" });

  } catch (error) {
    console.error("Lỗi cập nhật mật khẩu:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi cập nhật mật khẩu." }, { status: 500 });
  }
}