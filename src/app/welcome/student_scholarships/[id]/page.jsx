"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Foter from '@/app/components/Foter';
import AWS from 'aws-sdk';

export default function ScholarshipRegistration({ params }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();
  const student_id = session?.user?.student_id || null;  // ตรวจสอบ session ก่อนใช้



  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [status, session, router]);

  let scholarship_id = params?.id;
  if (!scholarship_id) {
    const parts = pathname.split("/");
    scholarship_id = parts[parts.length - 1];
  }


  // สถานะที่ต้องใช้ในฟอร์ม
  const [related_works, setRelatedWorks] = useState("");
  const [isPartTime, setIsPartTime] = useState("");
  const [dateAvailable, setDateAvailable] = useState([]);
  const [scholarships, setScholarships] = useState({});
  const [academic_year, setAcademicYear] = useState("");
  const [academic_term, setAcademicTerm] = useState("");
  const [student_firstname, setStudentFirstName] = useState("");
  const [student_lastname, setStudentLastName] = useState("");
  const [student_faculty, setStudentFaculty] = useState("");
  const [student_curriculum, setStudentCurriculum] = useState("");
  const [student_year, setStudentYear] = useState("");
  const [student_gpa, setStudentGpa] = useState("");
  const [student_phone, setStudentPhone] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const weekDays = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์"];

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;


  const handlePartTimeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      if (value === "in_time" && isPartTime === "นอกเวลาทำการที่กำหนด") {
        setIsPartTime("ทำได้ทั้งในเวลาและนอกเวลา");
      } else if (value === "out_time" && isPartTime === "ในเวลาที่กำหนด") {
        setIsPartTime("ทำได้ทั้งในเวลาและนอกเวลา");
      } else {
        setIsPartTime(value === "in_time" ? "ในเวลาที่กำหนด" : "นอกเวลาทำการที่กำหนด");
      }
    } else {
      setIsPartTime("");
    }
  };

  const handleDaySelectionChange = (e, day) => {
    const { checked } = e.target;
    if (checked) {
      setDateAvailable([...dateAvailable, day]);
    } else {
      setDateAvailable(dateAvailable.filter((selectedDay) => selectedDay !== day));
    }
  };

  const getStudentById = async (student_id) => {
    try {
      const res = await fetch(`${apiUrl}/api/student/${student_id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
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
      console.error("Error fetching student data:", error);
    }
  };

  const getDataById = async (scholarship_id) => {
    try {
      const res = await fetch(`${apiUrl}/api/scholarships/${scholarship_id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
      setScholarships(data);
      setAcademicYear(data.academic_year);
      setAcademicTerm(data.academic_term);
    } catch (error) {
      console.error("Error fetching scholarship data:", error);
    }
  };

  useEffect(() => {
    if (student_id) {
      getStudentById(student_id);
    }
    if (scholarship_id) {
      getDataById(scholarship_id);
    }
  }, [student_id, scholarship_id]);

  

  const handleSubmit = async (event) => {
    event.preventDefault();

    const fileInput = event.target.querySelector('input[type="file"]');
    const formData = new FormData();

    if (!student_id || !scholarship_id) {
      alert("Student ID หรือ Scholarship ID หายไป.");
      return;
    }

    try {
      const checkRegistrationResponse = await fetch(
        `${apiUrl}/api/student_scholarships/?student_id=${student_id}`,
        {
          method: "GET",
        }
      );

      const checkRegistrationData = await checkRegistrationResponse.json();

      if (checkRegistrationData.exists) {
        alert("เคยสมัครไปแล้ว");
        return;
      }

      formData.append("student_id", student_id);
      formData.append("scholarship_id", scholarship_id);
      formData.append("related_works", related_works);
      formData.append("is_parttime", isPartTime);
      formData.append("date_available", JSON.stringify(dateAvailable));
      formData.append("scholarships", JSON.stringify(scholarships));

      if (fileInput.files.length > 0) {
        formData.append("file", fileInput.files[0]);
      }

      const response = await fetch(`${apiUrl}/api/student_scholarships`, {
        method: "POST",
        body: formData,
      });


      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error && errorData.error.includes("Duplicate entry")) {
          alert("เคยสมัครทุนนี้ไปแล้ว");
        } else {
          throw new Error("การส่งฟอร์มล้มเหลว");
        }
      } else {
        setSuccessMessage("สมัครทุนการศึกษาสำเร็จ!");
        setSuccess(true);
        setTimeout(() => {
          router.push(`${apiUrl}/welcome/showStudentScholarships`);
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("เกิดข้อผิดพลาดขณะส่งฟอร์ม");
    }
  };

  const renderDaysCheckboxes = () => {
    let daysToRender = [];

    if (isPartTime === "ในเวลาที่กำหนด") {
      daysToRender = weekDays;
    }

    return (
      <div className="flex flex-wrap gap-4">
        <label className="font-semibold text-gray-600">เลือกวันที่สามารถทำงานได้:</label>
        {daysToRender.map((day, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`day_${index}`}
              value={day}
              checked={dateAvailable.includes(day)}
              onChange={(e) => handleDaySelectionChange(e, day)}
              className="h-5 w-5 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor={`day_${index}`} className="text-gray-700">{day}</label>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-500 via-blue-300 to-gray-100">
      <Navbar session={session} />

      <div className="container mx-auto px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6 border border-gray-300"
        >
          <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">สมัครทุนจ้างงาน</h1>

          <div className="grid grid-cols-2 gap-6">
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

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-700">ข้อมูลทุนการศึกษา</h2>
              <p className="text-gray-600">ปีการศึกษาที่: {academic_year}</p>
              <p className="text-gray-600">เทอมการศึกษาที่: {academic_term}</p>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
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
            <label>ปฎิบัติงานนอกเวลาได้หรือไม่ (สามารถเลือกได้ทั้งสองเวลา)</label>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="in_time"
                  value="in_time"
                  checked={isPartTime === "ในเวลาที่กำหนด" || isPartTime === "ทำได้ทั้งในเวลาและนอกเวลา"}
                  onChange={handlePartTimeChange}
                  className="h-5 w-5 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="in_time" className="text-gray-700">ในเวลา</label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="out_time"
                  value="out_time"
                  checked={isPartTime === "นอกเวลาทำการที่กำหนด" || isPartTime === "ทำได้ทั้งในเวลาและนอกเวลา"}
                  onChange={handlePartTimeChange}
                  className="h-5 w-5 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="out_time" className="text-gray-700">นอกเวลา</label>
              </div>
            </div>

            {isPartTime && renderDaysCheckboxes()}

            นอกเวลาทำการที่กำหนด

          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-500 transition ease-in-out duration-300 transform hover:scale-105"
            >
              สมัคร
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
