"use client";
import React, { useEffect, useState } from 'react';
import Navbar from "@/app/components/Navbar";
import Foter from '../components/Foter';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Tooltip } from "@nextui-org/react";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa"; // Use react-icons

function ShowScholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const formatDateToYYYYMMDD = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    } else {
      
      const fetchScholarships = async () => {
        try {
          const res = await fetch(`${apiUrl}/api/scholarships`);
          if (res.ok) {
            const data = await res.json();
            const formattedData = data.map(scholarship => ({
              ...scholarship,
              application_start_date: formatDateToYYYYMMDD(scholarship.application_start_date),
              application_end_date: formatDateToYYYYMMDD(scholarship.application_end_date),
            }));
            
            setScholarships(formattedData);
          } else {
            setError('Failed to fetch scholarships data');
          }
        } catch (error) {
          setError('An error occurred while fetching scholarships data');
        }
      };
  
      fetchScholarships();
    }
  }, [session, status, router]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);
  
  const handleUpdate = (scholarship_id) => {
    router.push(`${apiUrl}/scholarships/edit/${scholarship_id}`);
    setSuccess("แก้ไขข้อมูลทุนสำเร็จ!");
  };

  const handleAddData = (scholarship_id) => {
    router.push(`${apiUrl}/organization/create/${scholarship_id}`);
    setSuccess("เพิ่มหน่วยงานสำเร็จ!");
  };

  const handleOrganization = (organization_id) => {
    router.push(`${apiUrl}/organization/show/${organization_id}`);
    setSuccess("ดูหน่วยงานสำเร็จ!");
  };

  const handleDelete = async (scholarship_id) => {
    const confirmed = confirm("ต้องการลบทุนนี้ใช่หรือไม่?");
    if (confirmed) {
      const res = await fetch(`${apiUrl}/api/scholarships/?scholarship_id=${scholarship_id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSuccess("ลบทุนสำเร็จ!");
        window.location.reload();
      }
    }
  };

  const toggleStatus = async (scholarship_id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
  
    try {
      const res = await fetch(`${apiUrl}/api/scholarships/toggle-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scholarship_id, scholarship_status: newStatus }),
      });
  
      if (res.ok) {
        setScholarships((prevScholarships) =>
          prevScholarships.map((scholarship) =>
            scholarship.scholarship_id === scholarship_id
              ? { ...scholarship, scholarship_status: newStatus }
              : scholarship
          )
        );
        setSuccess(`ทุนถูก ${newStatus === 1 ? 'เปิด' : 'ปิด'} สำเร็จ!`);
      } else {
        setError("Failed to update scholarship status");
      }
    } catch (error) {
      setError("An error occurred while updating scholarship status");
    }
  };  

  return (
    <>
      <Navbar session={session} />
      <div className="แถบสี"></div>
      <br /><br />
      <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        <h3 className="text-2xl font-bold mb-6 text-center bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600">
          หน้าเปิดรับสมัครทุนนิสิตจ้างงาน
        </h3>
        <div className="flex justify-between items-center p-4">
          <div className="flex-grow"></div>
          <a href='/scholarships/create' className="bg-blue-500 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
            เพิ่มทุน
          </a>
        </div>
        <br />
        <div className="flex flex-col md:flex-row bg-blue-600 p-2 rounded">
          <div className="w-full md:w-1/4 bg-blue-400 p-2 rounded">
            <ul className=" space-y-2">
              <li>สิทธิ์ของ Admin</li>
              <li>1. เปิด/ปิด รับสมัครทุน</li>
              <li>2. แก้ไข/ลบ/ทำสำเนาทุน</li>
              <li>3. เพิ่ม/ลบ/แก้ไข ข้อมูลหน่วยงาน</li>
              <li>4. ดูผล Matching</li>
              <li>5. ออกรายงาน</li>
            </ul>
          </div>

          <div className="w-full bg-blue-800 p-2 rounded">
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-400 rounded-lg">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-400">
                    <th className="text-left py-2 px-4 whitespace-nowrap">ปีการศึกษา</th>
                    <th className="text-left py-2 px-4 whitespace-nowrap">เทอมการศึกษา</th>
                    <th className="text-left py-2 px-4 whitespace-nowrap">วันที่เริ่มต้น</th>
                    <th className="text-left py-2 px-4 whitespace-nowrap">วันที่สิ้นสุด</th>
                    <th className="text-left py-2 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scholarships.map((scholarship) => (
                    <tr key={scholarship.scholarship_id} className="border-b border-gray-400 hover:bg-gray-50">
                      <td className="py-2 px-4 whitespace-nowrap">{scholarship.academic_year}</td>
                      <td className="py-2 px-4 whitespace-nowrap">{scholarship.academic_term}</td>
                      <td className="py-2 px-4 whitespace-nowrap">{scholarship.application_start_date}</td>
                      <td className="py-2 px-4 whitespace-nowrap">{scholarship.application_end_date}</td>
                      <td className="py-2 px-4 text-right">
                        <div className="flex justify-center items-center space-x-3">
                          <button
                            className={`${scholarship.scholarship_status === 1 ? "bg-green-500" : "bg-red-500"
                              } text-white px-3 py-1 rounded-lg`}
                            onClick={() => toggleStatus(scholarship.scholarship_id, scholarship.scholarship_status)}
                          >
                            {scholarship.scholarship_status === 1 ? "เปิด" : "ปิด"}
                          </button>
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                            onClick={() => handleAddData(scholarship.scholarship_id)}
                          >
                            เพิ่มหน่วยงาน
                          </button>
                          <Tooltip content="ดูหน่วยงาน">
                            <span
                              className="text-lg text-gray-400 cursor-pointer active:opacity-50"
                              onClick={() => handleOrganization(scholarship.scholarship_id)}
                            >
                              <FaEye />
                            </span>
                          </Tooltip>
                          <Tooltip content="แก้ไข">
                            <span
                              className="text-lg text-gray-400 cursor-pointer active:opacity-50"
                              onClick={() => handleUpdate(scholarship.scholarship_id)}
                            >
                              <FaEdit />
                            </span>
                          </Tooltip>
                          <Tooltip content="ลบ">
                            <span
                              className="text-lg text-red-500 cursor-pointer active:opacity-50"
                              onClick={() => handleDelete(scholarship.scholarship_id)}
                            >
                              <FaTrashAlt />
                            </span>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                  {success}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <br /><br />
      <Foter />
    </>
  );
}

export default ShowScholarships;
