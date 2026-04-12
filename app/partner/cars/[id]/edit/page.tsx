/* eslint-disable */
// @ts-nocheck
"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { CarFront, Save, ChevronLeft, FileText } from "lucide-react";
import Link from "next/link";

const BRANDS = ["Toyota", "VinFast", "Hyundai", "Ford", "Mitsubishi", "Kia", "Mazda", "Honda", "Suzuki", "MG", "Peugeot", "Mercedes", "BMW", "Audi", "Lexus", "Porsche", "LandRover", "Nissan", "Subaru", "Volvo", "Volkswagen", "Tesla", "BYD", "Khac"];
const CATEGORIES = [ { id: "Sedan", name: "Sedan" }, { id: "SUV", name: "SUV" }, { id: "Hatchback", name: "Hatchback" }, { id: "MPV", name: "MPV" }, { id: "Pickup", name: "Bán tải" }, { id: "Sport", name: "Xe thể thao" } ];
const TIERS = [ { id: "Budget", name: "Bình dân" }, { id: "Standard", name: "Phổ thông" }, { id: "Luxury", name: "Hạng sang" } ];
const LOCATIONS = [ { id: "HaNoi", name: "Hà Nội" }, { id: "TPHCM", name: "TP. Hồ Chí Minh" }, { id: "DaNang", name: "Đà Nẵng" }, { id: "NhaTrang", name: "Nha Trang" }, { id: "PhuQuoc", name: "Phú Quốc" }, { id: "DaLat", name: "Đà Lạt" }, { id: "HaLong", name: "Hạ Long" }, { id: "VungTau", name: "Vũng Tàu" }, { id: "CanTho", name: "Cần Thơ" }, { id: "HoiAn", name: "Hội An" }, { id: "Hue", name: "Huế" }, { id: "QuyNhon", name: "Quy Nhơn" } ];

