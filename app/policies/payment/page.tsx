import { CreditCard } from "lucide-react";

export const metadata = { title: "Phương thức thanh toán | ViVuCar" };

export default function PaymentPage() {
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-black text-blue-900 uppercase italic tracking-tighter mb-8 flex items-center gap-4">
        <CreditCard className="text-blue-600 w-10 h-10 shrink-0" /> Phương thức thanh toán
      </h1>
      <div className="space-y-6 text-gray-700 leading-relaxed font-medium">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Cổng thanh toán VNPay</h2>
          <p>Chúng tôi hỗ trợ thanh toán an toàn, bảo mật tuyệt đối qua cổng VNPay. Khách hàng có thể quét mã QR, dùng thẻ ATM nội địa, Visa/MasterCard hoặc tài khoản ngân hàng.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Quy định đặt cọc</h2>
          <p>Để giữ xe, khách hàng cần đặt cọc trước một khoản tiền (tùy thuộc vào giá trị xe) thông qua hệ thống. Số tiền còn lại sẽ được thanh toán trực tiếp cho Chủ xe khi nhận xe.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Chính sách hoàn tiền</h2>
          <p>Nếu bạn hủy chuyến trước 24h, hệ thống sẽ hoàn cọc 100% vào tài khoản trong vòng 3-5 ngày làm việc. Nếu hủy quá sát giờ, phí hủy sẽ được tính theo quy định của nền tảng.</p>
        </section>
      </div>
    </>
  );
}