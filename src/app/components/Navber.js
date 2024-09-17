"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function Navber({ session }) {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const [student, setStudent] = useState(null); // State to store student info
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      if (sessionData?.user?.student_id) {
        try {
          const res = await fetch(`/api/student/${sessionData.user.student_id}`, {
            method: "GET",
            cache: "no-store",
          });
          if (res.ok) {
            const data = await res.json();
            setStudent(data); // Store student info in state
            console.log("Fetched student data:", data);
          } else {
            setError("Failed to fetch student data");
          }
        } catch (error) {
          setError("An error occurred while fetching student data");
        }
      }
    };

    fetchStudent();
  }, [sessionData]);

  const handleProfileClick = () => {
    if (student?.student_id) {
      router.push(`/student/edit/${student.student_id}`);
    }
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-white font-bold text-xl">
          <Link href="/">NextAuth</Link>
        </div>
        <ul className="flex space-x-4">
          {status === "loading" ? (
            <li className="text-white">Loading...</li>
          ) : !sessionData ? (
            <>
              <li>
                <Link href="/login" className="text-white hover:text-gray-200 transition duration-300">
                  เข้าสู่ระบบ
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-white hover:text-gray-200 transition duration-300">
                  สมัครสมาชิก
                </Link>
              </li>
            </>
          ) : (
            <>
            <li>
                <Link href="/welcome/showStudentScholarships" className="text-white hover:text-gray-200 transition duration-300">
                  ติดตามผลการสมัคร
                </Link>
              </li>
              <li>
                <button
                  onClick={handleProfileClick}
                  className="text-white hover:text-gray-200 transition duration-300 focus:outline-none"
                >
                  โปรไฟล์
                </button>
              </li>
              <li>
                <Link href="/welcome" className="text-white hover:text-gray-200 transition duration-300">
                  สมัครทุน
                </Link>
              </li>
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
