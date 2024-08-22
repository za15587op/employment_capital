"use client";
import React from 'react'
import Navber from '../components/Navber'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

function WelcomePage() {

  const {data: session} = useSession();
  console.log(session);
  
  if(!session) redirect("/login");

  return (
    <div>
        <Navber session = {session}/>
        <div>
            <h3>Welcome</h3>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum corporis iure suscipit quia mollitia accusantium maiores, consequuntur placeat odio autem quasi illo libero perspiciatis molestias porro quibusdam in quae neque?</p>
        </div>
        </div>
  )
}

export default WelcomePage