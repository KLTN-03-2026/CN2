/* eslint-disable */
// @ts-nocheck
import React from "react";
import prisma from "@/lib/prisma";
import { Star, Quote, User as UserIcon } from "lucide-react";

export default async function HomeReviews() {
  // 🚀 LẤY DỮ LIỆU THẬT TỪ DATABASE
  let reviews = [];
  try {
    const rawReviews = await prisma.review.findMany({
      where: {
        rating: { gte: 4 }, // Chỉ lấy 4 hoặc 5 sao để làm marketing
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        car: { select: { name: true } },
      },
      take: 15,
    });

    // Lọc ra tối đa 6 bình luận có chữ (khách không để trống)
    reviews = rawReviews.filter(r => r.comment && r.comment.trim() !== "").slice(0, 6);
  } catch (error) {
    console.error("Lỗi lấy đánh giá trang chủ:", error);
  }

  // Nếu chưa có ai đánh giá thì ẩn luôn khu vực này
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white relative overflow-hidden font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-blue-900 uppercase italic tracking-tighter mb-4">
            Khách Hàng Đánh Giá
          </h2>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] italic max-w-2xl mx-auto">
            Hàng ngàn chuyến đi trọn vẹn và trải nghiệm thực tế từ cộng đồng
          </p>
        </div>

        {/* GRID HIỂN THỊ REVIEWS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-blue-50/30 p-10 rounded-[48px] border border-blue-50 hover:border-blue-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 relative group flex flex-col"
            >
              <Quote className="absolute top-8 right-10 text-blue-100 opacity-40 group-hover:text-blue-200 transition-colors" size={48} />
              
              <div className="flex gap-1 mb-6 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < review.rating ? "#2563eb" : "none"} 
                    className={i < review.rating ? "text-blue-600" : "text-gray-200"} 
                  />
                ))}
              </div>

              <p className="text-gray-600 italic text-sm mb-10 leading-relaxed flex-1 relative z-10">
                "{review.comment}"
              </p>

              <div className="flex items-center gap-5 pt-6 border-t border-gray-100 mt-auto relative z-10">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black uppercase italic shadow-sm border-2 border-white ring-4 ring-blue-50">
                  {review.user?.name ? review.user.name.charAt(0) : <UserIcon size={20} />}
                </div>
                <div>
                  <h4 className="font-black text-blue-900 uppercase text-xs italic tracking-tight">
                    {review.user?.name || "Khách hàng"}
                  </h4>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">
                    Đã thuê: {review.car?.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}