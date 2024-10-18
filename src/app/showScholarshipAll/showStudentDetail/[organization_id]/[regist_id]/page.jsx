"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Foter from '@/app/components/Foter';

export default function ShowScholarshipRegistration({ params }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [status, session, router]);

  let regist_id = params?.id;
  if (!regist_id) {
    const parts = pathname.split("/");
    regist_id = parts[parts.length - 1];
  }

  const [relatedWorks, setRelatedWorks] = useState("");
  const [isPartTime, setIsPartTime] = useState(""); 
  const [dateAvailable, setDateAvailable] = useState([]); 
  const [scholarship_id, setScholarshipId] = useState("");
  const [academic_year, setAcademicYear] = useState("");
  const [academic_term, setAcademicTerm] = useState("");
  const [student_firstname, setStudentFirstName] = useState("");
  const [student_lastname, setStudentLastName] = useState("");
  const [student_faculty, setStudentFaculty] = useState("");
  const [student_curriculum, setStudentCurriculum] = useState("");
  const [student_year, setStudentYear] = useState("");
  const [student_gpa, setStudentGpa] = useState("");
  const [student_phone, setStudentPhone] = useState("");

  const weekDays = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์"];
  const weekendDays = ["เสาร์", "อาทิตย์"]; 

  const getExistingData = async () => {
    try {
      const res = await fetch(`http://10.120.1.109:11150/api/student_scholarships/edit/${regist_id}`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
      setRelatedWorks(data.related_works);
      setIsPartTime(data.datetime_available[0]?.is_parttime);
      setDateAvailable(data.datetime_available[0]?.date_available || []);
      setScholarshipId(data.scholarship_id);
      setAcademicTerm(data.academic_term);
      setAcademicYear(data.academic_year);
      setStudentFirstName(data.student_firstname);
      setStudentLastName(data.student_lastname);
      setStudentFaculty(data.student_faculty);
      setStudentCurriculum(data.student_curriculum);
      setStudentYear(data.student_year);
      setStudentGpa(data.student_gpa);
      setStudentPhone(data.student_phone);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (regist_id) {
      getExistingData();
    }
  }, [regist_id]);

  const renderDaysAvailable = () => {
    return dateAvailable.join(", ");
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar session={session} />

      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6">
          <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">ข้อมูลการสมัครทุนจ้างงาน</h1>

          <div className="grid grid-cols-2 gap-6">
            {/* ข้อมูลนักศึกษา */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-700">ข้อมูลนักศึกษา</h2>
              <div className="text-gray-600">
                <p>ชื่อ: {student_firstname}</p>
                <p>นามสกุล: {student_lastname}</p>
                <p>คณะ: {student_faculty}</p>
                <p>หลักสูตร: {student_curriculum}</p>
                <p>ปีการศึกษา: {student_year}</p>
                <p>เกรดเฉลี่ย (GPA): {student_gpa}</p>
                <p>เบอร์โทรศัพท์: {student_phone}</p>
              </div>
            </div>

            {/* ข้อมูลทุนการศึกษา */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-700">ข้อมูลทุนการศึกษา</h2>
              <p className="text-gray-600">ปีการศึกษาที่: {academic_year}</p>
              <p className="text-gray-600">เทอมการศึกษาที่: {academic_term}</p>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            {/* แสดงเวลาทำงาน */}
             {/* //ถ้าแก้เพิ่มไฟล์ตอน deploy ไม่ทันให้comment 248 - 257 */}
            <div>
              <label htmlFor="file" className="font-medium text-gray-700">อัปโหลดไฟล์ผลงานที่เกี่ยวข้อง:(ถ้ามี*)</label>
              <input
                type="file"
                id="file"
                name="file"
                onChange={(e) => setRelatedWorks(e.target.value)}
                className="block mt-2 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
              />
            </div>
            <label>ปฎิบัติงานนอกเวลาได้หรือไม่ (สามารถเลือกได้เพียงหนึ่ง)</label>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="in_time"
                  value="ในเวลาที่กำหนด"
                  disabled
                  checked={isPartTime === "ในเวลาที่กำหนด"}
                  className="h-5 w-5 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="in_time" className="text-gray-700">ในเวลาที่กำหนด</label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="out_time"
                  value="นอกเวลาทำการที่กำหนด"
                  disabled
                  checked={isPartTime === "นอกเวลาทำการที่กำหนด"}
                  className="h-5 w-5 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="out_time" className="text-gray-700">นอกเวลาทำการที่กำหนด</label>
              </div>
            </div>

            {/* แสดงวันที่สามารถทำงานได้ */}
            {isPartTime && (
              <div>
                <h2 className="font-semibold text-gray-600">วันที่สามารถทำงานได้:</h2>
                <p className="text-gray-700">{renderDaysAvailable()}</p>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-500 transition ease-in-out duration-300 transform hover:scale-105"
            >
              ย้อนกลับ
            </button>
          </div>
        </div>
      </div>

      <Foter />
    </div>
  );
}
