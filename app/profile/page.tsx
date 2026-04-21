/* eslint-disable */
// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  Calendar, MapPin, Car, Clock, User as UserIcon,
  ChevronRight, CreditCard, ShieldCheck, LogOut, 
  XCircle, AlertTriangle, Camera, FileText, Key, ClipboardCheck
} from "lucide-react";

import { getBookingState } from "@/lib/bookingUtils";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    booking: null,
    noteMsg: "",
    paidAmount: 0,
    cancellationFee: 0,
    refundAmount: 0,
    reason: "",
    isSubmitting: false
  });

  useEffect(() => {
    setMounted(true);
    if (status === "unauthenticated") {
      router.push("/?auth=login&callback=/profile");
      return;
    }
    if (status === "authenticated" && session?.user) {
      setUser(session.user);
      fetchMyBookings(session.user.email);
    }
  }, [status, session, router]);

  const fetchMyBookings = async (email) => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/mine?email=${email}`);
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCancelModal = (booking) => {
    const state = getBookingState(booking);
    if (!state.canUserCancel) return;

    const hasPaid = booking.paymentStatus === "DEPOSITED" || booking.paymentStatus === "PAID_FULL";
    const actualPaidAmount = hasPaid 
      ? (booking.paymentStatus === "PAID_FULL" ? booking.totalPrice : (booking.depositAmount || 0))
      : 0;

    let cancellationFee = 0;
    let actualRefund = 0;
    let finalNoteMsg = state.cancelMessage;

    if (!hasPaid) {
      cancellationFee = 0;
      actualRefund = 0;
      finalNoteMsg = "Hủy miễn phí (Bạn đang trong thời gian chờ thanh toán).";
    } else {
      cancellationFee = Math.max(0, actualPaidAmount - state.refundAmount);
      actualRefund = state.refundAmount;
    }

    setCancelModal({
      isOpen: true,
      booking,
      noteMsg: finalNoteMsg,
      paidAmount: actualPaidAmount,
      cancellationFee: cancellationFee,
      refundAmount: actualRefund,
      reason: "",
      isSubmitting: false
    });
  };

  const submitCancelBooking = async () => {
    if (!cancelModal.reason.trim()) {
      return alert("Vui lòng nhập lý do hủy chuyến!");
    }
    setCancelModal(prev => ({ ...prev, isSubmitting: true }));
    const hasPaid = cancelModal.booking.paymentStatus === "DEPOSITED" || cancelModal.booking.paymentStatus === "PAID_FULL";
    
    const finalReason = hasPaid 
      ? `${cancelModal.reason} (Phí phạt: ${cancelModal.cancellationFee.toLocaleString('vi-VN')}đ | Hoàn: ${cancelModal.refundAmount.toLocaleString('vi-VN')}đ)`
      : `${cancelModal.reason} (Hủy miễn phí)`;

    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: cancelModal.booking.id,
          userEmail: user.email,
          reason: finalReason
        }),
      });
      if (res.ok) {
        alert("Đã hủy chuyến thành công.");
        setCancelModal(prev => ({ ...prev, isOpen: false }));
        fetchMyBookings(user.email);
      } else {
        const err = await res.json();
        alert(err.error || "Không thể hủy đơn.");
        setCancelModal(prev => ({ ...prev, isSubmitting: false }));
      }
    } catch (e) {
      alert("Lỗi kết nối máy chủ.");
      setCancelModal(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("user");
    await signOut({ callbackUrl: "/" }); 
  };

  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === "COMPLETED").length;
  const cancelledBookings = bookings.filter(b => b.status === "CANCELLED").length;

  if (!mounted || status === "loading") return (
    <div className="min-h-screen flex items-center justify-center font-black italic text-blue-600 animate-pulse uppercase">
      Đang tải dữ liệu chuyến đi...
    </div>
  );

  if (!user) return null;

  return (
    <>
      <main className="min-h-screen bg-[#f8fafc] pb-20 pt-28 font-sans">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-12">

            <aside className="w-full lg:w-1/3 space-y-6">
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
                <div className="relative inline-block group">
                  <img
                    src={user?.photo || `https://ui-avatars.com/api/?name=${user?.name}&background=0D47A1&color=fff`}
                    className="w-28 h-28 rounded-[32px] mx-auto border-4 border-gray-50 mb-4 object-cover shadow-lg"
                    alt="Avatar"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                </div>
                <h2 className="text-2xl font-black text-blue-900 uppercase italic tracking-tighter">{user?.name}</h2>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">{user?.email}</p>

                <div className="space-y-4 pt-6 border-t border-dashed border-gray-100">
                  
                  {/* CẨM NANG NHẬN XE & AN TOÀN */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100 text-left space-y-5 shadow-inner">
                    <h3 className="text-sm font-black text-blue-900 uppercase italic tracking-tighter flex items-center gap-2 border-b border-blue-100/50 pb-3">
                      <ShieldCheck size={18} className="text-blue-600" /> Cẩm nang hành trình
                    </h3>
                    
                    {/* Quy trình nhận xe */}
                    <div>
                      <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        <Key size={12} /> Quy trình nhận xe
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2.5 text-[11px] font-medium text-gray-700 leading-relaxed">
                          <FileText size={14} className="text-blue-500 shrink-0 mt-0.5" />
                          <span><strong className="text-blue-900">1. Giấy tờ:</strong> Chuẩn bị sẵn bản gốc CCCD và GPLX (từ hạng B1/B2 trở lên) để chủ xe đối chiếu.</span>
                        </li>
                        <li className="flex items-start gap-2.5 text-[11px] font-medium text-gray-700 leading-relaxed">
                          <Camera size={14} className="text-blue-500 shrink-0 mt-0.5" />
                          <span><strong className="text-blue-900">2. Kiểm tra:</strong> Quay phim/chụp ảnh kỹ quanh xe, vết xước cũ và vạch xăng trước khi lăn bánh.</span>
                        </li>
                        <li className="flex items-start gap-2.5 text-[11px] font-medium text-gray-700 leading-relaxed">
                          <ClipboardCheck size={14} className="text-blue-500 shrink-0 mt-0.5" />
                          <span><strong className="text-blue-900">3. Ký nhận:</strong> Đọc kỹ các điều khoản trên biên bản bàn giao xe điện tử hoặc giấy.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Lưu ý an toàn */}
                    <div className="pt-4 border-t border-blue-100/50">
                      <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        <AlertTriangle size={12} /> An toàn trên mọi nẻo đường
                      </p>
                      <div className="bg-white/70 rounded-xl p-3.5 space-y-2.5 border border-white">
                        <p className="text-[10px] text-gray-600 font-bold leading-relaxed flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1 shrink-0"></span>
                          Tuyệt đối tuân thủ tốc độ, biển báo và KHÔNG sử dụng rượu bia khi lái xe.
                        </p>
                        <p className="text-[10px] text-gray-600 font-bold leading-relaxed flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1 shrink-0"></span>
                          Nếu xảy ra va chạm hoặc sự cố, giữ nguyên hiện trường và gọi ngay Hotline <span className="text-blue-600 font-black whitespace-nowrap">1900 8888</span>.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-2xl space-y-4 text-left border border-gray-100">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <span className="text-[10px] font-black text-gray-500 uppercase">Tổng chuyến đã đặt</span>
                      <span className="text-2xl font-black text-blue-600 italic leading-none">{totalBookings}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span> Đã hoàn thành
                      </span>
                      <span className="text-xl font-black text-green-600 italic leading-none">{completedBookings}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span> Đã hủy
                      </span>
                      <span className="text-xl font-black text-red-500 italic leading-none">{cancelledBookings}</span>
                    </div>
                  </div>

                  <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-4 text-red-500 font-black uppercase italic text-[10px] hover:bg-red-50 rounded-2xl transition-all">
                    <LogOut size={16} /> Đăng xuất
                  </button>
                </div>
              </div>

              <div className="bg-blue-900 p-8 rounded-[40px] shadow-xl text-white">
                <ShieldCheck size={32} className="mb-4 text-blue-400" />
                <h4 className="font-black uppercase italic tracking-tighter text-xl mb-2">Hội viên ViVuCar</h4>
                <p className="text-blue-200 text-[10px] font-medium leading-relaxed uppercase tracking-wider">
                  Giảm ngay 10% cho mọi chuyến đi trong năm 2026.
                </p>
              </div>
            </aside>

            <section className="w-full lg:w-2/3">
              <h2 className="text-3xl font-black text-blue-900 uppercase italic tracking-tighter flex items-center gap-3 mb-8">
                <Clock className="text-blue-600" size={28} /> Lịch sử chuyến đi
              </h2>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => <div key={i} className="h-48 bg-white rounded-[32px] animate-pulse" />)}
                </div>
              ) : bookings.length === 0 ? (
                <div className="bg-white p-16 rounded-[40px] text-center border-2 border-dashed border-gray-200">
                  <Car size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-400 font-black uppercase italic text-sm">Bạn chưa có chuyến hành trình nào</p>
                  <Link href="/" className="inline-block mt-6 text-blue-600 font-black uppercase text-[10px] border-b-2 border-blue-600">Khám phá xe ngay</Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookings.map((item) => {
                    const state = getBookingState(item);

                    return (
                      <div key={item.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-xl transition-all group">
                        
                        <Link href={`/history/${item.id}`} className="w-full md:w-56 h-36 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 relative block cursor-pointer">
                          <img src={item.car?.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Car" />
                          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[8px] font-black uppercase text-blue-900">
                            #{item.id}
                          </div>
                        </Link>

                        <div className="flex-grow flex flex-col justify-between py-1">
                          <div className="flex justify-between items-start">
                            <div className="flex-grow">
                              <Link href={`/history/${item.id}`}>
                                <h3 className="font-black text-xl text-blue-900 uppercase italic tracking-tighter leading-none mb-4 hover:text-blue-600 transition-colors">
                                  {item.car?.name}
                                </h3>
                              </Link>
                              
                              <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                  <Calendar size={14} className="text-blue-600 mt-0.5 shrink-0" />
                                  <div className="flex flex-col gap-1.5">
                                    <div className="flex flex-col">
                                      <span className="text-[10px] font-black uppercase italic text-blue-900 leading-none">
                                        {new Date(item.startDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        <span className="mx-1.5 opacity-30 text-gray-400">|</span>
                                        {new Date(item.startDate).toLocaleDateString('vi-VN')}
                                      </span>
                                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Thời gian nhận xe</span>
                                    </div>
                                    
                                    <div className="flex flex-col mt-1">
                                      <span className="text-[10px] font-black uppercase italic text-gray-500 leading-none flex items-center">
                                        <ChevronRight size={10} className="mr-1 text-gray-300" />
                                        {new Date(item.endDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        <span className="mx-1.5 opacity-30">|</span>
                                        {new Date(item.endDate).toLocaleDateString('vi-VN')}
                                      </span>
                                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 ml-3">Thời gian trả xe</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <MapPin size={14} className="text-red-500 shrink-0" />
                                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{item.car?.location}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase italic border ${state.badgeClass}`}>
                                {state.text}
                              </span>

                              {(item.status === "PENDING" || item.status === "CONFIRMED") && state.text !== "Đã hết hạn" && (
                                <div className="flex flex-col items-end mt-1 gap-1">
                                  {state.canUserPay && (
                                    <Link href={`/payment/${item.id}`} className="text-[9px] font-black uppercase italic px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl tracking-tighter transition-all shadow-lg shadow-blue-100 flex items-center gap-2">
                                      <CreditCard size={12} /> Thanh toán ngay
                                    </Link>
                                  )}
                                  {state.canUserCancel ? (
                                    <button onClick={() => openCancelModal(item)} className="text-[9px] font-black uppercase italic px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg tracking-tighter transition-all shadow-sm">
                                      Hủy chuyến
                                    </button>
                                  ) : (
                                    <button disabled className="text-[9px] font-black uppercase italic px-3 py-1.5 bg-gray-100 text-gray-400 rounded-lg tracking-tighter cursor-not-allowed">
                                      Quá hạn hủy
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-end">
                            <div>
                              {item.status === "CANCELLED" && item.cancelReason && (
                                <p className="text-[9px] text-red-400 font-bold italic uppercase tracking-tighter leading-none mb-1">
                                  Lý do: {item.cancelReason}
                                </p>
                              )}
                              <p className="text-[9px] font-black text-gray-300 uppercase italic mb-1">Hệ thống ViVuCar</p>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2">
                              <p className="font-black text-blue-600 text-2xl italic tracking-tighter leading-none">
                                {item.totalPrice?.toLocaleString('vi-VN')}đ
                              </p>
                              <Link href={`/history/${item.id}`} className="flex items-center gap-1 text-[9px] font-black text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg uppercase tracking-widest transition-colors">
                                Xem chi tiết <ChevronRight size={12} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* MODAL HỦY CHUYẾN XỊN SÒ */}
      {cancelModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm transition-opacity" onClick={() => !cancelModal.isSubmitting && setCancelModal(prev => ({ ...prev, isOpen: false }))}></div>
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-100">
              <AlertTriangle className="text-red-500 w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-blue-900 uppercase italic tracking-tighter mb-2">Xác nhận hủy chuyến</h3>
            <p className="text-sm font-medium text-gray-500 mb-6">Bạn đang yêu cầu hủy chuyến đi mã số <span className="font-bold text-blue-600">#{cancelModal.booking?.id}</span>.</p>
            <div className="bg-orange-50 p-5 rounded-3xl border border-orange-100 mb-6">
              <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1 flex items-center gap-1"><ShieldCheck size={14} /> Chính sách hệ thống</p>
              <p className="font-bold text-orange-800 text-sm mb-4 italic leading-relaxed">{cancelModal.noteMsg}</p>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between items-center text-xs font-medium text-gray-600"><span>Đã thanh toán</span><span>{cancelModal.paidAmount.toLocaleString('vi-VN')}đ</span></div>
                <div className="flex justify-between items-center text-xs font-medium text-gray-600"><span>Phí phạt hủy chuyến</span><span className="text-red-500">-{cancelModal.cancellationFee.toLocaleString('vi-VN')}đ</span></div>
              </div>
              <div className="flex justify-between items-center border-t border-orange-200/50 pt-3"><span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Số tiền hoàn lại</span><span className="text-xl font-black text-red-600 italic tracking-tighter">{cancelModal.refundAmount.toLocaleString('vi-VN')}đ</span></div>
            </div>
            <div className="mb-8">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Lý do hủy chuyến <span className="text-red-500">*</span></label>
              <textarea value={cancelModal.reason} onChange={(e) => setCancelModal(prev => ({ ...prev, reason: e.target.value }))} placeholder="Lý do hủy chuyến..." className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none h-28"></textarea>
            </div>
            <div className="flex gap-3">
              <button disabled={cancelModal.isSubmitting} onClick={() => setCancelModal(prev => ({ ...prev, isOpen: false }))} className="flex-1 py-4 bg-gray-50 text-gray-500 font-black uppercase italic text-[10px] rounded-2xl border border-gray-200">Quay lại</button>
              <button disabled={cancelModal.isSubmitting} onClick={submitCancelBooking} className="flex-[2] py-4 bg-red-500 text-white font-black uppercase italic text-[11px] rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2">{cancelModal.isSubmitting ? "Đang xử lý..." : "Xác nhận hủy ngay"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}