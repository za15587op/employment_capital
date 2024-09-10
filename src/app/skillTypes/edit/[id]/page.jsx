"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function EditStudentPage({ params }) {
  const { id: skill_type_id } = params;
  const [postData, setPostData] = useState({});
  const router = useRouter();

  // ตั้งค่า state ด้วยข้อมูลที่ดึงมา
  const [newskill_type_name, setNewSkillTypeName] = useState("");

  const getDataById = async (skill_type_id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/skillTypes/${skill_type_id}`, {
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
      setNewSkillTypeName(data.skill_type_name || "");

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (skill_type_id) {
      getDataById(skill_type_id);
    }
  }, [skill_type_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/api/skillTypes/${skill_type_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            newskill_type_name
        }),
      });

      if (!res.ok) {
        throw new Error("Fail to update");
      }

      router.refresh();
    router.push("/skillTypes");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h3>Edit Student Page</h3>
      {skill_type_id && <div>Editing Student ID: {skill_type_id}</div>}
      <form onSubmit={handleSubmit}>
        <input
            onChange={(e) => setNewSkillTypeName(e.target.value)}
            type="text"
            value={newskill_type_name}
            placeholder="Enter your Skill Types Name"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default EditStudentPage;
