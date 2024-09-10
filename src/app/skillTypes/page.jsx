"use client";
import React, { useEffect, useState } from 'react';
import Navber from '@/app/components/Navber';
import { useRouter } from 'next/navigation';


function ShowSkillTypes() {
  const [skillTypes, setSkillTypes] = useState([]);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchSkillTypes = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/skillTypes');
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched data:", data);
          setSkillTypes(data);
        } else {
          setError('Failed to fetch Skill Types data');
        }
      } catch (error) {
        setError('An error occurred while fetching Skill Types data');
      }
    };

    fetchSkillTypes();
  }, []);

  const handleUpdate = (skill_type_id) => {
    router.push(`/skillTypes/edit/${skill_type_id}`);
  };

  const handleDelete = async (skill_type_id)=> {
    const confirmed = confirm("Are you sure ? "); 
    if (confirmed) {
        const res = await fetch(`http://localhost:3000/api/skillTypes/?skill_type_id=${skill_type_id}`,{
            method: "DELETE"
        })

        if (res.ok) {
            window.location.reload();
        }
    }
}

  return (
    <div>
    <Navber/>
    <div>
      <h3>Skill Types List</h3>
      {/* <a href='/welcome'>Profile</a> */}
      {error && <div>{error}</div>}
      <table>
        <thead>
          <tr>
            <th>SkillTypesName</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody>
          {skillTypes.map((skillType) => (
            <tr key={skillType.skill_type_id}>
              <td>{skillType.skill_type_name}</td>
              <td>
                <button onClick={() => handleUpdate(skillType.skill_type_id)} className='m-2'>Edit</button>
                <button onClick={() => handleDelete(skillType.skill_type_id)}className='m-2'>Delete</button>
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
