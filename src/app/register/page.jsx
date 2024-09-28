"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Foter from "../components/Foter";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // Track success as a boolean
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
          setSuccess(true); // Trigger success notification
          e.target.reset(); // รีเซ็ตฟอร์มหลังจากลงทะเบียนสำเร็จ
          setTimeout(() => {
            router.push("/scholarships");
          }, 2000); // Redirect after 2 seconds
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
      <Navbar />
      <div className="flex flex-1 justify-center items-center py-12 bg-opacity-60">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105 w-full max-w-md"
        >
          {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
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
                {success && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[60%] lg:w-[40%] p-6 bg-gradient-to-r from-[#0fef76] to-[#09c9f6] border-2 border-[#0F1035] rounded-lg shadow-[0px_0px_20px_5px_rgba(15,239,118,0.5)] text-center transition-all duration-500 ease-out animate-pulse">
              <div className="flex items-center justify-center space-x-4">
                <div className="p-2 bg-green-100 rounded-full shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-10 h-10 text-green-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-white drop-shadow-lg">
                  สมัครสมาชิกสำเร็จ!
                </div>
              </div>
              <p className="mt-4 text-lg text-white opacity-90 drop-shadow-md">
                คุณได้สมัครสมาชิกเรียบร้อยแล้ว ระบบจะนำคุณไปยังหน้าอื่นในไม่ช้า...
              </p>
            </div>
          )}

      <Foter />
    </div>
  );
}

export default RegisterPage;
