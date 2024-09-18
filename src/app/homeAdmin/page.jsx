"use client";
import React from 'react';
import Navber from '../components/Navber';
import Foter from '../components/Foter';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
<<<<<<< HEAD
import Image from 'next/image';
=======
import { useRouter } from 'next/navigation';

// import { authOption } from '../api/auth/[...nextauth]/route';
>>>>>>> origin/New_P

function ProfilePage() {
  const { data: session, status } = useSession();
<<<<<<< HEAD
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
=======
  const router = useRouter();
  
  if(!session) redirect("/login");

  // if (session.user.role === 'student') {
  //   redirect('/login');
  // } else if (session.user.role === 'admin') {
  //   redirect('/profile');
  // }

  const genPDF = () => {
    router.push(`/homeAdmin/genPDF`);
  };

  return (
    <div>
        <Navber session = {session}/>
        <div>
            <p>Welcome, {session.user.name}!</p>
            <p>Role: {session.user.role}</p>
            <a href='/scholarships'>เพิ่มแก้ไขทุน</a> <br />
            <button onClick={() => genPDF()}>ออกรายงาน</button>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum corporis iure suscipit quia mollitia accusantium maiores, consequuntur placeat odio autem quasi illo libero perspiciatis molestias porro quibusdam in quae neque?</p>
>>>>>>> origin/New_P
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
