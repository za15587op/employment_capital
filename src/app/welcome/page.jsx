"use client";
import React, { useEffect, useState } from 'react';
import Navber from '@/app/components/Navber';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

function HomeStudentPage() {
  const [scholarships, setScholarships] = useState([]);
  const [error, setError] = useState("");

  const { data: session, status } = useSession();

  const router = useRouter();

  const formatDateToYYYYMMDD = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // "yyyy-MM-dd"
  };

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/showScholarshipsStd');
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched data:", data);

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
  }, []);

  const ApplyScholarship = (scholarship_id) => {
    router.push(`/welcome/student_scholarships/${scholarship_id}`);
  };

  return (
    <>
    <Navber session = {session}/>
    <div className=" bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h3 className="text-2xl font-bold mb-6 text-center">Scholarships List</h3>
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="text-left py-2 px-4">ปีการศึกษา</th>
                  <th className="text-left py-2 px-4">เทอมการศึกษา</th>
                  <th className="text-left py-2 px-4">วันที่เริ่มต้น</th>
                  <th className="text-left py-2 px-4">วันที่สิ้นสุด</th>
                  <th className="text-left py-2 px-4">สมัครทุน</th>
                </tr>
              </thead>
              <tbody>
                {scholarships.map((scholarship) => (
                  <tr key={scholarship.scholarship_id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-2 px-4">{scholarship.academic_year}</td>
                    <td className="py-2 px-4">{scholarship.academic_term}</td>
                    <td className="py-2 px-4">{scholarship.application_start_date}</td>
                    <td className="py-2 px-4">{scholarship.application_end_date}</td>
                    <td className="py-2 px-4">
                      <button onClick={() => ApplyScholarship(scholarship.scholarship_id)} className="bg-blue-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-blue-600">สมัครทุน</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default HomeStudentPage;
