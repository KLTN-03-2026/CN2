import { Truck } from "lucide-react";

export const metadata = { title: "Chính sách giao nhận | ViVuCar" };

export default function DeliveryPage() {
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-black text-blue-900 uppercase italic tracking-tighter mb-8 flex items-center gap-4">
        <Truck className="text-blue-600 w-10 h-10 shrink-0" /> Chính sách giao nhận xe
      </h1>
      <div className="space-y-6 text-gray-700 leading-relaxed font-medium">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Nhận xe tại bãi</h2>
          <p>Khách hàng mang theo bản gốc GPLX và CCCD gắn chip đến địa chỉ bãi đậu xe được cung cấp sau khi đặt cọc thành công. Quá trình nhận xe tại bãi hoàn toàn miễn phí.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Giao xe tận nơi</h2>
          <p>ViVuCar hỗ trợ giao xe tận nhà hoặc sân bay. Phí giao nhận sẽ được hệ thống tính toán tự động dựa trên khoảng cách. Khách hàng vui lòng có mặt đúng giờ để ký biên bản bàn giao xe.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Quy trình đồng kiểm</h2>
          <p>Khi nhận xe, hai bên sẽ chụp ảnh/quay video lại hiện trạng xe (vết xước, mức nhiên liệu). Trạng thái này sẽ được dùng làm căn cứ lúc khách hàng trả xe.</p>
        </section>
      </div>
    </>
  );
}