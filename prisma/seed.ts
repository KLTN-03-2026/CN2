/* eslint-disable */
// @ts-nocheck
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- 🚀 ĐANG KHỞI TẠO TOÀN BỘ DỮ LIỆU BONBONCAR 2026 ---');

  // 1. LÀM SẠCH DỮ LIỆU CŨ
  // Xóa theo thứ tự để tránh lỗi khóa ngoại (Foreign Key)
  await prisma.booking.deleteMany({});
  await prisma.car.deleteMany({});
  await prisma.promotion.deleteMany({});
  console.log('🗑️  Đã làm sạch dữ liệu cũ.');

  // 2. NẠP DANH SÁCH 20 XE MẪU
  const cars = [
    // MIỀN BẮC
    { name: 'VinFast VF9 Plus', location: 'HaNoi', brand: 'VinFast', category: 'SUV', tier: 'Luxury', transmission: 'Automatic', fuel: 'Electric', priceOriginal: 2500000, priceDiscount: 2200000, seats: 7, image: 'https://images.unsplash.com/photo-1617788138017-80ad42243c7d?q=80&w=1000' },
    { name: 'Toyota Camry 2.5Q', location: 'HaNoi', brand: 'Toyota', category: 'Sedan', tier: 'Standard', transmission: 'Automatic', fuel: 'Gasoline', priceOriginal: 1500000, priceDiscount: 1300000, seats: 5, image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000' },
    { name: 'Mercedes S450 Luxury', location: 'HaNoi', brand: 'Mercedes', category: 'Sedan', tier: 'Luxury', transmission: 'Automatic', fuel: 'Gasoline', priceOriginal: 5000000, priceDiscount: 4500000, seats: 5, image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000' },
    { name: 'Ford Everest Titanium', location: 'HaLong', brand: 'Ford', category: 'SUV', tier: 'Standard', transmission: 'Automatic', fuel: 'Diesel', priceOriginal: 1800000, priceDiscount: 1600000, seats: 7, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000' },

    // MIỀN TRUNG
    { name: 'Mazda CX-5 Premium', location: 'DaNang', brand: 'Mazda', category: 'SUV', tier: 'Standard', transmission: 'Automatic', fuel: 'Gasoline', priceOriginal: 1200000, priceDiscount: 1000000, seats: 5, image: 'https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?q=80&w=1000' },
    { name: 'BMW 330i M-Sport', location: 'DaNang', brand: 'BMW', category: 'Sedan', tier: 'Luxury', transmission: 'Automatic', fuel: 'Gasoline', priceOriginal: 2800000, priceDiscount: 2400000, seats: 5, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000' },
    { name: 'Hyundai SantaFe Premium', location: 'Hue', brand: 'Hyundai', category: 'SUV', tier: 'Standard', transmission: 'Automatic', fuel: 'Diesel', priceOriginal: 1600000, priceDiscount: 1400000, seats: 7, image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000' },
    { name: 'Kia Carnival Royal', location: 'NhaTrang', brand: 'Kia', category: 'MPV', tier: 'Luxury', transmission: 'Automatic', fuel: 'Diesel', priceOriginal: 2200000, priceDiscount: 2000000, seats: 7, image: 'https://images.unsplash.com/photo-1590362891175-3794ec1693af?q=80&w=1000' },
    { name: 'Mitsubishi Xpander', location: 'QuyNhon', brand: 'Mitsubishi', category: 'MPV', tier: 'Budget', transmission: 'Automatic', fuel: 'Gasoline', priceOriginal: 900000, priceDiscount: 800000, seats: 7, image: 'https://images.unsplash.com/photo-1567808291548-fc3ee04dbac0?q=80&w=1000' },

    // MIỀN NAM
    { name: 'Porsche Taycan', location: 'TPHCM', brand: 'Porsche', category: 'Sport', tier: 'Luxury', transmission: 'Automatic', fuel: 'Electric', priceOriginal: 6000000, priceDiscount: 5500000, seats: 4, image: 'https://images.unsplash.com/photo-1614200024993-42e74ec80026?q=80&w=1000' },
    { name: 'Honda Civic RS', location: 'TPHCM', brand: 'Honda', category: 'Sedan', tier: 'Standard', transmission: 'Automatic', fuel: 'Gasoline', priceOriginal: 1100000, priceDiscount: 950000, seats: 5, image: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?q=80&w=1000' },
    { name: 'Lexus RX350', location: 'TPHCM', brand: 'Lexus', category: 'SUV', tier: 'Luxury', transmission: 'Automatic', fuel: 'Gasoline', priceOriginal: 4500000, priceDiscount: 4000000, seats: 5, image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000' },
    { name: 'Suzuki XL7', location: 'CanTho', brand: 'Suzuki', category: 'MPV', tier: 'Budget', transmission: 'Automatic', fuel: 'Gasoline', priceOriginal: 850000, priceDiscount: 750000, seats: 7, image: 'https://images.unsplash.com/photo-1626847037657-fd3622613ce3?q=80&w=1000' },
    { name: 'VinFast VF8 City', location: 'PhuQuoc', brand: 'VinFast', category: 'SUV', tier: 'Standard', transmission: 'Automatic', fuel: 'Electric', priceOriginal: 1400000, priceDiscount: 1200000, seats: 5, image: 'https://images.unsplash.com/photo-1562911791-c7a97b729ec5?q=80&w=1000' },

    // TÂY NGUYÊN
    { name: 'Ford Ranger Raptor', location: 'DaLat', brand: 'Ford', category: 'Pickup', tier: 'Luxury', transmission: 'Automatic', fuel: 'Diesel', priceOriginal: 2000000, priceDiscount: 1800000, seats: 5, image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000' },
    { name: 'Audi Q7 Quattro', location: 'DaLat', brand: 'Audi', category: 'SUV', tier: 'Luxury', transmission: 'Automatic', fuel: 'Gasoline', priceOriginal: 3500000, priceDiscount: 3200000, seats: 7, image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1000' },

    // BỔ SUNG
    { name: 'Kia Morning', location: 'TPHCM', brand: 'Kia', category: 'Hatchback', tier: 'Budget', transmission: 'Manual', fuel: 'Gasoline', priceOriginal: 500000, priceDiscount: 400000, seats: 4, image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000' },
    { name: 'MG ZS Smart Up', location: 'VungTau', brand: 'MG', category: 'SUV', tier: 'Budget', transmission: 'Automatic', fuel: 'Gasoline', priceOriginal: 800000, priceDiscount: 700000, seats: 5, image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000' },
    { name: 'Hyundai Accent', location: 'CanTho', brand: 'Hyundai', category: 'Sedan', tier: 'Budget', transmission: 'Automatic', fuel: 'Gasoline', priceOriginal: 700000, priceDiscount: 600000, seats: 5, image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000' },
    { name: 'Nissan Navara', location: 'NhaTrang', brand: 'Nissan', category: 'Pickup', tier: 'Standard', transmission: 'Manual', fuel: 'Diesel', priceOriginal: 900000, priceDiscount: 850000, seats: 5, image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000' }
  ];

  for (const carData of cars) {
    await prisma.car.create({ data: carData });
  }
  console.log(`✅ Đã nạp xong ${cars.length} xe mẫu.`);

  // 3. NẠP DANH SÁCH ƯU ĐÃI (PROMOTIONS)
  const promotions = [
    {
      title: 'CHÀO BẠN MỚI',
      code: 'BONBONNEW',
      discount: 15,
      type: 'PERCENT',
      description: 'Giảm ngay 15% cho chuyến hành trình đầu tiên của bạn tại BonbonCar.',
      expiryDate: new Date('2026-12-31'),
      isActive: true,
    },
    {
      title: 'CUỐI TUẦN RỰC RỠ',
      code: 'WEEKEND',
      discount: 50000,
      type: 'AMOUNT',
      description: 'Ưu đãi 50.000đ khi đặt xe vào các ngày Thứ 7 và Chủ Nhật hàng tuần.',
      expiryDate: new Date('2026-06-30'),
      isActive: true,
    },
    {
      title: 'MÙA HÈ RỰC LỬA',
      code: 'SUMMER2026',
      discount: 20,
      type: 'PERCENT',
      description: 'Giảm 20% cho các chuyến đi du lịch dài ngày trên 3 ngày.',
      expiryDate: new Date('2026-08-31'),
      isActive: true,
    },
  ];

  for (const promoData of promotions) {
    await prisma.promotion.create({ data: promoData });
  }
  console.log(`✅ Đã nạp xong ${promotions.length} mã ưu đãi.`);

  console.log('--- 🎉 TẤT CẢ DỮ LIỆU ĐÃ SẴN SÀNG! CHÚC MỪNG KHOA ---');
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });