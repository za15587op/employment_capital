"use client";
import React, { useEffect } from "react";
import Navbar from "@/app/components/Navbar";  // แก้ Navber เป็น Navbar
import Foter from "../components/Foter";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function Report_adminPage() {
  const { data: session, status } = useSession();
  const router = useRouter(); // ใช้ useRouter แทนการใช้ redirect แบบตรง

  useEffect(() => {
    if (status === "loading") return; // รอจนกว่าจะโหลด session เสร็จ
    if (!session) {
      router.push("/login"); // ถ้าไม่มี session ให้ไปที่หน้า login
    }
  }, [session, status, router]);

  // รอจนกว่าจะตรวจสอบ session เสร็จ
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-500 via-blue-300 to-gray-100">
      <Navbar session={session} />
      <div className="แถบสี"></div>

      {/* Title Section */}
      <div className="py-10 flex justify-center">
        <div className="relative inline-block px-10 py-6 bg-gradient-to-r from-blue-200 to-purple-200 rounded-xl shadow-xl">
          <p className="text-4xl font-extrabold text-center text-blue-900 tracking-wider animate-pulse">
            ขั้นตอนการสมัครทุนจ้างงานนิสิต มหาวิทยาลัยทักษิณ
          </p>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-50 blur-md rounded-lg"></div>
        </div>
      </div>

      {/* Step-by-Step Section */}
      <div className="flex justify-center mt-16 space-x-12">
        {[
          { img: "/a.png", text: "คลิก “สมัครทุน”" },
          { img: "/b.png", text: "กรอกข้อมูลการสมัครทุน" },
          { img: "/c.png", text: "อยู่ในขั้นตอนดำเนินการ" },
          { img: "/d.png", text: "รอผลประกาศทุน และรับการแจ้งเตือน" },
        ].map((step, index) => (
          <div
            key={index}
            className="text-center transform transition-transform duration-500 hover:scale-105"
          >
            <img
              src={step.img}
              alt={`Step ${index + 1}`}
              className="mx-auto w-20 h-20 shadow-lg"
            />
            <p className="text-xl font-bold mt-6 text-blue-800">
              {step.text}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-16">
        <Foter />
      </div>
    </div>
  );
}

export default Report_adminPage;
