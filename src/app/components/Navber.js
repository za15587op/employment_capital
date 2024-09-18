<<<<<<< HEAD
import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import Image from "next/image";

function Navber({ session }) {
=======
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

>>>>>>> origin/New_P
  return (
    <header className="header relative flex flex-col items-end">
      <div
        className="nav relative w-full h-[30px] to-[#0F1035] mt-[60px]"
      >
        <div className="logo absolute top-[50px] right-[30px] z-20">
          <Image src="/tsu.png" width={150} height={100} alt="logo" />
        </div>
<<<<<<< HEAD
      </div>
      <nav className="relative z-10 flex items-center justify-between p-4 bg-gray-800 w-full">
        <div
          className="absolute top-[-35px] left-0 flex items-center space-x-2 bg-[#0F1035] px-4 py-2 rounded-t-lg shadow-md"
          style={{
            clipPath: "polygon(0 0, 95% 0, 100% 100%, 0 100%)",
            zIndex: 10,
          }}
        >
          {!session ? (
            <button
              className="text-blue-500 bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100 "
              style={{ fontSize: "22px" }}
            >
              <Link href="/login">เข้าสู่ระบบ</Link>
            </button>
          ) : (
            <>
              <Link href="/scholarships">
=======
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
>>>>>>> origin/New_P
                <button
                  className="text-blue-500 bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                  style={{ fontSize: "20px" }}
                >
                  หน้าหลัก
                </button>
              </Link>
              <Link href="/organization">
                <button
                  className="text-blue-500 bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                  style={{ fontSize: "20px" }}
                >
                  เพิ่ม-แก้ไขข้อมูล
                </button>
              </Link>
              <Link href="/matching_admin">
                <button
                  className="text-blue-500 bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                  style={{ fontSize: "20px" }}
                >
                  ดูผลการจับคู่
                </button>
              </Link>
              <Link href="/report_admin">
                <button
                  className="text-blue-500 bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                  style={{ fontSize: "20px" }}
                >
                  ออกรายงาน
                </button>
              </Link>

              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex-grow flex justify-center items-center space-x-4">
                  <div className="text-center">
                    <Link href="/homeAdmin">
                      <button
                        className="text-blue-500 bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                        style={{ fontSize: "20px" }}
                      >
                        โปรไฟล์
                      </button>
                    </Link>
                  </div>
                  <div className="text-center">
                    <button
                      className="text-blue-500 bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                      style={{ fontSize: "20px" }}
                      onClick={() => signOut()}
                    >
                      LogOut
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navber;
