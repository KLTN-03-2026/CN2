/* app/api/admin/promotions/[id]/route.ts */
/* eslint-disable */
// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 1. CẬP NHẬT THÔNG TIN MÃ
export async function PATCH(request: Request, { params }) {
  try {
    const id = Number(params.id);
    const body = await request.json();
    
    const updated = await prisma.promotion.update({
      where: { id },
      data: {
        ...body,
        discount: Number(body.discount),
        startDate: new Date(body.startDate),
        expiryDate: new Date(body.expiryDate),
      }
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi cập nhật" }, { status: 400 });
  }
}

// 2. XÓA MÃ ƯU ĐÃI
export async function DELETE(request: Request, { params }) {
  try {
    const id = Number(params.id);
    await prisma.promotion.delete({ where: { id } });
    return NextResponse.json({ message: "Đã xóa thành công" });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi xóa" }, { status: 400 });
  }
}