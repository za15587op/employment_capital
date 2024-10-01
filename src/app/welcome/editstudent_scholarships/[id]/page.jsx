"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Foter from '@/app/components/Foter';

export default function EditScholarshipRegistration({ params }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [success, setSuccess] = useState(false);
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
  const [file, setFile] = useState(null);
  const [isPartTime, setIsPartTime] = useState(""); // สำหรับ radio
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
  const weekendDays = ["เสาร์", "อาทิตย์"]; // เพิ่มวันเสาร์และวันอาทิตย์

  const getExistingData = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/student_scholarships/edit/${regist_id}`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
      setRelatedWorks(data.related_works);
      setIsPartTime(data.datetime_available[0]?.is_parttime); // เซ็ตค่าที่ดึงมาให้กับ isPartTime
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    try {
      formData.append("student_id", session.user.student_id);
      formData.append("regist_id", regist_id);
      formData.append("related_works", relatedWorks);
      formData.append("is_parttime", isPartTime); // เพิ่ม isPartTime
      formData.append("date_available", JSON.stringify(dateAvailable));   
      formData.append("academic_year", academic_year);
      formData.append("academic_term", academic_term);
      formData.append("scholarship_id", scholarship_id);

      if (file) {
        formData.append("file", file);
      }

      const response = await fetch(`${apiUrl}/api/student_scholarships/edit/${regist_id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("การส่งฟอร์มล้มเหลว");
      }

      const result = await response.json();
      if (result.success) {
        setSuccessMessage("แก้ไขข้อมูลการสมัครสำเร็จ!");
        setSuccess(true);
        setTimeout(() => {
          router.push(`${apiUrl}/welcome/showStudentScholarships`);
        }, 2000);
      } else {
        alert("การแก้ไขข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("เกิดข้อผิดพลาดขณะส่งฟอร์ม");
    }
  };

  const handlePartTimeChange = (e) => {
    setIsPartTime(e.target.value); // เปลี่ยนค่า isPartTime ตามค่าที่ผู้ใช้เลือก
  };

  const renderDaysCheckboxes = () => {
    const availableDays = isPartTime === "นอกเวลาทำการที่กำหนด"
      ? [...weekDays, ...weekendDays] // เพิ่มวันเสาร์และอาทิตย์เมื่อเลือกนอกเวลา
      : weekDays;

    return (
      <div className="flex flex-wrap gap-4">
        <label className="font-semibold text-gray-600">เลือกวันที่คุณสามารถทำงานได้:</label>
        {availableDays.map((day, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`day_${index}`}
              value={day}
              checked={dateAvailable.includes(day)} // ตรวจสอบวันที่ที่ถูกเลือก
              onChange={(e) => handleDaySelectionChange(e, day)}
              className="h-5 w-5 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor={`day_${index}`} className="text-gray-700">{day}</label>
          </div>
        ))}
      </div>
    );
  };

  const handleDaySelectionChange = (e, day) => {
    const { checked } = e.target;
    if (checked) {
      setDateAvailable([...dateAvailable, day]); // เพิ่มวันถ้า checkbox ถูกเลือก
    } else {
      setDateAvailable(dateAvailable.filter((selectedDay) => selectedDay !== day)); // ลบวันถ้า checkbox ถูกยกเลิกเลือก
    }
  };

  return (
  <div className="bg-gray-50 min-h-screen flex flex-col">
    <Navbar session={session} />

    <div className="container mx-auto px-4 py-8 flex-grow">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6"
      >
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">แก้ไขข้อมูลการสมัครทุนจ้างงาน</h1>

        <div className="grid grid-cols-2 gap-6">
          {/* ข้อมูลนักศึกษา */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-700">ข้อมูลนักศึกษา</h2>
            <div className="text-gray-600">
              <label className="block">ชื่อ: {student_firstname}</label>
              <label className="block">นามสกุล: {student_lastname}</label>
              <label className="block">คณะ: {student_faculty}</label>
              <label className="block">หลักสูตร: {student_curriculum}</label>
              <label className="block">ปีการศึกษา: {student_year}</label>
              <label className="block">เกรดเฉลี่ย (GPA): {student_gpa}</label>
              <label className="block">เบอร์โทรศัพท์: {student_phone}</label>
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
          {/* ไฟล์ที่อัปโหลด */}
          {/* ถ้าแก้เพิ่มไฟล์ไม่ทันให้ 200 - 212 */}
          {/* <div>
            <label htmlFor="file" className="font-medium text-gray-700">ไฟล์ที่อัปโหลดแล้ว:</label>{" "}
            <a href={`${apiUrl}/${relatedWorks}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
              ดูไฟล์ที่อัปโหลด
            </a>
            <input
              type="file"
              id="file"
              name="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="block mt-2 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
            />
          </div> */}

          {/* การทำงานในเวลาและนอกเวลา */}
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="in_time"
                value="ในเวลาที่กำหนด"
                checked={isPartTime === "ในเวลาที่กำหนด"} // แสดงผลสถานะ
                onChange={handlePartTimeChange}
                className="h-5 w-5 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="in_time" className="text-gray-700">ในเวลาที่กำหนด</label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="out_time"
                value="นอกเวลาทำการที่กำหนด"
                checked={isPartTime === "นอกเวลาทำการที่กำหนด"} // แสดงผลสถานะ
                onChange={handlePartTimeChange}
                className="h-5 w-5 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="out_time" className="text-gray-700">นอกเวลาทำการที่กำหนด</label>
            </div>
          </div>

          {/* แสดงวันที่สามารถทำงานได้ */}
          {isPartTime && renderDaysCheckboxes()}
        </div>

        {/* ปุ่มบันทึกการแก้ไข */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-500 transition ease-in-out duration-300 transform hover:scale-105"
          >
            บันทึกการแก้ไข
          </button>
        </div>
      </form>
    </div>

    {/* Success Message */}
    {success && (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[60%] lg:w-[40%] p-6 bg-gradient-to-r from-green-400 to-blue-400 border-2 border-green-600 rounded-lg shadow-2xl text-center transition-all duration-500 ease-out">
        <div className="flex items-center justify-center space-x-4">
          <div className="p-2 bg-white rounded-full shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-10 h-10 text-green-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <p className="mt-4 text-lg text-white font-semibold">
          {successMessage}
        </p>
      </div>
    )}

    <Foter />
  </div>
);
}
