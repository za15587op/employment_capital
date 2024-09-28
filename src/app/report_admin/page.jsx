"use client";
import React from 'react'
import Navbar from '../components/Navbar'
import Foter from '../components/Foter';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

function Report_adminPage() {

  const { data: session, status } = useSession();

  console.log(session,"session2");
  
  if(!session) redirect("/login");

  return(
    <div>
    <Navbar session = {session}/>
    <div className="แถบสี"></div> 
    <div>
        <br />
        <p className="text-2xl font-bold mb-6 text-center">หน้าออกรายงาน <br></br></p>
    </div>
    <Foter/>
    </div>
)
}

export default Report_adminPage


