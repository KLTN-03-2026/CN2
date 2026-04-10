import { FileSignature } from "lucide-react";

export const metadata = { title: "Mẫu Hợp đồng thuê xe | ViVuCar" };

export default function ContractPolicyPage() {
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-black text-blue-900 uppercase italic tracking-tighter mb-8 flex items-center gap-4">
        <FileSignature className="text-blue-600 w-10 h-10 shrink-0" /> Mẫu Hợp đồng thuê xe
      </h1>
      <div className="space-y-6 text-gray-700 leading-relaxed font-medium">
        
        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm border border-blue-100 italic">
          * Đây là mẫu hợp đồng tiêu chuẩn áp dụng trên nền tảng ViVuCar. Bản hợp đồng chính thức (kèm theo thông tin cá nhân và chi tiết chuyến xe cụ thể của quý khách) sẽ được hệ thống tạo tự động và gửi đến quý khách sau khi đặt xe thành công.
        </div>
        
        {/* PHÔI HỢP ĐỒNG */}
        <div className="bg-white p-6 md:p-10 rounded-2xl border-2 border-gray-100 shadow-inner font-serif mt-8">
           <h2 className="font-bold text-center text-lg mb-2">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
           <h3 className="font-bold text-center text-sm underline decoration-1 underline-offset-4 mb-8">Độc lập - Tự do - Hạnh phúc</h3>
           
           <h2 className="font-bold text-center text-xl mb-8">HỢP ĐỒNG CHO THUÊ XE TỰ LÁI</h2>
           
           <div className="space-y-6 text-justify">
             <p><strong>BÊN A (BÊN CHO THUÊ):</strong> Công ty TNHH ViVuCar Mobility Việt Nam</p>
             <p><strong>BÊN B (BÊN THUÊ XE):</strong> [Họ tên, SĐT, CCCD của Quý khách sẽ được điền tự động]</p>
             
             <h3 className="font-bold mt-6 underline">ĐIỀU 1: THÔNG TIN TÀI SẢN THUÊ & THỜI GIAN</h3>
             <ul className="list-disc pl-5 mt-2 space-y-1">
               <li><strong>Loại xe:</strong> [Tên dòng xe và biển số xe Quý khách chọn]</li>
               <li><strong>Thời gian thuê:</strong> [Bắt đầu từ ngày... đến ngày...]</li>
               <li><strong>Hình thức giao nhận:</strong> [Tự lấy tại bãi / Giao tận nơi]</li>
             </ul>

             <h3 className="font-bold mt-6 underline">ĐIỀU 2: CHI PHÍ & THANH TOÁN</h3>
             <ul className="list-disc pl-5 mt-2 space-y-1">
               <li><strong>Tổng tiền thuê:</strong> [Tính theo giá hệ thống hiển thị tại thời điểm đặt]</li>
               <li><strong>Tài sản thế chấp (Giao cho chủ xe lúc nhận):</strong> Khách hàng để lại 01 Xe máy (kèm cà vẹt gốc) có giá trị trên 15 triệu đồng hoặc đặt cọc tiền mặt 15.000.000 VNĐ.</li>
             </ul>

             <h3 className="font-bold mt-6 underline">ĐIỀU 3: TRÁCH NHIỆM BÊN B (NGƯỜI THUÊ)</h3>
             <ul className="list-disc pl-5 mt-2 space-y-1">
               <li>Sử dụng xe đúng mục đích, không dùng xe để cầm cố, thế chấp hoặc vận chuyển hàng quốc cấm.</li>
               <li>Chịu hoàn toàn trách nhiệm dân sự và hình sự trước pháp luật nếu vi phạm luật giao thông đường bộ trong thời gian thuê (bao gồm cả phạt nguội).</li>
               <li>Thanh toán chi phí sửa chữa theo báo giá của gara chính hãng nếu gây ra tai nạn, trầy xước, hư hỏng xe.</li>
               <li>Bồi thường phụ thu nếu trả xe trễ giờ (100.000 VNĐ/giờ).</li>
             </ul>
           </div>
        </div>
      </div>
    </>
  );
}