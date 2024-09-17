"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function ScholarshipRegistration({ params }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const student_id = session.user.student_id;

  let scholarship_id = params?.id;
  if (!scholarship_id) {
    const parts = pathname.split("/");
    scholarship_id = parts[parts.length - 1];
  }

  console.log(scholarship_id, "scholarship_id");

  // สถานะที่ต้องใช้ในฟอร์ม
  const [related_works, setRelatedWorks] = useState("");
  const [isPartTime, setIsPartTime] = useState(""); // เก็บค่า fulltime หรือ parttime หรือ both
  const [dateAvailable, setDateAvailable] = useState([]); // เก็บวันที่สามารถทำงานได้

  const [scholarships, setScholarships] = useState({});
  const [academic_year, setAcademicYear] = useState("");
  const [academic_term, setAcademicTerm] = useState("");
  const [student_firstname, setStudentFirstName] = useState("");
  const [student_lastname, setStudentLastName] = useState("");
  const [student_faculty, setStudentFaculty] = useState("");
  const [student_field, setStudentField] = useState("");
  const [student_curriculum, setStudentCurriculum] = useState("");
  const [student_year, setStudentYear] = useState("");
  const [student_gpa, setStudentGpa] = useState("");
  const [student_phone, setStudentPhone] = useState("");

  // กำหนดวันต่างๆ
  const weekDays = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์"];

  // ฟังก์ชันจัดการการเปลี่ยนแปลงของเวลางาน (นอกเวลา, ในเวลา หรือทั้ง 2)
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
    }
  };

  // ฟังก์ชันจัดการการเลือกวัน
  const handleDaySelectionChange = (e, day) => {
    const { checked } = e.target;
    if (checked) {
      setDateAvailable([...dateAvailable, day]);
    } else {
      setDateAvailable(dateAvailable.filter((selectedDay) => selectedDay !== day));
    }
  };

  // ดึงข้อมูลนักศึกษาและทุน
  const getStudentById = async (student_id) => {
    try {
      const res = await fetch(`/api/student/${student_id}`, {
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
      setStudentField(data.student_field);
      setStudentCurriculum(data.student_curriculum);
      setStudentYear(data.student_year);
      setStudentGpa(data.student_gpa);
      setStudentPhone(data.student_phone);
      console.log(data, "data");
    } catch (error) {
      console.log(error);
    }
  };

  const getDataById = async (scholarship_id) => {
    try {
      const res = await fetch(`/api/scholarships/${scholarship_id}`, {
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
      console.log(data, "data");
    } catch (error) {
      console.log(error);
    }
  };

  // เมื่อ component ถูก mount
  useEffect(() => {
    getStudentById(student_id);
    if (scholarship_id) {
      getDataById(scholarship_id);
    }
  }, [scholarship_id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const fileInput = event.target.querySelector('input[type="file"]');
    const formData = new FormData();

    if (!session?.user?.student_id || !scholarship_id) {
      alert("Student ID หรือ Scholarship ID หายไป.");
      return;
    }

    try {
      const checkRegistrationResponse = await fetch(
        `/api/student_scholarships/?student_id=${session.user.student_id}`,
        {
          method: "GET",
        }
      );

      const checkRegistrationData = await checkRegistrationResponse.json();

      if (checkRegistrationData.exists) {
        alert("เคยสมัครไปแล้ว");
        return;
      }

      formData.append("student_id", session.user.student_id);
      formData.append("scholarship_id", scholarship_id);
      formData.append("related_works", related_works);
      formData.append("is_parttime", isPartTime);
      formData.append("date_available", JSON.stringify(dateAvailable));
      formData.append("scholarships", JSON.stringify(scholarships));

      if (fileInput.files.length > 0) {
        formData.append("file", fileInput.files[0]);
      }

      const response = await fetch("/api/student_scholarships", {
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
        const result = await response.json();
        if (result.success) {
          alert("สมัครทุนการศึกษาสำเร็จ!");
          router.push(`/welcome/showStudentScholarships`);
        } else {
          alert("การสมัครทุนการศึกษาไม่สำเร็จ");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("เกิดข้อผิดพลาดขณะส่งฟอร์ม");
    }
  };

  const renderDaysCheckboxes = () => {
    let daysToRender = [];

    if (isPartTime === "fulltime") {
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
            <label htmlFor={`day_${index}`} className="text-gray-700">
              {day}
            </label>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6"
      >
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">สมัครทุนจ้างงาน</h1>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-700">ข้อมูลนักศึกษา</h2>
            <div className="text-gray-600">
              <label className="block">ชื่อ: {student_firstname}</label>
              <label className="block">นามสกุล: {student_lastname}</label>
              <label className="block">คณะ: {student_faculty}</label>
              <label className="block">สาขา: {student_field}</label>
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
            <label htmlFor="file" className="font-medium text-gray-700">อัปโหลดไฟล์:</label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={(e) => setRelatedWorks(e.target.value)}
              className="block mt-2 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="in_time"
                value="in_time"
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
                checked={isPartTime === "parttime" || isPartTime === "both"}
                onChange={handlePartTimeChange}
                className="h-5 w-5 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="out_time" className="text-gray-700">นอกเวลา</label>
            </div>
          </div>

          {isPartTime && renderDaysCheckboxes()}
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
  );
}


// "use client";
// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { usePathname } from "next/navigation";
// import { useRouter } from "next/navigation";
// import Navber from "@/app/components/Navber";

// export default function ScholarshipRegistration({ params }) {
//   const { data: session } = useSession();
//   const pathname = usePathname();
//   const router = useRouter();

//   let scholarship_id = params?.id;
//   if (!scholarship_id) {
//     const parts = pathname.split("/");
//     scholarship_id = parts[parts.length - 1];
//   }

//   console.log(scholarship_id, "scholarship_id");

//   const [related_works, setRelatedWorks] = useState("");
//   const [isPartTime, setIsPartTime] = useState("");
//   const [scholarships, setScholarships] = useState({});

//   const getDataById = async (scholarship_id) => {
//     try {
//       const res = await fetch(`http://localhost:3000/api/scholarships/${scholarship_id}`, {
//         method: "GET",
//         cache: "no-store",
//       });

//       if (!res.ok) {
//         throw new Error("Failed to fetch");
//       }

//       const data = await res.json();
//       setScholarships(data);
//       console.log(data, "data");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (scholarship_id) {
//       getDataById(scholarship_id);
//     }
//   }, [scholarship_id]);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
  
//     console.log(isPartTime, "isPartTime before submit");
    
//     if (!isPartTime) {
//       alert("กรุณาเลือกประเภทงานในเวลา/นอกเวลา");
//       return;
//     }
  
//     const fileInput = event.target.querySelector('input[type="file"]');
//     const formData = new FormData();
  
//     if (!session?.user?.student_id || !scholarship_id) {
//       alert("Student ID หรือ Scholarship ID หายไป.");
//       return;
//     }
  
//     try {
//       const checkRegistrationResponse = await fetch(`/api/student_scholarships/?student_id=${session.user.student_id}`,
//         {
//           method: "GET",
//         }
//       );
  
//       const checkRegistrationData = await checkRegistrationResponse.json();
  
//       if (checkRegistrationData.exists) {
//         alert("เคยสมัครไปแล้ว");
//         return;
//       }
  
//       formData.append("student_id", session.user.student_id);
//       formData.append("scholarship_id", scholarship_id);
//       formData.append("related_works", related_works);
//       formData.append("is_parttime", isPartTime);
//       formData.append("scholarships", JSON.stringify(scholarships));
  
//       if (fileInput.files.length > 0) {
//         formData.append("file", fileInput.files[0]);
//       }
  
//       const response = await fetch("/api/student_scholarships", {
//         method: "POST",
//         body: formData,
//       });
  
//       if (!response.ok) {
//         const errorData = await response.json();
//         if (errorData.error && errorData.error.includes("Duplicate entry")) {
//           alert("เคยสมัครทุนนี้ไปแล้ว");
//         } else {
//           throw new Error("การส่งฟอร์มล้มเหลว");
//         }
//       } else {
//         const result = await response.json();
//         if (result.success) {
//           alert("สมัครทุนการศึกษาสำเร็จ!");
//           router.push("/welcome/showStudentScholarships");
//         } else {
//           alert("การสมัครทุนการศึกษาไม่สำเร็จ");
//         }
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert("เกิดข้อผิดพลาดขณะส่งฟอร์ม");
//     }
//   };
  
//   return (
//     <>
//     <Navber session={session}/> 
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-500">
//       <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
//         <h1 className="text-2xl font-bold text-center mb-6">สมัครทุนการศึกษา</h1>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="flex flex-col space-y-2">
//             <label htmlFor="file" className="font-medium text-gray-700">Upload File:</label>
//             <input
//               type="file"
//               id="file"
//               name="file"
//               onChange={(e) => setRelatedWorks(e.target.value)}
//               className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div className="flex flex-col space-y-2">
//             <label className="font-medium text-gray-700">ปฎิบัติงานนอกเวลาได้หรือไม่</label>
//             <div className="flex items-center space-x-4">
//               <div>
//                 <input
//                   type="radio"
//                   id="in_time"
//                   value="Yes"
//                   name="is_parttime"
//                   checked={isPartTime === "Yes"}
//                   onChange={(e) => setIsPartTime(e.target.value)}
//                   className="focus:ring-blue-500"
//                 />
//                 <label htmlFor="in_time" className="ml-2 text-gray-600">ปฎิบัติงานนอกเวลาได้</label>
//               </div>
//               <div>
//                 <input
//                   type="radio"
//                   id="out_time"
//                   value="No"
//                   name="is_parttime"
//                   checked={isPartTime === "No"}
//                   onChange={(e) => setIsPartTime(e.target.value)}
//                   className="focus:ring-blue-500"
//                 />
//                 <label htmlFor="out_time" className="ml-2 text-gray-600">ปฎิบัติงานนอกเวลาไม่ได้</label>
//               </div>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
//           >
//             สมัคร
//           </button>
//         </form>
//       </div>
//     </div>
//     </>
//   );
// }
