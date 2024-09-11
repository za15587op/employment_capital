"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

function Navber({ session }) {

  // useEffect(() => {
  //   const fetchStudent = async () => {
  //     try {
  //       const res = await fetch(`http://localhost:3000/api/scholarships/${scholarship_id}`, {
  //         method: "GET",
  //         cache: "no-store",
  //       });
  //       if (res.ok) {
  //         const data = await res.json();
  //         console.log("Fetched data student:", data);
          
  //       } else {
  //         setError('Failed to fetch scholarships data');
  //       }
  //     } catch (error) {
  //       setError('An error occurred while fetching scholarships data');
  //     }
  //   };

  //   fetchStudent();
  // }, []);
    

  // const Profile = (student_id) => {
  //   router.push(`/student/${student_id}`);
  // };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-white font-bold text-xl">
          <Link href="/">NextAuth</Link>
        </div>
        <ul className="flex space-x-4">
          {!session ? (
            <>
              <li>
                <Link href="/login" className="text-white hover:text-gray-200 transition duration-300">เข้าสู่ระบบ</Link>
              </li>
              <li>
                <Link href="/register" className="text-white hover:text-gray-200 transition duration-300">สมัครสมาชิก</Link>
              </li>
            </>
          ) : (
            <>
              {/* <li onClick={Profile(student_id)}>
                
              </li> */}
              <li>
                <button
                  onClick={() => signOut()}
                  className="text-white hover:text-gray-200 transition duration-300 focus:outline-none"
                >
                  ออกจากระบบ
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navber;
