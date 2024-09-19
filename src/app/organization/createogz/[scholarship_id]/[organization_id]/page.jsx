"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Navber from "@/app/components/Navber";
import Foter from "@/app/components/Foter";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/solid"; // นำเข้าไอคอนลบ

function CreateogzPage({ params }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { scholarship_id, organization_id, skill_type_id, scholarship_organ_id } = params;

  // State สำหรับฟอร์มหลัก
  const [amount, setAmount] = useState("");
  const [workType, setWorkType] = useState("");
  const [workTime, setWorkTime] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State สำหรับจัดการทักษะและระดับทักษะ
  const [skills, setSkills] = useState([{ skill_type_name: "", required_level: "" }]);

  // ตัวเลือกเวลาทำการ
  const workTimeOptionsInTime = ["วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์"];
  const workTimeOptionsOutTime = ["วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์", "วันอาทิตย์"];

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [status, session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !workType || workTime.length === 0 || skills.some(skill => !skill.skill_type_name || !skill.required_level)) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน!");
      return;
    }

    const workTimeArray = JSON.stringify(workTime);

    try {
      // ส่งคำขอ POST ไปที่ API สำหรับข้อมูลหลัก
      const responseOrg = await fetch("/api/scholarshiporganization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scholarship_id,
          organization_id,
          amount,
          workType,
          workTime: workTimeArray,
        }),
      });

      const dataOrg = await responseOrg.json();
      if (!responseOrg.ok || !dataOrg.scholarship_organ_id) {
        throw new Error("ไม่สามารถสร้างได้ ข้อมูลนี้มีอยู่แล้ว");
      }

      const scholarship_organ_id = dataOrg.scholarship_organ_id;

      // เพิ่มข้อมูลทักษะใหม่ทั้งหมด
      for (const skill of skills) {
        const responseSkill = await fetch("/api/skillTypes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skill_type_name: skill.skill_type_name,
          }),
        });

        const dataSkill = await responseSkill.json();
        if (!responseSkill.ok || !dataSkill.skill_type_id) {
          throw new Error(dataSkill.message || "Failed to save skill type");
        }

        const skill_type_id = dataSkill.skill_type_id;

        // เพิ่มข้อมูลลงในตาราง scholarshiprequirement
        const responseReq = await fetch("/api/scholarshiprequirement", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scholarship_organ_id,
            skill_type_id,
            required_level: skill.required_level,
          }),
        });

        const dataReq = await responseReq.json();
        if (!responseReq.ok) {
          throw new Error(dataReq.message || "Failed to save scholarship requirement data");
        }
      }

      setError("");
      setSuccess("บันทึกข้อมูลสำเร็จ");
      setTimeout(() => {
        router.push(`/organization/show/${scholarship_id}`);
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      setError(`${error.message}`);
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

  const handleSelectAllWorkTimes = () => {
    if (workType === "ในเวลาทำการปกติ") {
      setWorkTime(workTimeOptionsInTime);
    } else if (workType === "นอกเวลาทำการที่กำหนด") {
      setWorkTime(workTimeOptionsOutTime);
    }
  };

  const handleDeselectAllWorkTimes = () => {
    setWorkTime([]);
  };

  // เพิ่มทักษะใหม่
  const handleAddSkill = () => {
    setSkills([...skills, { skill_type_name: "", required_level: "" }]);
  };
// ฟังก์ชันลบทักษะ
const handleRemoveSkill = (indexToRemove) => {
  setSkills((prevSkills) => prevSkills.filter((_, index) => index !== indexToRemove));
};
  // จัดการการเปลี่ยนค่าทักษะและระดับทักษะ
  const handleSkillChange = (index, field, value) => {
    const newSkills = [...skills];
    newSkills[index][field] = value;
    setSkills(newSkills);
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
                    ยกเลิกทั้งหมด
                  </button>
                </div>
              )}
            </div>
          </div>

  
          <div>
    <h3 className="text-gray-700">ประเภททักษะที่ต้องการ</h3>
    {skills.map((skill, index) => (
      <div key={index} className="flex space-x-4 mb-4 items-center">
        <div className="w-1/2">
          <input
            onChange={(e) => handleSkillChange(index, "skill_type_name", e.target.value)}
            type="text"
            placeholder="ประเภททักษะ"
            value={skill.skill_type_name}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="w-2/4 flex items-center space-x-2">
          <select
            onChange={(e) => handleSkillChange(index, "required_level", e.target.value)}
            value={skill.required_level}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">ระดับทักษะ</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>

          {/* ไอคอนเพิ่มทักษะ */}
          <button
            type="button"
            onClick={handleAddSkill}
            className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition duration-300"
          >
            <PlusIcon className="w-6 h-6" /> 
          </button>

          {/* ไอคอนลบทักษะ */}
          <button
            type="button"
            onClick={() => handleRemoveSkill(index)}
            className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition duration-300"
          >
            <MinusIcon className="w-6 h-6" /> 
          </button>
        </div>
      </div>
    ))}
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

export default CreateogzPage;
