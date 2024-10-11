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
  const [orgname, setOrgname] = useState();
  const [amount, setAmount] = useState();
  const [orgData, setOrgData] = useState(null);
  const [matches, setMatches] = useState(null);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [success, setSuccess] = useState("บันทึกสำเร็จ!");
  const [passFailStatus, setPassFailStatus] = useState({});

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Example mapping dictionaries
  const timeMapping = {
    "ในเวลาที่กำหนด": [1, 0],
    "นอกเวลาทำการที่กำหนด": [0, 1]
  };

  const dayMapping = {
    "วันจันทร์": [1, 0, 0, 0, 0, 0, 0],
    "วันอังคาร": [0, 1, 0, 0, 0, 0, 0],
    "วันพุธ": [0, 0, 1, 0, 0, 0, 0],
    "วันพฤหัสบดี": [0, 0, 0, 1, 0, 0, 0],
    "วันศุกร์": [0, 0, 0, 0, 1, 0, 0],
    "วันเสาร์": [0, 0, 0, 0, 0, 1, 0],
    "วันอาทิตย์": [0, 0, 0, 0, 0, 0, 1]
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
  

  useEffect(() => {
    if (studentData && orgData) {
      handleMatch(studentData, orgData); // เรียก handleMatch ทันทีเมื่อข้อมูลทั้งสองถูกโหลดแล้ว
    }
  }, [studentData, orgData]); // คอยตรวจสอบ studentData และ orgData

  // ฟังก์ชันดึงข้อมูลนักศึกษา
  const fetchStudentData = async (scholarship_id, organization_id) => {
    try {
      const res = await fetch(`${apiUrl}/api/knn/student/${scholarship_id}/${organization_id}`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch student data");
      }

      let data = await res.json();
      console.log("Fetched student data:", data);
      

            // แปลงข้อความเป็นตัวเลข
    data = data.map(student => {
      // แปลง skilltypes ให้กลายเป็น skill array
      const skills = student.skilltypes.split(',').map(skill => skillMapping[skill.trim()] || [0, 0, 0, 0, 0, 0, 0, 0, 0])
        .reduce((acc, curr) => acc.map((a, i) => a + curr[i]), [0, 0, 0, 0, 0, 0, 0, 0, 0]);

      // แปลง skill_level จาก string เป็น array ของตัวเลข
      const skillLevels = student.skill_level.split(',').map(Number); // แปลง '4,5' เป็น [4, 5]

      // แปลง skill_level ให้ใส่ตัวเลขตัวแรกในตำแหน่งแรกที่มีทักษะ และตัวถัดไปในตำแหน่งถัดไป
      let skillLevelIndex = 0; // ตำแหน่งที่เราใช้ดึงค่าจาก skillLevels
      const skillLevelsArray = skills.map((hasSkill, i) => {
        if (hasSkill === 1 && skillLevelIndex < skillLevels.length) {
          // ถ้ามีทักษะในตำแหน่งนี้ และยังมีค่า skill_level ที่ยังไม่ได้ใช้
          const level = skillLevels[skillLevelIndex]; // ใช้ค่าจาก skillLevels
          skillLevelIndex++; // ไปยังค่าต่อไป
          return level; // คืนค่าที่ตรงกับตำแหน่งทักษะ
        }
        return 0; // ถ้าไม่มีทักษะ ให้ใส่ค่า 0
      });

      return {
        student_id:student.student_id,
        regist_id:student.regist_id,
        student_firstname:student.student_firstname,
        student_lastname:student.student_lastname,
        student_status:student.student_status,
        student_gpa:student.student_gpa,
        skill_level: skillLevelsArray, // skill_level ใหม่ตามทักษะ
        availability_time: timeMapping[student.is_parttime] || [0, 0],
        availability_days: JSON.parse(student.date_available).map(day => dayMapping[day] || [0, 0, 0, 0, 0, 0, 0])
          .reduce((acc, curr) => acc.map((a, i) => a + curr[i]), [0, 0, 0, 0, 0, 0, 0]),
        skill_type_name: skills // skill array ที่แปลงแล้ว
      };
    });

      console.log("Mapped student data:", data);

      setStudentData(data);

      if (orgData) {
        handleMatch(data, orgData); // เรียกใช้ฟังก์ชัน Matching เมื่อข้อมูลพร้อม
      }

    } catch (error) {
      console.error("Error fetching student data:", error);
      setError("ไม่สามารถโหลดข้อมูลนักศึกษาได้ กรุณาลองใหม่อีกครั้ง.");
    }
  };

 // ฟังก์ชันดึงข้อมูลหน่วยงาน
const fetchOrgData = async (scholarship_id, organization_id) => {
  try {
    const res = await fetch(`${apiUrl}/api/knn/org/${scholarship_id}/${organization_id}`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch org data");
    }

    let data = await res.json();
    console.log("Fetched org data:", data);

    // เก็บข้อมูล organization_name และ amount
    setOrgname(data.organization_name);
    setAmount(data.amount); // เพิ่ม amount เพื่อเก็บจำนวนที่รับ

    if (data.length > 0) {
      let org = data[0];

      // แปลง required_level ให้เหมือนกับ skill_level
      const requiredLevels = org.required_level.split(',').map(Number); // แปลง '4,5' เป็น [4, 5]

      let requiredLevelIndex = 0; // ตำแหน่งที่เราใช้ดึงค่าจาก requiredLevels
      const requiredLevelArray = org.skill_type_name.split(',').map(skill => skillMapping[skill.trim()] || [0, 0, 0, 0, 0, 0, 0, 0, 0])
        .reduce((acc, curr) => acc.map((a, i) => a + curr[i]), [0, 0, 0, 0, 0, 0, 0, 0, 0])
        .map((hasSkill, i) => {
          if (hasSkill === 1 && requiredLevelIndex < requiredLevels.length) {
            const level = requiredLevels[requiredLevelIndex];
            requiredLevelIndex++;
            return level;
          }
          return 0; // ถ้าไม่มีทักษะในตำแหน่งนั้น ใส่ค่า 0
        });
        
      // แปลงข้อมูลหน่วยงาน
      org = {
        organization_id: parseInt(organization_id, 10),
        organization_name: org.organization_name,
        amount: org.amount, // เพิ่มจำนวนที่รับ (amount)
        skill_level: requiredLevelArray, // แปลง required_level ใหม่
        availability_time: timeMapping[org.workType] || [0, 0],
        availability_days: JSON.parse(org.workTime).map(day => dayMapping[day] || [0, 0, 0, 0, 0, 0, 0])
          .reduce((acc, curr) => acc.map((a, i) => a + curr[i]), [0, 0, 0, 0, 0, 0, 0]),
        skill_type_name: org.skill_type_name.split(',').map(skill => skillMapping[skill.trim()] || [0, 0, 0, 0, 0, 0, 0, 0, 0])
          .reduce((acc, curr) => acc.map((a, i) => a + curr[i]), [0, 0, 0, 0, 0, 0, 0, 0, 0])
      };
      
      console.log("Mapped org data:", org);
      setOrgData(org); // ตั้งค่า orgData หลังจากการแปลงข้อมูล

      if (studentData) {
        handleMatch(studentData, org); // เรียก handleMatch เมื่อข้อมูลพร้อม
      }

    } else {
      setError("ไม่มีข้อมูลหน่วยงาน");
    }

  } catch (error) {
    console.error("Error fetching org data:", error);
    setError("ไม่สามารถโหลดข้อมูลหน่วยงานได้ กรุณาลองใหม่อีกครั้ง.");
  }
};

// ฟังก์ชันจับคู่
const handleMatch = async (students, org) => {

  try {
    const response = await fetch(`${apiUrl}/api/k-nn`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ organizations: [org], students }),
    });

    // const data = await response.json();

    const matchResults = await response.json();
    console.log(matchResults,"matchResults");
    

    if(response.ok) {
      console.log("Matching results:", matchResults);

      // ตรวจสอบผลลัพธ์และแสดงค่าที่ได้
      matchResults.forEach(result => {
        console.log(`Organization ID: ${result["Organization ID"]}, Student ID: ${result["Student ID"]}, Distance: ${result["Distance"]}`);
      });

      setMatches(matchResults);  // เก็บผลลัพธ์การจับคู่
    } else {
      console.error("Error in matching:", matchResults);
    }

    setMatches(matchResults);  // เก็บผลลัพธ์การจับคู่
  } catch (error) {
    console.error('Error matching students:', error);
  }

};

