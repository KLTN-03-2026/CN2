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
        include: { user: true }
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
    <div className="min-h-screen bg-gray-200 pt-24 pb-12 font-sans text-gray-900 flex flex-col items-center">
      
      {/* CSS ép buộc trình duyệt khi In */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            nav, header, footer { display: none !important; }
            .hide-on-print { display: none !important; }
            body, html, main, .bg-gray-200 { background-color: white !important; }
            @page { margin: 0; }
            #printable-contract {
              padding: 15mm 20mm !important;
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
      <div id="printable-contract" className="bg-white w-full max-w-4xl p-10 md:p-16 shadow-2xl rounded-2xl">
        
        {/* TIÊU ĐỀ QUỐC HIỆU */}
        <div className="text-center mb-8">
          <h2 className="font-bold text-lg uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
          <h3 className="font-bold text-base underline decoration-1 underline-offset-4">Độc lập - Tự do - Hạnh phúc</h3>
          <p className="italic text-sm mt-4 text-gray-500">
            Mã hợp đồng: VIVU-{booking.id} <br/>
            Hôm nay, ngày {contractDate.getDate()} tháng {contractDate.getMonth() + 1} năm {contractDate.getFullYear()}, chúng tôi gồm có:
          </p>
        </div>

        <h1 className="text-2xl font-black text-center mb-8 uppercase tracking-wide">HỢP ĐỒNG CHO THUÊ XE Ô TÔ TỰ LÁI</h1>

        {/* THÔNG TIN HAI BÊN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 border-b border-gray-200 pb-6 text-sm">
            <div>
                <h3 className="font-black text-blue-900 uppercase mb-3 flex items-center gap-2 border-l-4 border-blue-600 pl-2">
                    Bên A (Chủ xe / Bên Cho Thuê)
                </h3>
                <ul className="space-y-2 font-medium">
                    <li><span className="text-gray-500">Đại diện:</span> <span className="font-bold text-gray-900 uppercase">{ownerName}</span></li>
                    <li><span className="text-gray-500">Số điện thoại:</span> <span className="font-bold text-gray-900">{ownerPhone}</span></li>
                    <li><span className="text-gray-500">Nền tảng kết nối:</span> Ứng dụng ViVuCar (AutoHub AI)</li>
                </ul>
            </div>

            <div>
                <h3 className="font-black text-red-700 uppercase mb-3 flex items-center gap-2 border-l-4 border-red-600 pl-2">
                    Bên B (Người Thuê)
                </h3>
                <ul className="space-y-2 font-medium">
                    <li><span className="text-gray-500">Ông/Bà:</span> <span className="font-bold text-gray-900 uppercase">{renterName}</span></li>
                    <li><span className="text-gray-500">Số điện thoại:</span> <span className="font-bold text-gray-900">{renterPhone}</span></li>
                    <li><span className="text-gray-500">CCCD số:</span> ....................................</li>
                    <li><span className="text-gray-500">GPLX số:</span> ................. Hạng: ............</li>
                </ul>
            </div>
        </div>

        <p className="font-bold italic mt-2 mb-4 text-sm">Sau khi bàn bạc, hai bên thống nhất ký kết Hợp đồng thuê xe ô tô tự lái với các điều khoản sau đây:</p>

        {/* ĐIỀU KHOẢN HỢP ĐỒNG CHI TIẾT */}
        <div className="space-y-5 text-justify text-[13px] leading-relaxed">
          
          <section>
            <h3 className="font-bold text-[14px] text-gray-900 mb-1">ĐIỀU 1: THÔNG TIN TÀI SẢN THUÊ & THỜI GIAN</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Tài sản thuê:</strong> Ô tô hiệu <span className="font-bold text-blue-700 uppercase">{carName}</span>, Biển kiểm soát: <strong>{licensePlate}</strong>.</li>
              <li>Bên A giao xe tình trạng hoạt động bình thường, đầy đủ giấy tờ (Bản sao công chứng hoặc Bản gốc có biên nhận). Mức nhiên liệu và tình trạng xước xát (nếu có) được hai bên ghi nhận bằng hình ảnh thực tế lúc giao xe.</li>
              <li><strong>Thời gian nhận xe:</strong> <span className="text-green-700 font-bold">{formatDate(booking.startDate)}</span></li>
              <li><strong>Thời gian trả xe:</strong> <span className="text-red-600 font-bold">{formatDate(booking.endDate)}</span></li>
              <li><strong>Địa điểm giao nhận:</strong> {booking.location || "Theo thỏa thuận trực tiếp giữa hai bên."}</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-[14px] text-gray-900 mb-1">ĐIỀU 2: GIÁ TRỊ HỢP ĐỒNG & TÀI SẢN THẾ CHẤP</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Tổng tiền thuê xe:</strong> <span className="font-bold text-blue-700">{formatCurrency(booking.totalPrice)}</span> (Bao gồm chi phí bảo hiểm chuyến đi ViVuCar).</li>
              <li><strong>Số tiền đã đặt cọc qua nền tảng:</strong> {formatCurrency(booking.depositAmount || 0)}</li>
              <li><strong>Tiền mặt thanh toán khi nhận xe:</strong> <span className="text-red-600 font-bold underline">{formatCurrency(booking.totalPrice - (booking.depositAmount || 0))}</span></li>
              <li><strong>Tài sản thế chấp (Bên B giao cho Bên A giữ):</strong> 01 Xe máy kèm Giấy đăng ký xe bản gốc (đứng tên Bên B hoặc người bảo lãnh) trị giá trên 15.000.000 VNĐ <strong>HOẶC</strong> đặt cọc tiền mặt 15.000.000 VNĐ. Tài sản này sẽ được hoàn trả 100% khi Bên B thanh lý hợp đồng và không phát sinh vi phạm.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-[14px] text-gray-900 mb-1">ĐIỀU 3: MỤC ĐÍCH SỬ DỤNG & CÁC HÀNH VI BỊ NGHIÊM CẤM</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-800">
              <li>Bên B chỉ sử dụng xe cho mục đích di chuyển cá nhân/gia đình. <strong className="text-red-600 text-[12px]">NGHIÊM CẤM DÙNG XE ĐỂ: Cầm cố, thế chấp, bán, cho thuê lại, chạy xe ghép, tập lái, đua xe trái phép.</strong></li>
              <li>Tuyệt đối <strong>không sử dụng xe để vận chuyển vũ khí, ma túy, hàng lậu, hàng quốc cấm</strong>. Nếu vi phạm, Bên B chịu hoàn toàn trách nhiệm Hình sự trước pháp luật, Bên A miễn trừ mọi trách nhiệm liên đ đới.</li>
              <li>Bên A có quyền đơn phương chấm dứt hợp đồng, thu hồi xe ngay lập tức và trình báo Cơ quan Công an nếu phát hiện Bên B có dấu hiệu vi phạm các điều cấm trên (thông qua định vị GPS).</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-[14px] text-gray-900 mb-1">ĐIỀU 4: TRÁCH NHIỆM KHI XẢY RA SỰ CỐ, TAI NẠN, PHẠT NGUỘI</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-800">
              <li><strong>Phạt giao thông:</strong> Bên B chịu trách nhiệm thanh toán 100% các khoản phạt vi phạm giao thông (phạt nóng, phạt nguội) phát sinh trong khoảng thời gian thuê xe (Dựa trên hình ảnh/biên bản của CSGT).</li>
              <li><strong>Hư hỏng & Tai nạn:</strong> Nếu xe xảy ra va quẹt, tai nạn, Bên B phải giữ nguyên hiện trường, thông báo ngay cho Bên A và Nền tảng ViVuCar để gọi Bảo hiểm. 
                <br/> - Bên B có trách nhiệm thanh toán chi phí sửa chữa theo báo giá của Gara chính hãng.
                <br/> - Trong thời gian xe nằm Gara sửa chữa, Bên B phải <strong>bồi thường thiệt hại ngày nghỉ xe cho Bên A</strong> tính theo đơn giá thuê xe của hợp đồng này nhân với số ngày xe nằm xưởng.</li>
              <li><strong>Trả xe trễ hạn:</strong> Nếu trả xe quá thời gian quy định tại Điều 1 mà không báo trước, Bên B chịu phí phạt 100.000 VNĐ/giờ. Quá 12 tiếng không liên lạc được, Bên A có quyền trình báo Công an tội Lạm dụng tín nhiệm chiếm đoạt tài sản.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-[14px] text-gray-900 mb-1">ĐIỀU 5: CAM KẾT CHUNG</h3>
            <p className="pl-5">Hai bên cam kết thực hiện đúng các điều khoản đã thỏa thuận. Mọi tranh chấp phát sinh sẽ được giải quyết qua thương lượng. Nếu không tự giải quyết được sẽ đưa ra Tòa án nhân dân có thẩm quyền tại địa phương. Hợp đồng này được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản.</p>
          </section>
        </div>

        {/* CHỮ KÝ */}
        <div className="grid grid-cols-2 text-center mt-10 pt-6 border-t border-gray-200">
          <div className="relative">
            <h3 className="font-bold text-[15px] uppercase">ĐẠI DIỆN BÊN A (CHỦ XE)</h3>
            <p className="italic text-[11px] text-gray-400 mb-20">(Ký, điểm chỉ và ghi rõ họ tên)</p>
            
            {/* CON DẤU VIVUCAR */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none hidden md:flex">
              <div className="w-20 h-20 border-[3px] border-red-500 rounded-full flex items-center justify-center rotate-[-15deg]">
                <span className="text-red-500 font-black uppercase text-[9px] text-center leading-tight">ĐÃ DUYỆT BỞI<br/>VIVUCAR</span>
              </div>
            </div>

            <p className="font-black uppercase text-blue-900">{ownerName}</p>
          </div>

          <div>
            <h3 className="font-bold text-[15px] uppercase">ĐẠI DIỆN BÊN B (NGƯỜI THUÊ)</h3>
            <p className="italic text-[11px] text-gray-400 mb-20">(Ký, điểm chỉ và ghi rõ họ tên)</p>
            <p className="font-black uppercase">{renterName}</p>
          </div>
        </div>

      </div>
    </div>
  );
}