export default function PartnerEditCarPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const carId = resolvedParams?.id;

  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const [formData, setFormData] = useState({
    name: "", image: "", gallery: "", priceOriginal: 0, priceDiscount: 0,
    brand: "Toyota", category: "Sedan", tier: "Standard",
    transmission: "Automatic", fuel: "Gasoline", location: "HaNoi",
    seats: 4, address: "", deliveryFee: 0, 
    amenities: "", rules: "", requirements: "",
    licensePlate: "", ownerCCCD: ""
  });

  useEffect(() => {
    if (!carId) return;
    const fetchCar = async () => {
      try {
        const res = await fetch(`/api/cars/${carId}`);
        if (res.ok) {
          const data = await res.json();
          
          let safeGallery = [];
          try { safeGallery = Array.isArray(data.gallery) ? data.gallery : JSON.parse(data.gallery || "[]"); } catch(e) {}
          let safeAmenities = [];
          try { safeAmenities = Array.isArray(data.amenities) ? data.amenities : JSON.parse(data.amenities || "[]"); } catch(e) {}

          setFormData({
            ...data,
            gallery: safeGallery.join(", "),
            amenities: safeAmenities.join(", "),
            address: data.address || "",
            rules: data.rules || "",
            requirements: data.requirements || "",
            deliveryFee: data.deliveryFee || 0,
            licensePlate: data.licensePlate || "",
            ownerCCCD: data.ownerCCCD || ""
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setInitialLoad(false);
      }
    };
    fetchCar();
  }, [carId]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      priceOriginal: Number(formData.priceOriginal) || 0,
      priceDiscount: Number(formData.priceDiscount) || 0,
      seats: Number(formData.seats) || 5,
      deliveryFee: Number(formData.deliveryFee) || 0,
      gallery: formData.gallery.split(',').map(item => item.trim()).filter(Boolean),
      amenities: formData.amenities.split(',').map(item => item.trim()).filter(Boolean)
    };

    try {
      const res = await fetch(`/api/cars/${carId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Đã cập nhật thông tin xe thành công! 🎉");
        router.push("/partner/dashboard"); // 🚀 Chuyển về trang của đối tác
        router.refresh(); 
      } else {
        const errorData = await res.json();
        alert(`Lỗi: ${errorData.error || "Không thể cập nhật"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) return <div className="min-h-screen flex items-center justify-center font-black text-blue-600 animate-pulse uppercase tracking-widest text-xl">Đang tải hồ sơ xe...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-28">
      <div className="max-w-5xl mx-auto">
        <Link href="/partner/dashboard" className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-6 hover:text-blue-600">
          <ChevronLeft size={16} /> Quay lại Quản lý đội xe
        </Link>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-black text-blue-900 uppercase tracking-tighter flex items-center gap-3 mb-8">
            <CarFront className="text-blue-600" /> Cập nhật xe của tôi #{carId}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. THÔNG TIN ĐỊNH DANH */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-yellow-50/50 rounded-2xl border border-yellow-100">
              <h2 className="col-span-full text-sm font-black text-yellow-600 uppercase tracking-widest flex items-center gap-2"><FileText size={18}/> Định danh cơ bản</h2>
              <div>
                <label className="text-xs font-bold text-gray-700">Biển số xe</label>
                <input name="licensePlate" value={formData.licensePlate} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white uppercase font-bold" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">CCCD Chủ xe</label>
                <input name="ownerCCCD" value={formData.ownerCCCD} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white" />
              </div>
            </div>

            {/* 2. THÔNG TIN CƠ BẢN & HÌNH ẢNH */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl">
              <h2 className="col-span-full text-sm font-black text-gray-400 uppercase tracking-widest">Thông tin & Hình ảnh</h2>
              
              <div className="col-span-full">
                <label className="text-xs font-bold text-gray-700">Tên xe</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white" />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-700">Giá gốc (VNĐ/ngày)</label>
                <input required type="number" name="priceOriginal" value={formData.priceOriginal} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Giá khuyến mãi (VNĐ/ngày)</label>
                <input required type="number" name="priceDiscount" value={formData.priceDiscount} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white" />
              </div>

              <div className="col-span-full border-t border-gray-200 pt-4 mt-2">
                <label className="text-xs font-bold text-gray-700">Link hình ảnh CHÍNH (URL hoặc Base64)</label>
                <input required name="image" value={formData.image} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white" />
              </div>
              <div className="col-span-full">
                <label className="text-xs font-bold text-gray-700">Bộ sưu tập ảnh (Gallery) - Phân cách bằng dấu phẩy</label>
                <textarea name="gallery" value={formData.gallery} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white h-20" />
              </div>
            </div>

            {/* 3. PHÂN LOẠI & THÔNG SỐ KỸ THUẬT */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
              <h2 className="col-span-full text-sm font-black text-blue-500 uppercase tracking-widest">Phân loại & Kỹ thuật</h2>
              
              <div>
                <label className="text-xs font-bold text-gray-700">Hãng xe</label>
                <select name="brand" value={formData.brand} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white">
                  {BRANDS.map(brand => <option key={brand} value={brand}>{brand === "LandRover" ? "Land Rover" : brand}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Kiểu xe</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white">
                  {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Phân khúc</label>
                <select name="tier" value={formData.tier} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white">
                  {TIERS.map(tier => <option key={tier.id} value={tier.id}>{tier.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Số chỗ ngồi</label>
                <input required type="number" name="seats" value={formData.seats} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Hộp số</label>
                <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white">
                  <option value="Automatic">Tự động</option>
                  <option value="Manual">Số sàn</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Nhiên liệu</label>
                <select name="fuel" value={formData.fuel} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white">
                  <option value="Gasoline">Xăng</option>
                  <option value="Diesel">Dầu</option>
                  <option value="Electric">Điện</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            {/* 4. VỊ TRÍ & GIAO NHẬN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-orange-50/50 rounded-2xl border border-orange-100">
              <h2 className="col-span-full text-sm font-black text-orange-500 uppercase tracking-widest">Vị trí & Giao nhận</h2>
              
              <div className="col-span-full">
                <label className="text-xs font-bold text-gray-700">Địa chỉ bãi xe chính xác</label>
                <input required name="address" value={formData.address} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Thành phố</label>
                <select name="location" value={formData.location} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white">
                  {LOCATIONS.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Phí giao xe tận nhà</label>
                <input required type="number" name="deliveryFee" value={formData.deliveryFee} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white" />
              </div>
            </div>

            {/* 5. TIỆN NGHI & ĐIỀU KHOẢN */}
            <div className="grid grid-cols-1 gap-6 p-6 bg-green-50/50 rounded-2xl border border-green-100">
              <h2 className="col-span-full text-sm font-black text-green-600 uppercase tracking-widest">Tiện nghi & Điều khoản</h2>
              
              <div>
                <label className="text-xs font-bold text-gray-700">Tiện nghi nổi bật</label>
                <input name="amenities" value={formData.amenities} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Giấy tờ yêu cầu</label>
                <textarea name="requirements" value={formData.requirements} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white h-20" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Lưu ý & Phụ thu</label>
                <textarea name="rules" value={formData.rules} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl border bg-white h-20" />
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full py-5 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex justify-center items-center gap-2">
              <Save size={20} /> {loading ? "Đang lưu thay đổi..." : "Lưu cập nhật xe"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}