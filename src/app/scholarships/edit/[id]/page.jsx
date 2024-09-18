"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navber from '@/app/components/Navber';
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
  const [success, setSuccess] = useState(""); 
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
      const res = await fetch(`http://localhost:3000/api/scholarships/${scholarship_id}`, {
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
        const res = await fetch(`http://localhost:3000/api/scholarships/${scholarship_id}`, {
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
  
        const data = await res.json(); // รับข้อมูลจากการตอบกลับของเซิร์ฟเวอร์
  
        if (res.ok) {
          const form = e.target;
          setError("");
          setSuccess("แก้ไขทุนสำเร็จ");
          form.reset();
          router.refresh();
          router.push("/scholarships");
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
    <>
       <Navber session={session} />
      <div className="แถบสี"></div> 
      <br /><br />
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-blue-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-blue-600 transform scale-110"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h3 className="text-2xl font-bold mb-4 text-center">Edit Scholarships Page</h3>
          {scholarship_id && <div className="text-center mb-4">Editing Scholarship ID: {scholarship_id}</div>}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}
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
      <br /><br /><Foter/>
    </>
  );
}

export default EditScholarshipsPage;
