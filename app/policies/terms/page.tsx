import { FileText } from "lucide-react";

export const metadata = { title: "Điều kiện giao dịch chung | ViVuCar" };

export default function TermsPage() {
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-black text-blue-900 uppercase italic tracking-tighter mb-8 flex items-center gap-4">
        <FileText className="text-blue-600 w-10 h-10 shrink-0" /> Điều kiện giao dịch chung
      </h1>
      <div className="space-y-6 text-gray-700 leading-relaxed font-medium">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Nguyên tắc chung</h2>
          <p>Nền tảng ViVuCar đóng vai trò là cầu nối giữa Chủ xe và Người thuê xe. Mọi giao dịch thuê xe phải tuân thủ pháp luật Việt Nam, đảm bảo tính minh bạch, tự nguyện và trung thực giữa các bên.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Quyền và nghĩa vụ của Khách hàng</h2>
          <p>Khách hàng cần cung cấp thông tin cá nhân chính xác (CCCD, GPLX). Khách hàng có trách nhiệm bảo quản xe trong suốt thời gian thuê và chịu trách nhiệm bồi thường nếu xảy ra hư hỏng, vi phạm luật giao thông.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Giải quyết tranh chấp</h2>
          <p>Mọi tranh chấp phát sinh sẽ được ViVuCar hỗ trợ hòa giải. Nếu không thể hòa giải, sự việc sẽ được đưa ra cơ quan có thẩm quyền tại Việt Nam giải quyết.</p>
        </section>
      </div>
    </>
  );
}