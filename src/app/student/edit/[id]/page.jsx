"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function EditStudentPage({ params }) {
  const { id: std_id } = params;
  const [postData, setPostData] = useState({});
  const router = useRouter();

  // ตั้งค่า state ด้วยข้อมูลที่ดึงมา
  const [newstudent_id, setNewStudentID] = useState("");
  const [newstudent_firstname, setNewStudentFirstName] = useState("");
  const [newstudent_lastname, setNewStudentLastName] = useState("");
  const [newstudent_faculty, setNewStudentFaculty] = useState("");
  const [newstudent_field, setNewStudentField] = useState("");
  const [newstudent_curriculum, setNewStudentCurriculum] = useState("");
  const [newstudent_year, setNewStudentYear] = useState("");
  const [newstudent_gpa, setNewStudentGpa] = useState("");
  const [newstudent_phone, setNewStudentPhone] = useState("");

  const getDataById = async (std_id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/student/${std_id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
      console.log(data, "data");
      setPostData(data);

      // ตั้งค่า state ด้วยข้อมูลที่ดึงมา
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
    if (std_id) {
      getDataById(std_id);
    }
  }, [std_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/api/student/${std_id}`, {
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
      router.push("/student/show");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h3>Edit Student Page</h3>
      {std_id && <div>Editing Student ID: {std_id}</div>}
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setNewStudentID(e.target.value)}
          type="number"
          placeholder={"Student ID"}
          value={newstudent_id}
        />
        <input
          onChange={(e) => setNewStudentFirstName(e.target.value)}
          type="text"
          placeholder={"First Name"}
          value={newstudent_firstname}
        />
        <input
          onChange={(e) => setNewStudentLastName(e.target.value)}
          type="text"
          placeholder={"Last Name"}
          value={newstudent_lastname}
        />
        <input
          onChange={(e) => setNewStudentFaculty(e.target.value)}
          type="text"
          placeholder={"Faculty"}
          value={newstudent_faculty}
        />
        <input
          onChange={(e) => setNewStudentField(e.target.value)}
          type="text"
          placeholder={"Field"}
          value={newstudent_field}
        />
        <input
          onChange={(e) => setNewStudentCurriculum(e.target.value)}
          type="text"
          placeholder={"Curriculum"}
          value={newstudent_curriculum}
        />
        <input
          onChange={(e) => setNewStudentYear(e.target.value)}
          type="number"
          placeholder={"Year"}
          value={newstudent_year}
        />
        <input
          onChange={(e) => setNewStudentGpa(e.target.value)}
          type="float"
          placeholder={"Email"}
          value={newstudent_gpa}
        />
        <input
          onChange={(e) => setNewStudentPhone(e.target.value)}
          type="tel"
          placeholder={"Phone"}
          value={newstudent_phone}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default EditStudentPage;
