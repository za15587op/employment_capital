"use client";
import React, { useEffect, useState } from 'react';
import Navber from '@/app/components/Navber';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

function ShowStudentScholarshipsPage() {
  const [getData, setGetData] = useState([]);
  const [error, setError] = useState("");

  const { data: session, status } = useSession();
  const router = useRouter();

  // ตรวจสอบการเข้าสู่ระบบก่อน
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login'); // ถ้าไม่ได้เข้าสู่ระบบ ให้ redirect ไปหน้า login
    }
  }, [status, router]);

  const student_id = session?.user?.student_id;

  // ฟังก์ชันดึงข้อมูลทุนที่สมัคร
  const fetchGetData = async () => {
    if (!student_id) return;
    try {
      const res = await fetch(`/api/showStudentScholarships/${student_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Fetched data:", data);
        setGetData(data);
      } else {
        setError('Failed to fetch getData data');
      }
    } catch (error) {
      setError('An error occurred while fetching getData data');
    }
  };

  useEffect(() => {
    if (student_id) {
      fetchGetData();
    }
  }, [student_id]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  const handleUpdate = (regist_id) => {
    router.push(`/welcome/editstudent_scholarships/${regist_id}`);
  };

  const handleDelete = async (regist_id) => {
    const confirmed = confirm("Are you sure?");
    if (confirmed) {
      const res = await fetch(`http://localhost:3000/api/student_scholarships/?regist_id=${regist_id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        window.location.reload();
      }
    }
  }

  return (
    <div className="bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Navber session={session} />
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h3 className="text-2xl font-bold mb-6 text-center">ข้อมูลส่วนตัวและทุนที่สมัคร</h3>
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          {getData.length === 0 ? (
            <p className="text-center">ยังไม่มีข้อมูลทุนการศึกษาที่สมัคร</p>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {getData.map((item, index) => (
                <div key={item.scholarship_id} className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-semibold text-gray-800">ทุนการศึกษา #{index + 1}</h4>
                    <span className={`px-3 py-1 rounded-full text-sm ${item.student_status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {item.student_status}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    <p><strong>รหัสนิสิต:</strong> {item.student_id}</p>
                    <p><strong>ปีการศึกษา:</strong> {item.academic_year}</p>
                    <p><strong>เทอมการศึกษา:</strong> {item.academic_term}</p>
                  </div>
                  <div className="mt-4 flex justify-end space-x-4">
                    <button
                      onClick={() => handleUpdate(item.regist_id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      แก้ไขการสมัคร
                    </button>
                    <button
                      onClick={() => handleDelete(item.regist_id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      ยกเลิกการสมัคร
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShowStudentScholarshipsPage;
