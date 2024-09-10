"use client";
import Navber from "./components/Navber";
import { useSession } from "next-auth/react";

export default function Profile() {
  const {data: session} = useSession();


  return (
    <main >
      <Navber session={session}/>
      <div>
        <h1>Welcome TO Web</h1>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe ab dolorem eos adipisci mollitia modi laudantium et dignissimos tenetur unde. Molestiae, officia. Nesciunt, atque. Possimus odit nam pariatur temporibus libero.
      </div>
    </main>
  );
}
