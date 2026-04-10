import { ShieldCheck } from "lucide-react";

export const metadata = { title: "Bảo vệ dữ liệu cá nhân | ViVuCar" };

export default function PrivacyPage() {
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-black text-blue-900 uppercase italic tracking-tighter mb-8 flex items-center gap-4">
        <ShieldCheck className="text-blue-600 w-10 h-10 shrink-0" /> Bảo vệ dữ liệu cá nhân
      </h1>
      <div className="space-y-6 text-gray-700 leading-relaxed font-medium">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Mục đích thu thập dữ liệu</h2>
          <p>Chúng tôi thu thập dữ liệu (Họ tên, SĐT, Email, Giấy tờ tùy thân) nhằm mục đích xác minh danh tính, tạo hợp đồng thuê xe và hỗ trợ khách hàng trong các trường hợp khẩn cấp.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Cam kết bảo mật</h2>
          <p>ViVuCar cam kết tuyệt đối không bán, trao đổi hay chia sẻ dữ liệu cá nhân của khách hàng cho bất kỳ bên thứ 3 nào vì mục đích thương mại, ngoại trừ trường hợp có yêu cầu từ cơ quan chức năng.</p>
        </section>
      </div>
    </>
  );
}