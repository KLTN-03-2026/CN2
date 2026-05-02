import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('⏳ Đang dọn dẹp dữ liệu cũ để tránh lỗi trùng lặp Khóa ngoại...');

  // Xóa theo thứ tự từ bảng con đến bảng cha
  await prisma.review.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.blockedDate.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.car.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Đã dọn sạch Database! Đang nhập 50 xe mới...');

  // Danh sách 50 xe chuẩn 100% theo Enum của bạn
  const cars = [
    // --- HÀ NỘI ---
    { name: "Toyota Vios 2023", location: "HaNoi", priceOriginal: 800000, priceDiscount: 700000, brand: "Toyota", category: "Sedan", tier: "Budget", transmission: "Automatic", fuel: "Gasoline", seats: 5, ownerType: "COMPANY", licensePlate: "29A-101.01", image: "https://images.unsplash.com/photo-1590362891991-f761ba3ec19b?auto=format&fit=crop&w=800&q=80" },
    { name: "VinFast VF8 Plus", location: "HaNoi", priceOriginal: 1500000, priceDiscount: 1350000, brand: "VinFast", category: "SUV", tier: "Standard", transmission: "Automatic", fuel: "Electric", seats: 5, ownerType: "PARTNER", licensePlate: "30G-202.02", image: "https://images.unsplash.com/photo-1678122312674-325b7b51b752?auto=format&fit=crop&w=800&q=80" },
    { name: "Mercedes C300 AMG", location: "HaNoi", priceOriginal: 3000000, priceDiscount: 2800000, brand: "Mercedes", category: "Sedan", tier: "Luxury", transmission: "Automatic", fuel: "Gasoline", seats: 5, ownerType: "COMPANY", licensePlate: "30K-303.03", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80" },
    { name: "Ford Ranger Wildtrak", location: "HaNoi", priceOriginal: 1200000, priceDiscount: 1100000, brand: "Ford", category: "Pickup", tier: "Standard", transmission: "Automatic", fuel: "Diesel", seats: 5, ownerType: "PARTNER", licensePlate: "29C-404.04", image: "https://images.unsplash.com/photo-1605898031388-752175a28189?auto=format&fit=crop&w=800&q=80" },
    { name: "Hyundai Grand i10", location: "HaNoi", priceOriginal: 600000, priceDiscount: 550000, brand: "Hyundai", category: "Hatchback", tier: "Budget", transmission: "Manual", fuel: "Gasoline", seats: 5, ownerType: "COMPANY", licensePlate: "29D-505.05", image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&w=800&q=80" },

    // --- TP. HỒ CHÍ MINH ---
    { name: "Mitsubishi Xpander", location: "TPHCM", priceOriginal: 1000000, priceDiscount: 900000, brand: "Mitsubishi", category: "MPV", tier: "Standard", transmission: "Automatic", fuel: "Gasoline", seats: 7, ownerType: "COMPANY", licensePlate: "51K-606.06", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80" },
    { name: "Porsche Macan S", location: "TPHCM", priceOriginal: 5000000, priceDiscount: 4500000, brand: "Porsche", category: "SUV", tier: "Luxury", transmission: "Automatic", fuel: "Gasoline", seats: 5, ownerType: "PARTNER", licensePlate: "51H-707.07", image: "https://images.unsplash.com/photo-1503376712341-ea1d821ae1a3?auto=format&fit=crop&w=800&q=80" },
    { name: "Honda City RS", location: "TPHCM", priceOriginal: 850000, priceDiscount: 800000, brand: "Honda", category: "Sedan", tier: "Standard", transmission: "Automatic", fuel: "Gasoline", seats: 5, ownerType: "COMPANY", licensePlate: "51G-808.08", image: "https://images.unsplash.com/photo-1590362891991-f761ba3ec19b?auto=format&fit=crop&w=800&q=80" },
    { name: "BMW 320i Sport Plus", location: "TPHCM", priceOriginal: 2800000, priceDiscount: 2600000, brand: "BMW", category: "Sedan", tier: "Luxury", transmission: "Automatic", fuel: "Gasoline", seats: 5, ownerType: "PARTNER", licensePlate: "51F-909.09", image: "https://images.unsplash.com/photo-1555353540-64fd8b028bfb?auto=format&fit=crop&w=800&q=80" },
    { name: "Kia Seltos 2024", location: "TPHCM", priceOriginal: 1100000, priceDiscount: 1000000, brand: "Kia", category: "SUV", tier: "Standard", transmission: "Automatic", fuel: "Gasoline", seats: 5, ownerType: "COMPANY", licensePlate: "51E-111.11", image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=800&q=80" },

    // --- ĐÀ NẴNG ---
    { name: "Mazda CX-5", location: "DaNang", priceOriginal: 1200000, priceDiscount: 1150000, brand: "Mazda", category: "SUV", tier: "Standard", transmission: "Automatic", fuel: "Gasoline", seats: 5, ownerType: "COMPANY", licensePlate: "43A-222.22", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80" },
    { name: "Lexus RX350", location: "DaNang", priceOriginal: 4500000, priceDiscount: 4200000, brand: "Lexus", category: "SUV", tier: "Luxury", transmission: "Automatic", fuel: "Hybrid", seats: 5, ownerType: "PARTNER", licensePlate: "43B-333.33", image: "https://images.unsplash.com/photo-1626668893632-6f0281b6dc24?auto=format&fit=crop&w=800&q=80" },
    { name: "Suzuki XL7", location: "DaNang", priceOriginal: 900000, priceDiscount: 850000, brand: "Suzuki", category: "MPV", tier: "Budget", transmission: "Automatic", fuel: "Gasoline", seats: 7, ownerType: "COMPANY", licensePlate: "43C-444.44", image: "https://images.unsplash.com/photo-1631526438096-7bb2a00c6dd9?auto=format&fit=crop&w=800&q=80" },
    { name: "Audi Q5", location: "DaNang", priceOriginal: 3500000, priceDiscount: 3200000, brand: "Audi", category: "SUV", tier: "Luxury", transmission: "Automatic", fuel: "Gasoline", seats: 5, ownerType: "PARTNER", licensePlate: "43D-555.55", image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0b63?auto=format&fit=crop&w=800&q=80" },

    // --- NHA TRANG ---
    { name: "Land Rover Defender", location: "NhaTrang", priceOriginal: 6000000, priceDiscount: 5500000, brand: "LandRover", category: "SUV", tier: "Luxury", transmission: "Automatic", fuel: "Diesel", seats: 5, ownerType: "PARTNER", licensePlate: "79A-666.66", image: "https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?auto=format&fit=crop&w=800&q=80" },
    { name: "MG ZS", location: "NhaTrang", priceOriginal: 800000, priceDiscount: 750000, brand: "MG", category: "SUV", tier: "Budget", transmission: "Automatic", fuel: "Gasoline", seats: 5, ownerType: "COMPANY", licensePlate: "79B-777.77", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80" },
    { name: "Peugeot 3008", location: "NhaTrang", priceOriginal: 1400000, priceDiscount: 1300000, brand: "Peugeot", category: "SUV", tier: "Standard", transmission: "Automatic", fuel: "Gasoline", seats: 5, ownerType: "COMPANY", licensePlate: "79C-888.88", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80" },

    // --- PHÚ QUỐC ---
    { name: "Nissan Navara", location: "PhuQuoc", priceOriginal: 1100000, priceDiscount: 1050000, brand: "Nissan", category: "Pickup", tier: "Standard", transmission: "Automatic", fuel: "Diesel", seats: 5, ownerType: "PARTNER", licensePlate: "68A-999.99", image: "https://images.unsplash.com/photo-1605898031388-752175a28189?auto=format&fit=crop&w=800&q=80" },
    { name: "Subaru Forester", location: "PhuQuoc", priceOriginal: 1500000, priceDiscount: 1400000, brand: "Subaru", category: "SUV", tier: "Standard", transmission: "Automatic", fuel: "Gasoline", seats: 5, ownerType: "COMPANY", licensePlate: "68B-101.10", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80" },
    { name: "Volvo XC90", location: "PhuQuoc", priceOriginal: 4000000, priceDiscount: 3800000, brand: "Volvo", category: "SUV", tier: "Luxury", transmission: "Automatic", fuel: "Hybrid", seats: 7, ownerType: "PARTNER", licensePlate: "68C-202.20", image: "https://images.unsplash.com/photo-1626668893632-6f0281b6dc24?auto=format&fit=crop&w=800&q=80" },

    // --- ĐÀ LẠT ---
    { name: "Volkswagen Tiguan", location: "DaLat", priceOriginal: 1800000, priceDiscount: 1700000, brand: "Volkswagen", category: "SUV", tier: "Standard", transmission: "Automatic", fuel: "Gasoline", seats: 7, ownerType: "COMPANY", licensePlate: "49A-303.30", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80" },
    { name: "Chevrolet Colorado", location: "DaLat", priceOriginal: 1000000, priceDiscount: 900000, brand: "Chevrolet", category: "Pickup", tier: "Budget", transmission: "Manual", fuel: "Diesel", seats: 5, ownerType: "PARTNER", licensePlate: "49B-404.40", image: "https://images.unsplash.com/photo-1605898031388-752175a28189?auto=format&fit=crop&w=800&q=80" },
    { name: "BYD Atto 3", location: "DaLat", priceOriginal: 1300000, priceDiscount: 1200000, brand: "BYD", category: "SUV", tier: "Standard", transmission: "Automatic", fuel: "Electric", seats: 5, ownerType: "COMPANY", licensePlate: "49C-505.50", image: "https://images.unsplash.com/photo-1678122312674-325b7b51b752?auto=format&fit=crop&w=800&q=80" },
    { name: "Ford Everest Ti", location: "DaLat", priceOriginal: 1600000, priceDiscount: 1500000, brand: "Ford", category: "SUV", tier: "Standard", transmission: "Automatic", fuel: "Diesel", seats: 7, ownerType: "PARTNER", licensePlate: "49D-606.60", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80" },

    // --- HẠ LONG ---
    { name: "VinFast VF9", location: "HaLong", priceOriginal: 2200000, priceDiscount: 2000000, brand: "VinFast", category: "SUV", tier: "Luxury", transmission: "Automatic", fuel: "Electric", seats: 7, ownerType: "COMPANY", licensePlate: "14A-707.70", image: "https://images.unsplash.com/photo-1678122312674-325b7b51b752?auto=format&fit=crop&w=800&q=80" },
    { name: "Toyota Camry", location: "HaLong", priceOriginal: 1500000, priceDiscount: 1400000, brand: "Toyota", category: "Sedan", tier: "Standard", transmission: "Automatic", fuel: "Hybrid", seats: 5, ownerType: "PARTNER", licensePlate: "14B-808.80", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80" },
    { name: "Hyundai SantaFe", location: "HaLong", priceOriginal: 1600000, priceDiscount: 1550000, brand: "Hyundai", category: "SUV", tier: "Standard", transmission: "Automatic", fuel: "Diesel", seats: 7, ownerType: "COMPANY", licensePlate: "14C-909.90", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80" },

    // --- VŨNG TÀU ---
    { name: "Kia Carnival", location: "VungTau", priceOriginal: 1800000, priceDiscount: 1700000, brand: "Kia", category: "MPV", tier: "Standard", transmission: "Automatic", fuel: "Diesel", seats: 7, ownerType: "COMPANY", licensePlate: "72A-121.21", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80" },
    { name: "Mazda BT-50", location: "VungTau", priceOriginal: 1000000, priceDiscount: 950000, brand: "Mazda", category: "Pickup", tier: "Budget", transmission: "Automatic", fuel: "Diesel", seats: 5, ownerType: "PARTNER", licensePlate: "72C-232.32", image: "https://images.unsplash.com/photo-1605898031388-752175a28189?auto=format&fit=crop&w=800&q=80" },
    { name: "Honda Civic Type R", location: "VungTau", priceOriginal: 3000000, priceDiscount: 2800000, brand: "Honda", category: "Sport", tier: "Luxury", transmission: "Manual", fuel: "Gasoline", seats: 4, ownerType: "PARTNER", licensePlate: "72B-343.43", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80" },

    // --- CẦN THƠ ---
    { name: "Mitsubishi Triton", location: "CanTho", priceOriginal: 950000, priceDiscount: 900000, brand: "Mitsubishi", category: "Pickup", tier: "Budget", transmission: "Automatic", fuel: "Diesel", seats: 5, ownerType: "COMPANY", licensePlate: "65C-454.54", image: "https://images.unsplash.com/photo-1605898031388-752175a28189?auto=format&fit=crop&w=800&q=80" },
    { name: "Suzuki Ertiga Hybrid", location: "CanTho", priceOriginal: 850000, priceDiscount: 800000, brand: "Suzuki", category: "MPV", tier: "Budget", transmission: "Automatic", fuel: "Hybrid", seats: 7, ownerType: "PARTNER", licensePlate: "65A-565.65", image: "https://images.unsplash.com/photo-1631526438096-7bb2a00c6dd9?auto=format&fit=crop&w=800&q=80" },
    { name: "BMW X5", location: "CanTho", priceOriginal: 4500000, priceDiscount: 4300000, brand: "BMW", category: "SUV", tier: "Luxury", transmission: "Automatic", fuel: "Gasoline", seats: 7, ownerType: "PARTNER", licensePlate: "65B-676.76", image: "https://images.unsplash.com/photo-1555353540-64fd8b028bfb?auto=format&fit=crop&w=800&q=80" },

    // --- HỘI AN ---
    { name: "Jeep Wrangler (Khác)", location: "HoiAn", priceOriginal: 3500000, priceDiscount: 3200000, brand: "Khac", category: "SUV", tier: "Luxury", transmission: "Automatic", fuel: "Gasoline", seats: 5, ownerType: "PARTNER", licensePlate: "92A-787.87", image: "https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?auto=format&fit=crop&w=800&q=80" },
    { name: "Peugeot 2008", location: "HoiAn", priceOriginal: 1100000, priceDiscount: 1000000, brand: "Peugeot", category: "SUV", tier: "Standard", transmission: "Automatic", fuel: "Gasoline", seats: 5, ownerType: "COMPANY", licensePlate: "92B-898.98", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80" },
    { name: "MG 5", location: "HoiAn", priceOriginal: 700000, priceDiscount: 650000, brand: "MG", category: "Sedan", tier: "Budget", transmission: "Automatic", fuel: "Gasoline", seats: 5, ownerType: "COMPANY", licensePlate: "92C-909.09", image: "https://images.unsplash.com/photo-1590362891991-f761ba3ec19b?auto=format&fit=crop&w=800&q=80" },

    // --- HUẾ ---
    { name: "Toyota Fortuner", location: "Hue", priceOriginal: 1400000, priceDiscount: 1350000, brand: "Toyota", category: "SUV", tier: "Standard", transmission: "Automatic", fuel: "Diesel", seats: 7, ownerType: "COMPANY", licensePlate: "75A-112.23", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80" },
    { name: "VinFast VF5", location: "Hue", priceOriginal: 700000, priceDiscount: 650000, brand: "VinFast", category: "SUV", tier: "Budget", transmission: "Automatic", fuel: "Electric", seats: 5, ownerType: "PARTNER", licensePlate: "75B-223.34", image: "https://images.unsplash.com/photo-1678122312674-325b7b51b752?auto=format&fit=crop&w=800&q=80" },
    { name: "Hyundai Tucson", location: "Hue", priceOriginal: 1300000, priceDiscount: 1200000, brand: "Hyundai", category: "SUV", tier: "Standard", transmission: "Automatic", fuel: "Gasoline", seats: 5, ownerType: "COMPANY", licensePlate: "75C-334.45", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80" },

    // --- QUY NHƠN ---
    { name: "Ford Territory", location: "QuyNhon", priceOriginal: 1250000, priceDiscount: 1150000, brand: "Ford", category: "SUV", tier: "Standard", transmission: "Automatic", fuel: "Gasoline", seats: 5, ownerType: "COMPANY", licensePlate: "77A-445.56", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80" },
    { name: "Kia K3", location: "QuyNhon", priceOriginal: 900000, priceDiscount: 850000, brand: "Kia", category: "Sedan", tier: "Budget", transmission: "Automatic", fuel: "Gasoline", seats: 5, ownerType: "PARTNER", licensePlate: "77B-556.67", image: "https://images.unsplash.com/photo-1590362891991-f761ba3ec19b?auto=format&fit=crop&w=800&q=80" },
    { name: "Mitsubishi Attrage", location: "QuyNhon", priceOriginal: 550000, priceDiscount: 500000, brand: "Mitsubishi", category: "Sedan", tier: "Budget", transmission: "Manual", fuel: "Gasoline", seats: 5, ownerType: "COMPANY", licensePlate: "77C-667.78", image: "https://images.unsplash.com/photo-1590362891991-f761ba3ec19b?auto=format&fit=crop&w=800&q=80" },

    // --- BỔ SUNG THÊM XE CHO CÁC THÀNH PHỐ LỚN ĐỂ ĐỦ 50 ---
    { name: "Audi A6", location: "HaNoi", priceOriginal: 3200000, priceDiscount: 3000000, brand: "Audi", category: "Sedan", tier: "Luxury", transmission: "Automatic", fuel: "Gasoline", seats: 5, ownerType: "COMPANY", licensePlate: "30F-778.89", image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0b63?auto=format&fit=crop&w=800&q=80" },
    { name: "Porsche Panamera", location: "TPHCM", priceOriginal: 6000000, priceDiscount: 5800000, brand: "Porsche", category: "Sport", tier: "Luxury", transmission: "Automatic", fuel: "Hybrid", seats: 4, ownerType: "PARTNER", licensePlate: "51K-889.90", image: "https://images.unsplash.com/photo-1503376712341-ea1d821ae1a3?auto=format&fit=crop&w=800&q=80" },
    { name: "Chevrolet Trailblazer", location: "DaNang", priceOriginal: 1100000, priceDiscount: 1000000, brand: "Chevrolet", category: "SUV", tier: "Standard", transmission: "Automatic", fuel: "Diesel", seats: 7, ownerType: "COMPANY", licensePlate: "43D-990.01", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80" },
    { name: "Subaru Outback", location: "NhaTrang", priceOriginal: 1600000, priceDiscount: 1500000, brand: "Subaru", category: "SUV", tier: "Standard", transmission: "Automatic", fuel: "Gasoline", seats: 5, ownerType: "PARTNER", licensePlate: "79A-102.34", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80" },
    { name: "Nissan Almera", location: "PhuQuoc", priceOriginal: 700000, priceDiscount: 650000, brand: "Nissan", category: "Sedan", tier: "Budget", transmission: "Automatic", fuel: "Gasoline", seats: 5, ownerType: "COMPANY", licensePlate: "68B-213.45", image: "https://images.unsplash.com/photo-1590362891991-f761ba3ec19b?auto=format&fit=crop&w=800&q=80" },
    { name: "Volvo S90", location: "DaLat", priceOriginal: 3500000, priceDiscount: 3300000, brand: "Volvo", category: "Sedan", tier: "Luxury", transmission: "Automatic", fuel: "Hybrid", seats: 5, ownerType: "COMPANY", licensePlate: "49C-324.56", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80" },
    { name: "Honda HR-V", location: "HaLong", priceOriginal: 1000000, priceDiscount: 900000, brand: "Honda", category: "SUV", tier: "Standard", transmission: "Automatic", fuel: "Gasoline", seats: 5, ownerType: "PARTNER", licensePlate: "14A-435.67", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80" },
    { name: "Mercedes GLC 300", location: "VungTau", priceOriginal: 3200000, priceDiscount: 3000000, brand: "Mercedes", category: "SUV", tier: "Luxury", transmission: "Automatic", fuel: "Gasoline", seats: 5, ownerType: "COMPANY", licensePlate: "72B-546.78", image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0b63?auto=format&fit=crop&w=800&q=80" },
    { name: "Volkswagen Polo", location: "CanTho", priceOriginal: 700000, priceDiscount: 650000, brand: "Volkswagen", category: "Hatchback", tier: "Budget", transmission: "Automatic", fuel: "Gasoline", seats: 5, ownerType: "PARTNER", licensePlate: "65C-657.89", image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&w=800&q=80" },
  ];

  // Map chung dữ liệu phụ để code ngắn gọn
  const defaultExtraData = {
    gallery: [
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80"
    ],
    address: "Bãi đỗ xe trung tâm",
    amenities: ["Camera hành trình", "Bluetooth", "Cảm biến lùi", "Bản đồ GPS", "Màn hình DVD"],
    deliveryFee: 50000,
    requirements: "Yêu cầu có bằng B2. Đặt cọc 15 triệu hoặc để lại xe máy chính chủ có giá trị tương đương.",
    rules: "Không hút thuốc trên xe. Không chở thú cưng. Vui lòng rửa xe trước khi trả.",
    ownerName: "AutoHub Partner",
    ownerPhone: "0988123456",
    ownerCCCD: "001090123456",
    commission: 20,
    status: "APPROVED" as any, 
    description: "Xe đời mới, bảo dưỡng định kỳ tại hãng. Động cơ mạnh mẽ, nội thất sạch sẽ, thích hợp cho các chuyến đi chơi xa gia đình hoặc công tác."
  };

  // Vòng lặp đẩy 50 chiếc xe vào Database
  for (const car of cars) {
    await prisma.car.create({
      data: {
        ...car,
        ...defaultExtraData,
        // Ép kiểu TypeScript để prisma nhận diện chính xác Enum
        location: car.location as any,
        brand: car.brand as any,
        category: car.category as any,
        tier: car.tier as any,
        transmission: car.transmission as any,
        fuel: car.fuel as any,
        ownerType: car.ownerType as any,
      },
    });
  }

  console.log('🎉 Đã thêm thành công 50 chiếc xe đa dạng vào hệ thống!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi Seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });