import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import prisma from "@/lib/prisma";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const userMessage = messages[messages.length - 1].content;
    const msg = userMessage.toLowerCase();

    // =====================================================================
    // 1. XÂY DỰNG BỘ LỌC TÌM KIẾM TOÀN DIỆN (PHỦ SÓNG 100% SCHEMA)
    // =====================================================================
    let buildWhere: any = { status: "APPROVED" }; 
    let orderByConfig: any = { createdAt: "desc" }; 

    // MAPPING ĐỊA ĐIỂM (12 Location)
    const locations: Record<string, string> = {
      "hà nội": "HaNoi", "ha noi": "HaNoi", "hcm": "TPHCM", "hồ chí minh": "TPHCM", "sài gòn": "TPHCM",
      "đà nẵng": "DaNang", "da nang": "DaNang", "nha trang": "NhaTrang", "phú quốc": "PhuQuoc", "phu quoc": "PhuQuoc",
      "đà lạt": "DaLat", "da lat": "DaLat", "hạ long": "HaLong", "ha long": "HaLong", "vũng tàu": "VungTau", "vung tau": "VungTau",
      "cần thơ": "CanTho", "can tho": "CanTho", "hội an": "HoiAn", "hoi an": "HoiAn", "huế": "Hue", "hue": "Hue", "quy nhơn": "QuyNhon"
    };
    for (const [key, val] of Object.entries(locations)) {
      if (msg.includes(key)) buildWhere.location = val;
    }

    // MAPPING HÃNG XE (24 Brand)
    const brands = [
      "toyota", "vinfast", "hyundai", "ford", "mitsubishi", "kia", "mazda", "honda", "suzuki", 
      "mg", "peugeot", "mercedes", "bmw", "audi", "lexus", "porsche", "nissan", "subaru", 
      "volvo", "volkswagen", "chevrolet", "byd"
    ];
    for (const brand of brands) {
      if (msg.includes(brand)) {
        // Viết hoa chữ cái đầu cho khớp Enum (VD: toyota -> Toyota)
        buildWhere.brand = brand.charAt(0).toUpperCase() + brand.slice(1);
      }
    }
    if (msg.includes("land rover")) buildWhere.brand = "LandRover";

    // MAPPING DÁNG XE (Category)
    const categories: Record<string, string> = {
      "sedan": "Sedan", "suv": "SUV", "hatchback": "Hatchback", "mpv": "MPV",
      "bán tải": "Pickup", "ban tai": "Pickup", "thể thao": "Sport", "the thao": "Sport"
    };
    for (const [key, val] of Object.entries(categories)) {
      if (msg.includes(key)) buildWhere.category = val;
    }

    // MAPPING CHỖ NGỒI, HỘP SỐ, NHIÊN LIỆU
    if (msg.match(/[457]\s*chỗ?/)) {
      const seatsMatch = msg.match(/([457])\s*chỗ?/);
      if (seatsMatch) buildWhere.seats = parseInt(seatsMatch[1]);
    }
    if (msg.includes("số tự động") || msg.includes("tu dong")) buildWhere.transmission = "Automatic";
    else if (msg.includes("số sàn") || msg.includes("so san")) buildWhere.transmission = "Manual";
    
    if (msg.includes("xe điện") || msg.includes("xe dien")) buildWhere.fuel = "Electric";
    else if (msg.includes("xe xăng") || msg.includes("xe xang")) buildWhere.fuel = "Gasoline";
    else if (msg.includes("máy dầu") || msg.includes("xe dầu")) buildWhere.fuel = "Diesel";

    if (msg.includes("rẻ") || msg.includes("thấp nhất")) orderByConfig = { priceOriginal: "asc" };

    // =====================================================================
    // 2. KÉO TOÀN BỘ CHI TIẾT DỮ LIỆU TỪ DATABASE
    // =====================================================================
    const availableCars = await prisma.car.findMany({
      where: buildWhere,
      take: 10,
      orderBy: orderByConfig,
      // Lấy KHÔNG SÓT MỘT THÔNG TIN NÀO
      select: { 
        name: true, brand: true, category: true, seats: true, location: true, 
        priceOriginal: true, priceDiscount: true, transmission: true, fuel: true,
        amenities: true, deliveryFee: true, requirements: true, rules: true
      }
    });

    // Ép kiểu toàn bộ dữ liệu thành 1 khối văn bản chi tiết
    const carListData = availableCars.map((c: any) => {
      const trans = c.transmission === "Automatic" ? "Số tự động" : "Số sàn";
      const fuel = c.fuel === "Electric" ? "Điện" : c.fuel === "Gasoline" ? "Xăng" : "Dầu";
      
      return `📌 [${c.brand} ${c.name} - ${c.category}]
- Thông số: ${c.seats} chỗ, ${trans}, Máy ${fuel}.
- Vị trí: ${c.location}.
- Giá: ${c.priceDiscount > 0 ? c.priceDiscount.toLocaleString('vi-VN') : c.priceOriginal.toLocaleString('vi-VN')}đ/ngày.
- Phí giao xe: ${c.deliveryFee > 0 ? c.deliveryFee.toLocaleString('vi-VN') + 'đ' : 'Miễn phí'}.
- Tiện ích có sẵn: ${c.amenities.length > 0 ? c.amenities.join(", ") : 'Cơ bản'}.
- Yêu cầu bắt buộc: ${c.requirements ? c.requirements : 'Không có'}.
- Quy định chủ xe: ${c.rules ? c.rules : 'Không có'}.`;
    }).join("\n\n");

    // =====================================================================
    // 3. NẠP CẨM NANG NGHIỆP VỤ & DỮ LIỆU VÀO AI
    // =====================================================================
    const systemPrompt = `
      Bạn là chuyên viên CSKH ảo của hệ thống thuê xe tự lái ViVuCar (AutoHub AI). Luôn xưng "em" và gọi khách là "anh/chị". 

      DƯỚI ĐÂY LÀ DANH SÁCH CHI TIẾT CÁC XE PHÙ HỢP NHẤT ĐANG SẴN SÀNG:
      ${carListData ? carListData : "(Hiện tại không có xe khớp với yêu cầu tìm kiếm của anh/chị)"}

      --- CẨM NANG NGHIỆP VỤ VIVUCAR ---

      1. QUY TRÌNH ĐẶT XE:
      - Khách chọn xe và lịch trình -> Xác nhận hợp đồng -> Thanh toán cọc 30% qua web.
      - 70% còn lại khách trả tiền mặt cho chủ xe lúc nhận xe.

      2. CHÍNH SÁCH HỦY ĐƠN:
      - Vào Lịch sử chuyến đi -> Chi tiết đơn hàng -> Bấm "Yêu cầu hủy chuyến đi".
      - Chỉ hỗ trợ hủy khi đơn ở trạng thái "Chờ thanh toán cọc" hoặc "Đã xác nhận".

      3. LỊCH TRỐNG CỦA XE:
      - Hướng dẫn khách bấm vào Xem chi tiết xe -> Lướt xuống phần Chọn ngày. Nếu ngày đó mờ đi nghĩa là xe đang bận.

      QUY TẮC TRẢ LỜI:
      - Nắm rõ YÊU CẦU và QUY ĐỊNH của từng xe để tư vấn (Ví dụ: khách hỏi xe này có cần thế chấp sổ hộ khẩu không, phải đọc trong mục "Yêu cầu bắt buộc").
      - Nếu khách hỏi tiện ích (có camera hành trình không?), xem mục "Tiện ích có sẵn".
      - Không cần liệt kê toàn bộ thông tin của xe nếu khách không hỏi. Chỉ nhấn mạnh những ý khách quan tâm.
    `;

    // 4. Xử lý lịch sử & Gọi Groq AI
    const recentMessages = messages.slice(-6).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content
    }));

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...recentMessages
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6, 
      max_tokens: 1024,
    });

    return NextResponse.json({ reply: chatCompletion.choices[0]?.message?.content });

  } catch (error: any) {
    console.error("❌ LỖI CHATBOT GROQ:", error.message);
    return NextResponse.json({ error: "Hệ thống đang bảo trì, anh/chị vui lòng thử lại sau nhé!" }, { status: 500 });
  }
}