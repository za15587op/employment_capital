
import Navber from "./components/Navbar";
import Foter from "./components/Foter";
import Image from "next/image";
export default function Home() {
  return (
    <>
      <Navber/> 
      <h1 className="หน้าแรกแอดมิน">บริการด้านทุนจ้างงานนิสิต มหาวิทยาลัยทักษิณ</h1>
            <br />
      <div className="logohome">
                <Image src="/logohome.jpg" width={1000} height={100} alt="logohome" />
            </div>
      <Foter/>
    </>
  );
}
