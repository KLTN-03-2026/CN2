/* eslint-disable */
// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next"; 
import { authOptions } from "@/lib/auth"; 

export async function POST(request: Request) {
  try {
    // 🚀 BƯỚC QUAN TRỌNG: Lấy session trực tiếp từ Server
    const session = await getServerSession(authOptions);

    // 1. KIỂM TRA ĐĂNG NHẬP (Lấy ID từ session, không lấy từ Body nữa)
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "BẠN CẦN ĐĂNG NHẬP ĐỂ THỰC HIỆN ĐẶT XE!" }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      carId, 
      startDate, 
      endDate, 
      totalPrice, 
      customerNote,
      promoCode,
      customerName,
      customerPhone,
      isDelivery,
      deliveryAddress,
      deliveryFee,
      paymentMethod 
    } = body;

    const userId = session.user.id; // 🚀 ID "xịn" lấy từ NextAuth

    // 2. KIỂM TRA THÔNG TIN XE VÀ THỜI GIAN
    if (!carId || !startDate || !endDate) {
      return NextResponse.json({ error: "VUI LÒNG CHỌN ĐẦY ĐỦ LỊCH TRÌNH!" }, { status: 400 });
    }

    const requestedStart = new Date(startDate);
    const requestedEnd = new Date(endDate);
    const now = new Date();

    if (requestedStart < now) {
      return NextResponse.json({ error: "NGÀY NHẬN XE KHÔNG ĐƯỢC Ở QUÁ KHỨ!" }, { status: 400 });
    }
    if (requestedStart >= requestedEnd) {
      return NextResponse.json({ error: "NGÀY TRẢ XE PHẢI SAU NGÀY NHẬN XE!" }, { status: 400 });
    }

    // 3. LOGIC CHỐNG TRÙNG LỊCH ĐẶT XE CỦA KHÁCH KHÁC & GIỮ CHỖ 20 PHÚT
    const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);

    const existingConflict = await prisma.booking.findFirst({
      where: {
        carId: Number(carId),
        AND: [
          {
            startDate: { lt: requestedEnd },
            endDate: { gt: requestedStart },
          },
        ],
        OR: [
          { status: "CONFIRMED" }, 
          { 
            status: "PENDING", 
            createdAt: { gte: twentyMinutesAgo } 
          }
        ]
      },
    });

    if (existingConflict) {
      return NextResponse.json(
        { error: "XE NÀY ĐANG CÓ NGƯỜI ĐẶT HOẶC GIỮ CHỖ. VUI LÒNG THỬ LẠI SAU 20 PHÚT!" }, 
        { status: 400 }
      );
    }

    // 🚀 BƯỚC 3.5: LƯỚI BẢO VỆ CHỐNG TRÙNG LỊCH BẬN CỦA CHỦ XE
    const overlappingBlock = await prisma.blockedDate.findFirst({
      where: {
        carId: Number(carId),
        startDate: { lte: requestedEnd },
        endDate: { gte: requestedStart },
      }
    });

    if (overlappingBlock) {
      const formattedStart = new Date(overlappingBlock.startDate).toLocaleDateString('vi-VN');
      const formattedEnd = new Date(overlappingBlock.endDate).toLocaleDateString('vi-VN');
      return NextResponse.json(
        { error: `XIN LỖI, XE ĐÃ BỊ CHỦ XE KHÓA LỊCH TỪ NGÀY ${formattedStart} ĐẾN ${formattedEnd}.` }, 
        { status: 400 }
      );
    }

    // 4. LOGIC TÍNH TIỀN CỌC
    const calculatedDeposit = paymentMethod === "FULL_PAY" 
      ? Number(totalPrice) 
      : Math.round(Number(totalPrice) * 0.3);

    // 5. TẠO ĐƠN ĐẶT HÀNG
    const newBooking = await prisma.booking.create({
      data: {
        startDate: requestedStart, 
        endDate: requestedEnd,
        totalPrice: Number(totalPrice),
        depositAmount: calculatedDeposit, 
        customerName: customerName || null,
        customerPhone: customerPhone || null,
        status: "PENDING", 
        paymentStatus: paymentMethod === "FULL_PAY" ? "PAID_FULL" : "DEPOSITED",
        paymentMethod: paymentMethod || "DEPOSIT",
        note: customerNote || "",
        promoCode: promoCode || null,
        isDelivery: isDelivery || false,
        deliveryAddress: deliveryAddress || null,
        deliveryFee: Number(deliveryFee || 0),

        car: { 
          connect: { id: Number(carId) } 
        },
        user: { 
          connect: { id: Number(userId) } 
        }
      }
    });

    return NextResponse.json({ 
      message: "ĐẶT XE THÀNH CÔNG!", 
      booking: newBooking 
    }, { status: 201 });

  } catch (error) {
    console.error("LỖI API BOOKINGS:", error);
    return NextResponse.json(
      { error: "LỖI HỆ THỐNG KHI XỬ LÝ ĐƠN HÀNG", details: error.message }, 
      { status: 500 }
    );
  }
}