/* eslint-disable */
// @ts-nocheck
import { ShieldCheck, Car, HelpCircle, PhoneCall, ArrowRight, FileText, Newspaper, Calendar } from "lucide-react";
import Link from "next/link";

// 🚀 HÀM GỌI API LẤY TIN TỨC TỪ VNEXPRESS (Chạy trực tiếp trên Server)
async function getCarNews() {
  try {
    const rssUrl = 'https://vnexpress.net/rss/oto-xe-may.rss';
    
    // Gọi qua API trung gian để ép RSS thành JSON. Cache lại 1 tiếng (3600 giây)
    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`, {
      next: { revalidate: 3600 } 
    });

    const data = await res.json();

    if (data.status === 'ok' && data.items) {
      return data.items.slice(0, 3).map((item, index) => {
        // Móc link ảnh từ nội dung
        const imgMatch = item.description.match(/src="([^"]+)"/);
        const imageUrl = imgMatch ? imgMatch[1] : "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800"; 

        // Xóa sạch các thẻ HTML rác để lấy text thuần
        const cleanDesc = item.description.replace(/<[^>]*>?/gm, '').trim();

        return {
          id: index + 1,
          title: item.title, 
          desc: cleanDesc.length > 120 ? cleanDesc.substring(0, 120) + "..." : cleanDesc, 
          image: imageUrl, 
          date: new Date(item.pubDate).toLocaleDateString('vi-VN'), 
          source: "VnExpress Xe",
          url: item.link // 🚀 Link bài viết gốc
        };
      });
    }
    
    return []; 
  } catch (error) {
    console.error("❌ Lỗi lấy tin tức:", error);
    return [];
  }
}

export default async function AboutPage() {
  // 🚀 Đợi tải dữ liệu tin tức xong mới render trang
  const newsArticles = await getCarNews();

  const values = [
    { 
      icon: <Car size={32}/>, 
      title: "Đa dạng phương tiện", 
      desc: "Hệ thống kết nối hàng trăm chủ xe đối tác và xe công ty. Mọi phương tiện đều được kiểm định chất lượng khắt khe.",
      actionText: "Khám phá đội xe",
      actionLink: "/cars"
    },
    { 
      icon: <FileText size={32}/>, 
      title: "Minh bạch tuyệt đối", 
      desc: "Bảo vệ quyền lợi tối đa với Hợp đồng điện tử tự động. Chi phí rõ ràng, hoàn toàn không có phụ phí ẩn.",
      actionText: "Quy chế hoạt động",
      actionLink: "/policies/terms"
    },
    { 
      icon: <HelpCircle size={32}/>, 
      title: "Giải đáp tường tận", 
      desc: "Từ thủ tục đặt cọc, giao nhận xe đến xử lý sự cố. Mọi thắc mắc của bạn đều đã được chúng tôi biên soạn chi tiết.",
      actionText: "Câu hỏi thường gặp (FAQ)",
      actionLink: "/#faq-section" 
    },
    { 
      icon: <PhoneCall size={32}/>, 
      title: "Hỗ trợ khách hàng 24/7", 
      desc: "Dù bạn ở đâu, lúc nào. Đội ngũ tổng đài viên và cứu hộ của ViVuCar luôn sẵn sàng đồng hành cùng bạn.",
      actionText: "Hotline: 1900 9999",
      actionLink: "tel:19009999" 
    },
  ];

  return (
    <main className="min-h-screen bg-[#f8fafc] pt-28 pb-20 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* PHẦN GIỚI THIỆU CHÍNH */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-widest mb-6 border border-blue-100">
              <ShieldCheck size={14} /> Nền tảng di chuyển thông minh
            </div>
            <h1 className="text-5xl font-black text-blue-900 uppercase italic tracking-tighter mb-6 leading-none">
              Câu chuyện về <br/> <span className="text-blue-600">ViVuCar</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 italic font-medium">
              Ra đời từ năm 2026, ViVuCar không chỉ là một nền tảng cho thuê xe đơn thuần. Chúng tôi là cầu nối công nghệ, mang đến trải nghiệm thuê xe tự lái minh bạch, nhanh chóng và an toàn nhất cho người Việt.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:border-blue-100 hover:shadow-md transition-all">
                <p className="text-4xl font-black text-blue-600 italic leading-none mb-2">200+</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Đối tác chủ xe</p>
              </div>
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:border-blue-100 hover:shadow-md transition-all">
                <p className="text-4xl font-black text-blue-600 italic leading-none mb-2">10k+</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chuyến đi thành công</p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="absolute -inset-4 bg-blue-600/10 rounded-[40px] rotate-3 -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800" 
              className="rounded-[40px] shadow-2xl w-full h-[500px] object-cover"
              alt="Câu chuyện ViVuCar"
            />
          </div>
        </div>

        {/* GIÁ TRỊ CỐT LÕI */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-blue-900 uppercase italic tracking-tighter mb-2">Cam kết của chúng tôi</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">Hệ sinh thái dịch vụ toàn diện</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {values.map((item, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-2 transition-all duration-300 group flex flex-col">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                {item.icon}
              </div>
              <h3 className="text-xl font-black text-blue-900 uppercase italic mb-4 tracking-tighter">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium mb-8 flex-1">{item.desc}</p>
              
              <Link 
                href={item.actionLink}
                className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors w-fit group/btn mt-auto"
              >
                {item.actionText}
                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        {/* 🚀 MỤC MỚI: GÓC TIN TỨC & LÁI XE AN TOÀN */}
        {newsArticles.length > 0 && (
          <div className="mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-black text-blue-900 uppercase italic tracking-tighter mb-2 flex items-center gap-3">
                  <Newspaper className="text-blue-600" size={32} /> Cẩm nang di chuyển
                </h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">Tin tức xe cộ & Mẹo lái xe an toàn</p>
              </div>
              
              {/* 🚀 ĐÃ SỬA: Nút Xem tất cả trỏ thẳng về chuyên trang Ô tô của VnExpress */}
              <a 
                href="https://vnexpress.net/oto-xe-may" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-xl transition-colors border border-transparent hover:border-blue-100"
              >
                Xem tất cả bài viết <ArrowRight size={14} />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newsArticles.map((article) => (
                <div key={article.id} className="group bg-white rounded-[32px] border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col h-full relative">
                  <div className="h-48 overflow-hidden relative">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-blue-900 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-md">
                      {article.source}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                      <Calendar size={12} /> {article.date}
                    </div>
                    <h3 className="text-lg font-black text-gray-800 leading-snug mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-3 mb-6 flex-1">
                      {article.desc}
                    </p>
                    
                    {/* 🚀 ĐÃ SỬA: Chuyển thẻ <a> bọc riêng nút "Đọc tiếp" thay vì bọc cả cục Card */}
                    <a 
                      href={article.url || "https://vnexpress.net/oto-xe-may"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 mt-auto hover:text-blue-800"
                    >
                      Đọc tiếp <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                  
                  {/* Tạo một thẻ a ẩn phủ lên toàn bộ card để bấm đâu cũng ăn link */}
                  <a href={article.url || "https://vnexpress.net/oto-xe-may"} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10 opacity-0 cursor-pointer" aria-label="Đọc tiếp bài viết"></a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LỜI KÊU GỌI (CTA) */}
        <div className="bg-blue-900 rounded-[50px] p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800 rounded-full -mr-32 -mt-32 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-800 rounded-full -ml-20 -mb-20 opacity-50"></div>
          
          <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-4 relative z-10">
            Sẵn sàng khởi hành cùng chúng tôi?
          </h2>
          <p className="text-blue-200 font-medium mb-8 max-w-2xl mx-auto relative z-10">
            Trải nghiệm nền tảng đặt xe tự lái thế hệ mới. Hàng ngàn chiếc xe đang chờ bạn khám phá.
          </p>
          <Link href="/cars" className="inline-block bg-white text-blue-900 px-10 py-5 rounded-[20px] font-black uppercase italic tracking-tighter hover:bg-blue-600 hover:text-white transition-all shadow-xl relative z-10 active:scale-95">
            Tìm xe rảnh ngay
          </Link>
        </div>

      </div>
    </main>
  );
}