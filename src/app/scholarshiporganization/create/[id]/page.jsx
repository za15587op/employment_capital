"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Navber from "@/app/components/Navber";
import Foter from "@/app/components/Foter";

function ScholarshipOrganizationPage({ params }) {
  const router = useRouter();
  const { data: session, status } = useSession();
 // ดึงค่า scholarship_id และ organization_id จาก params
 const { scholarship_id, organization_id } = params;
  const [amount, setAmount] = useState("");
  const [workType, setWorkType] = useState("");
  const [workTime, setWorkTime] = useState([]);
  const [skillName, setSkillName] = useState(""); // เก็บชื่อทักษะสำหรับ SkillsPage
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ตัวเลือกเวลาทำการปกติ
  const workTimeOptionsInTime = ["วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์"];
  const workTimeOptionsOutTime = ["วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์", "วันอาทิตย์"];

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (!scholarship_id || !organization_id) {
      setError("Scholarship ID หรือ Organization ID ไม่ครบถ้วน");
    }
  }, [scholarship_id, organization_id]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!amount || !workType || workTime.length === 0 || !skillName) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน!");
      return;
    }
  
    const workTimeArray = JSON.stringify(workTime);
  
    try {
      // ส่งคำขอ POST เพื่อสร้างข้อมูล Scholarship Organization
      const response = await fetch("http://localhost:3000/api/scholarshiporganization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scholarship_id, // ใช้ scholarship_id จาก params
          organization_id, // ใช้ organization_id จาก params
          amount,
          workType,
          workTime: workTimeArray,
          
        }),
      });
  
      const scholarshipData = await response.json();
  
      if (!response.ok) {
        throw new Error(scholarshipData.message || "Failed to save scholarship organization");
      }
  
      // หลังจากบันทึก Scholarship Organization สำเร็จ ให้ส่ง POST เพื่อสร้างข้อมูล Skills
      const skillResponse = await fetch("http://localhost:3000/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skill_name: skillName, // ส่งชื่อทักษะ
          scholarship_organ_id: scholarshipData.id, // ใช้ id จาก Scholarship Organization ที่สร้างสำเร็จ
        }),
      });
  
      const skillData = await skillResponse.json();
  
      if (!skillResponse.ok) {
        throw new Error(skillData.message || "Failed to save skill");
      }
  
      setError("");
      setSuccess("บันทึกข้อมูลสำเร็จ");
      setTimeout(() => {
        router.push("/organization");
      }, 1000); // ตั้งเวลา 1 วินาที เพื่อให้ข้อความสำเร็จแสดงขึ้นมาก่อน
    } catch (error) {
      console.error("Error:", error);
      setError("เกิดข้อผิดพลาดระหว่างการส่งข้อมูล");
    }
  };
  

  const handleWorkTypeChange = (e) => {
    setWorkType(e.target.value);
  };

  const handleWorkTimeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setWorkTime((prev) => [...prev, value]);
    } else {
      setWorkTime((prev) => prev.filter((item) => item !== value));
    }
  };

  // ฟังก์ชันเลือก/ยกเลิกเลือกเวลาทำการทั้งหมด
  const handleSelectAllWorkTimes = () => {
    if (workType === "ในเวลาทำการปกติ") {
      setWorkTime(workTimeOptionsInTime);
    } else if (workType === "นอกเวลาทำการที่กำหนด") {
      setWorkTime(workTimeOptionsOutTime);
    }
  };

  // ฟังก์ชันยกเลิกเลือกทั้งหมด
  const handleDeselectAllWorkTimes = () => {
    setWorkTime([]);
  };

  return (
    <div>
      <Navber session={session} />
      <div className="แถบสี"></div>
      <div className="max-w-lg mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Register Scholarship Organization
          </h3>
          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4 text-center">{success}</div>}

          {/* Scholarship Organization Section */}
          <div>
            <h3 className="text-gray-700">จำนวนนิสิตที่รับ</h3>
            <input
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              placeholder="จำนวนนิสิตที่รับ"
              value={amount}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

                        <div>
                <h3 className="text-gray-700">ประเภทเวลาในการทำงาน</h3>
                <select
                  value={workType}
                  onChange={handleWorkTypeChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">เลือกประเภทการทำงาน</option>
                  <option value="ในเวลาทำการปกติ">ในเวลาทำการปกติ</option>
                  <option value="นอกเวลาทำการที่กำหนด">นอกเวลาทำการที่กำหนด</option>
                </select>
              </div>

              <div>
                <h3 className="text-gray-700">เลือกเวลาทำงาน</h3>
                <div className="grid grid-cols-1 gap-2">
                  {workType === "ในเวลาทำการปกติ" &&
                    workTimeOptionsInTime.map((time) => (
                      <label key={time}>
                        <input
                          type="checkbox"
                          value={time}
                          onChange={handleWorkTimeChange}
                          checked={workTime.includes(time)}
                        />
                        {time}
                      </label>
                    ))}

                  {workType === "นอกเวลาทำการที่กำหนด" &&
                    workTimeOptionsOutTime.map((time) => (
                      <label key={time}>
                        <input
                          type="checkbox"
                          value={time}
                          onChange={handleWorkTimeChange}
                          checked={workTime.includes(time)}
                        />
                        {time}
                      </label>
                    ))}
                  {workType && (
                    <div className="flex justify-between mt-4">
                      <button
                        type="button"
                        onClick={handleSelectAllWorkTimes}
                        className="py-2 px-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                      >
                        เลือกทั้งหมด
                      </button>
                      <button
                        type="button"
                        onClick={handleDeselectAllWorkTimes}
                        className="py-2 px-4 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                      >
                        ยกเลิกเลือกทั้งหมด
                      </button>
                    </div>
                  )}
                </div>
              </div>
      
          <div>
            <h3 className="text-gray-700">ชื่อทักษะ</h3>
            <input
              onChange={(e) => setSkillName(e.target.value)}
              type="text"
              placeholder="ชื่อทักษะ"
              value={skillName}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <Foter />
    </div>
  );
}

export default ScholarshipOrganizationPage;
