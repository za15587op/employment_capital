"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Foter from "@/app/components/Foter";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function ShowogzPage({ params }) {
    const [organization, setOrganization] = useState([]);
    const { id:scholarship_id, id:scholarship_organ_id } = params || {}; 
    const [newacademic_year, setNewAcademicYear] = useState("");
    const [newacademic_term, setNewAcademicTerm] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(""); // Add success state
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true); // State สำหรับติดตามสถานะการโหลด
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    useEffect(() => {
        if (status === "loading") return; // รอจนกว่าจะโหลด session เสร็จ
        if (!session) {
          router.push("/login"); // หากไม่มี session ให้ไปที่หน้า login
          return;
        }
        fetchOrganization(); // เรียกใช้ฟังก์ชันที่แยกออกมา
      }, [status, session, router]);

    const fetchOrganization = async () => {
        try {
          const resOrganization = await fetch(`http://10.120.1.109:11150/api/organization`, {
            method: "GET",
          });
    
          if (!resOrganization.ok) {
            throw new Error("Failed to fetch organization data");
          }
    
          const orgData = await resOrganization.json();
          setOrganization(orgData);
          setLoading(false); // ตั้งค่าสถานะว่าโหลดเสร็จแล้ว
        } catch (error) {
          console.error("Error fetching organization data:", error);
          setError("An error occurred while fetching organization data");
          setLoading(false); // ตั้งค่าสถานะว่าโหลดเสร็จแล้ว แม้ว่าจะมี error
        }
      };

    const getDataById = async (scholarship_id) => {
        try {
          const res = await fetch(`http://10.120.1.109:11150/api/scholarships/${scholarship_id}`, {
            method: "GET",
            cache: "no-store",
          });
      
          if (!res.ok) {
            throw new Error("Failed to fetch");
          }
      
          const data = await res.json();
        
          console.log(data); // log ข้อมูลเพื่อตรวจสอบว่าได้ข้อมูลอะไรมา
        
          // ตรวจสอบว่า data เป็น object ที่ถูกต้อง
          if (data && data.academic_year && data.academic_term) {
            setNewAcademicYear(data.academic_year); // อัปเดตปีการศึกษา
            setNewAcademicTerm(data.academic_term); // อัปเดตเทอมการศึกษา
          } else {
            console.log("ไม่มีข้อมูลที่เหมาะสม");
          }
        } catch (error) {
          console.log(error); // แสดง error หาก fetch ข้อมูลไม่สำเร็จ
        }
      };

    useEffect(() => {
        if (scholarship_id) {
          getDataById(scholarship_id); // ดึงข้อมูลทุนการศึกษา
        }
    }, [scholarship_id]);
    
    if (loading) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-500">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
              <p className="text-xl text-white mt-4 animate-pulse">Loading...</p>
            </div>
          </div>
        );
    }

    // ฟังก์ชันเพื่อดูข้อมูล organization พร้อมการแจ้งเตือนสำเร็จ
    const handleedit_add = (organization_id) => {
        setSuccess("กำลังเข้าสู่หน้าดูข้อมูลหน่วยงาน!");
        setTimeout(() => {
          router.push(`/organization/showogz/${scholarship_id}/${organization_id}`);
          setSuccess(""); // Reset success message after navigation
        }, 1000); // แสดงข้อความแจ้งเตือน 1 วินาที
    };
    
    return (
        <>
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#DCF2F1] via-[#7FC7D9] via-[#365486] to-[#0F1035]">
                <Navbar session={session} />
                <div className="แถบสี"></div>
                <br /><br />
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-8">
                    <h3 className=" text-2xl font-bold mb-6 text-center bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600">
                        หน่วยงานทั้งหมด
                    </h3>
                </div>
                <div className="flex justify-between items-center p-4">
                    <div className="flex-grow"></div>
                </div>
                <br></br>
                <div className="flex flex-col md:flex-row bg-blue-600 p-2 rounded">
                    <div className="w-full bg-blue-800 p-2 rounded">
                        {error && (
                            <div className="text-red-500 text-center mb-4">{error}</div>
                        )}
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-400 rounded-lg">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-400">
                                    <th className="text-left py-2 px-4 whitespace-nowrap">ชื่อหน่วยงาน</th>
                                    <th className="text-left py-2 px-4 whitespace-nowrap">โทรศัพท์</th>
                                    <th className="text-left py-2 px-4 whitespace-nowrap text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {organization.length > 0 ? (
                                    organization.map(org => (
                                        <tr key={org.organization_id} className="border-b border-gray-400 hover:bg-gray-50">
                                            <td className="py-2 px-4 whitespace-nowrap">{org.organization_name}</td>
                                            <td className="py-2 px-4 whitespace-nowrap">{org.contactPhone}</td>
                                            <td className="py-2 px-4 text-right">
                                                <button
                                                    onClick={() => handleedit_add(org.organization_id)}
                                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 ml-2 "
                                                >
                                                    ดูข้อมูลหน่วยงาน
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center py-4">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <br /><br />
                <Foter />

                {/* การแสดงข้อความแจ้งเตือน */}
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
                                {success}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ShowogzPage;
