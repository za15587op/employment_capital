"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navber from "@/app/components/Navber";

function EditStudentPage({ params }) {
  const { id: student_id } = params;
  const [postData, setPostData] = useState({});
  const router = useRouter();

  // ข้อมูลนักศึกษา
  const [studentID, setStudentID] = useState("");
  const [studentFirstName, setStudentFirstName] = useState("");
  const [studentLastName, setStudentLastName] = useState("");
  const [studentFaculty, setStudentFaculty] = useState("");
  const [studentField, setStudentField] = useState("");
  const [studentCurriculum, setStudentCurriculum] = useState("");
  const [studentYear, setStudentYear] = useState("");
  const [studentGpa, setStudentGpa] = useState("");
  const [studentPhone, setStudentPhone] = useState("");

  // ข้อมูลทักษะ
  const [skills, setSkills] = useState([{ skill_name: "" }]);
  const [studentSkills, setStudentSkills] = useState([{ skill_level: "" }]);
  const [skillTypes, setSkillTypes] = useState([]);
  const [selectedSkillTypes, setSelectedSkillTypes] = useState([{ skill_type_id: "", skill_type_name: "" }]);

  // ดึงข้อมูลทักษะทั้งหมดจาก API
  const fetchSkillTypes = async () => {
    try {
      const res = await fetch("/api/skillTypes");
      if (!res.ok) {
        throw new Error("Failed to fetch skill types");
      }
      const data = await res.json();
      setSkillTypes(data);
    } catch (error) {
      console.error("Error fetching skill types:", error);
    }
  };

  // ดึงข้อมูลนักศึกษาโดยใช้ student_id
  const getDataById = async (student_id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/student/${student_id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
      setPostData(data);

      // ตั้งค่า state ด้วยข้อมูลที่ดึงมา
      setStudentID(data.student_id || "");
      setStudentFirstName(data.student_firstname || "");
      setStudentLastName(data.student_lastname || "");
      setStudentFaculty(data.student_faculty || "");
      setStudentField(data.student_field || "");
      setStudentCurriculum(data.student_curriculum || "");
      setStudentYear(data.student_year || "");
      setStudentGpa(data.student_gpa || "");
      setStudentPhone(data.student_phone || "");

      // ตั้งค่าทักษะที่ดึงมา
      setSkills(data.skills || [{ skill_name: "" }]);
      setStudentSkills(data.studentSkills || [{ skill_level: "" }]);
      setSelectedSkillTypes(data.selectedSkillTypes || [{ skill_type_id: "", skill_type_name: "" }]);
    } catch (error) {
      console.log(error);
    }
  };

  // เมื่อ component ถูก mount
  useEffect(() => {
    if (student_id) {
      getDataById(student_id);
      fetchSkillTypes(); // ดึงประเภททักษะ
    }
  }, [student_id]);

  // จัดการการเปลี่ยนแปลงในประเภททักษะ
  const handleSkillTypesChange = (index, event) => {
    const selectedSkillType = skillTypes.find((skillType) => skillType.skill_type_name === event.target.value);

    const newSelectedSkillTypes = [...selectedSkillTypes];
    newSelectedSkillTypes[index] = {
      skill_type_id: selectedSkillType?.skill_type_id || "",
      skill_type_name: event.target.value,
    };
    setSelectedSkillTypes(newSelectedSkillTypes);
  };

  // จัดการการเปลี่ยนแปลงชื่อทักษะ
  const handleSkillChange = (index, field, value) => {
    const newSkills = [...skills];
    newSkills[index][field] = value;
    setSkills(newSkills);
  };

  // จัดการการเปลี่ยนแปลงระดับทักษะ
  const handleStudentSkillChange = (index, field, value) => {
    const newStudentSkills = [...studentSkills];
    newStudentSkills[index][field] = value;
    setStudentSkills(newStudentSkills);
  };

  // เพิ่มฟิลด์ทักษะใหม่
  const addField = () => {
    setSkills([...skills, { skill_name: "" }]);
    setStudentSkills([...studentSkills, { skill_level: "" }]);
    setSelectedSkillTypes([...selectedSkillTypes, { skill_type_id: "", skill_type_name: "" }]);
  };

  // ลบฟิลด์ทักษะ
  const removeField = (index) => {
    setSkills(skills.filter((_, skillIndex) => skillIndex !== index));
    setStudentSkills(studentSkills.filter((_, skillIndex) => skillIndex !== index));
    setSelectedSkillTypes(selectedSkillTypes.filter((_, skillIndex) => skillIndex !== index));
  };

  // ส่งข้อมูลเพื่อแก้ไข
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/api/student/${student_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: studentID,
          student_firstname: studentFirstName,
          student_lastname: studentLastName,
          student_faculty: studentFaculty,
          student_field: studentField,
          student_curriculum: studentCurriculum,
          student_year: studentYear,
          student_gpa: studentGpa,
          student_phone: studentPhone,
          skills,
          selectedSkillTypes,
          studentSkills,
        }),
      });

      if (!res.ok) {
        throw new Error("Fail to update");
      }

      router.refresh();
      router.push("/welcome");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <Navber />
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-400 p-6 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-md p-8">
        <h3 className="text-3xl font-bold text-center text-gray-700 mb-8">Edit Student</h3>
        {student_id && <div className="text-center text-gray-600 mb-4">Editing Student ID: {student_id}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            onChange={(e) => setStudentID(e.target.value)}
            type="number"
            placeholder="รหัสนิสิต"
            value={studentID}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            onChange={(e) => setStudentFirstName(e.target.value)}
            type="text"
            placeholder="ชื่อ"
            value={studentFirstName}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            onChange={(e) => setStudentLastName(e.target.value)}
            type="text"
            placeholder="นามสกุล"
            value={studentLastName}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            onChange={(e) => setStudentFaculty(e.target.value)}
            type="text"
            placeholder="คณะ"
            value={studentFaculty}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            onChange={(e) => setStudentField(e.target.value)}
            type="text"
            placeholder="สาขา"
            value={studentField}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            onChange={(e) => setStudentCurriculum(e.target.value)}
            type="text"
            placeholder="หลักสูตร"
            value={studentCurriculum}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            onChange={(e) => setStudentYear(e.target.value)}
            type="number"
            placeholder="ชั้นปี"
            value={studentYear}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            onChange={(e) => setStudentGpa(e.target.value)}
            type="number"
            step="0.01"
            placeholder="เกรดเฉลี่ย GPA"
            value={studentGpa}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            onChange={(e) => setStudentPhone(e.target.value)}
            type="tel"
            placeholder="เบอร์โทร"
            value={studentPhone}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <div className="space-y-4">
            <label className="block text-gray-700 font-medium">ทักษะ</label>
            {skills.map((skill, index) => (
              <div key={index} className="relative bg-gray-50 p-4 rounded-md shadow-md">
                <button
                  type="button"
                  onClick={() => removeField(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  ลบทักษะ
                </button>
                <label className="block text-gray-600">ประเภททักษะ</label>
                <select
                  value={selectedSkillTypes[index]?.skill_type_name || ""}
                  onChange={(e) => handleSkillTypesChange(index, e)}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                <label className="block text-gray-600 mt-2">ระดับทักษะ</label>
                <input
                  type="number"
                  value={studentSkills[index]?.skill_level || ""}
                  onChange={(e) => handleStudentSkillChange(index, "skill_level", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

export default EditStudentPage;
