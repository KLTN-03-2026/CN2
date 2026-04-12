/* eslint-disable */
// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location'); // Lấy tham số ?location= từ URL

  try {
    const cars = await prisma.car.findMany({
      where: {
        status: "APPROVED", // Chỉ lấy xe đã duyệt
        ...(location && {
          location: {
            contains: location
            // 🚀 ĐÃ XÓA mode: 'insensitive'
          }
        })
      },
      orderBy: { id: 'desc' }
    });
    return NextResponse.json(cars);
  } catch (error) {
    console.error("Lỗi tải danh sách xe trang chủ:", error);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const carData = {
      ...body,
      priceOriginal: Number(body.priceOriginal),
      priceDiscount: Number(body.priceDiscount),
      seats: Number(body.seats),
      deliveryFee: Number(body.deliveryFee),
      amenities: body.amenities ? body.amenities.split(',').map((item: string) => item.trim()).filter(Boolean) : [],
      gallery: body.gallery ? body.gallery.split(',').map((item: string) => item.trim()).filter(Boolean) : [],
      
      status: body.status || "APPROVED"
    };

    const newCar = await prisma.car.create({
      data: carData,
    });

    return NextResponse.json({ success: true, data: newCar });
  } catch (error) {
    console.error("Lỗi thêm xe mới:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi thêm xe!" }, { status: 500 });
  }
}