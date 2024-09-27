"use client"; // Mark this as a Client Component

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; 
import Navbar from "@/app/components/Navber"; 
import Foter from "@/app/components/Foter";  

export default function MatchingAdminPage() {
  const { scholarship_id, organization_id } = useParams();
  const router = useRouter();
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); 
  const [showSuccess, setShowSuccess] = useState(false);
  const [matchPercentage, setMatchPercentage] = useState({}); // เก็บเปอร์เซ็นต์การ Matching สำหรับแต่ละนิสิต

  useEffect(() => {
    if (scholarship_id && organization_id) {
      fetchStudentData(scholarship_id, organization_id);
    }
  }, [scholarship_id, organization_id]);

  const fetchStudentData = async (scholarship_id, organization_id) => {
    try {
      console.log("Fetching data for scholarship_id:", scholarship_id, "and organization_id:", organization_id);
  
      const res = await fetch(`/api/showScholarshipAll/showStdOrgan/${scholarship_id}/${organization_id}`, {
        method: "GET",
      });
  
      if (!res.ok) {
        throw new Error("Failed to fetch student data");
      }
  
      const data = await res.json();
      console.log("Fetched student data:", data); // Log ข้อมูลนิสิตที่ได้มา
      setStudentData(data);
      setSuccess("ข้อมูลถูกโหลดสำเร็จ!");
  
      // ดึงเปอร์เซ็นต์ Matching สำหรับนิสิตทุกคน
      await fetchMatchingPercentages(data);
      
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError("Failed to load student data. Please try again later.");
    }
  };
  
  function safeParse(jsonString) {
    console.log("Parsing JSON string:", jsonString); // Log string ก่อนแปลง
    try {
      const parsed = jsonString ? JSON.parse(jsonString) : [];
      console.log("Parsed JSON:", parsed); // Log ค่า array ที่แปลงได้
      return parsed;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return [];
    }
  }
  
  function calculateDistance(student, requirement) {
    console.log("Calculating distance for student:", student, "and requirement:", requirement); // Log ข้อมูลนิสิตและความต้องการของทุน
    
    // แปลง JSON string ให้เป็น array
    const studentWorkTime = safeParse(student.workTime);
    const requirementWorkTime = safeParse(requirement.workTime);
    
    console.log("studentWorkTime:", studentWorkTime, "requirementWorkTime:", requirementWorkTime); // Log เวลาในการทำงานที่ถูกแปลง
  
    // ตรวจสอบว่ามีวันที่ตรงกันหรือไม่
    const workTimeDistance = studentWorkTime.some(day => requirementWorkTime.includes(day)) ? 0 : 1;
    console.log("Work time distance:", workTimeDistance);
  
    // คำนวณระยะห่างอื่นๆ (เช่น skill level, work type)
    const skillDistance = Math.pow(student.skill_level - requirement.required_level, 2);
    console.log("Skill distance:", skillDistance);
    
    const workTypeDistance = student.workType === requirement.workType ? 0 : 1;
    console.log("Work type distance:", workTypeDistance);
  
    // รวมระยะห่างทั้งหมด
    const totalDistance = Math.sqrt(skillDistance) + workTypeDistance + workTimeDistance;
    console.log("Total distance:", totalDistance);
  
    return totalDistance;
  }
  
  const fetchMatchingPercentages = async (students) => {
    try {
      const percentages = await Promise.all(
        students.map(async (student) => {
          console.log("Fetching requirements for student:", student); // Log ข้อมูลนิสิต
  
          const response = await fetch('/api/matching', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ scholarshipId: student.scholarship_id }), // ส่ง scholarshipId เพื่อดึง requirement
          });
          const requirements = await response.json();
          console.log("Fetched requirements:", requirements); // Log ความต้องการของทุนที่ดึงมา
  
          // คำนวณระยะห่างระหว่างนิสิตกับความต้องการของทุน
          const distances = requirements.map((requirement) => ({
            distance: calculateDistance(student, requirement),
            requirement,
          }));
  
          console.log("Distances calculated:", distances); // Log ระยะห่างที่คำนวณได้
  
          // เรียงระยะห่างจากน้อยไปมาก
          distances.sort((a, b) => a.distance - b.distance);
  
          // ใช้ KNN: เลือกเพื่อนบ้านที่ใกล้ที่สุด k คน
          const k = 3; // สามารถปรับค่า k ตามที่ต้องการ
          const nearestNeighbors = distances.slice(0, k);
          console.log("Nearest Neighbors:", nearestNeighbors); // Log เพื่อนบ้านที่ใกล้ที่สุด
  
          // คำนวณเปอร์เซ็นต์การจับคู่
          const matchPercentage = (nearestNeighbors.length / requirements.length) * 100;
          console.log("Match percentage:", matchPercentage); // Log เปอร์เซ็นต์การจับคู่
  
          return { studentId: student.student_id, matchPercentage };
        })
      );
  
      // อัปเดต matchPercentage state สำหรับนิสิตแต่ละคน
      const percentageMap = percentages.reduce((acc, item) => {
        acc[item.studentId] = item.matchPercentage;
        return acc;
      }, {});
  
      console.log("Updated match percentages:", percentageMap); // Log เปอร์เซ็นต์การจับคู่ทั้งหมด
      setMatchPercentage(percentageMap);
  
    } catch (error) {
      console.error("Error during matching:", error);
    }
  };
  

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  if (!studentData) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  const organizationName = studentData.length > 0 ? studentData[0].organization_name : organization_id;
  const AcademicYear = studentData.length > 0 ? studentData[0].academic_year : organization_id;
  const AcademicTerm = studentData.length > 0 ? studentData[0].academic_term : organization_id;

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#DCF2F1] via-[#7FC7D9] via-[#365486] to-[#0F1035]">
        <Navbar />
        <div className="แถบสี"></div><br /><br />
        <div className="bg-white shadow-lg rounded-lg px-6 py-6 w-full mb-6">
          <div className="bg-blue-500 text-white px-5 py-3 rounded-lg w-full text-center shadow-lg">
            <h3 className="text-2xl font-bold">รายชื่อนิสิตที่สมัครทุนนิสิตจ้างงาน</h3>
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
          </div>

          <table className="min-w-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-blue-900">
              <tr className="bg-blue-900 border-b border-blue-700">
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-300">ชื่อ</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-300">นามสกุล</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-300">คณะ</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-300">ชั้นปีที่</th>
                {/* <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-300">เบอร์โทร</th> */}
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-300">เปอร์เซ็นต์ Matching</th>
              </tr>
            </thead>
            <tbody>
              {studentData.length > 0 ? (
                studentData.map((student, index) => (
                  <tr
                    key={index}
                    className="border-b border-blue-700 hover:bg-blue-800 transition-all duration-300 hover:shadow-lg "
                  >
                    <td className="text-left py-3 px-4">{student.student_firstname}</td>
                    <td className="text-left py-3 px-4">{student.student_lastname}</td>
                    <td className="text-left py-3 px-4">{student.student_faculty}</td>
                    <td className="text-left py-3 px-4">{student.student_year}</td>
                    <td className="text-left py-3 px-4">{student.student_phone}</td>
                    <td className="text-left py-3 px-4">
                      {matchPercentage[student.student_id] !== undefined 
                        ? `${matchPercentage[student.student_id]}%` 
                        : "กำลังโหลด..."}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-3 text-gray-500">ไม่มีข้อมูลสำหรับนิสิต</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Foter />
    </>
  );
}
