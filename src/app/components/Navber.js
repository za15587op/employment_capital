"use client"
import React from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

function Navber({session}) {
  return (
   <nav>
    <div className="container mx-auto">
        <div>
            <div>
                <Link href="/"> NextAuth</Link>
            </div>
            <ul>
                {!session ? (
                    <>
                    <li><Link href="/login">Login</Link></li>
                    <li><Link href="/register">register</Link></li>
                    </>
                ) : (
                    <>  
                <li><a href='/welcome'>Profile</a></li>
                <li><a onClick={() => signOut()}>LogOut</a></li>
                    </>
                )}
            </ul>
        </div>
    </div>
   </nav>
  )
}

export default Navber