"use client";
import React, { useState } from "react";
import Navber from "../components/Navber";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { data: session } = useSession();
  // if (session) router.replace("/welcome");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password != confirmPassword) {
      setError("Password do not match!");
      return;
    } else if (!username || !password || !confirmPassword) {
      setError("Please complete all  inputs!");
      return;
    } else {
      try {
        const res = await fetch("http://localhost:3000/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        });

        if (res.ok) {
          const form = e.target;
          setError("");
          setSuccess("User registration successfully!");
          form.reset();
        } else {
          console.log("User registration failed");
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  return (
    <div>
      <Navber />
      <div>
        <form onSubmit={handleSubmit}>
          {error && <div>{error}</div>}
          {success && <div>{success}</div>}
          <h3>Resgister Page</h3>
          <input
            onChange={(e) => setUsername(e.target.value)}
            type="email"
            placeholder="Enter your email"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter your password"
          />
          <input
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="Confirm your password"
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
