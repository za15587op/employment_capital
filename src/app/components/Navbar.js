"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Navbar({ session }) {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const [student, setStudent] = useState(null); // เก็บข้อมูลนักศึกษา
  const [error, setError] = useState(null); // เก็บข้อผิดพลาด

  const MySwal = withReactContent(Swal);

  const handleSignOut = () => {
    MySwal.fire({
      title: 'คุณต้องการออกจากระบบใช่หรือไม่?',
      text: "เมื่อออกจากระบบ คุณจะต้องเข้าสู่ระบบใหม่เพื่อใช้งานอีกครั้ง",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ออกจากระบบ',
      cancelButtonText: 'ยกเลิก',
      background: '#f9fafb',
      customClass: {
        popup: 'rounded-lg shadow-lg',
        title: 'font-bold text-gray-800',
        confirmButton: 'bg-red-500 text-white font-bold rounded-md px-4 py-2',
        cancelButton: 'bg-gray-300 text-gray-800 font-bold rounded-md px-4 py-2',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        signOut();
      }
    });
  };

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
                    className="text-white bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                    style={{ fontSize: "20px" }}
                  >
                    เข้าสู่ระบบ
                  </button>
                </Link>
    
                <Link href="/register">
                  <button
                    className="text-white bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
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
                    <div className="text-white">
                      {sessionData.user.name}
                    </div>
                    <br />
                    <Link href="/homeSt">
                      <button
                        className="text-white bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                        style={{ fontSize: "20px" }}
                      >
                        หน้าแรก
                      </button>
                    </Link>
                    <Link href="/procedureSt">
                      <button
                        className="text-white bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                        style={{ fontSize: "20px" }}
                      >
                        ขั้นตอนการสมัครทุน
                      </button>
                    </Link>
                    <Link href="/welcome">
                      <button
                        className="text-white bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                        style={{ fontSize: "20px" }}
                      >
                        สมัครทุน
                      </button>
                    </Link>
                    <Link href="/welcome/showStudentScholarships">
                      <button
                        className="text-white bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                        style={{ fontSize: "20px" }}
                      >
                        ติดตามผลการสมัคร
                      </button>
                    </Link>
                    <button
                      onClick={handleProfileClick}
                      className="text-white bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                      style={{ fontSize: "20px" }}
                    >
                      โปรไฟล์
                    </button>
    
                    <div className="text-center">
                      <button
                        className="text-white bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                        style={{ fontSize: "20px" }}
                        onClick={handleSignOut}
                      >
                        ออกจากระบบ
                      </button>
                    </div>
                  </>
                )}
    
                {sessionData.user.role === "admin" && (
                  <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex-grow flex justify-center items-center space-x-4">
                      <div className="text-white">
                        {sessionData.user.name}
                      </div>
                      <div className="text-center">
                        <Link href="/scholarships">
                          <button
                            className="text-white bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                            style={{ fontSize: "20px" }}
                          >
                            หน้าหลัก
                          </button>
                        </Link>
                      </div>
                      <div className="text-center">
                        <Link href="/organization">
                          <button
                            className="text-white bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                            style={{ fontSize: "20px" }}
                          >
                            ดูหน่วยงานทั้งหมด
                          </button>
                        </Link>
                      </div>
                      <div className="text-center">
                        <button
                          className="text-white bg-transparent rounded-lg px-4 py-2 hover:bg-blue-100"
                          style={{ fontSize: "20px" }}
                          onClick={handleSignOut}
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
