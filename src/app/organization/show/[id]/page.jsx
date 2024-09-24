"use client";
import React, { useEffect, useState } from "react";
import Navber from "@/app/components/Navber";
import Foter from "@/app/components/Foter";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from 'next/link';

function ShowPage({ params }) {
    const [organization, setOrganization] = useState([]);
    const { id:scholarship_id } = params || {}; 
    const [newacademic_year, setNewAcademicYear] = useState("");
    const [newacademic_term, setNewAcademicTerm] = useState("");
    const [error, setError] = useState("");
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true); // State สำหรับติดตามสถานะการโหลด
    useEffect(() => {
        if (status === "loading") return; // รอจนกว่าจะโหลด session เสร็จ
      
        if (!session) {
          router.push("/login"); // หากไม่มี session ให้ไปที่หน้า login
          return;
        }
      
        fetchOrganization(); 
      }, [status, session, router]);

      const fetchOrganization = async () => {
        try {
          const resOrganization = await fetch(`/api/organization/${scholarship_id}`, {
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
          const res = await fetch(`http://localhost:3000/api/scholarships/${scholarship_id}`, {
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
    // ฟังก์ชันลบข้อมูล organization
    const handleDelete = async (organization_id) => {
        const confirmed = confirm("ต้องการลบหน่วยงานนี้ใช่หรือไม่?");
        if (confirmed) {
            try {
                // ลบข้อมูลจาก organization
                const resOrganization = await fetch(
                    `/api/organization?organization_id=${organization_id}`,
                    {
                        method: "DELETE",
                    }
                );

                // ตรวจสอบว่า API การลบข้อมูลทำงานสำเร็จหรือไม่
                if (resOrganization.ok) {
                    setOrganization((prev) =>
                        prev.filter((org) => org.organization_id !== organization_id)
                    );
                } else {
                    setError("Failed to delete organization data");
                }
            } catch (error) {
                setError("An error occurred while deleting organization data");
            }
        }
    };

    const handleUpdate = (organization_id) => {
        router.push(`/organization/editt/${scholarship_id}/${organization_id}`);
    };

    const handleAddData = (organization_id) => {
        router.push(`/organization/createogz/${scholarship_id}/${organization_id}`);
    };

    const handleedit_add = (organization_id) => {
        router.push(`/organization/showogz/${scholarship_id}/${organization_id}`);
        
    };

    const handleShow = (organization_id) => {
        router.push(`/showScholarshipAll/showStdOrgan/${scholarship_id}/${organization_id}`);
        
    };
    
    const handleEvaluate = (organization_id) => {
        router.push(`/evaluateStudent/${scholarship_id}/${organization_id}`);
        
    };

    
    return (
        <>
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#DCF2F1] via-[#7FC7D9] via-[#365486] to-[#0F1035]">
                <Navber session={session} />
                
                <div className="แถบสี"></div>
                <br /><br />
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-8">
                    <h3 className=" text-2xl font-bold mb-6 text-center bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600"><p>Organization List</p> 
                    ปีการศึกษา <span >{newacademic_year } เทอมการศึกษาที่ <span >{newacademic_term }</span></span>
                    </h3>
                </div>
                    <div className="flex justify-between items-center p-4">
                        <div className="flex-grow"></div>
                        <Link
                                href={`/organization/create/${scholarship_id}`} // ใช้ org.organization_id เพื่อสร้าง dynamic URL
                                className="inline-block bg-blue-500 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 "
                                >
                                เพิ่มหน่วยงาน
                                </Link>
                        
                        <Link
                            href="/scholarshiporganization"
                            className="inline-block bg-blue-500 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 ml-2"
                        >
                            ดูหน่วยงาน
                        </Link>
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
                                                        onClick={() => handleEvaluate(org.organization_id)}
                                                       className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 ml-2 "
                                                    >
                                                        ประเมิน
                                                    </button>
                                                <button
                                                        onClick={() => handleShow(org.organization_id)}
                                                       className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 ml-2 "
                                                    >
                                                        ดูคนสมัคร
                                                    </button>
                                                <button
                                                        onClick={() => handleAddData(org.organization_id)}
                                                        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 ml-2"
                                                    >
                                                        เพิ่มข้อมูลหน่วยงาน
                                                    </button>
                                                    <button
                                                        onClick={() => handleedit_add(org.organization_id)}
                                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 ml-2 "
                                                    >
                                                        ดูข้อมูลหน่วยงาน
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdate(org.organization_id)}
                                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 ml-2"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(org.organization_id)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 ml-2"
                                                    >
                                                        Delete
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
                </div>
                <br /><br />
                <Foter />
            {/* </div> */}
        </>
    );
}

export default ShowPage;
