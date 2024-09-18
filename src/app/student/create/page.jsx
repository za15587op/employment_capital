"use client";
import React, { useState, useEffect } from "react";
import Navber from "@/app/components/Navber";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function StudentForm({ params }) {
  const router = useRouter();
  const { data: session } = useSession();

  const [student_id, setStudentID] = useState("");
  const [student_firstname, setStudentFirstName] = useState("");
  const [student_lastname, setStudentLastName] = useState("");
  const [student_faculty, setStudentFaculty] = useState("");
  const [student_field, setStudentField] = useState("");
  const [student_curriculum, setStudentCurriculum] = useState("");
  const [student_year, setStudentYear] = useState("");
  const [student_gpa, setStudentGpa] = useState("");
  const [student_phone, setStudentPhone] = useState("");
  const [skills, setSkills] = useState([{ skill_name: "" }]);
  const [studentSkills, setStudentSkills] = useState([{ skill_level: "" }]);
  const [skillTypes, setSkillTypes] = useState([]);
  const [selectedSkillTypes, setSelectedSkillTypes] = useState([{ skill_type_id: "", skill_type_name: "" }]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchSkillTypes = async () => {
      try {
        const response = await fetch("/api/skillTypes");
        if (!response.ok) throw new Error("ไม่สามารถดึงข้อมูลประเภททักษะได้");
        const data = await response.json();
        setSkillTypes(data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลประเภททักษะ:", error);
      }
    };
    fetchSkillTypes();
  }, []);

  const handleSkillTypesChange = (index, event) => {
    const selectedSkillType = skillTypes.find((skillType) => skillType.skill_type_name === event.target.value);
    const newSelectedSkillTypes = [...selectedSkillTypes];
    newSelectedSkillTypes[index] = { skill_type_id: selectedSkillType?.skill_type_id || "", skill_type_name: event.target.value };
    setSelectedSkillTypes(newSelectedSkillTypes);
  };

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...skills];
    newSkills[index][field] = value;
    setSkills(newSkills);
  };

  const handleStudentSkillChange = (index, field, value) => {
    const newStudentSkills = [...studentSkills];
    newStudentSkills[index][field] = value;
    setStudentSkills(newStudentSkills);
  };

  const addField = () => {
    setSkills([...skills, { skill_name: "" }]);
    setStudentSkills([...studentSkills, { skill_level: "" }]);
    setSelectedSkillTypes([...selectedSkillTypes, { skill_type_id: "", skill_type_name: "" }]);
  };

  // ฟังก์ชันสำหรับลบทักษะ
  const removeField = (index) => {
    setSkills(skills.filter((_, skillIndex) => skillIndex !== index));
    setStudentSkills(studentSkills.filter((_, skillIndex) => skillIndex !== index));
    setSelectedSkillTypes(selectedSkillTypes.filter((_, skillIndex) => skillIndex !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!student_id || !student_firstname || !student_lastname || !student_faculty || !student_field || !student_curriculum || !student_year || !student_gpa || !student_phone) {
      setError("Please complete all inputs!");
      return;
    } else {
      try {
        const res = await fetch("/api/student", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: session.user.id,
            student_id,
            student_firstname,
            student_lastname,
            student_faculty,
            student_field,
            student_curriculum,
            student_year,
            student_gpa,
            student_phone,
            skills,
            selectedSkillTypes,
            studentSkills,
          }),
        });

        if (res.ok) {
          const form = e.target;
          setError("");
          setSuccess("Student registration successfully!");
          form.reset();
          router.refresh();
          router.push("/welcome");
        } else {
          console.log("student registration failed");
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  return (
<<<<<<< HEAD
    <div>
      <Navber />
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md mt-10">
        <h3 className="text-2xl font-bold mb-6 text-center">Profile Page</h3>
=======
    <>
      <Navber session = {session}/>
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-400 p-6 flex flex-col items-center justify-center">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-8">
        <h3 className="text-3xl font-bold mb-6 text-center text-gray-700">โปรไฟล์นักศึกษา</h3>
>>>>>>> origin/New_P

        {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-600 p-2 rounded mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input onChange={(e) => setStudentID(e.target.value)} type="number" placeholder="รหัสนิสิต" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input onChange={(e) => setStudentFirstName(e.target.value)} type="text" placeholder="ชื่อ" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input onChange={(e) => setStudentLastName(e.target.value)} type="text" placeholder="นามสกุล" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input onChange={(e) => setStudentFaculty(e.target.value)} type="text" placeholder="คณะ" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input onChange={(e) => setStudentField(e.target.value)} type="text" placeholder="สาขา" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input onChange={(e) => setStudentCurriculum(e.target.value)} type="text" placeholder="หลักสูตร" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input onChange={(e) => setStudentYear(e.target.value)} type="number" placeholder="ชั้นปี" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input onChange={(e) => setStudentGpa(e.target.value)} type="number" step="0.01" placeholder="เกรดเฉลี่ย GPA" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input onChange={(e) => setStudentPhone(e.target.value)} type="number" placeholder="เบอร์โทร" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <div className="space-y-4">
            <label className="block text-gray-700 font-medium">ทักษะ</label>
            {skills.map((skill, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md shadow-sm relative">
                <button
                  type="button"
                  onClick={() => removeField(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 "
                >
                  ลบทักษะ
                </button>
                <label className="block text-gray-600">ประเภททักษะ</label>
                <select
                  value={selectedSkillTypes[index]?.skill_type_name || ""}
                  onChange={(e) => handleSkillTypesChange(index, e)}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">เลือกประเภททักษะ</option>
                  {skillTypes.map((skillType, idx) => (
                    <option key={idx} value={skillType.skill_type_name}>
                      {skillType.skill_type_name}
                    </option>
                  ))}
                </select>

                <label className="block text-gray-600 mt-2">ชื่อทักษะ</label>
                <input
                  type="text"
                  value={skill.skill_name}
                  onChange={(e) => handleSkillChange(index, "skill_name", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label className="block text-gray-600 mt-2">ระดับทักษะ</label>
                <input
                  type="number"
                  value={studentSkills[index]?.skill_level || ""}
                  onChange={(e) => handleStudentSkillChange(index, "skill_level", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addField}
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300"
            >
              เพิ่มทักษะ
            </button>
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300">
            บันทึก
          </button>
        </form>
      </div>
    </div>
    </>
  );
}

export default StudentForm;
