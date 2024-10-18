"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Foter from "@/app/components/Foter";
import { useSession } from "next-auth/react";

function EditStudentPage({ params }) {
  const { data: session, status } = useSession();
  const { id: student_id } = params;
  const [postData, setPostData] = useState({});
  const router = useRouter();
  const [success, setSuccess] = useState(false); // Success state for notification
  // Student information
  const [studentID, setStudentID] = useState("");
  const [studentFirstName, setStudentFirstName] = useState("");
  const [studentLastName, setStudentLastName] = useState("");
  const [studentFaculty, setStudentFaculty] = useState("");
  const [studentField, setStudentField] = useState("");
  const [studentCurriculum, setStudentCurriculum] = useState("");
  const [studentYear, setStudentYear] = useState("");
  const [studentGpa, setStudentGpa] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [join_org, setJoinOrg] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Skills information
  const [skills, setSkills] = useState([{ skill_name: "" }]);
  const [studentSkills, setStudentSkills] = useState([{ skill_level: "" }]);
  const [skillTypes, setSkillTypes] = useState([]);
  const [selectedSkillTypes, setSelectedSkillTypes] = useState([
    { skill_type_id: "", skill_type_name: "" },
  ]);

  const organizations = [
    "ฝ่ายการคลังและบริหารสินทรัพย์",
    "สำนักงานวิทยาเขตพัทลุง",
    "สำนักงานวิทยาเขตสงขลา",
    "ฝ่ายยุทธศาสตร์และพัฒนาคุณภาพองค์กร",
    "ฝ่ายกิจการนิสิต",
    "งานสื่อสารองค์กร",
    "สถาบันทรัพยากรการเรียนรู้และเทคโนโลยีดิจิทัล",
    "ฝ่ายวิชาการและการเรียนรู้",
    "คณะวิทยาศาสตร์และนวัตกรรมดิจิทัล",
    "คณะวิศวกรรมศาสตร์",
    "คณะเทคโนโลยีและการพัฒนาชุมชน",
    "คณะพยาบาลศาสตร์",
    "คณะวิทยาการสุขภาพและการกีฬา",
    "คณะนิติศาสตร์",
    "คณะอุตสาหกรรมเกษตรและชีวภาพ",
    "คณะศึกษาศาสตร์",
  ];

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [status, session, router]);
  // Fetch skill types from API
  const fetchSkillTypes = async () => {
    try {
      const res = await fetch(`http://10.120.1.109:11150/api/skillTypes`);
      if (!res.ok) {
        throw new Error("Failed to fetch skill types");
      }
      const data = await res.json();
      setSkillTypes(data);
    } catch (error) {
      console.error("Error fetching skill types:", error);
    }
  };

  // Fetch student data by ID
  const getDataById = async (student_id) => {
    try {
      const res = await fetch(
        `http://10.120.1.109:11150/api/student/${student_id}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
      setPostData(data);
      console.log(data);

      // Set fetched data into state
      setStudentID(data.student_id || "");
      setStudentFirstName(data.student_firstname || "");
      setStudentLastName(data.student_lastname || "");
      setStudentFaculty(data.student_faculty || "");
      setStudentCurriculum(data.student_curriculum || "");
      setStudentYear(data.student_year || "");
      setStudentGpa(data.student_gpa || "");
      setStudentPhone(data.student_phone || "");
      setJoinOrg(data.join_org || "");

      // Set skills and types
      setSkills(data.skills || [{ skill_name: "" }]);
      setStudentSkills(data.studentSkills || [{ skill_level: "" }]);
      setSelectedSkillTypes(
        data.selectedSkillTypes || [{ skill_type_id: "", skill_type_name: "" }]
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (student_id) {
      getDataById(student_id);
      fetchSkillTypes();
    }
  }, [student_id]);

  const handleOrgChange = (event) => {
    setJoinOrg(event.target.value);
  };


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

  const removeField = (index) => {
    setSkills(skills.filter((_, skillIndex) => skillIndex !== index));
    setStudentSkills(
      studentSkills.filter((_, skillIndex) => skillIndex !== index)
    );
    setSelectedSkillTypes(
      selectedSkillTypes.filter((_, skillIndex) => skillIndex !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://10.120.1.109:11150/api/student/${student_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_id: studentID,
            student_firstname: studentFirstName,
            student_lastname: studentLastName,
            student_faculty: studentFaculty,
            student_curriculum: studentCurriculum,
            student_year: studentYear,
            student_gpa: studentGpa,
            student_phone: studentPhone,
            join_org: join_org,
            skills,
            selectedSkillTypes,
            studentSkills,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update");
      }

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        router.push(`http://10.120.1.109:11150/welcome`);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Background starts from the top and covers the whole page */}
      <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-500 via-blue-300 to-gray-100 overflow-hidden">
        <Navbar session={session} />
        <div className="แถบสี"></div>
        <div className="relative min-h-screen p-6 flex flex-col items-center justify-center">
          <div className="max-w-3xl w-full bg-white shadow-2xl rounded-3xl p-10 border-4 border-blue-400 bg-opacity-80 backdrop-blur-lg transform transition-all">
            <h3 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
              แก้ไขข้อมูลส่วนตัว
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">รหัสนิสิต</label>
                <input
                  onChange={(e) => setStudentID(e.target.value)}
                  type="number"
                  placeholder="รหัสนิสิต"
                  value={studentID}
                  className="w-full p-4 border-2 border-blue-400 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-md bg-white bg-opacity-70 text-gray-800"
                />
              </div>

              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">ชื่อ</label>
                <input
                  onChange={(e) => setStudentFirstName(e.target.value)}
                  type="text"
                  placeholder="ชื่อ"
                  value={studentFirstName}
                  className="w-full p-4 border-2 border-blue-400 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-md bg-white bg-opacity-70 text-gray-800"
                />
              </div>

              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">นามสกุล</label>
                <input
                  onChange={(e) => setStudentLastName(e.target.value)}
                  type="text"
                  placeholder="นามสกุล"
                  value={studentLastName}
                  className="w-full p-4 border-2 border-blue-400 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-md bg-white bg-opacity-70 text-gray-800"
                />
              </div>

              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">คณะ</label>
                <input
                  onChange={(e) => setStudentFaculty(e.target.value)}
                  type="text"
                  placeholder="คณะ"
                  value={studentFaculty}
                  className="w-full p-4 border-2 border-blue-400 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-md bg-white bg-opacity-70 text-gray-800"
                />
              </div>

              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">หลักสูตร</label>
                <input
                  onChange={(e) => setStudentCurriculum(e.target.value)}
                  type="text"
                  placeholder="หลักสูตร"
                  value={studentCurriculum}
                  className="w-full p-4 border-2 border-blue-400 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-md bg-white bg-opacity-70 text-gray-800"
                />
              </div>

              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">ชั้นปี</label>
                <input
                  onChange={(e) => setStudentYear(e.target.value)}
                  type="number"
                  placeholder="ชั้นปี"
                  value={studentYear}
                  className="w-full p-4 border-2 border-blue-400 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-md bg-white bg-opacity-70 text-gray-800"
                />
              </div>

              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">เกรดเฉลี่ย GPA (สะสม)</label>
                <input
                  onChange={(e) => setStudentGpa(e.target.value)}
                  type="number"
                  step="0.01"
                  placeholder="เกรดเฉลี่ย GPA"
                  value={studentGpa}
                  className="w-full p-4 border-2 border-blue-400 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-md bg-white bg-opacity-70 text-gray-800"
                />
              </div>

              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">เบอร์โทร</label>
                <input
                  onChange={(e) => setStudentPhone(e.target.value)}
                  type="tel"
                  placeholder="เบอร์โทร"
                  value={studentPhone}
                  className="w-full p-4 border-2 border-blue-400 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-md bg-white bg-opacity-70 text-gray-800"
                />
              </div>

              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">หน่วยงานที่อยากเข้าร่วม</label>
                <select
                  value={join_org}
                  onChange={handleOrgChange}
                  className="w-full p-4 border-2 border-blue-400 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-md bg-white bg-opacity-70 text-gray-800"
                >
                  <option value="">เลือกหน่วยงานที่อยากเข้าร่วม</option>
                  {organizations.map((org, index) => (
                    <option key={index} value={org}>
                      {org}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-4">
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-bold mb-1">ทักษะ</label>
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="relative bg-white bg-opacity-70 p-4 rounded-xl shadow-md border-2 border-blue-400"
                    >
                      <button
                        type="button"
                        onClick={() => removeField(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        ลบทักษะ
                      </button>
                      <label className="block text-gray-700 text-sm font-bold mb-1">ประเภททักษะ</label>
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

                      <label className="block text-gray-700 text-sm font-bold mb-1">
                        ชื่อทักษะ
                      </label>
                      <input
                        type="text"
                        value={skill.skill_name}
                        onChange={(e) =>
                          handleSkillChange(index, "skill_name", e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />

                      <label className="block text-gray-700 text-sm font-bold mb-1">
                        ระดับทักษะ
                      </label>
                      <select
                        value={studentSkills[index]?.skill_level || ""}
                        onChange={(e) =>
                          handleStudentSkillChange(
                            index,
                            "skill_level",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addField}
                  className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300"
                >
                  เพิ่มทักษะ
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300"
              >
                บันทึก
              </button>
            </form>
          </div>

          {/* Success notification */}
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
                  การแก้ไขข้อมูลสำเร็จ!
                </div>
              </div>
              <p className="mt-4 text-lg text-white opacity-90 drop-shadow-md">
                ข้อมูลของคุณได้รับการแก้ไขเรียบร้อยแล้ว
                ระบบจะนำคุณไปยังหน้าอื่นในไม่ช้า...
              </p>
            </div>
          )}
        </div>
        <Foter />
      </div>
    </>
  );
}

export default EditStudentPage;
