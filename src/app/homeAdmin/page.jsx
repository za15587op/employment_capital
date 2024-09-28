"use client";
import React, { useEffect } from 'react'; // นำเข้า useEffect
import Navbar from "@/app/components/Navbar";  // แก้ Navber เป็น Navbar
import Foter from '../components/Foter';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // ใช้ useRouter แทน redirect
import Image from 'next/image';

function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter(); // เพิ่มการใช้ useRouter

  console.log(session, "session2");

  useEffect(() => {
    if (status === "loading") return; // รอจนกว่าจะโหลด session เสร็จ
    if (!session) {
      router.push("/login"); // ถ้าไม่มี session ให้ไปที่หน้า login
    }
  }, [session, status, router]);

  // ถ้า session กำลังโหลด ให้แสดง "Loading..."
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // ถ้าไม่มี session ให้รีไดเรกต์ไปหน้า login
  if (!session) {
    return null; // หรือแสดง Loading หรือ Redirect แทนการรีเทิร์นว่างๆ
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#DCF2F1] via-[#7FC7D9] via-[#365486] to-[#0F1035] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#365486] to-[#0F1035] opacity-20 animate-movingBackground"></div>
      <Navbar session={session} />
      <div className="relative p-10">
        <div className="logohome flex justify-center">
          <Image
            src="/logohome.jpg"
            width={1000}
            height={100}
            alt="logohome"
            className="rounded-xl shadow-2xl transform hover:scale-110 transition duration-500 ease-in-out"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mt-10 tracking-wide text-white animate-pulse">
          บริการด้านทุนจ้างงานนิสิต มหาวิทยาลัยทักษิณ
        </h1>
        <p className="text-2xl font-bold mb-6 text-center mt-4 bg-white bg-opacity-20 p-6 rounded-lg shadow-lg text-white backdrop-blur-lg">
          ยินดีตอนรับเข้าสู่ บริการด้านทุนจ้างงานนิสิต มหาวิทยาลัยทักษิณ <br /> {session?.user?.name}!
        </p>
        <div className="flex justify-center mt-10">
          <div className="bg-black bg-opacity-30 p-8 rounded-lg shadow-xl text-center hover:bg-opacity-50 transition duration-300">
            <p className="text-xl font-semibold text-white">Role: {session?.user?.role}</p>
          </div>
        </div>
      </div>
      <Foter />
    </div>
  );
}

export default ProfilePage;
