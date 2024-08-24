"use client"
import React, { useState, useEffect } from 'react';
import Navber from '@/app/components/Navber';
import { useSession } from "next-auth/react";


function StudentForm() { // ถ้ามี student ให้ถือว่าเป็นการแก้ไข
  const [student_id, setStudentID] = useState("");
  const [student_firstname, setStudentFirstName] = useState("");
  const [student_lastname, setStudentLastName] = useState("");
  const [student_faculty, setStudentFaculty] = useState("");
  const [student_field, setStudentField] = useState("");
  const [student_curriculum, setStudentCurriculum] = useState("");
  const [student_year, setStudentYear] = useState("");
  const [student_email, setStudentEmail] = useState("");
  const [student_phone, setStudentPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { data: session } = useSession();
  // if (session) router.replace("/welcome");

  const handleSubmit = async (e) => {
    e.preventDefault();

   if (!student_id || !student_firstname || !student_lastname || !student_faculty || !student_field || !student_curriculum || !student_year || !student_email || !student_phone) {
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
            student_id,
            student_firstname,
            student_lastname,
            student_faculty,
            student_field,
            student_curriculum,
            student_year,
            student_email,
            student_phone,
          }),
        });

        if (res.ok) {
          const form = e.target;
          setError("");
          setSuccess("User registration successfully!");
          form.reset();
        } else {
          console.log("User registration failed");
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  return (
    <div>
      <Navber />
      <div>
        <form onSubmit={handleSubmit}>
          {error && <div>{error}</div>}
          {success && <div>{success}</div>}
          <h3>Resgister Page</h3>
          <input
            onChange={(e) => setStudentID(e.target.value)}
            type="number"
            placeholder="Enter your name"
          />
          <input
            onChange={(e) => setStudentFirstName(e.target.value)}
            type="name"
            placeholder="Enter your name"
          />
          <input
            onChange={(e) => setStudentLastName(e.target.value)}
            type="name"
            placeholder="Enter your name"
          />
          <input
            onChange={(e) => setStudentFaculty(e.target.value)}
            type="name"
            placeholder="Enter your Faculty"
          />
          <input
            onChange={(e) => setStudentField(e.target.value)}
            type="name"
            placeholder="Enter your Field"
          />
          <input
            onChange={(e) => setStudentCurriculum(e.target.value)}
            type="name"
            placeholder="Enter your Curriculum"
          />
          <input
            onChange={(e) => setStudentYear(e.target.value)}
            type="number"
            placeholder="Enter your Year"
          />
          <input
            onChange={(e) => setStudentEmail(e.target.value)}
            type="email"
            placeholder="Confirm your email"
          />
          <input
            onChange={(e) => setStudentPhone(e.target.value)}
            type="number"
            placeholder="Confirm your phone"
          />

          <button type="submit">submit</button>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;
