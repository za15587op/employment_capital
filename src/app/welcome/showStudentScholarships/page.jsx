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

  const student_id = session?.user?.student_id; // ตรวจสอบ session ก่อนเข้าถึง student_id

  // ฟังก์ชันดึงข้อมูลทุนที่สมัคร
  const fetchGetData = async () => {
    if (!student_id) return; // ถ้าไม่มี student_id ให้หยุดการ fetch
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

  // ใช้ useEffect เพื่อดึงข้อมูลทุนเมื่อ component ถูก mount
  useEffect(() => {
    if (student_id) {
        fetchGetData();
    }
  }, [student_id]);

  if (status === 'loading') {
    return <div>Loading...</div>; // แสดง loading เมื่อยังโหลด session ไม่เสร็จ
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
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="text-left py-2 px-4">ลำดับที่</th>
                    <th className="text-left py-2 px-4">รหัสนิสิต</th>
                    <th className="text-left py-2 px-4">ปีการศึกษา</th>
                    <th className="text-left py-2 px-4">เทอมการศึกษา</th>
                    <th className="text-left py-2 px-4">สถานะการสมัคร</th>
                    <th className="text-left py-2 px-4">แก้ไขการสมัคร</th>
                    <th className="text-left py-2 px-4">ยกเลิกการสมัคร</th>
                  </tr>
                </thead>
                <tbody>
                  {getData.map((item, index) => (
                    <tr key={item.scholarship_id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">{item.student_id}</td>
                      <td className="py-2 px-4">{item.academic_year}</td>
                      <td className="py-2 px-4">{item.academic_term}</td>
                      <td className="py-2 px-4">{item.student_status}</td>
                      <td className="py-2 px-4"><button onClick={() => handleUpdate(item.regist_id)} className="bg-blue-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-blue-600">Edit</button></td>
                      <td className="py-2 px-4"><button onClick={() => handleDelete(item.regist_id)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShowStudentScholarshipsPage;
