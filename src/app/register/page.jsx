"use client";
import React, { useState } from "react";
import Navber from "../components/Navber";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Foter from "../components/Foter";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  // ตรวจสอบ session เพื่อเปลี่ยนเส้นทาง
  if (session) {
    router.replace("/welcome");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบความถูกต้องของข้อมูลก่อนส่ง
    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน!");
      return;
    } else if (!username || !password || !confirmPassword) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน!");
      return;
    } else {
      try {
        const res = await fetch("http://localhost:3000/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        });

        if (res.ok) {
          setError("");
          router.push("/scholarships");
          setSuccess("ลงทะเบียนผู้ใช้สำเร็จ!");
          e.target.reset(); // รีเซ็ตฟอร์มหลังจากลงทะเบียนสำเร็จ
        } else {
          setError("การลงทะเบียนผู้ใช้ล้มเหลว");
        }
      } catch (error) {
        console.log("error", error);
        setError("เกิดข้อผิดพลาดในการลงทะเบียน");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#DCF2F1] via-[#7FC7D9] via-[#365486] to-[#0F1035]">
      <Navber />
      <div className="flex flex-1 justify-center items-center py-12 bg-opacity-60">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105 w-full max-w-md"
        >
          {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
          {success && <div className="text-green-500 mb-4 text-center">{success}</div>}
          <h3 className="text-4xl font-extrabold mb-6 text-center text-gray-800">
            สมัครสมาชิก
          </h3>
          <div className="mb-4">
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="email"
              placeholder="กรอกอีเมลของคุณ"
              className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#365486] focus:ring-2 focus:ring-[#7FC7D9] transition duration-300"
            />
          </div>
          <div className="mb-4">
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="กรอกรหัสผ่านของคุณ"
              className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#365486] focus:ring-2 focus:ring-[#7FC7D9] transition duration-300"
            />
          </div>
          <div className="mb-6">
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="ยืนยันรหัสผ่านของคุณ"
              className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#365486] focus:ring-2 focus:ring-[#7FC7D9] transition duration-300"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#365486] to-[#0F1035] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#7FC7D9]"
          >
            สมัครสมาชิก
          </button>
        </form>
      </div>
      <Foter />
    </div>
  );
};

export default RegisterPage;
