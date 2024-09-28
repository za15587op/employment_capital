"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Foter from "@/app/components/Foter";
import { useSession } from "next-auth/react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/solid";

function ViewCombinedPage({ params }) {
  const { organization_id } = params; 
  const [data, setData] = useState({});
  const [editData, setEditData] = useState({
    organization_name: "",
    contactPhone: "",
    amount: "",
    workType: "",
    workTime: [],
    required_level: "",
    skill_type_name: ""
  });
  const [skills, setSkills] = useState([{ skill_type_name: "", required_level: "" }]);
  const [workTime, setWorkTime] = useState([]);
  const [workType, setWorkType] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  const workTimeOptionsInTime = ["วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์"];
  const workTimeOptionsOutTime = ["วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์", "วันอาทิตย์"];

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    fetchCombinedData(organization_id);
  }, [status, session, router, organization_id]);

  const fetchCombinedData = async (organization_id) => {
    try {
      const res = await fetch(`/api/scholarshiporganization/${organization_id}`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await res.json();
      console.log(data);

      if (Array.isArray(data) && data.length > 0) {
        // กรองข้อมูลที่มี scholarship_organ_id เท่ากับ 464
        const filteredData = data.filter(item => item.scholarship_organ_id === 464);
  
        if (filteredData.length > 0) {
          const firstData = filteredData[0]; 
          setData(firstData);
          setEditData({
            organization_name: firstData.organization_name || "",
            contactPhone: firstData.contactPhone || "",
            amount: firstData.amount || 0,
            workType: firstData.workType || "",
            workTime: firstData.workTime ? JSON.parse(firstData.workTime) : [],
          });

          const skillData = filteredData.map(item => ({
            skill_type_name: item.skill_type_name || "",
            required_level: item.required_level || ""
          }));
          setSkills(skillData);
  
          setWorkType(firstData.workType || "");
          setWorkTime(firstData.workTime ? JSON.parse(firstData.workTime) : []);
          setLoading(false);
        } else {
          throw new Error("No matching data found");
        }
      } else {
        throw new Error("No data found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data");
      setLoading(false);
    }
  };
  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-500">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          <p className="text-xl text-white mt-4 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  const handleAddSkill = () => {
    setSkills([...skills, { skill_type_name: "", required_level: "" }]);
  };

  const handleRemoveSkill = (indexToRemove) => {
    setSkills((prevSkills) => prevSkills.filter((_, index) => index !== indexToRemove));
  };

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...skills];
    newSkills[index][field] = value;
    setSkills(newSkills);
  };

  const handleWorkTypeChange = (e) => {
    setWorkType(e.target.value);
    setEditData({ ...editData, workType: e.target.value, workTime: [] });
    setWorkTime([]);
  };

  const handleWorkTimeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setWorkTime((prev) => [...prev, value]);
      setEditData({ ...editData, workTime: [...editData.workTime, value] });
    } else {
      const newWorkTime = workTime.filter((time) => time !== value);
      setWorkTime(newWorkTime);
      setEditData({ ...editData, workTime: newWorkTime });
    }
  };

  const handleSelectAllWorkTimes = () => {
    if (workType === "ในเวลาทำการปกติ") {
      setWorkTime(workTimeOptionsInTime);
      setEditData({ ...editData, workTime: workTimeOptionsInTime });
    } else if (workType === "นอกเวลาทำการที่กำหนด") {
      setWorkTime(workTimeOptionsOutTime);
      setEditData({ ...editData, workTime: workTimeOptionsOutTime });
    }
  };

  const handleDeselectAllWorkTimes = () => {
    setWorkTime([]);
    setEditData({ ...editData, workTime: [] });
  };


  const handleComplete = () => {
    setSuccess(true); // แสดงแจ้งเตือน
    setTimeout(() => {
      router.back(); // ย้อนกลับไปหน้าก่อนหน้า หลังจาก 2 วินาที
    }, 2000); // หน่วงเวลา 2 วินาทีก่อนกลับหน้าเดิม
  };
  return (
    <div>
      <Navbar session={session} />
      <div className="แถบสี"></div>
      <div className="max-w-lg mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">ดูข้อมูลของหน่วยงาน</h3>
        {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
        
        <div>
          <h3 className="text-gray-700">ชื่อหน่วยงาน</h3>
          <p className="w-full px-4 py-2 border border-gray-300 rounded-lg">{editData.organization_name}</p>
        </div>
  
        <div>
          <h3 className="text-gray-700">เบอร์โทรศัพท์ติดต่อ</h3>
          <p className="w-full px-4 py-2 border border-gray-300 rounded-lg">{editData.contactPhone}</p>
        </div>
  
        <div>
          <h3 className="text-gray-700">จำนวนนิสิตที่รับ</h3>
          <p className="w-full px-4 py-2 border border-gray-300 rounded-lg">{editData.amount}</p>
        </div>
  
        <div>
          <h3 className="text-gray-700">ประเภทเวลาในการทำงาน</h3>
          <p className="w-full px-4 py-2 border border-gray-300 rounded-lg">{workType}</p>
        </div>
  
        <div>
          <h3 className="text-gray-700">เลือกเวลาทำงาน</h3>
          <div className="grid grid-cols-1 gap-2">
            {workTime.map((time, index) => (
              <p key={index} className="w-full px-4 py-2 border border-gray-300 rounded-lg">{time}</p>
            ))}
          </div>
        </div>
  
        <div>
          <h3 className="text-gray-700 mt-4">ประเภททักษะที่ต้องการ</h3>
          {skills.map((skill, index) => (
            <div key={index} className="flex space-x-4 mb-4 items-center">
              <p className="w-full px-4 py-2 border border-gray-300 rounded-lg">{skill.skill_type_name}</p>
              <p className="w-full px-4 py-2 border border-gray-300 rounded-lg">{skill.required_level}</p>
            </div>
          ))}
        </div>
  
        {/* ปุ่มย้อนกลับ */}
        <button
          onClick={() => window.history.back()} // ฟังก์ชันนี้ใช้เพื่อย้อนกลับไปหน้าก่อนหน้า
          className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 mt-4"
        >
          ย้อนกลับ
        </button>
  
        {/* การแสดงข้อความแจ้งเตือน */}
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
                เสร็จสิ้น!
              </div>
            </div>
            <p className="mt-4 text-lg text-white opacity-90 drop-shadow-md">
              ระบบจะนำคุณกลับไปยังหน้าเดิมในไม่ช้า...
            </p>
          </div>
        )}
      </div>
      <Foter />
    </div>
  );
  
}

export default ViewCombinedPage;
