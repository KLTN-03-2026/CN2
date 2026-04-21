/* eslint-disable */
// @ts-nocheck

// 1. DANH SÁCH TỈNH THÀNH PHỔ BIẾN (Dùng cho thanh tìm kiếm nhanh)
export const POPULAR_LOCATIONS = [
  { label: "Hà Nội", value: "HaNoi" },
  { label: "TP. Hồ Chí Minh", value: "TPHCM" },
  { label: "Đà Nẵng", value: "DaNang" },
  { label: "Nha Trang", value: "NhaTrang" },
  { label: "Phú Quốc", value: "PhuQuoc" },
  { label: "Đà Lạt", value: "DaLat" },
  { label: "Hạ Long", value: "HaLong" },
  { label: "Vũng Tàu", value: "VungTau" },
  { label: "Cần Thơ", value: "CanTho" },
  { label: "Hội An", value: "HoiAn" },
  { label: "Huế", value: "Hue" },
  { label: "Quy Nhơn", value: "QuyNhon" },
];

// 2. BỘ CÂU HỎI THƯỜNG GẶP (Hiển thị ở trang Giới thiệu/Trang chủ)
export const FAQS = [
  {
    id: 1,
    question: "Làm thế nào để tôi đặt thuê xe trên ViVuCar?",
    answer: "Rất đơn giản! Bạn chỉ cần Đăng nhập, chọn chiếc xe ưng ý cùng ngày giờ nhận/trả. Hệ thống sẽ tự động tính toán chi phí (bao gồm giá thuê, phí bảo hiểm và phí giao xe nếu có). Sau đó, bạn thanh toán một khoản cọc nhỏ qua web để giữ xe. Phần tiền còn lại sẽ được thanh toán trực tiếp cho chủ xe lúc nhận xe."
  },
  {
    id: 2,
    question: "Tôi cần chuẩn bị giấy tờ gì khi đi nhận xe?",
    answer: "Theo quy định bắt buộc của nền tảng, bạn cần chuẩn bị: 1. Thẻ Căn cước công dân (CCCD) gắn chip bản gốc. 2. Giấy phép lái xe hợp lệ (hạng B1 trở lên). 3. Tiền mặt hoặc tài sản thế chấp (như xe máy chính chủ) tùy theo yêu cầu cụ thể ghi trên trang chi tiết của từng chiếc xe."
  },
  {
    id: 3,
    question: "Xe trên hệ thống là của công ty hay cá nhân?",
    answer: "ViVuCar tự hào là nền tảng kết nối linh hoạt. Chúng tôi cung cấp cả 'Xe Hệ Thống' (do chính ViVuCar trực tiếp quản lý) và 'Xe Đối Tác' (do các chủ xe cá nhân ký gửi). Toàn bộ xe đều phải trải qua quy trình kiểm định chất lượng khắt khe trước khi được hiển thị lên hệ thống (Trạng thái: Đã duyệt)."
  },
  {
    id: 4,
    question: "Tôi có thể yêu cầu giao xe tận nhà hoặc sân bay không?",
    answer: "Hoàn toàn được! Đối với các xe có hỗ trợ, bạn có thể chọn hình thức 'Giao xe tận nơi' lúc đặt đơn. Phí giao xe sẽ được hệ thống tính toán minh bạch và cộng thẳng vào bảng kê chi phí trước khi bạn xác nhận đặt cọc."
  },
  {
    id: 5,
    question: "Nếu tôi muốn hủy chuyến đi thì có được hoàn cọc không?",
    answer: "Bạn có thể yêu cầu hủy chuyến đi ngay trên trang Quản lý đơn hàng. Nếu đơn đang ở trạng thái 'Chờ cọc', bạn có thể hủy miễn phí. Nếu đơn đã 'Đã xác nhận' (đã cọc), việc hoàn cọc sẽ phụ thuộc vào khoảng thời gian từ lúc bạn báo hủy đến giờ khởi hành, tuân theo chính sách hủy chuyến của ViVuCar."
  },
  {
    id: 6,
    question: "Làm sao để tôi bảo vệ quyền lợi của mình khi thuê xe?",
    answer: "ViVuCar bảo vệ bạn bằng 'Hợp đồng điện tử'. Ngay khi đơn hàng được xác nhận, hệ thống sẽ tự động tạo một Hợp đồng thuê xe ghi rõ các điều khoản, thông tin chủ xe và khách hàng. Bạn có thể xem lại hợp đồng này bất cứ lúc nào trong Lịch sử chuyến đi."
  },
  {
    id: 7,
    question: "Tôi muốn để lại lời khen/chê cho chủ xe thì làm thế nào?",
    answer: "Trải nghiệm của bạn cực kỳ quan trọng! Sau khi bạn hoàn tất việc trả xe và hệ thống chốt doanh thu (Đơn chuyển sang trạng thái 'Hoàn thành'), một nút 'Đánh giá dịch vụ' (5 sao) sẽ xuất hiện trong lịch sử chuyến đi của bạn. Những đánh giá chất lượng sẽ được ưu tiên hiển thị ngay trên trang chủ."
  }
];

// 3. ẢNH MẶC ĐỊNH HỆ THỐNG
export const DEFAULT_GALLERY = [
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800",
];