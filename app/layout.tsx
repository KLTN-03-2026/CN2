/* eslint-disable */
// @ts-nocheck
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar"; 
import { NextAuthProvider } from "@/components/Providers"; 
import Chatbot from "@/components/features/Chatbot";

import Link from "next/link";
import { Headset, PhoneCall, Facebook } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ViVuCar - Nền tảng thuê xe tự lái hàng đầu",
  description: "Thuê xe nhanh chóng, an toàn và tiện lợi cùng ViVuCar",
};

// SVG Zalo tự vẽ
const ZaloIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="12" y="15.5" textAnchor="middle" fontSize="7.5" fontWeight="900" fill="currentColor" stroke="none" style={{fontFamily: "Arial, sans-serif"}}>Zalo</text>
  </svg>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 font-sans`}>
        <NextAuthProvider>
          <Navbar />
          
          {children}
          
          <Footer />

          {/* ========================================================= */}
          {/* 🚀 CÁC NÚT LIÊN HỆ ĐỘC LẬP (ĐÃ TÁCH RỜI & LÊN MÀU TRỰC TIẾP) */}
          {/* ========================================================= */}
          {/* Đổi flex-col items-center thành items-end và tăng gap-4 để tách các nút ra */}
          <div className="fixed bottom-24 right-6 z-[90] flex flex-col items-end gap-4">
            
            {/* 1. Nút Facebook (Màu xanh FB) */}
            <a
              href="https://www.facebook.com/profile.php?id=61570958711733"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-12 h-12 flex items-center justify-center rounded-full bg-[#1877F2] text-white shadow-lg shadow-blue-500/30 hover:scale-110 hover:-translate-y-1 transition-all duration-300 group"
            >
              <Facebook size={22} />
              <span className="absolute right-[120%] bg-gray-900/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none shadow-xl scale-95 group-hover:scale-100 origin-right">
                Facebook
              </span>
            </a>

            {/* 2. Nút Zalo (Màu xanh Zalo) */}
            <a
              href="https://zalo.me/0559902699"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-12 h-12 flex items-center justify-center rounded-full bg-[#0068FF] text-white shadow-lg shadow-blue-500/30 hover:scale-110 hover:-translate-y-1 transition-all duration-300 group"
            >
              <ZaloIcon />
              <span className="absolute right-[120%] bg-gray-900/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none shadow-xl scale-95 group-hover:scale-100 origin-right">
                Chat Zalo
              </span>
            </a>

            {/* 3. Nút Gọi Điện (Màu xanh lá) */}
            <a
              href="tel:0559902699"
              className="relative w-12 h-12 flex items-center justify-center rounded-full bg-[#10B981] text-white shadow-lg shadow-green-500/30 hover:scale-110 hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Hiệu ứng nháy sáng nhẹ ẩn sau nút gọi để thu hút */}
              <span className="absolute inset-0 bg-[#10B981] rounded-full animate-ping opacity-40"></span>
              <PhoneCall size={22} className="relative z-10 animate-pulse" />
              
              <span className="absolute right-[120%] bg-[#10B981] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none shadow-xl shadow-green-500/20 scale-95 group-hover:scale-100 origin-right">
                Gọi: 0559.902.699
              </span>
            </a>

            {/* 4. Nút Liên Hệ Hỗ Trợ (Màu tím nhạt/Indigo) */}
            <Link
              href="/contact"
              className="relative w-12 h-12 flex items-center justify-center rounded-full bg-[#6366F1] text-white shadow-lg shadow-indigo-500/30 hover:scale-110 hover:-translate-y-1 transition-all duration-300 group"
            >
              <Headset size={22} />
              <span className="absolute right-[120%] bg-gray-900/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none shadow-xl scale-95 group-hover:scale-100 origin-right">
                Trung tâm hỗ trợ
              </span>
            </Link>

          </div>
          {/* ========================================================= */}
          
          <Chatbot />
          
        </NextAuthProvider>
      </body>
    </html>
  );
}