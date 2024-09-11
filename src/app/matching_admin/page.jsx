"use client";
import React from 'react'
import Navber from '../components/Navber'
import Foter from '../components/Foter';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

function Matching_adminPage(){
    const { data: session, status } = useSession();

    console.log(session,"session2");
    
    if(!session) redirect("/matching_admin");
  

  return(
    <div>
    <Navber session = {session}/>
    <div className="แถบสี"></div> 
    <div>
        <br />
        <p className="text-2xl font-bold mb-6 text-center">หน้าดูผลการจับคู่ <br></br></p>
    </div>
    <Foter/>
    </div>
)
}

export default Matching_adminPage

