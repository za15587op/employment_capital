"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function EditStudentPage({ params }) {
  const { id: student_id } = params;
  const [postData, setPostData] = useState({});
  const router = useRouter();

  const [newstudent_id, setNewStudentID] = useState("");
  const [newstudent_firstname, setNewStudentFirstName] = useState("");
  const [newstudent_lastname, setNewStudentLastName] = useState("");
  const [newstudent_faculty, setNewStudentFaculty] = useState("");
  const [newstudent_field, setNewStudentField] = useState("");
  const [newstudent_curriculum, setNewStudentCurriculum] = useState("");
  const [newstudent_year, setNewStudentYear] = useState("");
  const [newstudent_gpa, setNewStudentGpa] = useState("");
  const [newstudent_phone, setNewStudentPhone] = useState("");

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

      setNewStudentID(data.student_id || "");
      setNewStudentFirstName(data.student_firstname || "");
      setNewStudentLastName(data.student_lastname || "");
      setNewStudentFaculty(data.student_faculty || "");
      setNewStudentField(data.student_field || "");
      setNewStudentCurriculum(data.student_curriculum || "");
      setNewStudentYear(data.student_year || "");
      setNewStudentGpa(data.student_gpa || "");
      setNewStudentPhone(data.student_phone || "");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (student_id) {
      getDataById(student_id);
    }
  }, [student_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/api/student/${student_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newstudent_id,
          newstudent_firstname,
          newstudent_lastname,
          newstudent_faculty,
          newstudent_field,
          newstudent_curriculum,
          newstudent_year,
          newstudent_gpa,
          newstudent_phone,
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
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h3 className="text-2xl font-bold mb-6 text-center">Edit Student</h3>
      {student_id && <div className="text-center mb-4 text-gray-600">Editing Student ID: {student_id}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          onChange={(e) => setNewStudentID(e.target.value)}
          type="number"
          placeholder="รหัสนิสิต"
          value={newstudent_id}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <input
          onChange={(e) => setNewStudentFirstName(e.target.value)}
          type="text"
          placeholder="ชื่อ"
          value={newstudent_firstname}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <input
          onChange={(e) => setNewStudentLastName(e.target.value)}
          type="text"
          placeholder="นามสกุล"
          value={newstudent_lastname}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <input
          onChange={(e) => setNewStudentFaculty(e.target.value)}
          type="text"
          placeholder="คณะ"
          value={newstudent_faculty}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <input
          onChange={(e) => setNewStudentField(e.target.value)}
          type="text"
          placeholder="สาขา"
          value={newstudent_field}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <input
          onChange={(e) => setNewStudentCurriculum(e.target.value)}
          type="text"
          placeholder="หลักสูตร"
          value={newstudent_curriculum}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <input
          onChange={(e) => setNewStudentYear(e.target.value)}
          type="number"
          placeholder="ชั้นปี"
          value={newstudent_year}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <input
          onChange={(e) => setNewStudentGpa(e.target.value)}
          type="number"
          step="0.01"
          placeholder="เกรดเฉลี่ย GPA"
          value={newstudent_gpa}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <input
          onChange={(e) => setNewStudentPhone(e.target.value)}
          type="tel"
          placeholder="เบอร์โทร"
          value={newstudent_phone}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        
        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600">
          บันทึก
        </button>
      </form>
    </div>
  );
}

export default EditStudentPage;
