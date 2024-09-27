"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Foter from "@/app/components/Foter";
import { useParams } from "next/navigation"; // useParams for dynamic route params
import Navbar from "@/app/components/Navber";

export default function ShowStudentDetailPage({ params }) {
  const { organization_id, regist_id } = useParams(); // Extract params from URL
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // รอจนกว่าจะโหลด session เสร็จ
    if (!session) {
        router.push("/login");
    }
}, [session, status, router])
;
  // let regist_id = params?.id;
  if (!regist_id) {
    const parts = pathname.split("/");
    regist_id = parts[parts.length - 1];
  }

  const [relatedWorks, setRelatedWorks] = useState("");
  const [file, setFile] = useState(null);
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

  const getExistingData = async () => {
    try {
      const res = await fetch(`/api/student_scholarships/edit/${regist_id}`, {
        method: "GET",
      });
  
      if (!res.ok) {
        throw new Error("Failed to fetch");
      }
  
      const data = await res.json();
      console.log(data);
  
      setRelatedWorks(data.related_works);
      setIsPartTime(data.datetime_available[0]?.is_parttime);
      // แสดงค่า date_available ที่เป็น array
      setDateAvailable(data.datetime_available[0]?.date_available || []); // เข้าถึง date_available อย่างถูกต้อง
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


  const handlePartTimeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      if (value === "in_time" && isPartTime === "parttime") {
        setIsPartTime("both");
      } else if (value === "out_time" && isPartTime === "fulltime") {
        setIsPartTime("both");
      } else {
        setIsPartTime(value === "in_time" ? "fulltime" : "parttime");
      }
    } else {
      setIsPartTime("");
      setDateAvailable([]);
    }
  };
  
  const renderDaysCheckboxes = () => {
    const weekDays = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์"];
  
    return (
      <div className="flex flex-wrap gap-4">
        <label className="font-semibold text-gray-600">เลือกวันที่คุณสามารถทำงานได้:</label>
        {weekDays.map((day, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`day_${index}`}
              value={day}
              disabled
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

 
  const Back = (scholarship_id) => {
    router.push(`/evaluateStudent/${scholarship_id}/${organization_id}`);
    
};

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <>
    
    <Navbar/>
    <div className="container mx-auto px-4 py-8">
      <form
        className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6"
      >
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">ดูข้อมูลการสมัครทุนจ้างงาน</h1>

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
            <label htmlFor="file" className="font-medium text-gray-700">ไฟล์ที่อัปโหลดแล้ว:</label>{" "}
            <a href={`${baseUrl}/${relatedWorks}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
              ดูไฟล์ที่อัปโหลด
            </a>
            <input
              type="file"
              id="file"
              name="file"
              disabled
              onChange={(e) => setFile(e.target.files[0])}
              className="block mt-2 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="in_time"
                value="in_time"
                disabled
                checked={isPartTime === "fulltime" || isPartTime === "both"}
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
                disabled
                checked={isPartTime === "parttime" || isPartTime === "both"}
                onChange={handlePartTimeChange}
                className="h-5 w-5 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="out_time" className="text-gray-700">นอกเวลา</label>
            </div>
          </div>

          {isPartTime === "fulltime" || isPartTime === "both" ? renderDaysCheckboxes() : null}
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={() => Back(scholarship_id)}
            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-500 transition ease-in-out duration-300 transform hover:scale-105"
          >
            ย้อนกลับ
          </button>
        </div>
      </form>
    </div>
    <Foter/>
    </>
  );
}