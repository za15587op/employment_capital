"use client"
import React , {useState , useEffect } from 'react'
import Navber from '../components/Navber'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

function LoginPage() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const {data : session } = useSession();
  console.log(session, "Session Data");


  useEffect(() => {
    if (session && session.user) { // ตรวจสอบว่ามี session และ session.user ก่อน
      if (session.user.role === 'admin') {
        router.replace('/homeAdmin');
      } else if (session.user.role === 'student') {
        // router.replace('/welcome');
        console.log(session, "student_id");
        
        if (!session.user.student_id) {
          router.replace("/student/create"); // Redirect to create page if no student_id
      } else {
          router.replace(`/student/edit/${session.user.student_id}`); // Redirect to edit page if student_id exists
      }
      }
    }
  }, [session, router]);



  const handlerSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials",{
        username , password, redirect: false  
      })

      console.log(res, "res");
      

      if(res.error){
        setError("Invalid credentials");
        return;
      }

      // user_role == admin

      // user_role == student

      const userRole = res.user?.role;

      console.log(userRole);
      
      // if (userRole === 'admin') {
      //   router.replace("/profile");
      // } else if (userRole === 'student') {
      //   router.replace("/welcome");
      // } else {
      //   setError("Unknown role");
      // }
      

    } catch(error){
      console.log(error);
      
    }
  }
  
  return (
    <div>
       <Navber session={session}/>
        <div>
            <form onSubmit={handlerSubmit}>

            {error && (<div>{error}</div>)}

                <h3>Login Page</h3>
                <input onChange={(e) => setUsername(e.target.value)} type="email" placeholder='Enter your username' />
                <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Enter your password' />
                <button type='submit'>Sign Up</button>
            </form>
            <hr />
            <p>Already have an account? go to <Link href="/register">Register</Link>Page</p>
        </div>
    </div>
  )
}

export default LoginPage