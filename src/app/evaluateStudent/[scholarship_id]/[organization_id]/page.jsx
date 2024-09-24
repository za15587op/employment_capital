"use client"; // Mark this as a Client Component

import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // useParams for dynamic route params

export default function ShowStdOrgan() {
  const { scholarship_id, organization_id } = useParams(); // Extract params from URL
  const router = useRouter();
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);
  const [passFailStatus, setPassFailStatus] = useState({}); // Keep track of each student's status

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

      alert("บันทึกสำเร็จ!");
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
    <div className="container mx-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6"
      >
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

        {studentData?.length > 0 ? (
          <table className="min-w-full bg-white table-auto">
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
                  <td className="border px-4 py-2">
                    {student.student_firstname}
                  </td>
                  <td className="border px-4 py-2">
                    {student.student_lastname}
                  </td>
                  <td className="border px-4 py-2">
                    {student.student_faculty}
                  </td>
                  <td>
                    {passFailStatus[student.regist_id] ||
                      student.student_status}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="radio"
                      name={`passFail_${student.regist_id}`}
                      value="Pass"
                      checked={
                        passFailStatus[student.regist_id] === "Pass"  ||
                        (!passFailStatus[student.regist_id] && student.student_status === "Pass")
                      }
                      onChange={() =>
                        handlePassFailChange(student.regist_id, "Pass")
                      }
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="radio"
                      name={`passFail_${student.regist_id}`}
                      value="Fail"
                      checked={
                        passFailStatus[student.regist_id] === "Fail"  ||
                        (!passFailStatus[student.regist_id] && student.student_status === "Fail")                       
                      }
                      onChange={() =>
                        handlePassFailChange(student.regist_id, "Fail")
                      }
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
          <p className="text-gray-500 text-center">
            No data available for this student.
          </p>
        )}

        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-500 transition ease-in-out duration-300 transform hover:scale-105"
        >
          บันทึก
        </button>
      </form>
    </div>
  );
}
