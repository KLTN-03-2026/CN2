/* eslint-disable */
// @ts-nocheck

export const EXPIRY_MINUTES = 20; 
export const DEPOSIT_RATE = 0.3;  

export const getBookingState = (booking: any) => {
    const now = Date.now();
    const createdAt = new Date(booking.createdAt).getTime();
    const startDate = new Date(booking.startDate).getTime();
  
    const isExpired = booking.status === "PENDING" && (now - createdAt > EXPIRY_MINUTES * 60 * 1000);
    const hoursUntilStart = (startDate - now) / (1000 * 60 * 60);
  
    const amountPaid = booking.paymentStatus === "PAID_FULL" 
      ? booking.totalPrice 
      : (booking.depositAmount || (booking.totalPrice * DEPOSIT_RATE));
  
    let state = {
      text: "Đang xử lý",
      badgeClass: "bg-gray-50 text-gray-500 border-gray-200",
      canAdminAction: false, 
      canUserCancel: false,  
      canUserPay: false,
      cancelMessage: "",     
      refundAmount: 0,       
    };
  
    // 1. ĐÃ HOÀN THÀNH (Admin đã chốt tiền)
    if (booking.status === "COMPLETED") {
      state.text = "Đã hoàn thành";
      state.badgeClass = "bg-green-50 text-green-600 border-green-200";
      state.cancelMessage = "Chuyến đi đã kết thúc tốt đẹp.";
      return state;
    }

    // 🚀 2. ĐÃ TRẢ XE (Chờ Admin chốt)
    if (booking.status === "RETURNED") {
      state.text = "Chờ chốt doanh thu";
      state.badgeClass = "bg-teal-50 text-teal-600 border-teal-200";
      state.cancelMessage = "Xe đã được trả, đang chờ hệ thống thanh toán.";
      return state;
    }

    // 🚀 3. ĐANG DIỄN RA (Khách đang đi)
    if (booking.status === "IN_PROGRESS") {
      state.text = "Đang diễn ra";
      state.badgeClass = "bg-indigo-50 text-indigo-600 border-indigo-200";
      state.cancelMessage = "Chuyến đi đang diễn ra, không thể hủy.";
      return state;
    }

    // 4. ĐÃ HỦY
    if (booking.status === "CANCELLED") {
      state.text = "Đã hủy";
      state.badgeClass = "bg-red-50 text-red-700 border-red-100";
      return state;
    }

    // 5. HẾT HẠN
    if (isExpired && booking.paymentStatus === "PENDING") {
      state.text = "Đã hết hạn";
      state.badgeClass = "bg-gray-100 text-gray-400 border-gray-200";
      return state;
    }

    // 6. CHỜ THANH TOÁN (PENDING)
    if (booking.status === "PENDING") {
        state.text = "Chờ thanh toán cọc";
        state.badgeClass = "bg-orange-50 text-orange-600 border-orange-200 animate-pulse";
        state.canUserCancel = true;
        state.canUserPay = true; 
        state.cancelMessage = "Hủy miễn phí (Bạn đang trong thời gian giữ chỗ).";
        return state;
    }

    // 7. ĐÃ XÁC NHẬN (Khách đã cọc, chờ tới ngày lấy xe)
    if (booking.status === "CONFIRMED") {
      state.badgeClass = "bg-blue-50 text-blue-600 border-blue-100"; 
      state.text = "Đã xác nhận";
      state.canUserCancel = true;
      
      let penaltyPercent = 0;

      // Logic tính phí hủy
      if (hoursUntilStart > 24) {
        penaltyPercent = 0;
        state.cancelMessage = "Hủy trước 24h: Miễn phí hủy chuyến.";
      } 
      else if (hoursUntilStart >= 12) {
        penaltyPercent = 0.15;
        state.cancelMessage = "Hủy từ 12h - 24h: Phí hủy 15% tổng hóa đơn.";
      } 
      else {
        penaltyPercent = 0.30;
        state.cancelMessage = "Hủy dưới 12h: Phí hủy 30% tổng hóa đơn.";
      }

      const penaltyFee = booking.totalPrice * penaltyPercent;
      state.refundAmount = Math.max(0, amountPaid - penaltyFee);
    }
  
    return state;
};