"use client"
import React , {useState , useEffect } from 'react'
import Navbar from "@/app/components/Navbar";  // แก้ Navber เป็น Navbar
import Foter from "../components/Foter";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation'

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // เพิ่มการจัดการสำหรับ success
  const router = useRouter();
  const {data : session } = useSession();
  console.log(session, "Session Data");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (session && session.user) { // ตรวจสอบว่ามี session และ session.user ก่อน
      if (session.user.role === 'admin') {
        router.replace('/homeAdmin');
      } else if (session.user.role === 'student') {
        console.log(session, "student_id");
        
        if (!session.user.student_id) {
          router.replace(`${apiUrl}/student/create`); // Redirect to create page if no student_id
        } else {
          router.replace(`${apiUrl}/homeSt`); // Redirect to edit page if student_id exists
        }
      }
    }
  }, [session, router]);

  const handlerSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signIn("credentials",{
        username , password, redirect: false  
      });
      console.log(res, "res");
      if(res.error){
        setError("ข้อมูลประจำตัวไม่ถูกต้อง");
        return;
      }

      setSuccess(true); // ตั้งค่า success เป็น true เมื่อเข้าสู่ระบบสำเร็จ

      const userRole = res.user?.role;
      console.log(userRole);
      
    } catch(error){
      console.log(error);
    }
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#DCF2F1] via-[#7FC7D9] via-[#365486] to-[#0F1035]">
      <Navbar />
      <div className="แถบสี"></div>
      <div className="flex flex-1 justify-center items-center py-12 bg-opacity-60">
        <form
          onSubmit={handlerSubmit}
          className="bg-white p-10 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105 w-full max-w-md"
        >
          {error && (
            <div className="text-red-500 mb-4 text-center">{error}</div>
          )}
          <h3 className="text-4xl font-extrabold mb-6 text-center text-gray-800">
            หน้าเข้าสู่ระบบ
          </h3>
          <div className="mb-4">
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="email"
              placeholder="กรอกอีเมลของคุณ"
              className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#365486] focus:ring-2 focus:ring-[#7FC7D9] transition duration-300"
            />
          </div>
          <div className="mb-6">
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="กรอกรหัสผ่านของคุณ"
              className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#365486] focus:ring-2 focus:ring-[#7FC7D9] transition duration-300"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#365486] to-[#0F1035] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#7FC7D9]"
          >
            เข้าสู่ระบบ
          </button>
          <div className="text-center pt-6">
            <p className="text-gray-600">
              ยังไม่มีบัญชีใช่ไหม?{' '}
              <Link href="/register" className="text-[#365486] hover:underline">
                สมัครสมาชิก!!
              </Link>
            </p>
          </div>
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
              เข้าสู่ระบบสำเร็จ!
            </div>
          </div>
          <p className="mt-4 text-lg text-white opacity-90 drop-shadow-md">
            คุณได้เข้าสู่ระบบเรียบร้อยแล้ว ระบบจะนำคุณไปยังหน้าอื่นในไม่ช้า...
          </p>
        </div>
      )}

      <Foter />
    </div>
  );
};

export default LoginPage;
