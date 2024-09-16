
"use client";
import React from 'react'
import Navber from '../components/Navber'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';

// import { authOption } from '../api/auth/[...nextauth]/route';

function ProfilePage() {

  
  // const session = await getServerSession(authOptions);
  // const session = useSession();
  const { data: session, status } = useSession();
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
        </div>
        </div>
  )
}

export default ProfilePage