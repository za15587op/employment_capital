"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navber from '@/app/components/Navbar';
import Foter from "@/app/components/Foter";
import { useSession } from 'next-auth/react';

function EditScholarshipsPage({ params }) {
  const { id: scholarship_id } = params;
  const [postData, setPostData] = useState({});
  const [application_start_date, setApplicationStartDate] = useState("");
  const [application_end_date, setApplicationEndDate] = useState("");
  const [academic_year, setAcademicYear] = useState("");
  const [academic_term, setAcademicTerm] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState(""); 
  const [success, setSuccess] = useState(false); // เปลี่ยน success เป็น Boolean
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (status === "loading") return; // Wait until session status is determined
    if (!session) router.push("/login"); // Redirect to login page if not authenticated
  }, [status, session, router]);

  // Utility function to format the date to "yyyy-MM-dd"
  const formatDateToYYYYMMDD = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // "yyyy-MM-dd"
  };

  const getDataById = async (scholarship_id) => {
    try {
      const res = await fetch(`${apiUrl}/api/scholarships/${scholarship_id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
     
      setPostData(data);

      // Set state with formatted dates
      setApplicationStartDate(formatDateToYYYYMMDD(data.application_start_date) || "");
      setApplicationEndDate(formatDateToYYYYMMDD(data.application_end_date) || "");
      setAcademicYear(data.academic_year || "");
      setAcademicTerm(data.academic_term || "");

      console.log(data, "data");
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (scholarship_id) {
      getDataById(scholarship_id);
    }
  }, [scholarship_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!application_start_date || !application_end_date || !academic_year || !academic_term) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน!");
      return;
    } else {
      try {
        const res = await fetch(`${apiUrl}/api/scholarships/${scholarship_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scholarship_id,  // เพิ่ม scholarship_id ให้ถูกส่งไปด้วย
            application_start_date,
            application_end_date,
            academic_year,
            academic_term,
          }),
        });
  
        if (res.ok) {
          const form = e.target;
          setError("");
          setSuccess(true); // ตั้งค่า success เป็น true เมื่อแก้ไขสำเร็จ
          form.reset();
          setTimeout(() => {
            router.push(`${apiUrl}/scholarships`);
          }, 2000); // Redirect after 2 seconds
        } else {
          setError("แก้ไขทุนไม่สำเร็จ เนื่องจากปีการศึกษาทุนซ้ำกัน");
          console.log("แก้ไขทุนไม่สำเร็จ เนื่องจากปีการศึกษาทุนซ้ำกัน");
        }
      } catch (error) {
        setError("An error occurred during submission.");
        console.log("error", error);
      }
    }
  };

  return (
    <>
      <Navber session={session} />
      <div className="แถบสี"></div> 
      <br /><br />
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-blue-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-blue-600 transform scale-110"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h3 className="text-2xl font-bold mb-4 text-center">แก้ไขทุนที่เปิดรับ</h3>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-gray-700">ปีการศึกษา</h3>
              <input
                onChange={(e) => setAcademicYear(e.target.value)}
                type="number"
                placeholder="ปีการศึกษา"
                value={academic_year}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <h3 className="text-gray-700">เทอมการศึกษา</h3>
              <input
                onChange={(e) => setAcademicTerm(e.target.value)}
                type="number"
                placeholder="เทอมการศึกษา"
                value={academic_term}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <h3 className="text-gray-700">วันที่เริ่มต้น</h3>
              <input
                onChange={(e) => setApplicationStartDate(e.target.value)}
                type="date"
                placeholder="Start Date"
                value={application_start_date}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <h3 className="text-gray-700">วันที่สิ้นสุด</h3>
              <input
                onChange={(e) => setApplicationEndDate(e.target.value)}
                type="date"
                placeholder="End Date"
                value={application_end_date}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* การแจ้งเตือนเมื่อแก้ไขสำเร็จ */}
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
              แก้ไขทุนการศึกษาสำเร็จ!
            </div>
          </div>
          <p className="mt-4 text-lg text-white opacity-90 drop-shadow-md">
            ทุนการศึกษาได้ถูกแก้ไขเรียบร้อยแล้ว ระบบจะนำคุณไปยังหน้าอื่นในไม่ช้า...
          </p>
        </div>
      )}

      <br /><br /><Foter/>
    </>
  );
}

export default EditScholarshipsPage;
