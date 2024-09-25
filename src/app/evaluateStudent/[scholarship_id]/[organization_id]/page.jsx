"use client"; // Mark this as a Client Component

import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // useParams for dynamic route params
import Navbar from "@/app/components/Navber";
import Foter from "@/app/components/Foter";

export default function ShowStdOrgan() {
  const { scholarship_id, organization_id } = useParams(); // Extract params from URL
  const router = useRouter();
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);
  const [passFailStatus, setPassFailStatus] = useState({}); // Keep track of each student's status
  const [showSuccess, setShowSuccess] = useState(false);
  const [success, setSuccess] = useState("บันทึกสำเร็จ!");

  useEffect(() => {
    if (scholarship_id && organization_id) {
      fetchStudentData(scholarship_id, organization_id);
    }
  }, [scholarship_id, organization_id]);
  

  const fetchStudentData = async (scholarship_id, organization_id) => {
    try {
      // Corrected fetch call
      const res = await fetch(
        `/api/showScholarshipAll/showStdOrgan/${scholarship_id}/${organization_id}`,
        {
          method: "GET",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch student data");
      }

      const data = await res.json();
      console.log(data); // Log data for debugging
      setStudentData(data);

      console.log(data,"studentData");
      
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError("Failed to load student data. Please try again later.");
    }
  };

  const Back = (scholarship_id) => {
    router.push(`/organization/show/${scholarship_id}`);
  };

  const ViewDetails = (regist_id) => {
    router.push(`/showScholarshipAll/showStudentDetail/${regist_id}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prepare data to be sent, including each regist_id with its pass/fail status
    const payload = Object.entries(passFailStatus).map(
      ([regist_id, student_status]) => ({
        regist_id,
        student_status,
      })
    );

    console.log(payload, "payload");

    try {
      const res = await fetch("/api/evaluateStudent", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Send the payload with regist_id and status
      });

      if (!res.ok) {
        throw new Error("Failed to update student status");
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error("Error updating student status:", error);
      setError("Failed to update student status. Please try again later.");
    }
  };

  const handlePassFailChange = (regist_id, student_status) => {
    console.log(`regist_id: ${regist_id}, status: ${student_status}`);
    setPassFailStatus((prevStatus) => ({
      ...prevStatus,
      [regist_id]: student_status,
    }));
  };
  

  const organizationName =
    studentData?.length > 0
      ? studentData[0].organization_name
      : organization_id;
  const AcademicYear =
    studentData?.length > 0 ? studentData[0].academic_year : "";
  const AcademicTerm =
    studentData?.length > 0 ? studentData[0].academic_term : "";

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#DCF2F1] via-[#7FC7D9] via-[#365486] to-[#0F1035]">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white shadow-lg rounded-lg px-6 py-6 w-full mb-6">
            <div className="bg-blue-500 text-white px-5 py-3 rounded-lg w-full text-center shadow-lg">
              <h3 className="text-2xl font-bold">คัดเลือกนิสิตที่สมัครทุนนิสิตจ้างงาน</h3>
            </div>
  
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-800">ปีการศึกษาที่: {AcademicYear}</h1>
                <h1 className="text-xl font-bold text-gray-800">เทอมการศึกษาที่: {AcademicTerm}</h1>
                <h1 className="text-xl font-bold text-gray-800">คณะ: {organizationName}</h1>
                <button
                  onClick={() => Back(scholarship_id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  ย้อนกลับ
                </button>
              </div>
  
              {studentData?.length > 0 ? (
                <table className="min-w-full bg-white table-auto border-collapse border">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border">ลำดับที่</th>
                      <th className="px-4 py-2 border">ชื่อ</th>
                      <th className="px-4 py-2 border">นามสกุล</th>
                      <th className="px-4 py-2 border">คณะ</th>
                      <th className="px-4 py-2 border">สถานะ</th>
                      <th className="px-4 py-2 border">ผ่าน</th>
                      <th className="px-4 py-2 border">ไม่ผ่าน</th>
                      <th className="px-4 py-2 border">ดูรายละเอียด</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentData.map((student, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2 text-center">{index + 1}</td>
                        <td className="border px-4 py-2">{student.student_firstname}</td>
                        <td className="border px-4 py-2">{student.student_lastname}</td>
                        <td className="border px-4 py-2">{student.student_faculty}</td>
                        <td>
                          {passFailStatus[student.regist_id] || student.student_status}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          <input
                            type="radio"
                            name={`passFail_${student.regist_id}`}
                            value="Pass"
                            checked={
                              passFailStatus[student.regist_id] === "Pass" ||
                              (!passFailStatus[student.regist_id] &&
                                student.student_status === "Pass")
                            }
                            onChange={() => handlePassFailChange(student.regist_id, "Pass")}
                          />
                        </td>
                        <td className="border px-4 py-2 text-center">
                          <input
                            type="radio"
                            name={`passFail_${student.regist_id}`}
                            value="Fail"
                            checked={
                              passFailStatus[student.regist_id] === "Fail" ||
                              (!passFailStatus[student.regist_id] &&
                                student.student_status === "Fail")
                            }
                            onChange={() => handlePassFailChange(student.regist_id, "Fail")}
                          />
                        </td>
                        <td className="border px-4 py-2 text-center">
                          <button
                            onClick={() => ViewDetails(student.regist_id)}
                            className="text-blue-500 hover:underline"
                          >
                            ดูรายละเอียด
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-center">No data available for this student.</p>
              )}
  
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-500 transition ease-in-out duration-300 transform hover:scale-105"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
  
        {/* Success message */}
        {showSuccess && (
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
              <div className="text-2xl font-bold text-white drop-shadow-lg">{success}</div>
            </div>
          </div>
        )}
  
        <Foter />
      </div>
    );
  
}
