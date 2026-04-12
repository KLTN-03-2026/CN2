/* eslint-disable */
// @ts-nocheck
"use client";

import React from "react";
import { Star, MessageSquare, User, AlertCircle } from "lucide-react";

interface ReviewProps {
  reviews: any[];
}

export default function CarReviews({ reviews }: ReviewProps) {
  // Nếu chưa có đánh giá nào
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm mt-8 text-center">
        <MessageSquare size={48} className="mx-auto text-gray-200 mb-4" />
        <h3 className="text-xl font-black text-blue-900 uppercase italic tracking-tighter mb-2">Chưa có đánh giá</h3>
        <p className="text-sm font-medium text-gray-500 max-w-md mx-auto">
          Chiếc xe này chưa có lượt đánh giá nào từ khách hàng. Hãy trở thành người đầu tiên trải nghiệm và chia sẻ cảm nhận nhé!
        </p>
      </div>
    );
  }

  // Tính toán điểm trung bình
  const totalReviews = reviews.length;
  const averageRating = (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1);

  // Đếm số lượng từng loại sao (5 sao, 4 sao...)
  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((review) => {
    starCounts[review.rating] = (starCounts[review.rating] || 0) + 1;
  });

  return (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm mt-8">
      <h2 className="text-2xl font-black text-blue-900 uppercase italic tracking-tighter mb-6 flex items-center gap-2">
        <Star className="text-yellow-400 fill-yellow-400" size={24} /> Đánh giá từ khách hàng
      </h2>

      {/* TỔNG QUAN ĐÁNH GIÁ */}
      <div className="flex flex-col md:flex-row gap-8 mb-10 pb-8 border-b border-gray-50">
        {/* Khối điểm trung bình */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-[24px] p-6 w-full md:w-1/3 shadow-lg shadow-orange-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-orange-100 mb-2">Điểm trung bình</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black italic tracking-tighter">{averageRating}</span>
            <span className="text-xl font-bold text-orange-100">/ 5</span>
          </div>
          <div className="flex gap-1 mt-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={16} className={star <= Math.round(averageRating) ? "text-white fill-white" : "text-orange-300 fill-orange-300/30"} />
            ))}
          </div>
          <p className="text-[10px] font-bold mt-3 bg-white/20 px-3 py-1 rounded-full text-white">Dựa trên {totalReviews} đánh giá</p>
        </div>

        {/* Khối thanh tiến trình (Thống kê sao) */}
        <div className="flex-1 flex flex-col justify-center space-y-3">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = starCounts[star];
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12 text-[11px] font-black text-gray-500">
                  {star} <Star size={10} className="text-yellow-400 fill-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
                <div className="w-8 text-right text-[10px] font-bold text-gray-400">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DANH SÁCH BÌNH LUẬN */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-gray-50/50 p-6 rounded-[24px] border border-gray-100 hover:border-blue-100 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black uppercase italic text-sm">
                  {review.user?.name ? review.user.name.charAt(0) : "U"}
                </div>
                <div>
                  <p className="font-black text-blue-900 uppercase text-xs italic tracking-tighter">
                    {review.user?.name || "Khách hàng ẩn danh"}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString('vi-VN')} lúc {new Date(review.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              
              <div className="flex bg-yellow-50 px-2 py-1 rounded-lg">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={12} className={star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-100"} />
                ))}
              </div>
            </div>
            
            {review.comment ? (
              <p className="text-sm font-medium text-gray-600 italic leading-relaxed pl-14">
                "{review.comment}"
              </p>
            ) : (
              <p className="text-[11px] font-medium text-gray-400 italic pl-14 flex items-center gap-1">
                <AlertCircle size={12} /> Khách hàng chỉ đánh giá sao, không để lại bình luận.
              </p>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}