"use client";
import React, { useEffect, useState } from "react";
import Navber from "@/app/components/Navber";
import { useRouter } from "next/navigation";

function ShowSkillTypes() {
  const [skillTypes, setSkillTypes] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchSkillTypes = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/skillTypes");
        if (res.ok) {
          const data = await res.json();
          setSkillTypes(data);
        } else {
          setError("Failed to fetch Skill Types data");
        }
      } catch (error) {
        setError("An error occurred while fetching Skill Types data");
      }
    };

    fetchSkillTypes();
  }, []);

  const handleUpdate = (skill_type_id) => {
    router.push(`/skillTypes/edit/${skill_type_id}`);
  };

  const handleDelete = async (skill_type_id) => {
    const confirmed = confirm("Are you sure?");
    if (confirmed) {
      const res = await fetch(
        `http://localhost:3000/api/skillTypes/?skill_type_id=${skill_type_id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        window.location.reload();
      }
    }
  };

  return (
    <div>
      <Navber />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
        <h3 className="text-2xl font-bold mb-6 text-center">รายการประเภททักษะ</h3>
        {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4">{error}</div>}

        <table className="table-auto w-full bg-white border border-gray-300 shadow-md rounded-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3 text-left">ประเภททักษะ</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {skillTypes.map((skillType) => (
              <tr key={skillType.skill_type_id} className="border-t border-gray-300">
                <td className="p-3">{skillType.skill_type_name}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleUpdate(skillType.skill_type_id)}
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(skillType.skill_type_id)}
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ShowSkillTypes;
