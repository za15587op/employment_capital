"use client";
import React, { useEffect, useState } from 'react';
import Navber from '@/app/components/Navber';
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

  const handleUpdate = (std_id) => {
    router.push(`/student/edit/${std_id}`);
  };

  const handleDelete = async (std_id)=> {
    const confirmed = confirm("Are you sure ? "); 
    if (confirmed) {
        const res = await fetch(`http://localhost:3000/api/student/?std_id=${std_id}`,{
            method: "DELETE"
        })

        if (res.ok) {
            window.location.reload();
        }
    }
}

  return (
    <div>
    <Navber />
    <div>
      <h3>Student List</h3>
      <a href='/welcome'>Profile</a>
      {error && <div>{error}</div>}
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            {/* <th>Email</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.std_id}>
              <td>{student.student_firstname}</td>
              <td>{student.student_lastname}</td>
              <td>
                <button onClick={() => handleUpdate(student.std_id)} className='m-2'>Edit</button>
                <button onClick={() => handleDelete(student.std_id)}className='m-2'>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
}

export default ShowStudent;
