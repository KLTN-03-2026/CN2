/* eslint-disable */
// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { X, Phone, Lock, User, Loader2, Mail, ArrowLeft } from "lucide-react";
import CarAnimation from "../ui/CarAnimation"; 
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react"; 

// CHUẨN ĐỊNH DẠNG (REGEX)
const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;

export default function AuthModal({ onClose, onSuccess, initialMode = "login" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [viewMode, setViewMode] = useState(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  
  const [formData, setFormData] = useState({ 
    name: "", email: "", phone: "", password: "", confirmPass: "" 
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setViewMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    setErrors({});
  }, [viewMode]);

  const validateField = (name, value) => {
    let errorMsg = "";
    switch (name) {
      case "name":
        if (!value.trim()) errorMsg = "Vui lòng nhập họ và tên!";
        else if (!nameRegex.test(value.trim())) errorMsg = "Tên không chứa số hay kí tự đặc biệt!";
        break;
      case "email":
        if (!value.trim()) errorMsg = "Vui lòng nhập email!";
        else if (!emailRegex.test(value.trim())) errorMsg = "Email sai định dạng!";
        break;
      case "phone":
        if (!value.trim()) errorMsg = "Vui lòng nhập số điện thoại!";
        else if (!phoneRegex.test(value.trim())) errorMsg = "Số điện thoại không hợp lệ!";
        break;
      case "password":
        if (!value) errorMsg = "Vui lòng nhập mật khẩu!";
        else if (viewMode === "register" && value.length < 6) errorMsg = "Mật khẩu tối thiểu 6 ký tự!";
        break;
      case "confirmPass":
        if (value !== formData.password) errorMsg = "Mật khẩu xác nhận không khớp!";
        break;
      default: break;
    }
    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateAll = () => {
    const newErrors = {};
    if (viewMode === "register") {
      newErrors.name = validateField("name", formData.name);
      newErrors.email = validateField("email", formData.email);
      newErrors.confirmPass = validateField("confirmPass", formData.confirmPass);
    }
    newErrors.phone = validateField("phone", formData.phone);
    if (viewMode !== "forgot") newErrors.password = validateField("password", formData.password);
    setErrors(newErrors);
    return Object.values(newErrors).every(err => err === "" || err === undefined);
  };

  const handleSubmit = async () => {
    if (!validateAll()) return; 
    setIsLoading(true);

    // 1. QUÊN MẬT KHẨU
    if (viewMode === "forgot") {
      try {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: formData.phone })
        });
        if (res.ok) {
          alert("Hệ thống đã gửi yêu cầu khôi phục!");
          setViewMode("login");
        } else {
          const data = await res.json();
          setErrors(prev => ({ ...prev, phone: data.error }));
        }
      } catch (e) { alert("Lỗi kết nối."); }
      finally { setIsLoading(false); }
      return;
    }

    // 2. ĐĂNG KÝ
    if (viewMode === "register") {
      try {
        const res = await fetch("/api/auth/register", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        const data = await res.json();

        if (res.ok) {
            // Đăng ký xong -> Tự động đăng nhập qua NextAuth
            const loginRes = await signIn("credentials", {
                phone: formData.phone,
                password: formData.password,
                redirect: false,
            });

            if (!loginRes?.error) {
                localStorage.removeItem("user"); // 🚀 Dọn dẹp rác cũ
                setShowAnimation(true); // Hiện hiệu ứng xe chạy thành công
            } else {
                setViewMode("login");
            }
        } else {
            setErrors(prev => ({ 
              ...prev, 
              phone: data.error?.includes("điện thoại") ? data.error : "",
              email: data.error?.includes("Email") ? data.error : "" 
            }));
        }
      } catch (e) { alert("Lỗi hệ thống đăng ký."); }
      finally { setIsLoading(false); }
      return;
    }

    // 3. ĐĂNG NHẬP
    if (viewMode === "login") {
      try {
        const res = await signIn("credentials", {
          phone: formData.phone,
          password: formData.password,
          redirect: false,
        });

        if (res?.error) {
          setErrors({ phone: "SĐT hoặc mật khẩu không đúng!", password: " " });
          setIsLoading(false);
        } else {
          localStorage.removeItem("user"); // 🚀 Dọn dẹp rác cũ
          
          const callback = searchParams.get("callback");
          if (callback) {
            window.location.href = decodeURIComponent(callback);
          } else {
            window.location.reload(); 
          }
        }
      } catch (err) {
        alert("Lỗi kết nối hệ thống!");
        setIsLoading(false);
      }
    }
  };

  const handleAnimationDone = () => {
    setShowAnimation(false);
    // Sau khi đăng ký thành công, load lại trang để nhận diện session mới
    const callback = searchParams.get("callback");
    if (callback) {
      window.location.href = decodeURIComponent(callback);
    } else {
      window.location.reload();
    }
  };

  if (showAnimation) return <CarAnimation onComplete={handleAnimationDone} />;

  const renderInput = (name, icon, type, placeholder) => (
    <div className="mb-4">
      <div className={`flex items-center border-2 rounded-2xl p-4 bg-gray-50 transition-all ${
        errors[name] ? "border-red-400 bg-red-50/50 text-red-600" : "border-gray-100 focus-within:border-blue-500"
      }`}>
        <div className={`${errors[name] ? "text-red-400" : "text-gray-400"} mr-3`}>{icon}</div>
        <input 
          type={type} name={name} placeholder={placeholder} 
          className="bg-transparent outline-none w-full font-bold text-gray-700 placeholder:text-gray-400" 
          value={formData[name]} onChange={handleChange} onBlur={handleBlur} 
        />
      </div>
      {errors[name] && errors[name] !== " " && <p className="text-red-500 text-[10px] font-bold italic mt-1.5 ml-2 animate-in slide-in-from-top-1">* {errors[name]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition-colors p-2"><X size={24} /></button>
        
        <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-blue-900 italic uppercase tracking-tighter leading-none">
                {viewMode === "forgot" ? "Khôi Phục Mật Khẩu" : viewMode === "login" ? "Đăng Nhập" : "Tạo Tài Khoản"}
            </h2>
            <p className="text-gray-400 text-xs mt-2 font-bold uppercase tracking-widest">ViVuCar - Nâng tầm hành trình</p>
        </div>

        <div>
            {viewMode === "register" && renderInput("name", <User size={20}/>, "text", "Họ và tên của bạn")}
            {viewMode === "register" && renderInput("email", <Mail size={20}/>, "email", "Địa chỉ Email")}
            {renderInput("phone", <Phone size={20}/>, "tel", "Số điện thoại")}
            {viewMode !== "forgot" && renderInput("password", <Lock size={20}/>, "password", "Mật khẩu")}
            {viewMode === "register" && renderInput("confirmPass", <Lock size={20}/>, "password", "Xác nhận mật khẩu")}

            {viewMode === "login" && (
              <div className="flex justify-end mb-4 -mt-2">
                <button onClick={() => setViewMode("forgot")} className="text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors italic">Quên mật khẩu?</button>
              </div>
            )}

            <button onClick={handleSubmit} disabled={isLoading} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all flex justify-center shadow-xl shadow-blue-100 active:scale-95 disabled:bg-gray-400 uppercase italic tracking-tighter mt-2">
                {isLoading ? <Loader2 className="animate-spin"/> : viewMode === "login" ? "ĐĂNG NHẬP NGAY" : viewMode === "register" ? "TẠO TÀI KHOẢN" : "TÌM TÀI KHOẢN"}
            </button>

            <div className="text-center pt-4 border-t border-gray-100 mt-6">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    {viewMode === "login" ? "Chưa có tài khoản?" : "Đã có tài khoản?"} 
                    <span className="text-blue-600 font-black ml-2 cursor-pointer hover:underline italic" onClick={() => setViewMode(viewMode === "login" ? "register" : "login")}>
                        {viewMode === "login" ? "Đăng ký ngay" : "Đăng nhập tại đây"}
                    </span>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}