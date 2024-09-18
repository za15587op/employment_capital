"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Navber from "@/app/components/Navber";
import Foter from "@/app/components/Foter";

function CreateRequirementPage({ params }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { scholarship_id, skill_id } = params; // ใช้ scholarship_id และ skill_id
  const [required_level, setRequiredLevel] = useState(""); // เก็บระดับที่ต้องการสำหรับทักษะ
  const [scholarships, setScholarships] = useState([]); // เก็บข้อมูล scholarship
  const [skills, setSkills] = useState([]); // เก็บข้อมูล skills
  const [selectedScholarship, setScholarship] = useState(scholarship_id || ""); // เก็บค่าที่เลือก
  const [selectedSkill, setSelectedSkill] = useState(skill_id || ""); // เก็บค่าที่เลือก
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ดึงข้อมูล Scholarship และ Skills
  useEffect(() => {
    const fetchData = async () => {
      try {
        const scholarshipRes = await fetch("/api/scholarships");
        const skillsRes = await fetch("/api/skills");
        const scholarshipData = await scholarshipRes.json();
        const skillsData = await skillsRes.json();
        setScholarships(scholarshipData);
        setSkills(skillsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [status, session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!required_level || !selectedScholarship || !selectedSkill) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน!");
      return;
    }
  
    try {
      // ส่งข้อมูลที่จำเป็น
      const response = await fetch("http://localhost:3000/api/scholarshiprequirement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scholarship_id: selectedScholarship,
          skill_id: selectedSkill,
          required_level: parseInt(required_level), // ส่งระดับทักษะเป็นตัวเลข
        }),
      });
  
      const requirementData = await response.json();
  
      if (!response.ok) {
        throw new Error(requirementData.message || "Failed to save scholarship requirement");
      }
  
      setError("");
      setSuccess("บันทึกข้อมูลสำเร็จ");
      setTimeout(() => {
        router.push(`/organization/show/${scholarship_id}`);
      }, 1000);
    } catch (error) {
      console.error("Error occurred:", error.message);
      setError("เกิดข้อผิดพลาดระหว่างการส่งข้อมูล");
    }
  };
  

  return (
    <div>
      <Navber session={session} />
      <div className="แถบสี"></div>
      <div className="max-w-lg mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Register Scholarship Requirement
          </h3>
          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4 text-center">{success}</div>}

          <div>
            <label>Skill:</label>
            <select
              onChange={(e) => setSelectedSkill(e.target.value)}
              value={selectedSkill}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">เลือก Skill</option>
              {skills.map((skill) => (
                <option key={skill.skill_id} value={skill.skill_id}>
                  {skill.skill_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h3 className="text-gray-700">ระดับทักษะที่ต้องการ (จากน้อยไปมาก)</h3>
            <select
              onChange={(e) => setRequiredLevel(e.target.value)}
              value={required_level}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">เลือกระดับทักษะ</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
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

export default CreateRequirementPage;
