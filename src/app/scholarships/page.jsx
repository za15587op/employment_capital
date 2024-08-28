"use client";
import React, { useEffect, useState } from 'react';
import Navber from '@/app/components/Navber';
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
    const fetchScholarships = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/scholarships');
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

  const handleUpdate = (scholarship_id) => {
    router.push(`/scholarships/edit/${scholarship_id}`);
  };

  const handleDelete = async (scholarship_id) => {
    const confirmed = confirm("Are you sure?");
    if (confirmed) {
      const res = await fetch(`http://localhost:3000/api/scholarships/?scholarship_id=${scholarship_id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        window.location.reload();
      }
    }
  }

  return (
    <div className=" bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Navber session = {session}/>
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h3 className="text-2xl font-bold mb-6 text-center">Scholarships List</h3>
          <a href='/scholarships/create' className="text-blue-500 underline mb-4 block text-center">เพิ่มทุน</a>
          <button className="bg-blue-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-blue-600">เพิ่มทุน</button>
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="text-left py-2 px-4">ปีการศึกษา</th>
                  <th className="text-left py-2 px-4">เทอมการศึกษา</th>
                  <th className="text-left py-2 px-4">วันที่เริ่มต้น</th>
                  <th className="text-left py-2 px-4">วันที่สิ้นสุด</th>
                  <th className="text-left py-2 px-4">Actions</th>
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
                      <button onClick={() => handleUpdate(scholarship.scholarship_id)} className="bg-blue-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-blue-600">Edit</button>
                      <button onClick={() => handleDelete(scholarship.scholarship_id)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowScholarships;
