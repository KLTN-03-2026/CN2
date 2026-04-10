/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { 
  Car, PhoneCall, Mail, MapPin, Facebook, 
  Youtube, Instagram, Linkedin, ChevronRight, ShieldCheck 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="print:hidden bg-white border-t border-gray-100 pt-16 pb-8 font-sans">
      <div className="container mx-auto px-4">
        
        {/* ĐÃ SỬA: Dùng 4 cột chia đều nhau (lg:grid-cols-4) đảm bảo dàn ngang chuẩn xác */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">
          
          {/* CỘT 1: BRANDING & GIỚI THIỆU */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group inline-flex">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-blue-200 group-hover:rotate-6 transition-all">
                <Car size={26} />
              </div>
              <span className="text-3xl font-black text-blue-900 tracking-tighter uppercase italic">ViVuCar</span>
            </Link>
            
            <p className="text-gray-500 font-medium leading-relaxed">
              Nền tảng đặt xe tự lái và có tài xế hàng đầu Việt Nam. Trải nghiệm di chuyển thông minh, minh bạch và đẳng cấp.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-gray-600 font-medium">
                <MapPin size={20} className="text-blue-600 shrink-0 mt-0.5" />
                <span>Tầng 4, Tòa nhà ViVuCar, 123 Đường Láng, Đống Đa, Hà Nội</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 font-medium">
                <PhoneCall size={20} className="text-blue-600 shrink-0" />
                <span className="font-bold text-gray-900 text-lg tracking-tight">1900 9999</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 font-medium">
                <Mail size={20} className="text-blue-600 shrink-0" />
                <span>cskh@vivucar.vn</span>
              </div>
            </div>
          </div>

          {/* CỘT 2: CHÍNH SÁCH CỦA KHOA */}
          <div>
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Chính sách</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/policies/terms" className="text-gray-600 font-medium hover:text-blue-600 transition-all flex items-center gap-2 group">
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  Điều kiện giao dịch chung
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="text-gray-600 font-medium hover:text-blue-600 transition-all flex items-center gap-2 group">
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  Chính sách bảo vệ dữ liệu cá nhân
                </Link>
              </li>
              <li>
                <Link href="/policies/platform-terms" className="text-gray-600 font-medium hover:text-blue-600 transition-all flex items-center gap-2 group">
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  Điều khoản sử dụng nền tảng
                </Link>
              </li>
              <li>
                <Link href="/policies/delivery" className="text-gray-600 font-medium hover:text-blue-600 transition-all flex items-center gap-2 group">
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  Chính sách giao nhận xe
                </Link>
              </li>
              <li>
                <Link href="/policies/payment" className="text-gray-600 font-medium hover:text-blue-600 transition-all flex items-center gap-2 group">
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  Phương thức thanh toán
                </Link>
              </li>
            </ul>
          </div>

          {/* CỘT 3: ĐỊA ĐIỂM DỊCH VỤ CỦA KHOA */}
          <div>
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Địa điểm dịch vụ</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/cars?location=HaNoi" className="text-gray-600 font-medium hover:text-blue-600 transition-all flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-600 transition-colors"></div>
                  Hà Nội
                </Link>
              </li>
              <li>
                <Link href="/cars?location=DaNang" className="text-gray-600 font-medium hover:text-blue-600 transition-all flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-600 transition-colors"></div>
                  Đà Nẵng
                </Link>
              </li>
              <li>
                <Link href="/cars?location=NhaTrang" className="text-gray-600 font-medium hover:text-blue-600 transition-all flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-600 transition-colors"></div>
                  Nha Trang
                </Link>
              </li>
              <li>
                <Link href="/cars?location=TPHCM" className="text-gray-600 font-medium hover:text-blue-600 transition-all flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-600 transition-colors"></div>
                  Hồ Chí Minh
                </Link>
              </li>
              <li>
                <Link href="/cars?location=VungTau" className="text-gray-600 font-medium hover:text-blue-600 transition-all flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-600 transition-colors"></div>
                  Vũng Tàu
                </Link>
              </li>
            </ul>
          </div>

          {/* CỘT 4: MẠNG XÃ HỘI & CHỨNG NHẬN */}
          <div>
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Kết nối với ViVuCar</h3>
            <div className="flex gap-3 mb-8">
              <Link href="https://facebook.com" target="_blank" className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                <Facebook size={18} />
              </Link>
              <Link href="https://linkedin.com" target="_blank" className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center hover:bg-blue-800 hover:text-white transition-all shadow-sm">
                <Linkedin size={18} />
              </Link>
              <Link href="https://youtube.com" target="_blank" className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm">
                <Youtube size={18} />
              </Link>
              <Link href="https://instagram.com" target="_blank" className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-500 hover:text-white transition-all shadow-sm">
                <Instagram size={18} />
              </Link>
            </div>

            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Chứng nhận</h3>
            <Link href="http://online.gov.vn" target="_blank" className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-2xl w-fit hover:bg-blue-50 hover:border-blue-100 transition-all group">
              <ShieldCheck className="text-blue-600 w-8 h-8 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-[10px] font-black text-blue-900 uppercase tracking-tighter italic leading-none mb-1">Đã thông báo</p>
                <p className="text-xs font-bold text-gray-600 uppercase group-hover:text-blue-600 transition-colors">Bộ Công Thương</p>
              </div>
            </Link>
          </div>

        </div>
        
        {/* ĐƯỜNG KẺ VÀ COPYRIGHT */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-400">
          <p>© {new Date().getFullYear()} Công ty TNHH ViVuCar Mobility Việt Nam. MST: 0123456789.</p>
          <div className="flex items-center gap-6">
            <Link href="/policies/terms" className="hover:text-blue-600 transition-colors">Điều khoản</Link>
            <Link href="/policies/privacy" className="hover:text-blue-600 transition-colors">Bảo mật</Link>
            <Link href="/sitemap" className="hover:text-blue-600 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}