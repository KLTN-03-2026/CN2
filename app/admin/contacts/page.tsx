/* eslint-disable */
// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { MessageSquare, CheckCircle, Clock, Mail, Phone, User } from "lucide-react";

export default function AdminContactsPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/contacts");
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi tải tin nhắn:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsResolved = async (id: number) => {
    if (!confirm("Đánh dấu tin nhắn này là Đã xử lý?")) return;
    
    try {
      const res = await fetch("/api/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "RESOLVED" })
      });
      
      if (res.ok) {
        fetchMessages(); // Tải lại danh sách
      }
    } catch (error) {
      alert("Lỗi kết nối");
    }
  };

  if (loading) return <div className="p-8 font-black text-blue-600 animate-pulse italic uppercase">Đang tải hộp thư...</div>;

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
          <MessageSquare size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-blue-900 uppercase italic tracking-tighter">Hỗ trợ khách hàng</h1>
          <p className="text-gray-500 font-medium text-sm">Quản lý các yêu cầu liên hệ từ người dùng hệ thống.</p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="p-6">Thời gian</th>
                <th className="p-6">Khách hàng</th>
                <th className="p-6 min-w-[300px]">Nội dung yêu cầu</th>
                <th className="p-6 text-center">Trạng thái</th>
                <th className="p-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {messages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-400 font-bold italic">Không có tin nhắn nào.</td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-6">
                      <div className="text-xs font-black text-blue-900">{new Date(msg.createdAt).toLocaleDateString('vi-VN')}</div>
                      <div className="text-[10px] font-bold text-gray-400">{new Date(msg.createdAt).toLocaleTimeString('vi-VN')}</div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 mb-1">
                        <User size={12} className="text-gray-400" />
                        <span className="text-sm font-bold text-gray-800">{msg.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Phone size={12} className="text-blue-500" />
                        <span className="text-xs font-bold text-blue-600">{msg.phone}</span>
                      </div>
                      {msg.email && (
                        <div className="flex items-center gap-2">
                          <Mail size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500">{msg.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-6">
                      <p className="text-sm font-medium text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                        {msg.message}
                      </p>
                    </td>
                    <td className="p-6 text-center">
                      {msg.status === "PENDING" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 border border-orange-100 rounded-lg text-[10px] font-black uppercase tracking-widest">
                          <Clock size={12} /> Chờ xử lý
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 border border-green-100 rounded-lg text-[10px] font-black uppercase tracking-widest">
                          <CheckCircle size={12} /> Đã xử lý
                        </span>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      {msg.status === "PENDING" && (
                        <button 
                          onClick={() => handleMarkAsResolved(msg.id)}
                          className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase italic tracking-wider rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
                        >
                          Đã xử lý xong
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}