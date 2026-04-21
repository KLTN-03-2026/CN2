/* eslint-disable */
// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Đảm bảo import đúng đường dẫn auth của bạn

export async function POST(request: Request) {
  try {
    // 🚀 LẤY THÔNG TIN KHÁCH HÀNG ĐANG ĐẶT XE
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "VUI LÒNG ĐĂNG NHẬP ĐỂ SỬ DỤNG MÃ GIẢM GIÁ" }, 
        { status: 401 }
      );
    }
    
    const currentUserId = Number(session.user.id);
    const { code } = await request.json();
    const now = new Date(); 

    // 1. Tìm mã trong hệ thống
    const promo = await prisma.promotion.findUnique({
      where: { code: code.toUpperCase() }
    });

    // 2. Kiểm tra tồn tại và trạng thái kích hoạt
    if (!promo || !promo.isActive) {
      return NextResponse.json(
        { error: "MÃ GIẢM GIÁ KHÔNG TỒN TẠI HOẶC ĐÃ BỊ VÔ HIỆU HÓA" }, 
        { status: 404 }
      );
    }

    // 3. Kiểm tra ngày bắt đầu
    if (new Date(promo.startDate) > now) {
      return NextResponse.json(
        { error: `MÃ NÀY CHƯA ĐẾN HẠN SỬ DỤNG. HÃY QUAY LẠI VÀO NGÀY ${new Date(promo.startDate).toLocaleDateString('vi-VN')}` }, 
        { status: 400 }
      );
    }

    // 4. Kiểm tra ngày hết hạn
    if (new Date(promo.expiryDate) < now) {
      return NextResponse.json(
        { error: "MÃ GIẢM GIÁ NÀY ĐÃ HẾT HẠN SỬ DỤNG" }, 
        { status: 400 }
      );
    }

    // ======================================================================
    // 🛡️ BỨC TƯỜNG LỬA CHỐNG BÀO MÃ BẮT ĐẦU TỪ ĐÂY
    // ======================================================================

    // 🛡️ CHỐT CHẶN 1: Kiểm tra xem user này đã từng dùng mã này chưa?
    const hasUsedPromo = await prisma.booking.findFirst({
      where: {
        userId: currentUserId,
        promoCode: promo.code,
        status: {
          not: "CANCELLED" // Nếu đơn cũ bị hủy thì vẫn châm chước cho dùng lại
        }
      }
    });

    if (hasUsedPromo) {
      return NextResponse.json(
        { error: "BẠN ĐÃ SỬ DỤNG MÃ ƯU ĐÃI NÀY CHO MỘT CHUYẾN ĐI RỒI!" }, 
        { status: 400 }
      );
    }

    // 🛡️ CHỐT CHẶN 2: Nếu là mã TÂN BINH -> Kiểm tra xem có đúng là user mới không?
    if (promo.type === "NEW_USER" || promo.code.includes("NEW")) {
      const pastBookingsCount = await prisma.booking.count({
        where: {
          userId: currentUserId,
          status: { not: "CANCELLED" }
        }
      });

      if (pastBookingsCount > 0) {
        return NextResponse.json(
          { error: "MÃ GIẢM GIÁ NÀY CHỈ DÀNH RIÊNG CHO KHÁCH HÀNG ĐẶT CHUYẾN ĐẦU TIÊN!" }, 
          { status: 400 }
        );
      }
    }

    // ======================================================================

    // 5. Vượt qua mọi bài test -> Trả về thông tin mã giảm giá hợp lệ
    return NextResponse.json({
      code: promo.code,
      discount: promo.discount,
      type: promo.type,
      title: promo.title
    });

  } catch (error) {
    console.error("LỖI KIỂM TRA MÃ:", error);
    return NextResponse.json({ error: "LỖI HỆ THỐNG KIỂM TRA MÃ" }, { status: 500 });
  }
}