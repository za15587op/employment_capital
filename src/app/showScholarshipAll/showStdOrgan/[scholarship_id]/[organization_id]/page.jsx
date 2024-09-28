"use client"; // Mark this as a Client Component
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // useParams for dynamic route params
import Navbar from "@/app/components/Navbar";
import Foter from "@/app/components/Foter";

export default function ShowStdOrgan() {

  let { scholarship_id, organization_id } = useParams(); // Extract params from URL
  const { data: session, status } = useSession();
  const router = useRouter();
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Success message state
  const [showSuccess, setShowSuccess] = useState(false); // State to control the visibility of the success message
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  useEffect(() => {
    if (status === "loading") return; // รอจนกว่าจะโหลด session เสร็จ
    if (!session) {
        router.push("/login");
    }
}, [session, status, router]);

  useEffect(() => {
    if (scholarship_id && organization_id) {
      fetchStudentData(scholarship_id, organization_id);
    }
  }, [scholarship_id, organization_id]);

  const fetchStudentData = async (scholarship_id, organization_id) => {
    try {
      // Corrected fetch call
      const res = await fetch(
        `${apiUrl}/api/showScholarshipAll/showStdOrgan/${scholarship_id}/${organization_id}`,
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
      setSuccess("ข้อมูลถูกโหลดสำเร็จ!"); // Set success message
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
    setShowSuccess(true);
    setSuccess("กำลังกลับไปยังหน้าก่อนหน้านี้!");
    setTimeout(() => {
      setShowSuccess(false);
      router.push(`${apiUrl}/organization/show/${scholarship_id}`);
    }, 3000);
  };

  const ViewDetails = (regist_id) => {
    setShowSuccess(true);
    setSuccess("กำลังโหลดเพื่อดูรายละเอียดเพิ่มเติม!");
    setTimeout(() => {
      setShowSuccess(false);
      router.push(
        `${apiUrl}/showScholarshipAll/showStudentDetail/${organization_id}/${regist_id}`
      );
    }, 3000);
  };

  const handleMatching = (organization_id) => {
    router.push(`${apiUrl}/matching_admin/${scholarship_id}/${organization_id}`);
  };

  // Ensure we get organization_name[0] from the first student, if available
  const organizationName =
    studentData.length > 0 ? studentData[0].organization_name : organization_id;
  const AcademicYear =
    studentData.length > 0 ? studentData[0].academic_year : organization_id;
  const AcademicTerm =
    studentData.length > 0 ? studentData[0].academic_term : organization_id;

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#DCF2F1] via-[#7FC7D9] via-[#365486] to-[#0F1035]">
        <Navbar />
        <div className="แถบสี"></div>
        <br />
        <br />
        <div className="bg-white shadow-lg rounded-lg px-6 py-6 w-full mb-6">
          <div className="bg-blue-500 text-white px-5 py-3 rounded-lg w-full text-center shadow-lg">
            <h3 className="text-2xl font-bold">
              รายชื่อนิสิตที่สมัครทุนนิสิตจ้างงาน
            </h3>
          </div>
        </div>
        <div className="container mx-auto p-8 mt-6 bg-white shadow-lg rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              ปีการศึกษาที่: {AcademicYear}
            </h1>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              เทอมการศึกษาที่: {AcademicTerm}
            </h1>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              คณะ: {organizationName}
            </h1>

            <button
              onClick={() => handleMatching(organization_id)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 ml-2"
            >
              จับคู่
            </button>
            <button
              onClick={() => Back(scholarship_id)}
              className="bg-gradient-to-r from-blue-500 to-blue-400 text-white px-6 py-3 rounded-xl shadow-xl"
            >
              ย้อนกลับ
            </button>
          </div>

          <table className="min-w-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-blue-900">
              <tr className="bg-blue-900 border-b border-blue-700">
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-300">
                  ชื่อ
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-300">
                  นามสกุล
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-300">
                  คณะ
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-300">
                  ชั้นปีที่
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-300">
                  เบอร์โทร
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-300">
                  ดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody>
              {studentData.length > 0 ? (
                studentData.map((student, index) => (
                  <tr
                    key={index}
                    className="border-b border-blue-700 hover:bg-blue-800 transition-all duration-300 hover:shadow-lg "
                  >
                    <td className="text-left py-3 px-4">
                      {student.student_firstname}
                    </td>
                    <td className="text-left py-3 px-4">
                      {student.student_lastname}
                    </td>
                    <td className="text-left py-3 px-4">
                      {student.student_faculty}
                    </td>
                    <td className="text-left py-3 px-4">
                      {student.student_year}
                    </td>
                    <td className="text-left py-3 px-4">
                      {student.student_phone}
                    </td>
                    <td className="text-left py-3 px-4">
                      <button
                        onClick={() => ViewDetails(student.regist_id)}
                        className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-4 py-2 rounded-lg shadow-lg"
                      >
                        ดูเพิ่มเติม
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-3 text-gray-500">
                    ไม่มีข้อมูลสำหรับนิสิต
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
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
            <div className="text-2xl font-bold text-white drop-shadow-lg">
              {success}
            </div>
          </div>
        </div>
      )}
      <Foter />
    </>
  );
}
