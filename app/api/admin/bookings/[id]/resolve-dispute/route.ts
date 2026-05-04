import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Không có quyền truy cập." }, { status: 403 });
    }

    const resolvedParams = await params;
    const bookingId = Number(resolvedParams.id);
    const { action } = await req.json();

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return NextResponse.json({ error: "Không tìm thấy đơn hàng." }, { status: 404 });

    if (action === "REFUND") {
      // Hủy đơn & Cắm cờ REFUNDED để không tính vào doanh thu
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: "CANCELLED",
          paymentStatus: "REFUNDED", 
          issueReport: `${booking.issueReport || ''} || [ADMIN] Đã xử lý: Hủy đơn & Hoàn tiền cho khách hàng.`,
        }
      });
    } else if (action === "IGNORE") {
      // Bác bỏ khiếu nại, trả về trạng thái Đã Cọc
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: "CONFIRMED",
          issueReport: `${booking.issueReport || ''} || [ADMIN] Đã xử lý: Bác bỏ khiếu nại, giữ nguyên trạng thái đặt xe.`,
        }
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("LỖI XỬ LÝ TRANH CHẤP:", error);
    return NextResponse.json({ error: "Lỗi Server." }, { status: 500 });
  }
}