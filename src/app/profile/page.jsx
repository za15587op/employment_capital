
"use client";
import React from 'react'
import Navber from '../components/Navber'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
// import { authOption } from '../api/auth/[...nextauth]/route';

function ProfilePage() {

  
  // const session = await getServerSession(authOptions);
  // const session = useSession();
  const { data: session, status } = useSession();

  console.log(session,"session2");
  
  if(!session) redirect("/login");

  // if (session.user.role === 'student') {
  //   redirect('/login');
  // } else if (session.user.role === 'admin') {
  //   redirect('/profile');
  // }

  

  return (
    <div>
        {/* <Navber session = {session}/> */}
        <div>
            <p>Welcome, {session.user.name}!</p>
            <p>Role: {session.user.role}</p>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum corporis iure suscipit quia mollitia accusantium maiores, consequuntur placeat odio autem quasi illo libero perspiciatis molestias porro quibusdam in quae neque?</p>
        </div>
        </div>
  )
}

export default ProfilePage