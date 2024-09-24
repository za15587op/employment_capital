"use client"; // Mark this as a Client Component

import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // useParams for dynamic route params

export default function ShowStdOrgan() {
  const { scholarship_id, organization_id } = useParams(); // Extract params from URL
  const router = useRouter();
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (scholarship_id && organization_id) {
      fetchStudentData(scholarship_id, organization_id);
    }
  }, [scholarship_id, organization_id]);

  const fetchStudentData = async (scholarship_id, organization_id) => {
    try {
      // Corrected fetch call
      const res = await fetch(`/api/showScholarshipAll/showStdOrgan/${scholarship_id}/${organization_id}`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch student data");
      }

      const data = await res.json();
      console.log(data); // Log data for debugging
      setStudentData(data);
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError("Failed to load student data. Please try again later.");
    }
  };

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  if (!studentData) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  const Back = (scholarship_id) => {
    router.push(`/organization/show/${scholarship_id}`);
  };

  const ViewDetails = (regist_id) => {
    router.push(`/showScholarshipAll/showStudentDetail/${regist_id}`);
  };

  // Ensure we get organization_name[0] from the first student, if available
  const organizationName = studentData.length > 0 ? studentData[0].organization_name : organization_id;
  const AcademicYear = studentData.length > 0 ? studentData[0].academic_year : organization_id;
  const AcademicTerm = studentData.length > 0 ? studentData[0].academic_term : organization_id;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          ปีการศึกษาที่: {AcademicYear}  
        </h1>
        <h1 className="text-2xl font-bold text-gray-800">
          เทอมการศึกษาที่: {AcademicTerm}  
        </h1>
        <h1 className="text-2xl font-bold text-gray-800">
          คณะ: {organizationName}  
        </h1>
        <button
          onClick={() => Back(scholarship_id)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          ย้อนกลับ
        </button>
      </div>
      {studentData.length > 0 ? (
        studentData.map((student, index) => (
          <div
            key={index}
            className="mb-8 p-6 bg-white shadow-md rounded-lg border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              นิสิตที่ {index + 1}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><strong>ชื่อ:</strong> {student.student_firstname}</p>
              <p><strong>นามสกุล:</strong> {student.student_lastname}</p>
              <p><strong>คณะ:</strong> {student.student_faculty}</p>
              <p><strong>ชั้นปีที่:</strong> {student.student_year}</p>
              <p><strong>เบอร์โทร:</strong> {student.student_phone}</p>
              <button onClick={() => ViewDetails(student.regist_id)}>ดูรายละเอียด</button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No data available for this student.</p>
      )}
    </div>
  );
}
