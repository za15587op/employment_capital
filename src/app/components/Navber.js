"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

function Navbar({ session }) {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const [student, setStudent] = useState(null); // เก็บข้อมูลนักศึกษา
  const [error, setError] = useState(null); // เก็บข้อผิดพลาด

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
            setStudent(data); // เก็บข้อมูลนักศึกษาใน state
            console.log("Fetched student data:", data);
          } else {
            setError("ไม่สามารถดึงข้อมูลนักศึกษาได้");
          }
        } catch (error) {
          setError("เกิดข้อผิดพลาดในการดึงข้อมูลนักศึกษา");
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
    <header className="header relative flex flex-col items-end">
      <div className="nav relative w-full h-[30px] bg-[#0F1035] mt-[60px]">
        <div className="logo absolute top-[50px] right-[30px] z-20">
          <Image src="/tsu.png" width={150} height={100} alt="logo" />
        </div>
      </div>

      <nav className="relative z-10 flex items-center justify-between p-4 bg-gray-800 w-full">
        <div
          className="absolute top-[-35px] left-0 flex items-center space-x-2 bg-[#0F1035] px-4 py-2 rounded-t-lg shadow-md"
          style={{
            clipPath: "polygon(0 0, 95% 0, 100% 100%, 0 100%)",
            zIndex: 10,
          }}
        >
          {status === "loading" ? (
            <li className="text-white">กำลังโหลด...</li>
          ) : !sessionData ? (
            <>
              <Link href="/login">
                <button
                  className="text-blue-500 bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                  style={{ fontSize: "20px" }}
                >
                  เข้าสู่ระบบ
                </button>
              </Link>

              <Link href="/register">
                <button
                  className="text-blue-500 bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                  style={{ fontSize: "20px" }}
                >
                  สมัครสมาชิก
                </button>
              </Link>
          </>
          
          ) : (
            <>
              {sessionData.user.role === "student" && (
                <>
               <Link href="/welcome">
                    <button
                      className="text-blue-500 bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                      style={{ fontSize: "20px" }}
                    >
                      หน้าแรก
                    </button>
                  </Link>
                  <Link href="/procedureSt">
                    <button
                      className="text-blue-500 bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                      style={{ fontSize: "20px" }}
                    >
                      ขั้นตอนการสมัครทุน
                    </button>
                  </Link>
                <Link href="/welcome">
                    <button
                      className="text-blue-500 bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                      style={{ fontSize: "20px" }}
                    >
                      สมัครทุน
                    </button>
                  </Link>
                  <Link href="/welcome/showStudentScholarships">
                    <button
                      className="text-blue-500 bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                      style={{ fontSize: "20px" }}
                    >
                      ติดตามผลการสมัคร
                    </button>
                  </Link>
  
                  <button
                    onClick={handleProfileClick}
                    className="text-blue-500 bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                    style={{ fontSize: "20px" }}
                  >
                    โปรไฟล์
                  </button>
                  <button
                        className="text-blue-500 bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                        style={{ fontSize: "20px" }}
                        onClick={signOut}
                      >
                        ออกจากระบบ
                      </button>
              </>
              )}
                
              {sessionData.user.role === "admin" && (
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex-grow flex justify-center items-center space-x-4">
                    <div className="text-center">
                      <Link href="/scholarships">
                        <button
                          className="text-blue-500 bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                          style={{ fontSize: "20px" }}
                        >
                          หน้าหลัก
                        </button>
                      </Link>
                    </div>
                    <div className="text-center">
                      <Link href="/organization">
                        <button
                          className="text-blue-500 bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                          style={{ fontSize: "20px" }}
                        >
                          เพิ่ม-แก้ไขข้อมูล
                        </button>
                      </Link>
                    </div>
                    <div className="text-center">
                      <Link href="/matching_admin">
                        <button
                          className="text-blue-500 bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                          style={{ fontSize: "20px" }}
                        >
                          ดูผลการจับคู่
                        </button>
                      </Link>
                    </div>
                    <div className="text-center">
                      <Link href="/homeAdmin/genPDF">
                        <button
                          className="text-blue-500 bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                          style={{ fontSize: "20px" }}
                        >
                          ออกรายงาน
                        </button>
                      </Link>
                    </div>
                    {/* <div className="text-center">
                      <Link href="/skillTypes">
                        <button
                          className="text-blue-500 bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                          style={{ fontSize: "20px" }}
                        >
                          เพิ่มประเภททักษะ
                        </button>
                      </Link>
                    </div> */}
                    <div className="text-center">
                      <button
                        className="text-blue-500 bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                        style={{ fontSize: "20px" }}
                        onClick={signOut}
                      >
                        ออกจากระบบ
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
