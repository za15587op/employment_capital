"use client"
import React, { useState, useEffect } from 'react';
import Navber from '../components/Navber';

function StudentForm({ student }) { // ถ้ามี student ให้ถือว่าเป็นการแก้ไข
  const [student_id, setStudentID] = useState(student ? student.student_id : "");
  const [student_firstname, setStudentFirstName] = useState(student ? student.student_firstname : "");
  const [student_lastname, setStudentLastName] = useState(student ? student.student_lastname : "");
  const [student_faculty, setStudentFaculty] = useState(student ? student.student_faculty : "");
  const [student_field, setStudentField] = useState(student ? student.student_field : "");
  const [student_curriculum, setStudentCurriculum] = useState(student ? student.student_curriculum : "");
  const [student_year, setStudentYear] = useState(student ? student.student_year : "");
  const [student_email, setStudentEmail] = useState(student ? student.student_email : "");
  const [student_phone, setStudentPhone] = useState(student ? student.student_phone : "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = student ? "PUT" : "POST"; // ถ้ามี student ให้ใช้ PUT สำหรับการแก้ไข

    try {
      const res = await fetch(`http://localhost:3000/api/student${student ? `/${student_id}` : ''}`, {
        method,
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
        setSuccess(student ? "User updated successfully!" : "User registered successfully!");
        form.reset();
      } else {
        setError(student ? "User update failed" : "User registration failed");
      }
    } catch (error) {
      console.log("error", error);
      setError(student ? "An error occurred during update." : "An error occurred during registration.");
    }
  };

  return (
    <div>
      <Navber />
      <div>
        <form onSubmit={handleSubmit}>
          {error && (<div>{error}</div>)}
          {success && (<div>{success}</div>)}
          
          <h3>{student ? "Update Student" : "Add Student"}</h3>
          <input
            value={student_id}
            onChange={(e) => setStudentID(e.target.value)}
            type="number"
            placeholder="Enter your Student ID"
          />
          <input
            value={student_firstname}
            onChange={(e) => setStudentFirstName(e.target.value)}
            type="name"
            placeholder="Enter your first name"
          />
          <input
            value={student_lastname}
            onChange={(e) => setStudentLastName(e.target.value)}
            type="name"
            placeholder="Enter your last name"
          />
          <input
            value={student_faculty}
            onChange={(e) => setStudentFaculty(e.target.value)}
            type="name"
            placeholder="Enter your Faculty"
          />
          <input
            value={student_field}
            onChange={(e) => setStudentField(e.target.value)}
            type="name"
            placeholder="Enter your Field"
          />
          <input
            value={student_curriculum}
            onChange={(e) => setStudentCurriculum(e.target.value)}
            type="name"
            placeholder="Enter your Curriculum"
          />
          <input
            value={student_year}
            onChange={(e) => setStudentYear(e.target.value)}
            type="number"
            placeholder="Enter your Year"
          />
          <input
            value={student_email}
            onChange={(e) => setStudentEmail(e.target.value)}
            type="email"
            placeholder="Confirm your Email"
          />
          <input
            value={student_phone}
            onChange={(e) => setStudentPhone(e.target.value)}
            type="number"
            placeholder="Confirm your Phone"
          />
          <button type="submit">{student ? "Update" : "Submit"}</button>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;
