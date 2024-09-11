"use client";
import React, { useEffect } from 'react';
import Navber from '../components/Navber';
import Foter from '../components/Foter';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Wait until the session status is determined
    if (status === "loading") return;

    // If not authenticated, redirect to login page
    if (!session) {
      router.push("/login");
    }
  }, [status, session, router]);

  return (
    <div>
      <Navber session={session} />
      <div className="แถบสี"></div> 
      <div className="text-center mt-10">
        {/* Link to Add Organization */}
        <Link href="/organization" className="bg-blue-500 text-white px-3 py-2 rounded-lg no-underline mb-4 block hover:bg-blue-600">
          เพิ่มหน่วยงาน
        </Link>
        <br /><br /><br />
      </div>
      <Foter />
    </div>
  );
}

export default Page;
