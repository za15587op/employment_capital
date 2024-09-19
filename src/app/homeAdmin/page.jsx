"use client";
import React from 'react';
import Navber from '../components/Navber';
import Foter from '../components/Foter';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Image from 'next/image';

function ProfilePage() {
  const { data: session, status } = useSession();
console.log(session, "session2");
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#DCF2F1] via-[#7FC7D9] via-[#365486] to-[#0F1035] relative overflow-hidden">
      {/* เคลื่อนไหวของพื้นหลัง */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#365486] to-[#0F1035] opacity-20 animate-movingBackground"></div>

      {/* เพิ่มรายละเอียด UI */}
      <Navber session={session} />
      
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
          ยินดีตอนรับเข้าสู่ บริการด้านทุนจ้างงานนิสิต มหาวิทยาลัยทักษิณ <br /> {session.user.name}!
        </p>
        <div className="flex justify-center mt-10">
          <div className="bg-black bg-opacity-30 p-8 rounded-lg shadow-xl text-center hover:bg-opacity-50 transition duration-300">
            <p className="text-xl font-semibold text-white">Role: {session.user.role}</p>
          </div>
        </div>
      </div>
      <Foter />
    </div>
  );
}

export default ProfilePage;
