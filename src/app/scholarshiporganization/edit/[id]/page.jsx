"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navber from "@/app/components/Navber";
import Foter from "@/app/components/Foter";
import { useSession } from "next-auth/react";

function ScholarshipOrganizationPage({ params }) {
  const { id: scholarship_organ_id,scholarship_requirement_id } = params || {}; // ใช้ scholarship_organ_id เพื่อดึงข้อมูล
  const [amount, setAmount] = useState("");
  const [workType, setWorkType] = useState(""); 
  const [workTime, setWorkTime] = useState([]);
  const [skills, setSkills] = useState([]); 
  const [required_level, setRequiredLevel] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  // ตรวจสอบ Session เพื่อบังคับให้ผู้ใช้เข้าสู่ระบบก่อนเข้าหน้านี้
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [status, session, router]);

  // ดึงข้อมูล Scholarship Organization เมื่อมี scholarship_organ_id
  useEffect(() => {
    if (scholarship_organ_id) {
      getDataById(scholarship_organ_id);
      getRequiredLevel(scholarship_organ_id);
      getSkillsByScholarshipId(scholarship_organ_id); // ดึงข้อมูลทักษะจาก scholarship_organ_id
    }
  }, [scholarship_organ_id]);

  const getDataById = async (scholarship_organ_id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/scholarshiporganization/${scholarship_organ_id}`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch scholarship organization data");
      }

      const data = await res.json();
      setAmount(data.amount);
      setWorkType(data.workType);
      setWorkTime(JSON.parse(data.workTime));
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("เกิดข้อผิดพลาดระหว่างการดึงข้อมูล");
    }
  };

  // ฟังก์ชันดึงข้อมูล skills โดยใช้ scholarship_organ_id
  const getSkillsByScholarshipId = async (scholarship_organ_id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/skills?scholarship_organ_id=${scholarship_organ_id}`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch skills data");
      }

      const skillsData = await res.json();
      setSkills(skillsData); // อัปเดต state ด้วยข้อมูลทักษะ
    } catch (error) {
      console.error("Error fetching skills:", error);
      setError("เกิดข้อผิดพลาดระหว่างการดึงข้อมูลทักษะ");
    }
  };
  const getRequiredLevel = async (scholarship_requirement_id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/scholarshiprequirement/${scholarship_requirement_id}`, {
        method: "GET",
      });
  
      if (!res.ok) {
        throw new Error("ไม่สามารถดึงข้อมูลระดับที่ต้องการได้");
      }
      const data = await res.json();
      // ตั้งค่า required_level ที่ดึงมาได้
      if (data.required_level) {
        setRequiredLevel(data.required_level);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดระหว่างการดึงข้อมูล required_level:", error);
      setError("เกิดข้อผิดพลาดระหว่างการดึงข้อมูล required_level");
    }
  };
  return (
    <div>
      <Navber session={session} />
      <div className="แถบสี"></div>
      <div className="max-w-lg mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          View Scholarship Organization
        </h3>
        {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

        <div>
          <h3 className="text-gray-700">จำนวนนิสิตที่รับ</h3>
          <p className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            {amount}
          </p>
        </div>

        <div>
          <h3 className="text-gray-700">ประเภทเวลาในการทำงาน</h3>
          <p className="w-full px-4 py-2 border border-gray-300 rounded-lg">
            {workType}
          </p>
        </div>

        <div>
          <h3 className="text-gray-700">เวลาทำงาน</h3>
          <div className="grid grid-cols-1 gap-2">
            {workTime.map((time, index) => (
              <p key={index} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                {time}
              </p>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-gray-700 mt-4">ทักษะที่เกี่ยวข้อง</h3>
          <div className="grid grid-cols-1 gap-2">
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <div key={index} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <p>ทักษะ: {skill.skill_name}</p>
                  <p>ระดับที่ต้องการ: {skill.required_level}</p> 
                </div>
              ))
            ) : (
              <p className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                ไม่มีทักษะที่เกี่ยวข้อง
              </p>
            )}
          </div>
        </div>
      </div>
      <Foter />
    </div>
  );
}

export default ScholarshipOrganizationPage;