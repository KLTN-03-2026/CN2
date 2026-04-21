/* eslint-disable */
// @ts-nocheck
"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { CarFront, Save, ChevronLeft, FileText, ImagePlus, X, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

const BRANDS = ["Toyota", "VinFast", "Hyundai", "Ford", "Mitsubishi", "Kia", "Mazda", "Honda", "Suzuki", "MG", "Peugeot", "Mercedes", "BMW", "Audi", "Lexus", "Porsche", "LandRover", "Nissan", "Subaru", "Volvo", "Volkswagen", "Tesla", "BYD", "Khac"];
const CATEGORIES = [ { id: "Sedan", name: "Sedan" }, { id: "SUV", name: "SUV" }, { id: "Hatchback", name: "Hatchback" }, { id: "MPV", name: "MPV" }, { id: "Pickup", name: "Bán tải" }, { id: "Sport", name: "Xe thể thao" } ];
const TIERS = [ { id: "Budget", name: "Bình dân" }, { id: "Standard", name: "Phổ thông" }, { id: "Luxury", name: "Hạng sang" } ];
const LOCATIONS = [ { id: "HaNoi", name: "Hà Nội" }, { id: "TPHCM", name: "TP. Hồ Chí Minh" }, { id: "DaNang", name: "Đà Nẵng" }, { id: "NhaTrang", name: "Nha Trang" }, { id: "PhuQuoc", name: "Phú Quốc" }, { id: "DaLat", name: "Đà Lạt" }, { id: "HaLong", name: "Hạ Long" }, { id: "VungTau", name: "Vũng Tàu" }, { id: "CanTho", name: "Cần Thơ" }, { id: "HoiAn", name: "Hội An" }, { id: "Hue", name: "Huế" }, { id: "QuyNhon", name: "Quy Nhơn" } ];
const AMENITIES_LIST = ["Bản đồ", "Bluetooth", "Camera lùi", "Cảm biến lốp", "Cửa sổ trời", "Định vị GPS", "Khe cắm USB", "Lốp dự phòng"];

