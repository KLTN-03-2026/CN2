/* eslint-disable */
// @ts-nocheck
import React from "react";
import { FileText, ShieldCheck } from "lucide-react";

export default function ContractPolicyPage() {
  return (
    // 🚀 Đã thêm font-sans vào thẻ main để diệt tận gốc lỗi phông chữ tiếng Việt
    <main className="min-h-screen bg-gray-50 pb-20 pt-28 font-sans text-gray-800">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* HEADER BẢN MẪU */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-blue-900 uppercase italic flex items-center justify-center gap-3">
            <FileText size={32} className="text-blue-600" /> Bản Mẫu Hợp Đồng Thuê Xe
          </h1>
          <p className="text-gray-500 font-medium mt-3 text-sm max-w-2xl mx-auto bg-blue-50 p-4 rounded-xl border border-blue-100">
            * Đây là bản hợp đồng tiêu chuẩn được áp dụng trên nền tảng ViVuCar. Khi bạn tiến hành đặt xe và thanh toán thành công, hệ thống sẽ tự động điền thông tin cá nhân và chi tiết chuyến xe của bạn vào bản hợp đồng chính thức.
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
                <h1 className="font-black text-2xl md:text-3xl uppercase text-gray-900 mb-2">Hợp đồng cho thuê xe tự lái</h1>
                <p className="text-sm font-medium text-gray-500 italic">
                    Mã hợp đồng: VIVU-[Mã chuyến đi tự động sinh ra] <br/>
                    Hôm nay, ngày ... tháng ... năm ..., chúng tôi gồm có:
                </p>
            </div>

            {/* BÊN A VÀ BÊN B */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 border-b border-gray-200 pb-8">
                <div>
                    <h3 className="font-black text-blue-900 uppercase mb-4 flex items-center gap-2 border-l-4 border-blue-600 pl-2">
                        Bên A (Chủ xe)
                    </h3>
                    <ul className="space-y-3 text-sm font-medium">
                        <li><span className="text-gray-500">Ông/Bà:</span> <span className="font-bold text-gray-900 uppercase">[Tên chủ xe / Đại diện nền tảng]</span></li>
                        <li><span className="text-gray-500">Số điện thoại:</span> <span className="font-bold text-gray-900">[Số điện thoại chủ xe]</span></li>
                        <li><span className="text-gray-500">Vai trò:</span> Chủ sở hữu phương tiện hoặc người được ủy quyền hợp pháp.</li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-black text-red-700 uppercase mb-4 flex items-center gap-2 border-l-4 border-red-600 pl-2">
                        Bên B (Người thuê)
                    </h3>
                    <ul className="space-y-3 text-sm font-medium">
                        <li><span className="text-gray-500">Ông/Bà:</span> <span className="font-bold text-gray-900 uppercase">[Tên khách hàng thuê xe]</span></li>
                        <li><span className="text-gray-500">Số điện thoại:</span> <span className="font-bold text-gray-900">[Số điện thoại khách hàng]</span></li>
                        <li><span className="text-gray-500">Trách nhiệm:</span> Người trực tiếp điều khiển phương tiện.</li>
                    </ul>
                </div>
            </div>

            {/* NỘI DUNG THỎA THUẬN */}
            <div className="space-y-6 text-sm font-medium leading-relaxed text-justify">
                <p>Sau khi thỏa thuận, hai bên đồng ý ký kết hợp đồng cho thuê xe ô tô tự lái với các điều khoản sau đây:</p>

                <div>
                    <h4 className="font-bold text-base text-gray-900 mb-2">ĐIỀU 1: THÔNG TIN PHƯƠNG TIỆN VÀ THỜI GIAN THUÊ</h4>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Bên A đồng ý cho Bên B thuê xe ô tô nhãn hiệu: <span className="font-bold text-blue-700 uppercase">[Tên Dòng Xe - Năm sản xuất]</span></li>
                        <li>Biển kiểm soát: <span className="font-bold text-gray-900">[Biển số xe]</span></li>
                        <li>Thời gian giao xe: <span className="font-bold text-green-700">[Giờ nhận - Ngày nhận]</span></li>
                        <li>Thời gian trả xe: <span className="font-bold text-red-600">[Giờ trả - Ngày trả]</span></li>
                        <li>Địa điểm giao nhận: <span className="font-bold">[Địa chỉ nhận xe do khách chọn]</span></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-base text-gray-900 mb-2">ĐIỀU 2: CHI PHÍ & THANH TOÁN</h4>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Tổng giá trị tiền thuê xe là: <span className="font-bold text-blue-700 text-lg">[Tổng tiền] VNĐ</span>.</li>
                        
                        {/* 🚀 Đã cập nhật khoản Phí bảo hiểm vào bản mẫu */}
                        <li>Phí bảo hiểm vật chất xe: Sàn ViVuCar thu 120.000 VNĐ (Đã bao gồm trong tổng tiền) để kích hoạt gói bảo hiểm chuyến đi trong suốt thời gian thuê.</li>
                        
                        <li>Số tiền đặt cọc (Giữ chỗ qua hệ thống): <span className="font-bold">[Tiền cọc] VNĐ</span>.</li>
                        <li>Số tiền Bên B cần thanh toán trực tiếp cho Bên A khi nhận xe: <span className="font-bold text-red-600 underline">[Số tiền còn lại] VNĐ</span>.</li>
                        <li>Bên B thế chấp giấy tờ tùy thân (CCCD/Passport) hoặc tài sản trị giá 15.000.000 VNĐ cho Bên A trong suốt thời gian thuê.</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-base text-gray-900 mb-2">ĐIỀU 3: TRÁCH NHIỆM CỦA CÁC BÊN</h4>
                    <p className="font-bold mb-1">Trách nhiệm của Bên A:</p>
                    <ul className="list-disc pl-5 space-y-1 mb-3 text-gray-600">
                        <li>Giao xe đúng chất lượng, đúng hạn, giấy tờ pháp lý đầy đủ (Bản photo công chứng hoặc bản gốc).</li>
                        <li>Hỗ trợ Bên B giải quyết các sự cố kỹ thuật phát sinh do lỗi phương tiện.</li>
                    </ul>
                    <p className="font-bold mb-1">Trách nhiệm của Bên B:</p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        <li>Sử dụng xe đúng mục đích, không sử dụng xe để cầm cố, thế chấp hoặc vi phạm pháp luật.</li>
                        <li>Tự chịu trách nhiệm dân sự và hình sự nếu vi phạm luật giao thông. Nếu có phạt nguội, Bên B chịu hoàn toàn trách nhiệm nộp phạt.</li>
                        <li>Trường hợp xảy ra tai nạn, va quẹt gây hư hỏng, Bên B phải bồi thường 100% chi phí sửa chữa tại gara chính hãng.</li>
                    </ul>
                </div>
            </div>

            {/* CHỮ KÝ */}
            <div className="mt-12 flex justify-between items-start pt-8 border-t border-gray-200">
                <div className="text-center">
                    <h4 className="font-bold text-base uppercase text-gray-900">Đại diện Bên A</h4>
                    <p className="text-xs text-gray-400 italic mb-16">(Ký và ghi rõ họ tên)</p>
                    <p className="font-black uppercase text-gray-300">[Chữ ký bên A]</p>
                </div>
                
                {/* DẤU MỘC BẢN MẪU */}
                <div className="text-center opacity-20 mt-8 hidden md:block">
                    <div className="w-24 h-24 border-4 border-gray-400 rounded-full flex items-center justify-center rotate-[-15deg] mx-auto">
                        <span className="text-gray-400 font-black uppercase text-xs text-center">BẢN MẪU<br/>VIVUCAR</span>
                    </div>
                </div>

                <div className="text-center">
                    <h4 className="font-bold text-base uppercase text-gray-900">Đại diện Bên B</h4>
                    <p className="text-xs text-gray-400 italic mb-16">(Ký và ghi rõ họ tên)</p>
                    <p className="font-black uppercase text-gray-300">[Chữ ký bên B]</p>
                </div>
            </div>

        </div>
      </div>
    </main>
  );
}