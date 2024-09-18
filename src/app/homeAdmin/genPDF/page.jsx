"use client";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/fonts/THSarabunNew-normal.js"; // นำฟอนต์เข้ามาเพื่อใช้ภาษาไทย
import Navber from "@/app/components/Navber";
import { useSession } from "next-auth/react";

function ShowScholarshipGenPDF() {
  const [getData, setGetData] = useState([]);
  const { data: session, status } = useSession();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // เพิ่มสถานะการโหลด
  const router = useRouter();

  // ฟังก์ชันดึงข้อมูลนักศึกษาจาก API
  const fetchGetData = async () => {
    try {
      const res = await fetch(`/api/genPDF/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setGetData(data);
        setLoading(false); // ปิดการโหลดข้อมูลเมื่อเสร็จสิ้น
      } else {
        setError("Failed to fetch data");
        setLoading(false); // ปิดการโหลดเมื่อเกิดข้อผิดพลาด
      }
    } catch (error) {
      setError("An error occurred while fetching data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGetData();
  }, []);

  // ฟังก์ชันสำหรับสร้าง PDF
  const generatePDF = () => {
    if (getData.length === 0) {
      alert("ไม่มีข้อมูลในการสร้าง PDF");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth(); // กำหนดความกว้างของหน้า PDF

    // ตั้งค่าฟอนต์เป็น THSarabunNew
    doc.setFont("THSarabunNew", "normal");

    // ใส่หัวข้อในเอกสาร PDF (จัดให้อยู่กึ่งกลางโดยคำนวณจากความกว้างของหน้า PDF)
    doc.setFontSize(18);
    doc.text("รายชื่อนักศึกษาที่ผ่านทุนจ้างงาน", pageWidth / 2, 22, { align: "center" });
    doc.text("ทุนจ้างงานปีการศึกษาที่", pageWidth / 2, 30, { align: "center" });
    doc.text("เทอมศึกษาที่", pageWidth / 2, 36, { align: "center" });

    // เตรียมข้อมูลนักศึกษาที่จะแสดงในตาราง
    const studentsData = getData.map((student, index) => [
      index + 1,
      student.student_id,
      `${student.student_firstname} ${student.student_lastname}`,
      student.student_faculty,
      student.student_field,
      student.student_gpa,
      student.student_status,
    ]);

    // สร้างตารางข้อมูลนักศึกษา
    doc.autoTable({
      head: [["ลำดับที่", "รหัสนิสิต", "ชื่อ-นามสกุล", "คณะ", "สาขา", "GPA", "สถานะ"]],
      body: studentsData,
      startY: 44, // กำหนดตำแหน่งของตาราง (หลังจากหัวข้อทั้งหมด)
      styles: { font: "THSarabunNew", fontSize: 14 }, // เพิ่มการตั้งค่าฟอนต์และขนาดในตาราง
      didDrawPage: (data) => {
        doc.setFontSize(10);
        doc.text(`${doc.internal.getNumberOfPages()}`, pageWidth - 20, 285); // แสดงหน้าที่มุมขวาล่าง
      },
    });

    // บันทึกไฟล์ PDF
    doc.save("students_list.pdf");
  };

  return (
    <>
    <Navber session = {session}/>
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full bg-white p-6 shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4">รายชื่อนักศึกษาทั้งหมด</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {loading ? (
          <p>กำลังโหลดข้อมูล...</p> // เพิ่มสถานะการโหลด
        ) : getData.length > 0 ? (
          <div>
            <button
              onClick={generatePDF}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Generate PDF
            </button>

            {/* ตัวอย่างแสดงข้อมูลนักศึกษา */}
            <div className="mt-6">
              {getData.map((student, index) => (
                <div
                  key={`${student.student_id}-${index}`}
                  className="mb-4 border-b pb-2"
                >
                  <p>
                    <strong>
                      {student.student_firstname} {student.student_lastname}
                    </strong>{" "}
                    (ID: {student.student_id})
                  </p>
                  <p>
                    คณะ: {student.student_faculty} | สาขา:{" "}
                    {student.student_field} | GPA: {student.student_gpa}
                  </p>
                  <p>สถานะ: {student.student_status}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>ไม่พบข้อมูลนักศึกษา</p>
        )}
      </div>
    </div>
    </>
  );
}

export default ShowScholarshipGenPDF;
