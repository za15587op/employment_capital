"use client"
import React from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

function Navber({ session }) {
  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-white font-bold text-xl">
          <Link href="/">NextAuth</Link>
        </div>
        <ul className="flex space-x-4">
          {!session ? (
            <>
              <li>
                <Link href="/login" className="text-white hover:text-gray-200 transition duration-300">Login</Link>
              </li>
              <li>
                <Link href="/register" className="text-white hover:text-gray-200 transition duration-300">Register</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/welcome" className="text-white hover:text-gray-200 transition duration-300">Profile</Link>
              </li>
              <li>
                <button
                  onClick={() => signOut()}
                  className="text-white hover:text-gray-200 transition duration-300 focus:outline-none"
                >
                  Log Out
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navber;
