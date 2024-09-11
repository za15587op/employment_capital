"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function EditSkillTypePage({ params }) {
  const { id: skill_type_id } = params;
  const [postData, setPostData] = useState({});
  const router = useRouter();

  // ตั้งค่า state ด้วยข้อมูลที่ดึงมา
  const [newskill_type_name, setNewSkillTypeName] = useState("");

  const getDataById = async (skill_type_id) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/skillTypes/${skill_type_id}`,
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
      const res = await fetch(
        `http://localhost:3000/api/skillTypes/${skill_type_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newskill_type_name,
          }),
        }
      );

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
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h3 className="text-2xl font-bold mb-6 text-center">แก้ไขประเภททักษะ</h3>
      {skill_type_id && (
        <div className="text-center mb-4 text-gray-600">
          Editing Skill Type ID: {skill_type_id}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          onChange={(e) => setNewSkillTypeName(e.target.value)}
          type="text"
          value={newskill_type_name}
          placeholder="ชื่อประเภททักษะ"
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
        >
          บันทึก
        </button>
      </form>
    </div>
  );
}

export default EditSkillTypePage;
