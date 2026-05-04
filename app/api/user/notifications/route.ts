/* eslint-disable */
// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const now = new Date();
    
    // 1. CHỜ THANH TOÁN (Tính giờ đếm ngược 20p)
    const pendingBookings = await prisma.booking.findMany({
      where: { userId: userId, status: "PENDING" },
      select: { id: true, createdAt: true, car: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });

    //  ĐÃ XÁC NHẬN: Lấy TẤT CẢ chuyến đi trong tương lai 
    const upcomingTrips = await prisma.booking.findMany({
      where: {
        userId: userId,
        status: "CONFIRMED",
        startDate: { gt: now } // Chỉ cần lớn hơn giờ hiện tại
      },
      select: { id: true, startDate: true, car: { select: { name: true } } },
      orderBy: { startDate: 'asc' }
    });

    // 3. KHIẾU NẠI ĐÃ ĐƯỢC ADMIN XỬ LÝ (Hoàn tiền trong 3 ngày gần đây)
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const resolvedDisputes = await prisma.booking.findMany({
      where: {
        userId: userId,
        status: "CANCELLED",
        paymentStatus: "REFUNDED",
        updatedAt: { gt: threeDaysAgo } 
      },
      select: { id: true, car: { select: { name: true } }, issueReport: true }
    });

    return NextResponse.json({
      pendingBookings,
      upcomingTrips,
      resolvedDisputes,
      total: pendingBookings.length + upcomingTrips.length + resolvedDisputes.length
    });

  } catch (error) {
    console.error("Lỗi API User Notifications:", error);
    return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
  }
}