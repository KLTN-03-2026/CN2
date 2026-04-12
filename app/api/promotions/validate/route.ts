/* eslint-disable */
// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    const now = new Date(); // Thời gian thực tại

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

    // 3. VÁ LỖ HỔNG: Kiểm tra ngày bắt đầu
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

    // 5. Trả về thông tin nếu hợp lệ
    return NextResponse.json({
      code: promo.code,
      discount: promo.discount,
      type: promo.type,
      title: promo.title
    });

  } catch (error) {
    return NextResponse.json({ error: "LỖI HỆ THỐNG KIỂM TRA MÃ" }, { status: 500 });
  }
}