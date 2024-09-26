"use client";
import React, { useEffect, useState } from "react";
import Navber from "@/app/components/Navber";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function ShowScholarshipAllPage({ params }) {
  const { id: scholarship_id } = params;
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "loading") return; // รอจนกว่าจะโหลด session เสร็จ
    if (!session) {
        router.push("/login");
    }
}, [session, status, router]);
  // // ฟังก์ชันสำหรับลบข้อมูลที่ซ้ำกัน โดยอ้างอิงจาก key ที่เป็นเอกลักษณ์ เช่น regist_id หรือ student_id
  // const removeDuplicates = (array, key) => {
  //   return array.filter((item, index, self) => 
  //     index === self.findIndex((t) => t[key] === item[key])
  //   );
  // };

  // ฟังก์ชันสำหรับดึงข้อมูลทุนการศึกษา
  const fetchScholarShipReGist = async (scholarship_id) => {
    try {
      const res = await fetch(`/api/showScholarshipAll/${scholarship_id}`, {
        method: "GET",
        cache: "no-store",
      });
      if (res.ok) {
        let fetchedData = await res.json();
        console.log("Fetched data:", fetchedData);

        // // ลบข้อมูลที่ซ้ำกัน โดยใช้ regist_id หรือ student_id เป็นเกณฑ์
        // const uniqueData = removeDuplicates(fetchedData, "regist_id");

        setData(fetchedData);
      } else {
        setError("ไม่สามารถดึงข้อมูล showScholarshipAll ได้");
      }
    } catch (error) {
      setError("ไม่มีข้อมูลผู้สมัคร");
    }
  };

  // ดึงข้อมูลเมื่อ scholarship_id พร้อมใช้งาน
  useEffect(() => {
    if (scholarship_id) {
      fetchScholarShipReGist(scholarship_id);
    }
  }, [scholarship_id]);


  const ViewDetails = (regist_id) => {
    router.push(`/showScholarshipAll/showStudentDetail/${regist_id}`);
  };

  const Back = () => {
    router.push(`/scholarships`);
  };


  return (
    <div>
      <Navber />
      {error && <p>{error}</p>}
      {data.length > 0 ? (
        <div>
          <button
            type="button"
            onClick={() => Back()}
            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-500 transition ease-in-out duration-300 transform hover:scale-105"
          >
            ย้อนกลับ
          </button>
          <h2>ข้อมูลนักศึกษา </h2>
          <h2>ปีการศึกษาที่ {data[0].academic_year}</h2>
          <h2>เทอมการศึกษา {data[0].academic_term}</h2>
          <h2>จำนวนผู้สมัครทั้งหมด {data.length}</h2>
          {data.map((student) => (
            <div key={student.regist_id}>
              <p>
                <strong>ชื่อ-นามสกุล: </strong>
                {student.student_firstname} {student.student_lastname}
              </p>
              <p>
                <strong>คณะ: </strong>
                {student.student_faculty}
              </p>
              <button onClick={() => ViewDetails(student.regist_id)}>ดูรายละเอียด</button>
            </div>
          ))}
        </div>
      ) : (
        <p>กำลังโหลดข้อมูล...</p>
      )}
    </div>
  );
}

export default ShowScholarshipAllPage;
