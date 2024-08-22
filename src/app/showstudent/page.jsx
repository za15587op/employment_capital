"use client"
import React, { useEffect, useState } from 'react';
import Navber from '../components/Navber';
import { useRouter } from 'next/navigation';

function ShowStudent() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");


  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/student');
        if (res.ok) {
          const data = await res.json();

        console.log("Fetched data:", data);

        setStudents(data);
        } else {
          setError('Failed to fetch student data');
        }
      } catch (error) {
        setError('An error occurred while fetching student data');
      }
    };

    fetchStudents();
  }, []);


  const handleUpdate = (id) => {
    router.push(`/update-student?id=${id}`);
  };


  return (
    <div>
      <Navber />
      <div>
        <h3>Student List</h3>
        {error && <div>{error}</div>}
        <ul>
          {students.map((student) => (
            <li key={student.id} onClick={() => handleUpdate(student.id)}>
              {student.student_firstname} {student.student_lastname} - {student.student_email}
            </li>
          ))}
            {/* <button key={student.student_id} onClick={() => handleUpdate(student.student_id)}>edit</button> */}
        </ul>
      </div>
    </div>
  );
}

export default ShowStudent;
