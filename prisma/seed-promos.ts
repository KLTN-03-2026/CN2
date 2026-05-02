import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('⏳ Đang chuẩn bị thêm các mã khuyến mãi đặc biệt...');

  // Dùng ngày hiện tại và tính ngày hết hạn (ví dụ: cuối năm 2026)
  const now = new Date();
  const endOfYear = new Date("2026-12-31T23:59:59Z");

  const newPromos = [
    {
      title: "Quà Tặng Tân Binh",
      code: "NEWUSER100",
      discount: 100000, // Giảm 100k
      type: "NEW_USER",
      description: "Giảm ngay 100K cho khách hàng đặt thuê chuyến xe đầu tiên trên hệ thống AutoHub.",
      isActive: true,
      startDate: now,
      expiryDate: endOfYear,
    },
    {
      title: "Vi Vu Cuối Tuần",
      code: "CUOITUANVUI",
      discount: 10, // Dưới 100 thì giao diện tự hiểu là Giảm 10%
      type: "WEEKEND",
      description: "Giảm 10% tổng giá trị đơn hàng. Chỉ áp dụng cho lịch nhận xe vào Thứ 7 hoặc Chủ Nhật.",
      isActive: true,
      startDate: now,
      expiryDate: endOfYear,
    },
    {
      title: "Thuê Dài Trải Nghiệm Sâu",
      code: "THUE3NGAYVIP",
      discount: 15, // Giảm 15%
      type: "LONG_TRIP",
      description: "Đặc quyền giảm 15% cho các chuyến đi dài hạn từ 3 ngày (72 giờ) trở lên.",
      isActive: true,
      startDate: now,
      expiryDate: endOfYear,
    },
    {
      title: "Tri Ân Khách Quen",
      code: "TRIANLAN5",
      discount: 200000, // Giảm 200k
      type: "LOYALTY_5",
      description: "Món quà thay lời cảm ơn: Giảm ngay 200K cho chuyến đi thứ 5 của bạn tại AutoHub.",
      isActive: true,
      startDate: now,
      expiryDate: endOfYear,
    },
    {
      title: "Đặt Sớm Giảm Sâu",
      code: "DATSOMGIAMSAU",
      discount: 150000, // Giảm 150k
      type: "EARLY_BIRD",
      description: "Giảm 150K khi khách hàng chốt đơn và đặt cọc giữ xe trước ít nhất 7 ngày.",
      isActive: true,
      startDate: now,
      expiryDate: endOfYear,
    }
  ];

  // Lặp và thêm từng mã vào Database, bỏ qua nếu mã code đã tồn tại
  for (const promo of newPromos) {
    const existingPromo = await prisma.promotion.findUnique({
      where: { code: promo.code }
    });

    if (!existingPromo) {
      await prisma.promotion.create({
        data: promo
      });
      console.log(`✅ Đã thêm mã: ${promo.code}`);
    } else {
      console.log(`⚠️ Mã ${promo.code} đã tồn tại, bỏ qua.`);
    }
  }

  console.log('🎉 Đã nạp xong toàn bộ mã ưu đãi chiến lược!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });