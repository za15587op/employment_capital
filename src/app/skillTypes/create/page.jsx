"use client";
import React, { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

function SkillTypesForm() {
  const [skill_type_name, setSkillTypeName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!skill_type_name) {
      setError("Please complete all inputs!");
      return;
    } else {
      try {
        const res = await fetch(`http://10.120.1.109:11150/api/skillTypes`, {
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
          router.push(`http://10.120.1.109:11150/skillTypes`);
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
      <Navbar session={session}/>
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md mt-10">
        <h3 className="text-2xl font-bold mb-6 text-center">เพิ่มประเภททักษะ</h3>

        {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-600 p-2 rounded mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            onChange={(e) => setSkillTypeName(e.target.value)}
            type="text"
            placeholder="ชื่อประเภททักษะ"
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600">
          บันทึก
          </button>
        </form>
      </div>
    </div>
  );
}

export default SkillTypesForm;
