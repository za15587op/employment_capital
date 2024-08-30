'use client';

import { useState, useEffect } from "react";

export default function ScholarshipRegistration() {
  const [skills, setSkills] = useState([{ skill_name: "", skill_type_name: "", skill_level: "" }]);
  const [formData, setFormData] = useState({
    student_firstname: "",
    student_lastname: "",
    student_year: "",
    student_curriculum: "",
    student_gpa: "",
    parttime: [],
    parttime_dates: [],
    related_works: [],
  });

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...skills];
    newSkills[index][field] = value;
    setSkills(newSkills);
  };

  const addSkillField = () => {
    setSkills([...skills, { skill_name: "", skill_type_name: "", skill_level: "" }]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        skills,
      }),
    });

    const result = await response.json();
    if (result.success) {
      alert('สมัครทุนการศึกษาสำเร็จ!');
    } else {
      alert('การสมัครทุนการศึกษาไม่สำเร็จ');
    }
  };

  return (
    <div>
      <h1>สมัครทุนการศึกษา</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="student_firstname">ชื่อ</label>
          <input
            type="text"
            id="student_firstname"
            value={formData.student_firstname}
            onChange={(e) => setFormData({ ...formData, student_firstname: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="student_lastname">นามสกุล</label>
          <input
            type="text"
            id="student_lastname"
            value={formData.student_lastname}
            onChange={(e) => setFormData({ ...formData, student_lastname: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="student_year">ชั้นปีที่เข้าเรียน</label>
          <input
            type="number"
            id="student_year"
            value={formData.student_year}
            onChange={(e) => setFormData({ ...formData, student_year: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="student_curriculum">หลักสูตร</label>
          <input
            type="text"
            id="student_curriculum"
            value={formData.student_curriculum}
            onChange={(e) => setFormData({ ...formData, student_curriculum: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="student_gpa">ผลการเรียน (GPA)</label>
          <input
            type="text"
            id="student_gpa"
            value={formData.student_gpa}
            onChange={(e) => setFormData({ ...formData, student_gpa: e.target.value })}
          />
        </div>
        <div>
          <label>ทักษะ</label>
          {skills.map((skill, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="ประเภททักษะ"
                value={skill.skill_type_name}
                onChange={(e) => handleSkillChange(index, "skill_type_name", e.target.value)}
              />
              <input
                type="text"
                placeholder="ชื่อทักษะ"
                value={skill.skill_name}
                onChange={(e) => handleSkillChange(index, "skill_name", e.target.value)}
              />
              <input
                type="number"
                placeholder="ระดับสกิล"
                value={skill.skill_level}
                onChange={(e) => handleSkillChange(index, "skill_level", e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={addSkillField}>
            เพิ่มทักษะ
          </button>
        </div>
        <div>
          <label htmlFor="parttime">เวลาในการปฏิบัติงาน</label>
          <input
            type="text"
            id="parttime"
            value={formData.parttime}
            onChange={(e) => setFormData({ ...formData, parttime: e.target.value.split(",") })}
          />
        </div>
        <div>
          <label htmlFor="parttime_dates">วันที่ในการปฏิบัติงาน</label>
          <input
            type="text"
            id="parttime_dates"
            value={formData.parttime_dates}
            onChange={(e) => setFormData({ ...formData, parttime_dates: e.target.value.split(",") })}
          />
        </div>
        <div>
          <label htmlFor="related_works">ไฟล์ผลงานที่เกี่ยวข้อง</label>
          <input
            type="text"
            id="related_works"
            value={formData.related_works}
            onChange={(e) => setFormData({ ...formData, related_works: e.target.value.split(",") })}
          />
        </div>
        <button type="submit">สมัคร</button>
      </form>
    </div>
  );
}
