"use client"
import React , {useState} from 'react'
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
  if(session) router.replace("/welcome");

  const handlerSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials",{
        username , password, redirect: false  
      })

      if(res.error){
        setError("Invalid credentials");
        return;
      }

      router.replace("welcome");

    } catch(error){
      console.log(error);
      
    }
  }
  
  return (
    <div>
        <Navber/>
        <div>
            <form onSubmit={handlerSubmit}>

            {error && (<div>{error}</div>)}

                <h3>Login Page</h3>
                <input onChange={(e) => setUsername(e.target.value)} type="username" placeholder='Enter your username' />
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