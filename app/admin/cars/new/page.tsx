"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CarFront, Save, ChevronLeft } from "lucide-react";
import Link from "next/link";

// --- DANH SÁCH DỮ LIỆU ĐỂ RENDER SELECT BOX CHO NHANH ---
const BRANDS = ["Toyota", "VinFast", "Hyundai", "Ford", "Mitsubishi", "Kia", "Mazda", "Honda", "Suzuki", "MG", "Peugeot", "Mercedes", "BMW", "Audi", "Lexus", "Porsche", "LandRover", "Nissan", "Subaru", "Volvo", "Volkswagen", "Chevrolet", "BYD", "Khac"];
const CATEGORIES = [
  { id: "Sedan", name: "Sedan" }, { id: "SUV", name: "SUV" }, { id: "Hatchback", name: "Hatchback" },
  { id: "MPV", name: "MPV" }, { id: "Pickup", name: "Bán tải" }, { id: "Sport", name: "Xe thể thao" }
];
const TIERS = [
  { id: "Budget", name: "Bình dân" }, { id: "Standard", name: "Phổ thông" }, { id: "Luxury", name: "Hạng sang" }
];
const LOCATIONS = [
  { id: "HaNoi", name: "Hà Nội" }, { id: "TPHCM", name: "TP. Hồ Chí Minh" }, { id: "DaNang", name: "Đà Nẵng" },
  { id: "NhaTrang", name: "Nha Trang" }, { id: "PhuQuoc", name: "Phú Quốc" }, { id: "DaLat", name: "Đà Lạt" },
  { id: "HaLong", name: "Hạ Long" }, { id: "VungTau", name: "Vũng Tàu" }, { id: "CanTho", name: "Cần Thơ" },
  { id: "HoiAn", name: "Hội An" }, { id: "Hue", name: "Huế" }, { id: "QuyNhon", name: "Quy Nhơn" }
];

export default function AddCarAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "", image: "", gallery: "", priceOriginal: 0, priceDiscount: 0,
    brand: "Toyota", category: "Sedan", tier: "Standard",
    transmission: "Automatic", fuel: "Gasoline", location: "HaNoi",
    seats: 4, address: "", deliveryFee: 0, 
    amenities: "", rules: "", requirements: ""
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Đã thêm xe mới thành công! 🎉");
        router.push("/admin/cars"); // 🚀 ĐỔI THÀNH ĐƯỜNG DẪN TRANG QUẢN LÝ XE CỦA KHOA
        router.refresh();           // 🚀 THÊM DÒNG NÀY để danh sách xe tự động cập nhật chiếc mới
      } else {
        alert("Có lỗi xảy ra khi thêm xe.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/admin" className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-6 hover:text-blue-600">
          <ChevronLeft size={16} /> Quay lại Dashboard
        </Link>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-black text-blue-900 uppercase tracking-tighter flex items-center gap-3 mb-8">
            <CarFront className="text-blue-600" /> Thêm xe mới vào hệ thống
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. THÔNG TIN CƠ BẢN & HÌNH ẢNH */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl">
              <h2 className="col-span-full text-sm font-black text-gray-400 uppercase tracking-widest">Thông tin & Hình ảnh</h2>
              
              <div className="col-span-full">
                <label className="text-xs font-bold text-gray-700">Tên xe (Vd: VinFast VF8)</label>
                <input required name="name" onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white" />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-700">Giá gốc (VNĐ/ngày)</label>
                <input required type="number" name="priceOriginal" onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Giá khuyến mãi (VNĐ/ngày)</label>
                <input required type="number" name="priceDiscount" onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white" />
              </div>

              <div className="col-span-full border-t border-gray-200 pt-4 mt-2">
                <label className="text-xs font-bold text-gray-700">Link hình ảnh CHÍNH (URL)</label>
                <input required name="image" onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white" placeholder="https://..." />
              </div>
              <div className="col-span-full">
                <label className="text-xs font-bold text-gray-700">Bộ sưu tập ảnh (Gallery) - Phân cách bằng dấu phẩy</label>
                <textarea name="gallery" onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white h-20" placeholder="https://anh1.jpg, https://anh2.jpg, https://anh3.jpg" />
              </div>
            </div>

            {/* 2. PHÂN LOẠI & THÔNG SỐ KỸ THUẬT */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
              <h2 className="col-span-full text-sm font-black text-blue-500 uppercase tracking-widest">Phân loại & Kỹ thuật</h2>
              
              <div>
                <label className="text-xs font-bold text-gray-700">Hãng xe</label>
                <select name="brand" onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white">
                  {BRANDS.map(brand => <option key={brand} value={brand}>{brand === "LandRover" ? "Land Rover" : brand}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Kiểu xe</label>
                <select name="category" onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white">
                  {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Phân khúc</label>
                <select name="tier" onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white">
                  {TIERS.map(tier => <option key={tier.id} value={tier.id}>{tier.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Số chỗ ngồi</label>
                <input required type="number" name="seats" defaultValue={4} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Hộp số</label>
                <select name="transmission" onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white">
                  <option value="Automatic">Tự động</option>
                  <option value="Manual">Số sàn</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Nhiên liệu</label>
                <select name="fuel" onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white">
                  <option value="Gasoline">Xăng</option>
                  <option value="Diesel">Dầu</option>
                  <option value="Electric">Điện</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            {/* 3. VỊ TRÍ & GIAO NHẬN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-orange-50/50 rounded-2xl border border-orange-100">
              <h2 className="col-span-full text-sm font-black text-orange-500 uppercase tracking-widest">Vị trí & Giao nhận</h2>
              
              <div className="col-span-full">
                <label className="text-xs font-bold text-gray-700">Địa chỉ bãi xe chính xác</label>
                <input required name="address" onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white" placeholder="123 Lê Lợi, TP. Đông Hà, Quảng Trị" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Thành phố</label>
                <select name="location" onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white">
                  {LOCATIONS.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Phí giao xe tận nhà (Nhập 0 nếu ko hỗ trợ)</label>
                <input required type="number" name="deliveryFee" onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white" />
              </div>
            </div>

            {/* 4. TIỆN NGHI & ĐIỀU KHOẢN */}
            <div className="grid grid-cols-1 gap-6 p-6 bg-green-50/50 rounded-2xl border border-green-100">
              <h2 className="col-span-full text-sm font-black text-green-600 uppercase tracking-widest">Tiện nghi & Điều khoản</h2>
              
              <div>
                <label className="text-xs font-bold text-gray-700">Tiện nghi nổi bật (Ngăn cách bằng dấu phẩy)</label>
                <input name="amenities" onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white" placeholder="Bluetooth, Camera 360, Cửa sổ trời, Ghế massage..." />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Giấy tờ yêu cầu</label>
                <textarea name="requirements" onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white h-20" placeholder="1. CCCD gắn chip&#10;2. GPLX Hạng B1 trở lên..." />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Lưu ý & Phụ thu</label>
                <textarea name="rules" onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white h-20" placeholder="Không hút thuốc, giữ gìn vệ sinh chung..." />
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full py-5 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex justify-center items-center gap-2">
              <Save size={20} /> {loading ? "Đang đẩy dữ liệu lên hệ thống..." : "Xác nhận đưa xe lên sàn"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}