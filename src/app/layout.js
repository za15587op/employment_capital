import { Kanit } from "next/font/google"; // แก้ไขเป็น Kanit
import "./globals.css";
import { AuthProvider } from "./provider";
import { SessionProvider } from 'next-auth/react';
import Navbar from "@/app/components/Navbar";

// นำเข้า Kanit จาก Google Fonts
const kanit = Kanit({ 
  subsets: ["latin"], 
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] // น้ำหนักที่ต้องการใช้
});

export const metadata = {
  title: "ระบบบริหารจัดการทุนจ้างงานนิสิต", // เปลี่ยนชื่อเป็น Thaksin University
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        {/* เปลี่ยนเป็นใช้ className ของฟอนต์ Kanit */}
        <body className={kanit.className}>
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
