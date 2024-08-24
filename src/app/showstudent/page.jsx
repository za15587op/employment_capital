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
    router.push(`/student?id=${id}`);
  };


  return (
    <div>
      <Navber />
      <div>
        <h3>Student List</h3>
        {error && <div>{error}</div>}
        <div className="table-container">
      <table className="student-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
         
            <tr >
              <td>student.id</td>
              <td>student.name</td>
              <td>student.age</td>
              <td>student.email</td>
            </tr>

        </tbody>
      </table>

      <style jsx>{`
        .table-container {
          overflow-x: auto;
        }

        .student-table {
          width: 100%;
          border-collapse: collapse;
        }

        .student-table th, .student-table td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .student-table th {
          background-color: #f2f2f2;
        }

        .student-table tr:hover {
          background-color: #f1f1f1;
        }
      `}</style>
    </div>
      </div>
    </div>
  );
}

export default ShowStudent;