const ViewDetails = (regist_id) => {
  router.push(`${apiUrl}/evaluateStudent/evaluateStudentDetail/${organization_id}/${regist_id}`);
};

const handlePassFailChange = (regist_id, student_status) => {
  // นับจำนวนที่ผ่าน
  const passCount = Object.values(passFailStatus).filter(status => status === "Pass").length;

  // ถ้าสถานะเป็น "Pass" และจำนวนที่ผ่านเกินจำนวนที่รับ
  if (student_status === "Pass" && passCount >= orgData.amount) {
    alert("ไม่สามารถเลือกนิสิตผ่านได้เกินจำนวนที่กำหนด");
    return;
  }

  setPassFailStatus((prevStatus) => ({
    ...prevStatus,
    [regist_id]: student_status,
  }));
};


// Submit pass/fail status
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
    setSuccess("บันทึกข้อมูลสำเร็จ!");

  } catch (error) {
    console.error("Error updating student status:", error);
    setError("ไม่สามารถอัปเดตสถานะนักศึกษาได้ กรุณาลองใหม่อีกครั้ง.");
  }
};


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#DCF2F1] via-[#7FC7D9] via-[#365486] to-[#0F1035]">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white shadow-lg rounded-lg px-6 py-6 w-full mb-6">
          <div className="bg-blue-500 text-white px-5 py-3 rounded-lg w-full text-center shadow-lg">
            <h3 className="text-2xl font-bold">คัดเลือกนิสิตที่สมัครทุนนิสิตจ้างงาน</h3>
          </div>
           {/* เพิ่มข้อความแจ้งเตือนสำเร็จ */}
        {showSuccess && (
          <div className="bg-green-500 text-white text-center py-2 px-4 mb-4 rounded-lg">
            {success || "บันทึกข้อมูลสำเร็จ!"}
          </div>
        )}
          {/* แสดงชื่อหน่วยงานและจำนวนที่รับ */}
  <h1>หน่วยงาน: {orgData?.organization_name}</h1>
  <h2>จำนวนที่รับ: {orgData?.amount}</h2> {/* แสดงจำนวนที่รับ */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {studentData?.length > 0 ? (
              <table className="min-w-full bg-white table-auto border-collapse border mt-6">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">ลำดับที่</th>
                    <th className="px-4 py-2 border">ชื่อ</th>
                    <th className="px-4 py-2 border">นามสกุล</th>
                    <th className="px-4 py-2 border">เกรดเฉลี่ย</th>
                    <th className="px-4 py-2 border">สถานะ</th>
                    <th className="px-4 py-2 border">ผ่าน</th>
                    <th className="px-4 py-2 border">ไม่ผ่าน</th>
                    <th className="px-4 py-2 border">Distance</th>
                    <th className="px-4 py-2 border">ดูรายละเอียด</th>
                  </tr>
                </thead>
                <tbody>
  {/* จัดเรียง matches ตามค่า Distance จากน้อยไปมาก */}
  {matches && matches.length > 0
    ? matches
        .sort((a, b) => a.Distance - b.Distance) // เรียง matches ตามค่า Distance จากน้อยไปมาก
        .map((match, index) => {
          const student = studentData.find(student => student.student_id === match["Student ID"]); // หา student ที่ตรงกับ match

          if (!student) return null; // ถ้าไม่พบ student ให้ข้ามไป

          const formattedDistance = parseFloat(match.Distance).toFixed(2); // คงการแสดงผลที่มี toFixed(2)

          return (
            <tr key={index}>
              <td className="border px-4 py-2 text-center">{index + 1}</td>
              <td className="border px-4 py-2">{student.student_firstname}</td>
              <td className="border px-4 py-2">{student.student_lastname}</td>
              <td className="border px-4 py-2 text-center">{student.student_gpa}</td>
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
              <td className="border px-4 py-2 text-center">{formattedDistance}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => ViewDetails(student.regist_id)}
                  className="text-blue-500 hover:underline"
                >
                  ดูรายละเอียด
                </button>
              </td>
            </tr>
          );
        })
    : (
      <tr>
        <td colSpan="9" className="text-center py-4">ไม่มีข้อมูลผู้สมัคร</td>
      </tr>
    )}
</tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center">ไม่มีข้อมูลที่พร้อมแสดง</p>
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
        <Foter />
      </div>
    </div>
  );
}