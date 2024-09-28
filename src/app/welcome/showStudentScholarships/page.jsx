"use client";
import React, { useEffect, useState } from 'react';
import Navbar from "@/app/components/Navbar";
import Foter from '@/app/components/Foter';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

function ShowStudentScholarshipsPage() {
  const [getData, setGetData] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // รอจนกว่าจะโหลด session เสร็จ
    if (!session) {
        router.push("/login");
    }
}, [session, status, router]);;

  const student_id = session?.user?.student_id;

  const fetchGetData = async () => {
    if (!student_id) return;
    try {
      const res = await fetch(`/api/showStudentScholarships/${student_id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        setGetData(data);
      } else {
        setError('Failed to fetch data');
      }
    } catch (error) {
      setError('An error occurred while fetching data');
    }
  };

  useEffect(() => {
    if (student_id) fetchGetData();
  }, [student_id]);

  if (status === 'loading') return <div>Loading...</div>;

  const handleUpdate = (regist_id) => {
    setSuccessMessage("กำลังนำคุณไปยังหน้าสมัครทุนถัดไป...");
    setSuccess(true);
    setTimeout(() => {
      router.push(`/welcome/editstudent_scholarships/${regist_id}`);
    }, 1500);
  };

  const handleDelete = async (regist_id) => {
    const confirmed = confirm("Are you sure?");
    if (confirmed) {
      const res = await fetch(`/api/student_scholarships/?regist_id=${regist_id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setSuccessMessage("การสมัครถูกยกเลิกเรียบร้อยแล้ว");
        setSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-500 via-blue-300 to-gray-100">
      <Navbar session={session} />

      {/* Title Section */}
      <div className="py-10 flex justify-center">
        <div className="relative inline-block px-10 py-4 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg shadow-xl">
          <p className="text-4xl font-extrabold text-center text-blue-900 tracking-wider animate-pulse">
            ข้อมูลทุนการศึกษาที่สมัคร
          </p>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-40 blur-md rounded-lg"></div>
        </div>
      </div>

      {/* Scholarships List */}
      <div className="relative px-6 py-8 bg-white bg-opacity-10 backdrop-blur-md shadow-2xl rounded-xl sm:p-10">
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-700">รายการทุนที่คุณสมัคร</h3>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {getData.length === 0 ? (
          <p className="text-center text-gray-500">ยังไม่มีข้อมูลทุนการศึกษาที่สมัคร</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {getData.map((item, index) => (
              <div key={item.scholarship_id} className="bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 p-6 rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xl font-semibold text-gray-800">ทุนการศึกษา #{index + 1}</h4>
                  <span className={`px-3 py-1 rounded-full text-sm ${item.student_status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {/* {item.student_status === 'approved' ? 'อนุมัติ' : 'อยู่ระหว่างดำเนินการ'} */}
                    {item.student_status}
                  </span>
                </div>
                <div className="text-gray-700">
                  <p><strong>รหัสนิสิต:</strong> {item.student_id}</p>
                  <p><strong>ปีการศึกษา:</strong> {item.academic_year}</p>
                  <p><strong>เทอมการศึกษา:</strong> {item.academic_term}</p>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => handleUpdate(item.regist_id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    แก้ไขการสมัคร
                  </button>
                  <button
                    onClick={() => handleDelete(item.regist_id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    ยกเลิกการสมัคร
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Success Message */}
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
              {successMessage}
            </p>
          </div>
        </div>
      )}

      <Foter />
    </div>
  );
}

export default ShowStudentScholarshipsPage;
