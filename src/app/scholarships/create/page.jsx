"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import Foter from "@/app/components/Foter";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function ScholarshipsForm() {
  const [application_start_date, setApplicationStartDate] = useState("");
  const [application_end_date, setApplicationEndDate] = useState("");
  const [academic_year, setAcademicYear] = useState("");
  const [academic_term, setAcademicTerm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // เปลี่ยน success ให้เป็น Boolean สำหรับแจ้งเตือน
  const { data: session, status } = useSession();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (status === "loading") return; // Wait until session status is determined
    if (!session) router.push("/login"); // Redirect to login page if not authenticated
  }, [status, session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!application_start_date || !application_end_date || !academic_year || !academic_term) {
      setError("Please complete all inputs!");
      return;
    } else {
      try {
        const res = await fetch(`${apiUrl}/api/scholarships`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            application_start_date,
            application_end_date,
            academic_year,
            academic_term,
          }),
        });

        if (res.ok) {
          const form = e.target;
          setError("");
          setSuccess(true); // แสดงแจ้งเตือนว่าการดำเนินการสำเร็จ
          form.reset();
          setTimeout(() => {
            router.push(`${apiUrl}/scholarships`);
          }, 2000); // Redirect after 2 seconds
        } else {
          setError("เพิ่มทุนไม่สำเร็จ เนื่องจากปีการศึกษาทุนซ้ำกัน");
          console.log("เพิ่มทุนไม่สำเร็จ เนื่องจากปีการศึกษาทุนซ้ำกัน");
        }
      } catch (error) {
        setError("An error occurred during submission.");
        console.log("error", error);
      }
    }
  };

  return (
    <div>
      <Navbar session={session} />
      <div className="แถบสี"></div>
      <div className="max-w-lg mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">เปิดรับสมัครทุน </h3>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          
          <div>
            <h3 className="text-gray-700">ปีการศึกษา</h3>
            <input
              onChange={(e) => setAcademicYear(e.target.value)}
              type="number"
              placeholder="ปีการศึกษา"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <h3 className="text-gray-700">เทอมการศึกษา</h3>
            <input
              onChange={(e) => setAcademicTerm(e.target.value)}
              type="number"
              placeholder="เทอมการศึกษา"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <h3 className="text-gray-700">วันที่เริ่มต้น</h3>
            <input
              onChange={(e) => setApplicationStartDate(e.target.value)}
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <h3 className="text-gray-700">วันที่สิ้นสุด</h3>
            <input
              onChange={(e) => setApplicationEndDate(e.target.value)}
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              ยืนยัน
            </button>
          </div>
        </form>
      </div>

      {/* การแจ้งเตือนเมื่อเพิ่มทุนสำเร็จ */}
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
              เพิ่มทุนการศึกษาสำเร็จ!
            </div>
          </div>
          <p className="mt-4 text-lg text-white opacity-90 drop-shadow-md">
            ทุนการศึกษาได้ถูกเพิ่มเข้าสู่ระบบเรียบร้อยแล้ว ระบบจะนำคุณไปยังหน้าอื่นในไม่ช้า...
          </p>
        </div>
      )}

      <Foter />
    </div>
  );
}

export default ScholarshipsForm;
