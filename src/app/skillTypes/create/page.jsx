"use client"
import React, { useState, useEffect } from 'react';
import Navber from '@/app/components/Navber';
import { useRouter } from 'next/navigation';


function SkillTypesForm() { // ถ้ามี student ให้ถือว่าเป็นการแก้ไข
//   const [skill_type_id, setSkillTypeId] = useState("");
  const [skill_type_name, setSkillTypeName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

   if (!skill_type_name ) {
      setError("Please complete all  inputs!");
      return;
    } else {
      try {
        const res = await fetch("http://localhost:3000/api/skillTypes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skill_type_name
          }),
        });

        if (res.ok) {
          const form = e.target;
          setError("");
          setSuccess("เพิ่มข้อมูลประเภททักษะสำเร็จ");
          form.reset();
          router.refresh();
          router.push("/skillTypes");
        } else {
          console.log("เพิ่มข้อมูลประเภททักษะไม่สำเร็จ");
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
          <h3>Skill Types Page</h3>
          <input
            onChange={(e) => setSkillTypeName(e.target.value)}
            type="text"
            placeholder="Enter your Skill Types Name"
          />
          <button type="submit">submit</button>
        </form>
      </div>
    </div>
  );
}

export default SkillTypesForm;
