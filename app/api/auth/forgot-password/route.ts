import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    // 1. TÌM KHÁCH HÀNG TRONG DATABASE
    const user = await prisma.user.findUnique({ 
        where: { phone } 
    });

    // Nếu không tìm thấy SĐT trong hệ thống
    if (!user) {
      return NextResponse.json(
        { error: "Số điện thoại này chưa được đăng ký trong hệ thống!" }, 
        { status: 404 }
      );
    }

    // Nếu SĐT có tồn tại nhưng ngày xưa khách không nhập Email
    if (!user.email) {
        return NextResponse.json(
          { error: "Tài khoản này chưa cập nhật Email nên không thể nhận link khôi phục!" }, 
          { status: 400 }
        );
    }

    // 2. TẠO LINK ĐẶT LẠI MẬT KHẨU
    // Ở đồ án này, chúng ta truyền tạm ID của user lên URL để màn hình sau biết là đang đổi pass cho ai
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?id=${user.id}`;

    // 3. TÁI SỬ DỤNG CẤU HÌNH NODEMAILER (Giống hệt phần đặt xe)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Dùng lại biến môi trường cũ
        pass: process.env.EMAIL_PASS, // Dùng lại App Password cũ
      },
    });

    // 4. THIẾT KẾ GIAO DIỆN EMAIL (Giao diện chuẩn BonbonCar)
    const mailOptions = {
      from: '"ViVuCar Support" <no-reply@vivucar.com>',
      to: user.email, 
      subject: "🚗 Khôi phục mật khẩu tài khoản ViVuCar",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #1e3a8a; font-style: italic; margin: 0;">BONBONCAR</h1>
          </div>
          <h2 style="color: #333; text-align: center;">Yêu cầu đặt lại mật khẩu</h2>
          <p style="color: #555; font-size: 16px;">Chào <b>${user.name}</b>,</p>
          <p style="color: #555; font-size: 16px;">Chúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản BonbonCar liên kết với số điện thoại <b>${phone}</b> của bạn.</p>
          <p style="color: #555; font-size: 16px;">Vui lòng click vào nút bên dưới để tiến hành đặt lại mật khẩu mới:</p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">ĐẶT LẠI MẬT KHẨU</a>
          </div>
          
          <p style="color: #9ca3af; font-size: 13px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này để bảo vệ tài khoản.
          </p>
        </div>
      `,
    };

    // 5. GỬI ĐI VÀ TRẢ KẾT QUẢ VỀ CHO FORM
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: "Đã gửi email khôi phục thành công!" });

  } catch (error) {
    console.error("Lỗi gửi email:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi gửi Email. Vui lòng thử lại sau." }, { status: 500 });
  }
}