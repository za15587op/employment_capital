"use client";
import React, { useState , useEffect} from "react";
import Navber from "@/app/components/Navber";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // Import useSession to get session data

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
  const [selectedSkillTypes, setSelectedSkillTypes] = useState([
    { skill_type_id: "", skill_type_name: "" },
  ]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  useEffect(() => {
    const fetchSkillTypes = async () => {
      try {
        const response = await fetch("/api/skillTypes");
        if (!response.ok) {
          throw new Error("ไม่สามารถดึงข้อมูลประเภททักษะได้");
        }
        const data = await response.json();
        setSkillTypes(data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลประเภททักษะ:", error);
      }
    };
    fetchSkillTypes();
  }, []);

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

  const addField = () => {
    setSkills([...skills, { skill_name: "" }]);
    setStudentSkills([...studentSkills, { skill_level: "" }]);
    setSelectedSkillTypes([
      ...selectedSkillTypes,
      { skill_type_id: "", skill_type_name: "" },
    ]);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !student_id ||
      !student_firstname ||
      !student_lastname ||
      !student_faculty ||
      !student_field ||
      !student_curriculum ||
      !student_year ||
      !student_gpa ||
      !student_phone
    ) {
      setError("Please complete all  inputs!");
      return;
    } else {
      try {
        const res = await fetch("http://localhost:3000/api/student", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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

        console.log(res.body,"body");
        

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
    <div>
      <Navber />
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md mt-10">
        <h3 className="text-2xl font-bold mb-6 text-center">โปรไฟล์ Page</h3>

        {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-600 p-2 rounded mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            onChange={(e) => setStudentID(e.target.value)}
            type="number"
            placeholder="รหัสนิสิต"
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            onChange={(e) => setStudentFirstName(e.target.value)}
            type="text"
            placeholder="ชื่อ"
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            onChange={(e) => setStudentLastName(e.target.value)}
            type="text"
            placeholder="นามสกุล"
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            onChange={(e) => setStudentFaculty(e.target.value)}
            type="text"
            placeholder="คณะ"
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            onChange={(e) => setStudentField(e.target.value)}
            type="text"
            placeholder="สาขา"
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            onChange={(e) => setStudentCurriculum(e.target.value)}
            type="text"
            placeholder="หลักสูตร"
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            onChange={(e) => setStudentYear(e.target.value)}
            type="number"
            placeholder="ชั้นปี"
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            onChange={(e) => setStudentGpa(e.target.value)}
            type="number"
            step="0.01"
            placeholder="เกรดเฉลี่ย GPA"
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            onChange={(e) => setStudentPhone(e.target.value)}
            type="number"
            placeholder="เบอร์โทร"
            className="w-full p-3 border border-gray-300 rounded-md"
          />

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

          <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600">
          บันทึก
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;
