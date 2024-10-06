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
  const [showSuccess, setShowSuccess] = useState(false);
  const [success, setSuccess] = useState("บันทึกสำเร็จ!");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Example mapping dictionaries
  const timeMapping = {
    "ในเวลาที่กำหนด": [1, 0],
    "นอกเวลาทำการที่กำหนด": [0, 1]
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
    "ความคิดสร้างสรรค์ ในการออกแบบ สามารถใช้งานโปรแกรม เช่น Canva, Adobe Illustrator, Adobe Photoshop และโปรแกรมตัดต่อวิดิโอ": [0, 0, 0, 0, 0, 0, 0, 1, 0],
    "ทำงานอื่นๆ ตามที่ได้รับมอบหมาย": [0, 0, 0, 0, 0, 0, 0, 0, 1]
  };

  useEffect(() => {
    if (scholarship_id && organization_id) {
      fetchOrgData(scholarship_id, organization_id);
      fetchStudentData(scholarship_id, organization_id);  // ดึงข้อมูลนักศึกษาเมื่อมี scholarship_id และ organization_id
      
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
       data = data.map(student => ({
        // ...student,
        skill_level: student.skill_level,
        availability_time: timeMapping[student.is_parttime] || [0, 0],
        // ตรวจสอบว่ามีการใช้ JSON.parse() ก่อนแปลงเป็น array ของวันที่พร้อมทำงาน
        availability_days: JSON.parse(student.date_available).map(day => dayMapping[day] || [0, 0, 0, 0, 0, 0, 0])
          .reduce((acc, curr) => acc.map((a, i) => a + curr[i]), [0, 0, 0, 0, 0, 0, 0]),
        skill_type_name: student.skilltypes.split(',').map(skill => skillMapping[skill.trim()] || [0, 0, 0, 0, 0, 0, 0, 0, 0])
          .reduce((acc, curr) => acc.map((a, i) => a + curr[i]), [0, 0, 0, 0, 0, 0, 0, 0, 0])
      }));

      console.log("Mapped student data:", data); // Log ข้อมูลหน่วยงานหลังการแปลง

      setStudentData(data);
      setSuccess("ข้อมูลถูกโหลดสำเร็จ!");

      handleMatch(data, orgData); // เรียกใช้ฟังก์ชัน Matching โดยตรงเมื่อดึงข้อมูลเสร็จ

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
        console.log("Fetched org data:", data); // Log ข้อมูลหน่วยงานเพื่อดีบัก

        // ตรวจสอบว่ามีข้อมูลในอาร์เรย์
        if (data.length > 0) {
            let org = data[0];  // เข้าถึงองค์แรกในอาร์เรย์

            // แปลงข้อความเป็นตัวเลข โดยใช้ JSON.parse() กับ workTime
            org = {
                // ...org,
                required_level:org.required_level,
                availability_time: timeMapping[org.workType] || [0, 0],
                availability_days: JSON.parse(org.workTime).map(day => dayMapping[day] || [0, 0, 0, 0, 0, 0, 0])
                    .reduce((acc, curr) => acc.map((a, i) => a + curr[i]), [0, 0, 0, 0, 0, 0, 0]),
                skill_type_name: org.skill_type_name.split(',').map(skill => skillMapping[skill.trim()] || [0, 0, 0, 0, 0, 0, 0, 0, 0])
                    .reduce((acc, curr) => acc.map((a, i) => a + curr[i]), [0, 0, 0, 0, 0, 0, 0, 0, 0])
            };

            console.log("Mapped org data:", org); // Log ข้อมูลหน่วยงานหลังการแปลง

            setOrgData(org);
            setSuccess("ข้อมูลถูกโหลดสำเร็จ!");
        } else {
            setError("ไม่มีข้อมูลหน่วยงาน");
        }

    } catch (error) {
        console.error("Error fetching org data:", error);
        setError("ไม่สามารถโหลดข้อมูลหน่วยงานได้ กรุณาลองใหม่อีกครั้ง.");
    }

    const handleMatch = async (students, org) => {
      try {
        // ส่งข้อมูล orgData และ studentData ไปใน API
        const response = await axios.post(`http://localhost:5000/match`, { organizations: [org], students });
        setMatches(response.data);
      } catch (error) {
        console.error('Error matching students:', error);
      }
    };

};

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#DCF2F1] via-[#7FC7D9] via-[#365486] to-[#0F1035]">
      <Navbar/>
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white shadow-lg rounded-lg px-6 py-6 w-full mb-6">
          <div className="bg-blue-500 text-white px-5 py-3 rounded-lg w-full text-center shadow-lg">
            <h3 className="text-2xl font-bold">คัดเลือกนิสิตที่สมัครทุนนิสิตจ้างงาน</h3>
          </div>

          <form className="mt-6 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold text-gray-800">หน่วยงาน</h1>
            </div>

            {studentData?.length > 0 ? (
              <table className="min-w-full bg-white table-auto border-collapse border">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">ลำดับที่</th>
                    <th className="px-4 py-2 border">ชื่อ</th>
                    <th className="px-4 py-2 border">นามสกุล</th>
                    <th className="px-4 py-2 border">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.map((student, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2 text-center">{index + 1}</td>
                      <td className="border px-4 py-2">{student.student_firstname}</td>
                      <td className="border px-4 py-2">{student.student_lastname}</td>
                      <td className="border px-4 py-2">{student.student_status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center">ไม่มีข้อมูลที่พร้อมแสดง</p>
            )}
          </form>
        </div>
        <Foter/>
      </div>
    </div>
  );
}