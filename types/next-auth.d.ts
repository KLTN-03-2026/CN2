import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  // Mở rộng interface Session để có thêm các trường mới trong session.user
  interface Session {
    user: {
      id: string;
      role: string;
      phone: string;
    } & DefaultSession["user"]
  }

  // Mở rộng interface User để lúc authorize trả về không bị lỗi
  interface User {
    id: string;
    role: string;
    phone: string;
  }
}

declare module "next-auth/jwt" {
  // Mở rộng interface JWT để lưu trữ các trường này trong Token
  interface JWT {
    id: string;
    role: string;
    phone: string;
  }
}