import { MonitorSmartphone } from "lucide-react";

export const metadata = { title: "Điều khoản sử dụng nền tảng | ViVuCar" };

export default function PlatformTermsPage() {
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-black text-blue-900 uppercase italic tracking-tighter mb-8 flex items-center gap-4">
        <MonitorSmartphone className="text-blue-600 w-10 h-10 shrink-0" /> Điều khoản sử dụng
      </h1>
      <div className="space-y-6 text-gray-700 leading-relaxed font-medium">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Bản quyền tài sản trí tuệ</h2>
          <p>Toàn bộ thiết kế, mã nguồn, logo và tài liệu trên website ViVuCar đều thuộc sở hữu của chúng tôi. Nghiêm cấm mọi hành vi sao chép, chỉnh sửa khi chưa được sự cho phép bằng văn bản.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Các hành vi bị nghiêm cấm</h2>
          <p>Người dùng không được phép sử dụng nền tảng để lừa đảo, phát tán mã độc, spam hoặc đăng tải nội dung vi phạm thuần phong mỹ tục.</p>
        </section>
      </div>
    </>
  );
}