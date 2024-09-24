"use client";
import React, { useEffect, useState } from 'react';
import Navber from '@/app/components/Navber';
import Foter from '../components/Foter';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

function ShowScholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [error, setError] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  const formatDateToYYYYMMDD = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // "yyyy-MM-dd"
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    } else {
      const fetchScholarships = async () => {
        try {
          const res = await fetch('/api/scholarships');
          if (res.ok) {
            const data = await res.json();
            console.log("Fetched data:", data); // ตรวจสอบข้อมูลที่ดึงมา
  
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
  

  const handleUpdate = (scholarship_id) => {
    router.push(`/scholarships/edit/${scholarship_id}`);
  };

  const handleAddData = (organization_id) => {
    router.push(`/organization/create/${organization_id}`);
      };
  const handleorganization = (organization_id) => {
      router.push(`/organization/show/${organization_id}`);
      };

  const handleShow = (scholarship_id) => {
        router.push(`/showScholarshipAll/${scholarship_id}`);
      };

  // useEffect(() => {
  //   if (scholarship_id) {
  //     getDataById(scholarship_id);
  //   }
  // }, [scholarship_id]);
  // const handleCreate = () => {
  //   router.push(`/scholarships/create`);
  // };



  const handleDelete = async (scholarship_id) => {
    const confirmed = confirm("ต้องการลบทุนนี้ใช่หรือไม่?");
    if (confirmed) {
    const res = await fetch(`/api/scholarships/?scholarship_id=${scholarship_id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        window.location.reload();
      }
    }
  };

  const toggleStatus = async (scholarship_id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
  
    try {
      const res = await fetch("/api/scholarships/toggle-status", {
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
      } else {
        setError("Failed to update scholarship status");
      }
    } catch (error) {
      setError("An error occurred while updating scholarship status");
    }
  };  

  return (
    <>
      <Navber session={session} />
      <div className="แถบสี"></div> 
      <br /><br />
      <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        <h3 className="text-2xl font-bold mb-6 text-center bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600">
          Scholarships List
        </h3>
        <div className="flex justify-between items-center p-4">
          <div className="flex-grow"></div>
          <a href='/scholarships/create' className="bg-blue-500 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
            เปิดรับสมัครทุน
          </a>
        </div>
        <br />
        <div className="flex flex-col md:flex-row bg-blue-600 p-2 rounded">
                <div className="w-full md:w-1/4 bg-blue-400 p-2 rounded">
                <ul className=" space-y-2">
                <li>สิทธิ์ของ Admin</li>
                <li>1. เปิดรับสมัครทุน</li>
                <li>2. แก้ไข/ลบ/ทำสำเนาทุน</li>
                <li>3. เพิ่ม/ลบ/แก้ไข ข้อมูลหน่วยงาน</li>
                <li>4. ดูผล Matching</li>
                <li>5. ออกรายงาน</li>
            </ul>
            </div>
            <div className="w-full  bg-blue-800 p-2 rounded">
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
                  <td className="py-2 px-4">
                      <button
                        onClick={() =>
                          toggleStatus(scholarship.scholarship_id, scholarship.scholarship_status)
                        }
                        className={`${
                          scholarship.scholarship_status === 1
                            ? "bg-green-500"
                            : "bg-red-500"
                        } text-white px-3 py-1 rounded-lg`}
                      >
                        {scholarship.scholarship_status === 1 ? "เปิด" : "ปิด"}
                      </button>
                    </td>
                  <td className="py-2 px-4 text-right">
                  <button
                     onClick={() => handleShow(scholarship.scholarship_id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 mr-2" >
                      ดูจำนวนผู้สมัคร
                      </button>
                  <button
                     onClick={() => handleAddData(scholarship.scholarship_id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 mr-2" >
                      เพิ่มหน่วยงาน
                      </button>
                      <button onClick={() => handleorganization(scholarship.scholarship_id)} className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 mr-2">
                      ดูหน่วยงาน
                    </button>
                    <button onClick={() => handleUpdate(scholarship.scholarship_id)} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(scholarship.scholarship_id)} className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>   
      </div>  
      <br /><br />
      <Foter />
    </>
  );
}


export default ShowScholarships;
