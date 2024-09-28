"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Foter from "../components/Foter";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { BsClockFill } from 'react-icons/bs'; // นำเข้าไอคอนการนับเวลาถอยหลัง

function HomeStudentPage() {
  const [scholarships, setScholarships] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // รอจนกว่าจะโหลด session เสร็จ
    if (!session) {
        router.push("/login");
    }
}, [session, status, router]);

  // ฟังก์ชันสำหรับแปลงวันที่ให้เป็นรูปแบบ YYYY-MM-DD
  const formatDateToYYYYMMDD = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // "yyyy-MM-dd"
  };

  // ฟังก์ชันสำหรับคำนวณจำนวนวันที่เหลือก่อนหมดเขตรับสมัคร
  const calculateDaysLeft = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // แปลงเวลาเป็นจำนวนวัน
    return diffDays;
  };

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await fetch("/api/showScholarshipsStd");
        if (res.ok) {
          const data = await res.json();
          const formattedData = data.map((scholarship) => ({
            ...scholarship,
            application_start_date: formatDateToYYYYMMDD(scholarship.application_start_date),
            application_end_date: formatDateToYYYYMMDD(scholarship.application_end_date),
            daysLeft: calculateDaysLeft(scholarship.application_end_date), // เพิ่มข้อมูลวันเหลือ
          }));
          setScholarships(formattedData);
        } else {
          setError("Failed to fetch scholarships data");
        }
      } catch (error) {
        setError("An error occurred while fetching scholarships data");
      }
    };

    fetchScholarships();
  }, []);

  const ApplyScholarship = (scholarship_id) => {
    setSuccess(true);
    setTimeout(() => {
      router.push(`/welcome/student_scholarships/${scholarship_id}`);
    }, 2000);
  };

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-500 via-blue-300 to-gray-100">
        <Navbar session={session} />
        <div className="แถบสี"></div>

        {/* Scholarship Cards */}
        <div className="relative z-10 container mx-auto py-12">
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}

          {/* Scholarship Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {scholarships.map((scholarship) => (
              <div
                key={scholarship.scholarship_id}
                className="relative group bg-white bg-opacity-10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-white hover:shadow-3xl hover:scale-110 transition-transform duration-700 ease-in-out"
              >
                {/* Neon Glow Outline */}
                <div className="absolute inset-0 -z-10 transform scale-105 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-30 group-hover:scale-110 transition-transform duration-700 ease-in-out"></div>

                {/* Scholarship Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 p-5 bg-gradient-to-r from-blue-400 to-green-500 rounded-full shadow-2xl">
                    <img src="/e.png" alt="Scholarship Icon" className="w-full h-full" />
                  </div>
                </div>

                {/* Scholarship Details */}
                <div className="flex flex-col text-center text-lg text-gray-800 space-y-2 mt-2 group-hover:text-blue-700 transition-all duration-500 ease-in-out">
                  <span className="font-extrabold text-3xl text-gray-900 group-hover:text-blue-500">
                    ปีการศึกษา {scholarship.academic_year}
                  </span>
                  <span className="text-md">เทอมที่ {scholarship.academic_term}</span>
                  <span>เริ่มสมัครได้ตั้งแต่: {scholarship.application_start_date}</span>
                  <span>ปิดรับสมัครวันที่: {scholarship.application_end_date}</span>
                </div>

                {/* Countdown Information */}
                <div className="mt-4 flex items-center justify-center text-red-500">
                  <BsClockFill className="mr-2" />
                  <span className="text-sm">เหลือเวลาอีก {scholarship.daysLeft} วันในการสมัคร</span>
                </div>

                {/* Apply Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => ApplyScholarship(scholarship.scholarship_id)}
                    className="bg-gradient-to-r from-green-400 to-blue-600 text-white px-8 py-3 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-transform duration-500 ease-in-out transform hover:bg-gradient-to-l"
                  >
                    สมัครทุน
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Modal */}
        {success && (
          <div className="fixed z-50 top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-80">
            <div className="relative w-[90%] md:w-[60%] lg:w-[40%] p-6 bg-gradient-to-r from-green-400 to-blue-400 border-2 border-green-600 rounded-lg shadow-2xl text-center transition-all duration-500 ease-out animate-pulse">
              <div className="flex items-center justify-center space-x-4">
                <div className="p-2 bg-white rounded-full shadow-lg">
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
              </div>
              <p className="mt-4 text-lg text-white font-semibold">
                ระบบกำลังนำคุณไปยังหน้าสมัครทุนถัดไป...
              </p>
            </div>
          </div>
        )}

        <Foter />
      </div>
    </>
  );
}

export default HomeStudentPage;
