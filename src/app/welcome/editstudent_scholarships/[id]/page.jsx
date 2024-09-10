"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function EditStudentScholarship({ params }) {
  const { id: student_id } = params;

  const { data: session, status } = useSession();
  console.log(session, "session");
//   console.log(scholarship_id, "scholarship_id");

  const [skills, setSkills] = useState([{ skill_name: "" }]);
  const [studentSkills, setStudentSkills] = useState([{ skill_level: "" }]);
  const [scholarshipRegistrations, setScholarshipRegistrations] = useState([
    { is_parttime: "", is_parttimedate: "", related_works: "" },
  ]);
  const [skillTypes, setSkillTypes] = useState([]);
  const [selectedSkillTypes, setSelectedSkillTypes] = useState([
    { skill_type_id: "", skill_type_name: "" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch skill types
        const skillTypesResponse = await fetch("/api/skillTypes");
        const skillTypesData = await skillTypesResponse.json();
        setSkillTypes(skillTypesData);

        // Fetch existing scholarship registration data
        const Response = await fetch(`/api/student_scholarships/${student_id}`);
        const dataAll = await Response.json();
            console.log(dataAll,'dataAll');
            
        setSkills(dataAll.skills || [{ skill_name: "" }]);
        setStudentSkills(dataAll.skills || [{ skill_level: "" }]);
        setScholarshipRegistrations(dataAll.scholarshipRegistrations || [
          { is_parttime: "", is_parttimedate: "", related_works: "" },
        ]);
        setSelectedSkillTypes(dataAll.selectedSkillTypes || [
          { skill_type_id: "", skill_type_name: "" },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [student_id]);

  const handleSkillTypesChange = (index, event) => {
    const selectedSkillType = skillTypes.find(
      (skillType) => skillType.skill_type_name === event.target.value
    );

    const newSelectedSkillTypes = [...selectedSkillTypes];
    newSelectedSkillTypes[index] = {
      skill_type_id: selectedSkillType?.skill_type_id || "",
      skill_type_name: event.target.value,
    };
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

  const handleScholarshipRegistrationsChange = (index, field, value) => {
    const newScholarshipRegistrations = [...scholarshipRegistrations];
    newScholarshipRegistrations[index][field] = value;
    setScholarshipRegistrations(newScholarshipRegistrations);
  };

  const addField = () => {
    setSkills([...skills, { skill_name: "" }]);
    setStudentSkills([...studentSkills, { skill_level: "" }]);
    setSelectedSkillTypes([
      ...selectedSkillTypes,
      { skill_type_id: "", skill_type_name: "" },
    ]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedScholarshipRegistrations = scholarshipRegistrations.map(
      (registration) => ({
        ...registration,
        scholarship_id,
      })
    );

    try {
      const response = await fetch(`/api/student_scholarships/${scholarship_id}`, {
        method: "PUT", // Using PUT for updating
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: session.user.student_id,
          skills,
          scholarshipRegistrations: updatedScholarshipRegistrations,
          selectedSkillTypes,
          studentSkills,
        }),
      });

      if (!response.ok) {
        throw new Error("การส่งฟอร์มล้มเหลว");
      }

      const result = await response.json();

      if (result.success) {
        alert("แก้ไขข้อมูลทุนการศึกษาสำเร็จ!");
      } else {
        alert("การแก้ไขข้อมูลทุนการศึกษาไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("เกิดข้อผิดพลาดขณะส่งฟอร์ม");
    }
  };

  return (
    <div>
      {/* <Link href={`/welcome/showStudentScholarships/${scholarship_id}`}>
        สถานะการศึกษาทุน
      </Link> */}
      <h1>แก้ไขข้อมูลทุนการศึกษา</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ทักษะ</label>
          {skills.map((skill, index) => (
            <div key={index}>
              <label>ประเภททักษะ</label>
              <select
                value={selectedSkillTypes[index]?.skill_type_name || ""}
                onChange={(e) => handleSkillTypesChange(index, e)}
              >
                {skillTypes.map((skillType, idx) => (
                  <option key={idx} value={skillType.skill_type_name}>
                    {skillType.skill_type_name}
                  </option>
                ))}
              </select>

              <label>ชื่อทักษะ</label>
              <input
                type="text"
                value={skill.skill_name}
                onChange={(e) =>
                  handleSkillChange(index, "skill_name", e.target.value)
                }
              />
              <label>ระดับทักษะ</label>
              <input
                type="number"
                value={studentSkills[index]?.skill_level || ""}
                onChange={(e) =>
                  handleStudentSkillChange(index, "skill_level", e.target.value)
                }
              />
            </div>
          ))}
          <button type="button" onClick={addField}>
            เพิ่มทักษะ
          </button>
        </div>

        <label>ช่วงเวลา</label>
        {scholarshipRegistrations.map((scholarshipRegistration, index) => (
          <div key={index}>
            <label>เวลาที่สามารถทำงานได้</label>
            <input
              type="text"
              placeholder="เวลาที่สามารถทำงานได้"
              value={scholarshipRegistration.is_parttime}
              onChange={(e) =>
                handleScholarshipRegistrationsChange(
                  index,
                  "is_parttime",
                  e.target.value
                )
              }
            />
            <label>วันที่สามารถทำงานได้</label>
            <input
              type="text"
              placeholder="วันที่สามารถทำงานได้"
              value={scholarshipRegistration.is_parttimedate}
              onChange={(e) =>
                handleScholarshipRegistrationsChange(
                  index,
                  "is_parttimedate",
                  e.target.value
                )
              }
            />
            <label>ผลงานที่เกี่ยวข้อง</label>
            <input
              type="text"
              placeholder="ผลงานที่เกี่ยวข้อง"
              value={scholarshipRegistration.related_works}
              onChange={(e) =>
                handleScholarshipRegistrationsChange(
                  index,
                  "related_works",
                  e.target.value
                )
              }
            />
          </div>
        ))}
        <button type="submit">บันทึกการเปลี่ยนแปลง</button>
      </form>
    </div>
  );
}