export default function EditCarAdminPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const carId = resolvedParams?.id;

  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "", priceOriginal: "", priceDiscount: "",
    brand: "Toyota", category: "Sedan", tier: "Standard",
    transmission: "Automatic", fuel: "Gasoline", location: "HaNoi",
    seats: 4, address: "", deliveryFee: 0, 
    amenities: [], rules: "", requirements: "",
    licensePlate: "", ownerCCCD: "",
    images: [] // Chứa cả ảnh chính và gallery
  });

  // TỰ ĐỘNG LẤY DỮ LIỆU CŨ KHI LOAD TRANG
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

          // Gom ảnh chính và gallery vào một mảng để dễ render
          const allImages = data.image ? [data.image, ...safeGallery] : safeGallery;

          setFormData({
            ...data,
            priceOriginal: data.priceOriginal?.toString() || "",
            priceDiscount: data.priceDiscount?.toString() || "",
            images: allImages,
            amenities: safeAmenities,
            address: data.address || "",
            rules: data.rules || "",
            requirements: data.requirements || "",
            deliveryFee: data.deliveryFee?.toString() || "0",
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
    let { name, value } = e.target;
    
    // Chỉ cho phép nhập số
    if (['priceOriginal', 'priceDiscount', 'deliveryFee'].includes(name)) {
      value = value.replace(/[^0-9]/g, ''); 
    }

    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors(prev => { const newErrors = { ...prev }; delete newErrors[name]; return newErrors; });
    }
  };

  const toggleAmenity = (name: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(name) ? prev.amenities.filter(a => a !== name) : [...prev.amenities, name]
    }));
  };

  const handleImageUpload = async (e: any) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 5) return alert("Tối đa 5 ảnh");
    
    const base64Images = await Promise.all(files.map(file => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
        });
    }));
    
    setFormData(prev => ({ ...prev, images: [...prev.images, ...base64Images] }));
  };

  const removeImage = (idx: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    const pOriginal = Number(formData.priceOriginal);
    const pDiscount = Number(formData.priceDiscount);
    
    if (!pOriginal) return setErrors({ priceOriginal: "Vui lòng nhập giá gốc!" });
    if (pDiscount > 0 && pDiscount > pOriginal) return setErrors({ priceDiscount: "Giá KM không lớn hơn giá gốc!" });
    if (formData.images.length === 0) return alert("Cần ít nhất 1 ảnh cho xe!");

    setLoading(true);

    const { images, ...restFormData } = formData; 
    const payload = {
      ...restFormData,
      priceOriginal: pOriginal,
      priceDiscount: pDiscount > 0 ? pDiscount : pOriginal,
      seats: Number(formData.seats) || 5,
      deliveryFee: Number(formData.deliveryFee) || 0,
      image: images[0] || "",
      gallery: images.slice(1) || [],
      amenities: formData.amenities 
    };

    try {
      const res = await fetch(`/api/cars/${carId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Đã cập nhật thông tin xe thành công! 🎉");
        router.push("/admin/cars");
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

  if (initialLoad) return <div className="min-h-screen flex flex-col items-center justify-center font-black text-blue-600 bg-[#f8fafc]"><Loader2 className="animate-spin mb-4" size={40} /><span className="uppercase tracking-widest text-[10px]">Đang tải hồ sơ xe...</span></div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 font-sans pb-20">
      <div className="max-w-5xl mx-auto">
        <Link href="/admin/cars" className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-6 hover:text-blue-600 w-fit">
          <ChevronLeft size={16} /> Quay lại Danh sách xe
        </Link>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <h1 className="text-3xl font-black text-blue-900 uppercase italic tracking-tighter flex items-center gap-3 mb-8">
            <CarFront className="text-blue-600" size={32} /> Cập nhật thông tin xe #{carId}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. THÔNG TIN ĐỊNH DANH */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-yellow-50/30 rounded-[32px] border border-yellow-50">
              <h2 className="col-span-full text-xs font-black text-yellow-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><FileText size={16}/> Định danh cơ bản</h2>
              <div>
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Biển số xe</label>
                <input name="licensePlate" value={formData.licensePlate} onChange={handleChange} className="w-full mt-2 p-4 rounded-xl border border-gray-200 bg-white uppercase font-bold text-sm outline-none focus:border-yellow-400" />
              </div>
              <div>
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">CCCD Chủ xe</label>
                <input name="ownerCCCD" value={formData.ownerCCCD} onChange={handleChange} className="w-full mt-2 p-4 rounded-xl border border-gray-200 bg-white font-bold text-sm outline-none focus:border-yellow-400" />
              </div>
            </div>

            {/* 2. THÔNG TIN CƠ BẢN & GIÁ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-blue-50/30 rounded-[32px] border border-blue-50">
              <h2 className="col-span-full text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-2">Thông tin & Giá thuê</h2>
              <div className="col-span-full">
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Tên xe <span className="text-red-500">*</span></label>
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full mt-2 p-4 rounded-xl border border-gray-200 bg-white font-bold text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Giá gốc (VNĐ/ngày) <span className="text-red-500">*</span></label>
                <input required type="text" value={formData.priceOriginal} name="priceOriginal" onChange={handleChange} className={`w-full mt-2 p-4 rounded-xl border bg-white font-black text-blue-600 text-lg outline-none ${errors.priceOriginal ? 'border-red-400' : 'border-gray-200 focus:border-blue-500'}`} />
                {errors.priceOriginal && <p className="text-red-500 text-[10px] font-bold italic mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.priceOriginal}</p>}
              </div>
              <div>
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Giá khuyến mãi (VNĐ/ngày)</label>
                <input type="text" value={formData.priceDiscount} name="priceDiscount" onChange={handleChange} className={`w-full mt-2 p-4 rounded-xl border bg-white font-black text-green-600 text-lg outline-none ${errors.priceDiscount ? 'border-red-400' : 'border-gray-200 focus:border-blue-500'}`} />
                {errors.priceDiscount && <p className="text-red-500 text-[10px] font-bold italic mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.priceDiscount}</p>}
              </div>
            </div>

            {/* 3. QUẢN LÝ HÌNH ẢNH */}
            <div className="p-8 bg-gray-50/50 rounded-[32px] border border-gray-100">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Hình ảnh xe (Tối đa 5 ảnh) <span className="text-red-500">*</span></h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {formData.images.length < 5 && (
                      <label className="border-2 border-dashed border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer h-28 relative transition-all">
                          <ImagePlus className="text-blue-500 mb-1" size={24} />
                          <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Tải ảnh lên</span>
                          <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                  )}
                  {formData.images.map((img, idx) => (
                      <div key={idx} className="relative rounded-2xl overflow-hidden h-28 group border border-gray-200 shadow-sm">
                          <img src={img} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-all"><X/></button>
                          {idx === 0 && <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-[8px] font-bold px-2 py-1 rounded-md uppercase tracking-widest">Ảnh chính</span>}
                      </div>
                  ))}
              </div>
            </div>

            {/* 4. PHÂN LOẠI & THÔNG SỐ */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm">
              <h2 className="col-span-full text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Phân loại & Kỹ thuật</h2>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hãng xe</label>
                <select name="brand" value={formData.brand} onChange={handleChange} className="w-full mt-2 p-3 rounded-xl border border-gray-200 bg-gray-50 font-bold text-sm outline-none focus:border-blue-500">
                  {BRANDS.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kiểu xe</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full mt-2 p-3 rounded-xl border border-gray-200 bg-gray-50 font-bold text-sm outline-none focus:border-blue-500">
                  {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phân khúc</label>
                <select name="tier" value={formData.tier} onChange={handleChange} className="w-full mt-2 p-3 rounded-xl border border-gray-200 bg-gray-50 font-bold text-sm outline-none focus:border-blue-500">
                  {TIERS.map(tier => <option key={tier.id} value={tier.id}>{tier.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Số chỗ ngồi</label>
                <input required type="number" name="seats" value={formData.seats} onChange={handleChange} className="w-full mt-2 p-3 rounded-xl border border-gray-200 bg-gray-50 font-bold text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hộp số</label>
                <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full mt-2 p-3 rounded-xl border border-gray-200 bg-gray-50 font-bold text-sm outline-none focus:border-blue-500">
                  <option value="Automatic">Tự động</option>
                  <option value="Manual">Số sàn</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nhiên liệu</label>
                <select name="fuel" value={formData.fuel} onChange={handleChange} className="w-full mt-2 p-3 rounded-xl border border-gray-200 bg-gray-50 font-bold text-sm outline-none focus:border-blue-500">
                  <option value="Gasoline">Xăng</option>
                  <option value="Diesel">Dầu</option>
                  <option value="Electric">Điện</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            {/* 5. VỊ TRÍ & GIAO NHẬN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-orange-50/30 rounded-[32px] border border-orange-50">
              <h2 className="col-span-full text-xs font-black text-orange-400 uppercase tracking-[0.2em] mb-2">Vị trí & Giao nhận</h2>
              <div className="col-span-full">
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Địa chỉ bãi xe chính xác <span className="text-red-500">*</span></label>
                <input required name="address" value={formData.address} onChange={handleChange} className="w-full mt-2 p-4 rounded-xl border border-gray-200 bg-white font-bold text-sm outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Thành phố</label>
                <select name="location" value={formData.location} onChange={handleChange} className="w-full mt-2 p-4 rounded-xl border border-gray-200 bg-white font-bold text-sm outline-none focus:border-orange-400">
                  {LOCATIONS.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Phí giao xe (Nhập số 0 nếu không có dịch vụ) <span className="text-red-500">*</span></label>
                <input required type="text" value={formData.deliveryFee} name="deliveryFee" onChange={handleChange} className="w-full mt-2 p-4 rounded-xl border border-gray-200 bg-white font-bold text-sm outline-none focus:border-orange-400" />
              </div>
            </div>

            {/* 6. TIỆN NGHI & ĐIỀU KHOẢN */}
            <div className="grid grid-cols-1 gap-6 p-8 bg-green-50/30 rounded-[32px] border border-green-50">
              <h2 className="col-span-full text-xs font-black text-green-500 uppercase tracking-[0.2em] mb-2">Tiện nghi & Điều khoản</h2>
              <div>
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Tiện nghi nổi bật</label>
                  <div className="flex flex-wrap gap-2">
                      {AMENITIES_LIST.map(item => (
                      <button 
                        type="button" 
                        key={item} 
                        onClick={() => toggleAmenity(item)} 
                        className={`px-4 py-2.5 rounded-xl text-[11px] font-black tracking-wider border transition-all ${formData.amenities.includes(item) ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-100' : 'bg-white text-gray-500 border-gray-200 hover:border-green-300'}`}
                      >
                        {item}
                      </button>
                      ))}
                  </div>
              </div>
              <div>
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Giấy tờ yêu cầu</label>
                <textarea name="requirements" value={formData.requirements} onChange={handleChange} className="w-full mt-2 p-4 rounded-xl border border-gray-200 bg-white font-medium text-sm outline-none focus:border-green-400 min-h-[100px]" />
              </div>
              <div>
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Lưu ý & Phụ thu</label>
                <textarea name="rules" value={formData.rules} onChange={handleChange} className="w-full mt-2 p-4 rounded-xl border border-gray-200 bg-white font-medium text-sm outline-none focus:border-green-400 min-h-[100px]" />
              </div>
            </div>

            <button 
              disabled={loading} 
              type="submit" 
              className="w-full py-5 bg-blue-900 text-white font-black uppercase italic tracking-widest rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-800 transition-all active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <><Save size={20} /> Lưu cập nhật hồ sơ xe</>}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}