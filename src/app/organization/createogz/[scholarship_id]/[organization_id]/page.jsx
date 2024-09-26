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
  const { scholarship_id, organization_id } = params;

  // State สำหรับฟอร์มหลัก
  const [amount, setAmount] = useState("");
  const [workType, setWorkType] = useState("");
  const [workTime, setWorkTime] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // ใช้ boolean สำหรับ success message

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
    const skillsData = skills.map(skill => ({
      skill_type_name: skill.skill_type_name,
      required_level: skill.required_level,
    }));
  
    try {
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
  
      const responseSkills = await fetch("/api/skillTypes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skills: skillsData,
          scholarship_organ_id,
        }),
      });
  
      const dataSkills = await responseSkills.json();
      if (!responseSkills.ok) {
        throw new Error(dataSkills.message || "Failed to save skill types");
      }
  
      setError("");
      setSuccess(true); // แสดง success message
      setTimeout(() => {
        router.push(`/organization/show/${scholarship_id}`);
      }, 1000); // Redirect after 1 second
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

  const handleAddSkill = () => {
    if (skills.some(skill => skill.skill_type_name === "" || skill.required_level === "")) {
      setError("กรุณากรอกข้อมูลทักษะให้ครบถ้วน!");
      return;
    }
    setSkills([...skills, { skill_type_name: "", required_level: "" }]);
  };

  const handleRemoveSkill = (indexToRemove) => {
    setSkills((prevSkills) => prevSkills.filter((_, index) => index !== indexToRemove));
  };

  const handleSkillChange = (index, field, value) => {
    setSkills((prevSkills) => {
      const updatedSkills = [...prevSkills];
      updatedSkills[index][field] = value;
      return updatedSkills;
    });
  };

  return (
    <div>
      <Navber session={session} />
      <div className="แถบสี"></div>
      <div className="max-w-lg mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">
           เพิ่มข้อมูลของหน่วยงาน
          </h3>
          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

          {/* การแสดงข้อความแจ้งเตือนแบบทันสมัย */}
          {success && (
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
                  บันทึกข้อมูลสำเร็จ!
                </div>
              </div>
              <p className="mt-4 text-lg text-white opacity-90 drop-shadow-md">
                ระบบจะนำคุณไปยังหน้าอื่นในไม่ช้า...
              </p>
            </div>
          )}

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
