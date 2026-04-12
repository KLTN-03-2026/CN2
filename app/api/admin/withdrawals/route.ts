/* eslint-disable */
// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// LẤY DANH SÁCH YÊU CẦU RÚT TIỀN
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Không có quyền truy cập!" }, { status: 403 });
    }

    const withdrawals = await prisma.transaction.findMany({
      where: { type: "PAYOUT" },
      orderBy: { createdAt: "desc" },
      include: {
        wallet: {
          include: { user: true } // Lấy thông tin đối tác để biết chuyển tiền cho ai
        }
      }
    });

    return NextResponse.json(withdrawals);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}

// XỬ LÝ DUYỆT / TỪ CHỐI RÚT TIỀN
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Không có quyền truy cập!" }, { status: 403 });
    }

    const body = await request.json();
    const { id, status } = body; // status: "COMPLETED" hoặc "FAILED"

    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(id) }
    });

    if (!transaction || transaction.status !== "PENDING") {
      return NextResponse.json({ error: "Giao dịch không hợp lệ hoặc đã được xử lý" }, { status: 400 });
    }

    if (status === "COMPLETED") {
      // Nếu DUYỆT: Chỉ cần cập nhật trạng thái (Vì tiền đã bị trừ lúc đối tác tạo yêu cầu rồi)
      await prisma.transaction.update({
        where: { id: Number(id) },
        data: { status: "COMPLETED" }
      });
      return NextResponse.json({ success: true, message: "Đã duyệt yêu cầu rút tiền" });

    } else if (status === "FAILED") {
      // 🚀 Nếu TỪ CHỐI: Cập nhật trạng thái + HOÀN TIỀN lại vào ví đối tác
      // Lấy giá trị tuyệt đối của số tiền (vì amount đang là số âm, ví dụ: -500000)
      const refundAmount = Math.abs(transaction.amount);

      await prisma.$transaction([
        prisma.transaction.update({
          where: { id: Number(id) },
          data: { status: "FAILED", description: transaction.description + " (Bị từ chối - Hoàn tiền)" }
        }),
        prisma.wallet.update({
          where: { id: transaction.walletId },
          data: { balance: { increment: refundAmount } } // Hoàn tiền lại ví
        })
      ]);
      return NextResponse.json({ success: true, message: "Đã từ chối và hoàn tiền cho đối tác" });
    }

  } catch (error) {
    return NextResponse.json({ error: "Lỗi hệ thống khi xử lý" }, { status: 500 });
  }
}