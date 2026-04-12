/* eslint-disable */
// @ts-nocheck
import prisma from "@/lib/prisma";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import PrintButton from "./PrintButton"; 

export const dynamic = "force-dynamic";

const formatCurrency = (amount: number) => new Intl.NumberFormat("vi-VN").format(amount) + " VNĐ";
const formatDate = (date: Date) => {
  const d = new Date(date);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} ngày ${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

export default async function ContractPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const resolvedParams = await params;
  const bookingId = parseInt(resolvedParams.bookingId);

  // Lấy dữ liệu Chuyến xe, kèm Thông tin Xe (và Chủ xe) và Thông tin Khách hàng
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { 
      car: {
        include: { user: true } // Lấy thông tin chủ xe
      }, 
      user: true 
    }
  });

  if (!booking) return <div className="text-center p-20 font-black text-2xl text-red-500">404 - Không tìm thấy mã chuyến đi!</div>;

  // Trích xuất dữ liệu động
  const ownerName = booking.car?.user?.name || booking.car?.ownerName || "Đối tác ViVuCar";
  const ownerPhone = booking.car?.user?.phone || "Chưa cập nhật";
  const renterName = booking.user?.name || "Khách hàng";
  const renterPhone = booking.user?.phone || "Chưa cập nhật";
  const carName = booking.car?.name || "Chưa xác định";
  const licensePlate = booking.car?.licensePlate || "Chưa cập nhật";
  const contractDate = new Date(booking.createdAt);

  return (
    // 🚀 SỬA LỖI PHÔNG CHỮ: Đổi font-serif thành font-sans ở dòng dưới đây
    <div className="min-h-screen bg-gray-200 pt-24 pb-12 font-sans text-gray-900 flex flex-col items-center">
      
      {/* 🚀 VŨ KHÍ BÍ MẬT: Bơm CSS ép buộc trình duyệt khi In */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            /* 1. "Trảm" toàn bộ Navbar, Header, Footer trên toàn hệ thống */
            nav, header, footer { display: none !important; }
            
            /* 2. Ẩn cụm nút điều khiển */
            .hide-on-print { display: none !important; }
            
            /* 3. Đổi nền trang web thành màu trắng tinh */
            body, html, main, .bg-gray-200 { background-color: white !important; }
            
            /* 4. Xóa luôn mấy chữ localhost, ngày tháng, số trang ở góc của trình duyệt */
            @page { margin: 0; }
            
            /* 5. Căn lề lùi vào cho tờ A4 đỡ bị lẹm chữ khi in thật */
            #printable-contract {
              padding: 20mm !important;
              box-shadow: none !important;
              border: none !important;
            }
          }
        `
      }} />

      {/* NÚT ĐIỀU KHIỂN */}
      <div className="hide-on-print w-full max-w-4xl flex justify-between mb-6 px-4 md:px-0">
        <Link href={`/history/${booking.id}`} className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl font-bold shadow-sm border border-gray-100 hover:text-blue-600 transition-all">
          <ChevronLeft size={18} /> Quay lại
        </Link>
        <PrintButton />
      </div>

      {/* TỜ GIẤY A4 */}
      <div id="printable-contract" className="bg-white w-full max-w-4xl p-12 md:p-20 shadow-2xl rounded-2xl">
        
        {/* TIÊU ĐỀ QUỐC HIỆU */}
        <div className="text-center mb-10">
          <h2 className="font-bold text-lg uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
          <h3 className="font-bold text-base underline decoration-1 underline-offset-4">Độc lập - Tự do - Hạnh phúc</h3>
          <p className="italic text-sm mt-4 text-gray-500">
            Mã hợp đồng: VIVU-{booking.id} <br/>
            Hôm nay, ngày {contractDate.getDate()} tháng {contractDate.getMonth() + 1} năm {contractDate.getFullYear()}, chúng tôi gồm có:
          </p>
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-center mb-10 uppercase">HỢP ĐỒNG CHO THUÊ XE TỰ LÁI</h1>

        {/* THÔNG TIN HAI BÊN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 border-b border-gray-200 pb-8 text-sm">
            <div>
                <h3 className="font-black text-blue-900 uppercase mb-4 flex items-center gap-2 border-l-4 border-blue-600 pl-2">
                    Bên A (Chủ xe)
                </h3>
                <ul className="space-y-3 font-medium">
                    <li><span className="text-gray-500">Đại diện:</span> <span className="font-bold text-gray-900 uppercase">{ownerName}</span></li>
                    <li><span className="text-gray-500">Số điện thoại:</span> <span className="font-bold text-gray-900">{ownerPhone}</span></li>
                    <li><span className="text-gray-500">Vai trò:</span> Chủ sở hữu phương tiện.</li>
                </ul>
            </div>

            <div>
                <h3 className="font-black text-red-700 uppercase mb-4 flex items-center gap-2 border-l-4 border-red-600 pl-2">
                    Bên B (Người thuê)
                </h3>
                <ul className="space-y-3 font-medium">
                    <li><span className="text-gray-500">Ông/Bà:</span> <span className="font-bold text-gray-900 uppercase">{renterName}</span></li>
                    <li><span className="text-gray-500">Số điện thoại:</span> <span className="font-bold text-gray-900">{renterPhone}</span></li>
                    <li><span className="text-gray-500">CCCD/GPLX số:</span> ....................................</li>
                </ul>
            </div>
        </div>

        <p className="font-bold italic mt-4 mb-6">Hai bên thống nhất ký kết Hợp đồng thuê xe với các điều khoản sau:</p>

        {/* ĐIỀU KHOẢN HỢP ĐỒNG */}
        <div className="space-y-6 text-justify text-sm leading-relaxed">
          <section>
            <h3 className="font-bold text-base text-gray-900">ĐIỀU 1: THÔNG TIN TÀI SẢN THUÊ & THỜI GIAN</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Loại xe:</strong> <span className="font-bold text-blue-700 uppercase">{carName}</span></li>
              <li><strong>Biển kiểm soát:</strong> {licensePlate}</li>
              <li><strong>Thời gian nhận xe:</strong> <span className="text-green-700 font-bold">{formatDate(booking.startDate)}</span></li>
              <li><strong>Thời gian trả xe:</strong> <span className="text-red-600 font-bold">{formatDate(booking.endDate)}</span></li>
              <li><strong>Địa điểm giao nhận:</strong> {booking.location || "Theo thỏa thuận hai bên"}</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-base text-gray-900">ĐIỀU 2: CHI PHÍ & THANH TOÁN</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Tổng tiền thuê:</strong> <span className="text-lg font-bold text-blue-700">{formatCurrency(booking.totalPrice)}</span></li>
              <li><strong>Phí bảo hiểm vật chất xe:</strong> Sàn ViVuCar thu 120.000 VNĐ (Đã bao gồm trong tổng tiền) để kích hoạt gói bảo hiểm chuyến đi trong suốt thời gian thuê.</li>
              <li><strong>Số tiền đã đặt cọc (Qua hệ thống):</strong> {formatCurrency(booking.depositAmount || 0)}</li>
              <li><strong>Số tiền cần thanh toán khi nhận xe:</strong> <span className="text-red-600 font-bold underline">{formatCurrency(booking.totalPrice - (booking.depositAmount || 0))}</span></li>
              <li><strong>Tài sản thế chấp:</strong> Khách hàng để lại 01 Xe máy (kèm cà vẹt gốc) có giá trị trên 15 triệu đồng hoặc đặt cọc tiền mặt 15.000.000 VNĐ cho Chủ xe khi nhận xe.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-base text-gray-900">ĐIỀU 3: TRÁCH NHIỆM BÊN B (NGƯỜI THUÊ)</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
              <li>Sử dụng xe đúng mục đích, không dùng xe để cầm cố, thế chấp hoặc vận chuyển hàng quốc cấm.</li>
              <li>Chịu hoàn toàn trách nhiệm dân sự và hình sự trước pháp luật nếu vi phạm luật giao thông đường bộ trong thời gian thuê (bao gồm cả phạt nguội).</li>
              <li>Thanh toán 100% chi phí sửa chữa tại gara chính hãng nếu gây ra tai nạn, trầy xước, hư hỏng xe.</li>
              <li>Bồi thường phụ thu nếu trả xe trễ giờ (Mức phí: 100.000 VNĐ/giờ).</li>
            </ul>
          </section>
        </div>

        {/* CHỮ KÝ */}
        <div className="grid grid-cols-2 text-center mt-12 pt-8 border-t border-gray-200">
          <div className="relative">
            <h3 className="font-bold text-base uppercase">ĐẠI DIỆN BÊN A</h3>
            <p className="italic text-xs text-gray-400 mb-20">(Ký và ghi rõ họ tên)</p>
            
            {/* CON DẤU VIVUCAR */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 opacity-30 pointer-events-none hidden md:flex">
              <div className="w-24 h-24 border-[3px] border-red-500 rounded-full flex items-center justify-center rotate-[-15deg]">
                <span className="text-red-500 font-black uppercase text-[10px] text-center leading-tight">ĐÃ DUYỆT BỞI<br/>VIVUCAR</span>
              </div>
            </div>

            <p className="font-black uppercase text-blue-900">{ownerName}</p>
          </div>

          <div>
            <h3 className="font-bold text-base uppercase">ĐẠI DIỆN BÊN B</h3>
            <p className="italic text-xs text-gray-400 mb-20">(Ký và ghi rõ họ tên)</p>
            <p className="font-black uppercase">{renterName}</p>
          </div>
        </div>

      </div>
    </div>
  );
}