import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PoliciesLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-8 hover:text-blue-600 transition-colors w-fit">
          <ChevronLeft size={16} /> Về trang chủ
        </Link>
        <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-gray-100">
          {children}
        </div>
      </div>
    </main>
  );
}