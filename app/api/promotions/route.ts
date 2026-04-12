/* eslint-disable */
// @ts-nocheck
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const promotions = await prisma.promotion.findMany({
      where: { 
        isActive: true, 
        expiryDate: {
          gte: new Date(), 
        },
      },
      orderBy: {
        createdAt: "desc", 
      },
    });

    return NextResponse.json(promotions);
  } catch (error) {
    console.error("LỖI TẢI ƯU ĐÃI:", error);
    
    // Xử lý lỗi an toàn để không bị báo lỗi 'unknown'
    return NextResponse.json(
      { 
        error: "Không thể tải danh sách ưu đãi", 
        details: error instanceof Error ? error.message : String(error) 
      }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}