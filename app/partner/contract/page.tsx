/* eslint-disable */
// @ts-nocheck
import React from "react";
import { ShieldCheck, Handshake } from "lucide-react";

export default function PartnerContractPage() {
  return (
    // Sử dụng font-sans để đồng bộ và tránh lỗi font tiếng Việt
    <main className="min-h-screen bg-gray-50 pb-20 pt-28 font-sans text-gray-800">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* HEADER BẢN MẪU HỢP ĐỒNG ĐỐI TÁC */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-blue-900 uppercase italic flex items-center justify-center gap-3">
            <Handshake size={32} className="text-blue-600" /> Hợp Đồng Hợp Tác Đối Tác
          </h1>
          <p className="text-gray-500 font-medium mt-3 text-sm max-w-2xl mx-auto bg-blue-50 p-4 rounded-xl border border-blue-100">
            * Đây là bản hợp đồng tiêu chuẩn quy định quyền lợi và nghĩa vụ giữa Đối tác (Chủ xe) và Nền tảng ViVuCar. Đối tác cần đọc kỹ và xác nhận đồng ý trước khi xe được phê duyệt trên hệ thống.
          </p>
        </div>

        {/* NỘI DUNG HỢP ĐỒNG */}
        <div className="bg-white p-8 md:p-12 rounded-[24px] shadow-sm border border-gray-200">
            
            {/* QUỐC HIỆU */}
            <div className="text-center mb-8">
                <h3 className="font-bold text-lg uppercase">Cộng hòa xã hội chủ nghĩa Việt Nam</h3>
                <h4 className="font-bold text-base underline underline-offset-4">Độc lập - Tự do - Hạnh phúc</h4>
            </div>

            {/* TIÊU ĐỀ */}
            <div className="text-center mb-10">
                <h1 className="font-black text-2xl md:text-3xl uppercase text-gray-900 mb-2">Hợp Đồng Hợp Tác Điện Tử</h1>
                <p className="text-sm font-medium text-gray-500 italic">
                    Mã hợp đồng: PARTNER-[Mã đối tác tự động sinh ra] <br/>
                    Hôm nay, ngày ... tháng ... năm ..., chúng tôi gồm có:
                </p>
            </div>

            {/* BÊN A VÀ BÊN B */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 border-b border-gray-200 pb-8">
                <div>
                    <h3 className="font-black text-blue-900 uppercase mb-4 flex items-center gap-2 border-l-4 border-blue-600 pl-2">
                        Bên A (Nền tảng ViVuCar)
                    </h3>
                    <ul className="space-y-3 text-sm font-medium">
                        <li><span className="text-gray-500">Đại diện:</span> <span className="font-bold text-gray-900 uppercase">Công ty TNHH Công nghệ ViVuCar (AutoHub AI)</span></li>
                        <li><span className="text-gray-500">Hotline:</span> <span className="font-bold text-gray-900">1900 8888</span></li>
                        <li><span className="text-gray-500">Vai trò:</span> Cung cấp nền tảng kết nối, quản lý giao dịch và bảo vệ quyền lợi các bên.</li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-black text-green-700 uppercase mb-4 flex items-center gap-2 border-l-4 border-green-600 pl-2">
                        Bên B (Đối tác/Chủ xe)
                    </h3>
                    <ul className="space-y-3 text-sm font-medium">
                        <li><span className="text-gray-500">Ông/Bà:</span> <span className="font-bold text-gray-900 uppercase">[Tên đối tác đăng ký]</span></li>
                        <li><span className="text-gray-500">Số điện thoại:</span> <span className="font-bold text-gray-900">[Số điện thoại đối tác]</span></li>
                        <li><span className="text-gray-500">Vai trò:</span> Chủ sở hữu phương tiện cung cấp dịch vụ cho thuê tự lái.</li>
                    </ul>
                </div>
            </div>

            {/* NỘI DUNG THỎA THUẬN */}
            <div className="space-y-6 text-sm font-medium leading-relaxed text-justify">
                <p>Sau khi thỏa thuận, hai bên thống nhất ký kết hợp đồng hợp tác với các điều khoản cụ thể như sau:</p>

                <div>
                    <h4 className="font-bold text-base text-gray-900 mb-2">ĐIỀU 1: NỘI DUNG HỢP TÁC</h4>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Bên A cung cấp nền tảng phần mềm để Bên B đăng tải thông tin phương tiện (ô tô) nhằm mục đích cho người dùng cuối (Khách hàng) thuê tự lái.</li>
                        <li>Bên B cam kết cung cấp phương tiện có đầy đủ giấy tờ pháp lý hợp lệ, đạt tiêu chuẩn an toàn kỹ thuật theo quy định hiện hành.</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-base text-gray-900 mb-2 flex items-center gap-2">
                      <ShieldCheck size={18} className="text-blue-600"/> ĐIỀU 2: KÝ QUỸ TRÁCH NHIỆM & BỒI THƯỜNG
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Để đảm bảo tính xác thực và trách nhiệm khi tham gia hệ thống, Bên B đồng ý đóng khoản <span className="font-bold text-red-600">Ký quỹ trách nhiệm là 2.000.000 VNĐ (Hai triệu đồng)</span> cho mỗi xe đăng ký.</li>
                        <li>Khoản ký quỹ này sẽ được lưu giữ tại hệ thống của Bên A và **không được phép rút ra** trong suốt thời gian Bên B duy trì trạng thái xe hoạt động.</li>
                        <li>Trường hợp Bên B đơn phương hủy chuyến đi của khách hàng đã xác nhận cọc mà không có lý do chính đáng (thiên tai, xe tai nạn có giấy tờ chứng minh), Bên A có quyền **trừ trực tiếp tiền phạt vào khoản ký quỹ này** để bồi thường cho khách hàng.</li>
                        <li>Khi Bên B ngừng hợp tác và xóa xe khỏi nền tảng, Bên A sẽ hoàn trả lại 100% số tiền ký quỹ (sau khi đã cấn trừ các khoản phạt vi phạm, nếu có) trong vòng 7 ngày làm việc.</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-base text-gray-900 mb-2">ĐIỀU 3: PHÍ DỊCH VỤ VÀ THANH TOÁN</h4>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Bên A thu chiết khấu <span className="font-bold text-blue-700">15%</span> trên tổng giá trị tiền thuê của mỗi chuyến đi hoàn thành thành công.</li>
                        <li>Tiền cọc của khách hàng (30%) sẽ do Bên A tạm giữ (Escrow) để đảm bảo giao dịch. Số tiền này sẽ được chuyển vào "Ví Đối Tác" của Bên B sau 24h kể từ khi kết thúc chuyến đi (nếu không có tranh chấp khiếu nại).</li>
                        <li>Khách hàng thanh toán phần tiền còn lại (70%) trực tiếp cho Bên B khi nhận xe.</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-base text-gray-900 mb-2">ĐIỀU 4: XỬ LÝ TRANH CHẤP & GIAN LẬN</h4>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Nếu Khách hàng sử dụng tính năng "Báo cáo sự cố" (Ví dụ: Chủ xe không giao xe, thu thêm phí sai quy định), đơn hàng sẽ chuyển sang trạng thái "Đang tranh chấp".</li>
                        <li>Bên A sẽ đóng vai trò trung gian xác minh. Nếu lỗi thuộc về Bên B (cố tình phá hoại, lừa đảo), Bên A có quyền: Hoàn cọc 100% cho khách, trừ tiền ký quỹ của Bên B, và cấm vĩnh viễn (Blacklist) tài khoản/biển số xe của Bên B khỏi hệ thống.</li>
                        <li>Trường hợp Khách hàng gây thiệt hại cho xe, Bên B sử dụng hợp đồng thuê xe ký trực tiếp với Khách hàng để giải quyết theo luật dân sự. Bên A sẽ hỗ trợ cung cấp hồ sơ lịch sử giao dịch.</li>
                    </ul>
                </div>
            </div>

            {/* CHỮ KÝ */}
            <div className="mt-12 flex justify-between items-start pt-8 border-t border-gray-200">
                <div className="text-center">
                    <h4 className="font-bold text-base uppercase text-gray-900">Đại diện Nền tảng (Bên A)</h4>
                    <p className="text-xs text-gray-400 italic mb-16">(Ký và đóng dấu điện tử)</p>
                    <p className="font-black text-blue-900 uppercase">ViVuCar (AutoHub AI)</p>
                </div>
                
                {/* DẤU MỘC BẢN MẪU */}
                <div className="text-center opacity-20 mt-8 hidden md:block">
                    <div className="w-24 h-24 border-4 border-gray-400 rounded-full flex items-center justify-center rotate-[-15deg] mx-auto">
                        <span className="text-gray-400 font-black uppercase text-[10px] text-center leading-tight">BẢN MẪU<br/>ĐIỀU KHOẢN<br/>ĐỐI TÁC</span>
                    </div>
                </div>

                <div className="text-center">
                    <h4 className="font-bold text-base uppercase text-gray-900">Đối Tác (Bên B)</h4>
                    <p className="text-xs text-gray-400 italic mb-16">(Xác nhận bằng tick chọn)</p>
                    <p className="font-black uppercase text-gray-300">[Đã xác nhận điện tử]</p>
                </div>
            </div>

        </div>
      </div>
    </main>
  );
}