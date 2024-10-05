"use client"; // Mark this as a Client Component

import { useRouter } from "next/navigation"; 
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; 
import Navbar from "@/app/components/Navbar";
import Foter from "@/app/components/Foter";

export default function AdminPage() {
  let { scholarship_id, organization_id } = useParams(); // Extract params from URL
  const router = useRouter();
  const [studentData, setStudentData] = useState(null);
  const [orgData, setOrgData] = useState(null);
  const [error, setError] = useState(null);
  const [passFailStatus, setPassFailStatus] = useState({}); // Keep track of each student's status
  const [showSuccess, setShowSuccess] = useState(false);
  const [success, setSuccess] = useState("บันทึกสำเร็จ!");
  const [matchPercentage, setMatchPercentage] = useState({}); // Store matching percentages for each student
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Example mapping dictionaries
  const timeMapping = {
    "ในเวลา": [1, 0],
    "นอกเวลา": [0, 1]
  };

  const dayMapping = {
    "จันทร์": [1, 0, 0, 0, 0, 0, 0],
    "อังคาร": [0, 1, 0, 0, 0, 0, 0],
    "พุธ": [0, 0, 1, 0, 0, 0, 0],
    "พฤหัสบดี": [0, 0, 0, 1, 0, 0, 0],
    "ศุกร์": [0, 0, 0, 0, 1, 0, 0],
    "เสาร์": [0, 0, 0, 0, 0, 1, 0],
    "อาทิตย์": [0, 0, 0, 0, 0, 0, 1]
  };

  const skillMapping = {
    "ทักษะในการถ่ายภาพ วิดีโอ": [1, 0, 0, 0, 0, 0, 0, 0, 0],
    "ทักษะในการสื่อสาร เช่น เขียนข่าวประชาสัมพันธ์": [0, 1, 0, 0, 0, 0, 0, 0, 0],
    "ทักษะด้านภาษาอังกฤษ การพูด อ่าน เขียน ภาษาอังกฤษ": [0, 0, 1, 0, 0, 0, 0, 0, 0],
    "ความรู้พื้นฐานเกี่ยวกับการบริหารโครงการ การเงิน พัสดุ": [0, 0, 0, 1, 0, 0, 0, 0, 0],
    "มีความรับผิดชอบ": [0, 0, 0, 0, 1, 0, 0, 0, 0],
    "สามารถใช้โปรแกรม Microsoft Office ได้": [0, 0, 0, 0, 0, 1, 0, 0, 0],
    "มีความรู้ด้านคอมพิวเตอร์ เช่น ซ่อมบำรุงได้ เขียนโปรแกรม": [0, 0, 0, 0, 0, 0, 1, 0, 0],
    "ความคิดสร้างสรรค์ ในการออกแบบ สามารถใช้งานโปรแกรม เช่น Canva,  Adobe Illustrator, Adobe Photoshop และโปรแกรมตัดต่อวิดิโอ": [0, 0, 0, 0, 0, 0, 0, 1, 0],
    "ทำงานอื่นๆ ตามที่ได้รับมอบหมาย": [0, 0, 0, 0, 0, 0, 0, 0, 1]
  };

  useEffect(() => {
    if (scholarship_id && organization_id) {
      fetchStudentData(scholarship_id, organization_id);  // ดึงข้อมูลนักศึกษาเมื่อมี scholarship_id และ organization_id
      fetchOrgData(scholarship_id, organization_id);
    }
  }, [scholarship_id, organization_id]);

  // ฟังก์ชันดึงข้อมูลนักศึกษา
  const fetchStudentData = async (scholarship_id, organization_id) => {
    try {
      const res = await fetch(
        `${apiUrl}/api/knn/student/${scholarship_id}/${organization_id}`,
        {
          method: "GET",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch student data");
      }

      let data = await res.json();
      console.log("Fetched student data:", data); // Log ข้อมูลนักศึกษาเพื่อดีบัก

      // แปลงข้อความเป็นตัวเลข
      student = data.map(student => ({
        ...student,
        availability_time: timeMapping[student.availability_time] || [0, 0],
        availability_days: student.availability_days.map(day => dayMapping[day] || [0, 0, 0, 0, 0, 0, 0]).reduce((a, b) => a.map((x, i) => x + b[i])),
        skill_type_name: skillMapping[student.skill_type_name] || [0, 0, 0, 0, 0, 0, 0, 0, 0],
      }));

      console.log(student,"student");
      

      setStudentData(student);
      setSuccess("ข้อมูลถูกโหลดสำเร็จ!");

    } catch (error) {
      console.error("Error fetching student data:", error);
      setError("ไม่สามารถโหลดข้อมูลนักศึกษาได้ กรุณาลองใหม่อีกครั้ง.");
    }
  };

  // ฟังก์ชันดึงข้อมูลหน่วยงาน
  const fetchOrgData = async (scholarship_id, organization_id) => {
    try {
      const res = await fetch(
        `${apiUrl}/api/knn/org/${scholarship_id}/${organization_id}`,
        {
          method: "GET",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch org data");
      }

      let data = await res.json();
      console.log("Fetched org data:", data); // Log ข้อมูลนักศึกษาเพื่อดีบัก

      // แปลงข้อความเป็นตัวเลข
      org = {
        ...data,
        availability_time: timeMapping[data.availability_time] || [0, 0],
        availability_days: data.availability_days.map(day => dayMapping[day] || [0, 0, 0, 0, 0, 0, 0]).reduce((a, b) => a.map((x, i) => x + b[i])),
        skill_type_name: skillMapping[data.skill_type_name] || [0, 0, 0, 0, 0, 0, 0, 0, 0],
      };
      console.log(org,"org");
      

      setOrgData(org);

      setSuccess("ข้อมูลถูกโหลดสำเร็จ!");

    } catch (error) {
      console.error("Error fetching org data:", error);
      setError("ไม่สามารถโหลดข้อมูลหน่วยงานได้ กรุณาลองใหม่อีกครั้ง.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = Object.entries(passFailStatus).map(
      ([regist_id, student_status]) => ({
        regist_id,
        student_status,
      })
    );

    try {
      const res = await fetch(`${apiUrl}/api/evaluateStudent`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to update student status");
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setSuccess("ข้อมูลถูกโหลดสำเร็จ!");

    } catch (error) {
      console.error("Error updating student status:", error);
      setError("ไม่สามารถอัปเดตสถานะนักศึกษาได้ กรุณาลองใหม่อีกครั้ง.");
    }
  };

  const handlePassFailChange = (regist_id, student_status) => {
    setPassFailStatus((prevStatus) => ({
      ...prevStatus,
      [regist_id]: student_status,
    }));
  };

  const ViewDetails = (regist_id) => {
    router.push(`${apiUrl}/evaluateStudent/evaluateStudentDetail/${organization_id}/${regist_id}`);
  };

    const handleEvaluate = (organization_id) => {
    router.push(`${apiUrl}/evaluateStudent/editEvaluateStudent/${scholarship_id}/${organization_id}`);
    
};

  
  const organizationName = studentData?.length > 0 ? studentData[0].organization_name : organization_id;
  const AcademicYear = studentData?.length > 0 ? studentData[0].academic_year : "";
  const AcademicTerm = studentData?.length > 0 ? studentData[0].academic_term : "";



  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#DCF2F1] via-[#7FC7D9] via-[#365486] to-[#0F1035]">
      <Navbar/>
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white shadow-lg rounded-lg px-6 py-6 w-full mb-6">
          <div className="bg-blue-500 text-white px-5 py-3 rounded-lg w-full text-center shadow-lg">
            <h3 className="text-2xl font-bold">คัดเลือกนิสิตที่สมัครทุนนิสิตจ้างงาน</h3>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold text-gray-800">ปีการศึกษาที่: {AcademicYear}</h1>
              <h1 className="text-xl font-bold text-gray-800">เทอมการศึกษาที่: {AcademicTerm}</h1>
              <h1 className="text-xl font-bold text-gray-800">หน่วยงาน: {organizationName}</h1>
            </div>
             <button
               onClick={() => handleEvaluate(organization_id)}
               className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                แก้ไขประเมิน
             </button>
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
                    <th className="px-4 py-2 border">เปอร์เซ็นต์ Matching</th>
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
                      <td>{passFailStatus[student.regist_id] || student.student_status}</td>
                      <td className="border px-4 py-2 text-center">
                        <input
                          type="radio"
                          name={`passFail_${student.regist_id}`}
                          value="Pass"
                          checked={
                            passFailStatus[student.regist_id] === "Pass" ||
                            (!passFailStatus[student.regist_id] && student.student_status === "Pass")
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
                            (!passFailStatus[student.regist_id] && student.student_status === "Fail")
                          }
                          onChange={() => handlePassFailChange(student.regist_id, "Fail")}
                        />
                      </td>
                      <td className="text-left py-3 px-4">
                        {matchPercentage[student.student_id] !== undefined 
                          ? `${matchPercentage[student.student_id].toFixed(2)}%`
                          : "กำลังโหลด..."}
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
              <p className="text-gray-500 text-center ">ไม่มีข้อมูลที่พร้อมแสดง</p>
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
        <Foter/>
      </div>

    </div>
  );
}




// "use client";
// import { useState } from 'react';

// export default function Home() {
//   const [features, setFeatures] = useState([5.1, 3.5, 1.4, 0.2]); // ข้อมูลตัวอย่าง
//   const [prediction, setPrediction] = useState(null);

//   const handlePredict = async () => {
//     try {
//       const res = await fetch('/api/knn', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ features }),
//       });

//       const data = await res.json();
//       setPrediction(data.prediction);
//     } catch (error) {
//       console.error("Error fetching prediction:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>KNN Prediction</h1>
//       <button onClick={handlePredict}>Predict</button>
//       {prediction !== null && <div>Prediction: {prediction}</div>}
//     </div>
//   );
// }
