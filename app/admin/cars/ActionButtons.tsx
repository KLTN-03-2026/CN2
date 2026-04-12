"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Eye } from "lucide-react";

export default function ActionButtons({ carId }: { carId: number }) {
  const router = useRouter();

  const handleDelete = async () => {
    // Hiện thông báo xác nhận chống bấm nhầm
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn chiếc xe #${carId} không?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/cars/${carId}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        alert("Đã xóa xe thành công!");
        router.refresh(); // Tự động F5 lại bảng dữ liệu để làm mất dòng xe bị xóa
      } else {
        alert(data.error || "Có lỗi xảy ra khi xóa.");
      }
    } catch (error) {
      alert("Lỗi kết nối đến máy chủ.");
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Link href={`/admin/cars/${carId}`} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Xem hồ sơ xe">
        <Eye size={18} />
      </Link>

      {/* Đường dẫn tới trang Edit (Mình sẽ làm ở bước sau) */}
      <Link href={`/admin/cars/${carId}/edit`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Chỉnh sửa">
        <Edit size={18} />
      </Link>
      
      <button onClick={handleDelete} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa xe">
        <Trash2 size={18} />
      </button>
    </div>
  );
}