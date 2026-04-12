/* eslint-disable */
// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 1. LẤY DANH SÁCH MÃ KÈM THỐNG KÊ SỬ DỤNG
export async function GET() {
  try {
    // Lấy toàn bộ danh sách mã ưu đãi từ Database
    const promos = await prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Thống kê số lần từng mã được sử dụng trong bảng Booking
    // Chúng ta nhóm các đơn hàng theo mã giảm giá và đếm số lượng
    const usageStats = await prisma.booking.groupBy({
      by: ['promoCode'],
      _count: {
        promoCode: true
      },
      where: {
        promoCode: { not: null } // Chỉ đếm các đơn có áp mã
      }
    });

    // Gộp dữ liệu thống kê vào danh sách mã ưu đãi
    const promosWithUsage = promos.map(promo => {
      const stat = usageStats.find(s => s.promoCode === promo.code);
      return {
        ...promo,
        usageCount: stat ? stat._count.promoCode : 0 // Nếu không tìm thấy thì lượt dùng = 0
      };
    });

    return NextResponse.json(promosWithUsage);
  } catch (error) {
    console.error("LỖI TẢI THỐNG KÊ ƯU ĐÃI:", error);
    return NextResponse.json({ error: "KHÔNG THỂ TẢI DỮ LIỆU THỐNG KÊ" }, { status: 500 });
  }
}

// 2. TẠO MÃ ƯU ĐÃI MỚI (CẬP NHẬT TRƯỜNG DỮ LIỆU)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      title, 
      code, 
      discount, 
      type, 
      description, 
      startDate, 
      expiryDate 
    } = body;

    // Kiểm tra trùng lặp mã trước khi tạo
    const existing = await prisma.promotion.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (existing) {
      return NextResponse.json({ error: "MÃ GIẢM GIÁ NÀY ĐÃ TỒN TẠI TRÊN HỆ THỐNG" }, { status: 400 });
    }

    const newPromo = await prisma.promotion.create({
      data: {
        title: title.toUpperCase(), // Đồng bộ in hoa cho tiêu đề
        code: code.toUpperCase(),
        discount: Number(discount), // Đảm bảo lưu đúng định dạng số
        type,
        description,
        startDate: new Date(startDate), // Hỗ trợ ngày bắt đầu chiến dịch
        expiryDate: new Date(expiryDate),
        isActive: true
      }
    });

    return NextResponse.json(newPromo, { status: 201 });
  } catch (error) {
    console.error("LỖI TẠO MÃ:", error);
    return NextResponse.json({ error: "DỮ LIỆU KHÔNG HỢP LỆ HOẶC LỖI HỆ THỐNG" }, { status: 400 });
  }
}