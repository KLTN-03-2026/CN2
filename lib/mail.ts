/* eslint-disable */
// @ts-nocheck
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendBookingEmail = async (to: string, userName: string, carName: string, status: string) => {
  const statusText = status === "CONFIRMED" ? "ĐÃ ĐƯỢC DUYỆT" : "ĐÃ BỊ HỦY";
  const color = status === "CONFIRMED" ? "#16a34a" : "#dc2626";

  const mailOptions = {
    from: `"BonbonCar Support" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: `[BonbonCar] Thông báo trạng thái đơn đặt xe #${carName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #2563eb; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">BonbonCar</h1>
        </div>
        <div style="padding: 30px;">
          <p>Chào <strong>${userName}</strong>,</p>
          <p>Chúng tôi xin thông báo về đơn đặt xe của bạn:</p>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Xe thuê:</strong> ${carName}</p>
            <p style="margin: 5px 0;"><strong>Trạng thái:</strong> <span style="color: ${color}; font-weight: bold;">${statusText}</span></p>
          </div>
          <p>Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!</p>
        </div>
        <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
          Đây là email tự động, vui lòng không phản hồi.
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};