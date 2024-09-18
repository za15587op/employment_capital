"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

export default function EditScholarshipRegistration({ params }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  let regist_id = params?.id;
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
  const [student_field, setStudentField] = useState("");
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
      setRelatedWorks(data.related_works);
      setIsPartTime(data.datetime_available[0]?.is_parttime);
      setDateAvailable(data.datetime_available.map(d => d.date_available));
      setScholarshipId(data.scholarship_id);
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
      formData.append("is_parttime", isPartTime);
      formData.append("date_available", JSON.stringify(dateAvailable));
      formData.append("academic_year", academic_year);
      formData.append("academic_term", academic_term);
      formData.append("scholarship_id", scholarship_id);

      if (file) {
        formData.append("file", file);
      }

      const response = await fetch(`/api/student_scholarships/edit/${regist_id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("การส่งฟอร์มล้มเหลว");
      }

      const result = await response.json();
      if (result.success) {
        alert("แก้ไขข้อมูลการสมัครสำเร็จ!");
        router.push(`/welcome/showStudentScholarships`);
      } else {
        alert("การแก้ไขข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("เกิดข้อผิดพลาดขณะส่งฟอร์ม");
    }
  };

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

  const handleDaySelectionChange = (e, day) => {
    const { checked } = e.target;
    if (checked) {
      setDateAvailable([...dateAvailable, day]);
    } else {
      setDateAvailable(dateAvailable.filter((selectedDay) => selectedDay !== day));
    }
  };

  const renderDaysCheckboxes = () => {
    let daysToRender = [];

    if (isPartTime === "fulltime") {
      daysToRender = weekDays;
    }

    return (
      <div className="flex flex-wrap gap-4">
        <label className="font-semibold text-gray-600">เลือกวันที่คุณสามารถทำงานได้:</label>
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
    <div className="container mx-auto px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6"
      >
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">แก้ไขข้อมูลการสมัครทุนจ้างงาน</h1>

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
            <label htmlFor="file" className="font-medium text-gray-700">ไฟล์ที่อัปโหลดแล้ว:</label>{" "}
            <a href={`/${relatedWorks}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
              ดูไฟล์ที่อัปโหลด
            </a>
            <input
              type="file"
              id="file"
              name="file"
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
            บันทึกการแก้ไข
          </button>
        </div>
      </form>
    </div>
  );
}


// "use client";
// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { usePathname, useRouter } from "next/navigation";
// import Navber from "@/app/components/Navber";

// export default function EditScholarshipRegistration({ params }) {
//   const { data: session, status } = useSession();
//   const pathname = usePathname();
//   const router = useRouter();
  
//   let regist_id = params?.id;
//   if (!regist_id) {
//     const parts = pathname.split("/");
//     regist_id = parts[parts.length - 1];
//   }

//   const [relatedWorks, setRelatedWorks] = useState("");
//   const [file, setFile] = useState(null);
//   const [isPartTime, setIsPartTime] = useState("");

//   const [scholarship_id, setScholarshipId] = useState("");
//   const [academic_year, setAcademicYear] = useState("");
//   const [academic_term, setAcademicTerm] = useState("");

//   const getExistingData = async () => {
//     try {
//       const res = await fetch(`/api/student_scholarships/edit/${regist_id}`, {
//         method: "GET",
//       });

//       if (!res.ok) {
//         throw new Error("Failed to fetch");
//       }

//       const data = await res.json();
//       setRelatedWorks(data.related_works);
//       setIsPartTime(data.is_parttime);
//       setScholarshipId(data.scholarship_id);
//       setAcademicYear(data.academic_year);
//       setAcademicTerm(data.academic_term);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (regist_id) {
//       getExistingData();
//     }
//   }, [regist_id]);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const formData = new FormData();

//     try {
//       formData.append("student_id", session.user.student_id);
//       formData.append("regist_id", regist_id);
//       formData.append("related_works", relatedWorks);
//       formData.append("is_parttime", isPartTime);
//       formData.append("academic_year", academic_year);
//       formData.append("academic_term", academic_term);
//       formData.append("scholarship_id", scholarship_id);

//       if (file) {
//         formData.append("file", file);
//       }

//       const response = await fetch(
//         `/api/student_scholarships/edit/${regist_id}`,
//         {
//           method: "PUT",
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         throw new Error("การส่งฟอร์มล้มเหลว");
//       }

//       const result = await response.json();
//       if (result.success) {
//         alert("แก้ไขข้อมูลการสมัครสำเร็จ!");
//         router.push(`/welcome/showStudentScholarships`);
//       } else {
//         alert("การแก้ไขข้อมูลไม่สำเร็จ");
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert("เกิดข้อผิดพลาดขณะส่งฟอร์ม");
//     }
//   };

//   return (
//     <>
//     <Navber session={session}/>
//     <div className="min-h-screen bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center">
//       <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
//         <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
//           แก้ไขข้อมูลการสมัครทุนการศึกษา
//         </h1>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             {relatedWorks && (
//               <>
//                 <label
//                   htmlFor="file"
//                   className="block text-gray-700 font-medium mb-2"
//                 >
//                   ไฟล์ที่อัปโหลดแล้ว:
//                 </label>
//                 <a
//                   href={`http://localhost:3000/${relatedWorks}`} // แก้ไขให้ URL ชี้ตรงไปที่โฟลเดอร์ uploads
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-500 underline"
//                 >
//                   ดูไฟล์ที่อัปโหลด
//                 </a>

//                 <input
//                   type="file"
//                   id="file"
//                   name="file"
//                   onChange={(e) => setFile(e.target.files[0])}
//                   className="mt-4 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </>
//             )}
//           </div>

//           <div className="flex flex-col space-y-4">
//             <label className="font-medium text-gray-700">
//               ปฎิบัติงานนอกเวลาได้หรือไม่
//             </label>
//             <div className="flex items-center space-x-4">
//               <div>
//                 <input
//                   type="radio"
//                   id="in_time"
//                   value="Yes"
//                   checked={isPartTime === "Yes"}
//                   onChange={(e) => setIsPartTime(e.target.value)}
//                   className="focus:ring-blue-500"
//                 />
//                 <label htmlFor="in_time" className="ml-2 text-gray-600">
//                   ปฎิบัติงานนอกเวลาได้
//                 </label>
//               </div>
//               <div>
//                 <input
//                   type="radio"
//                   id="out_time"
//                   value="No"
//                   checked={isPartTime === "No"}
//                   onChange={(e) => setIsPartTime(e.target.value)}
//                   className="focus:ring-blue-500"
//                 />
//                 <label htmlFor="out_time" className="ml-2 text-gray-600">
//                   ปฎิบัติงานนอกเวลาไม่ได้
//                 </label>
//               </div>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
//           >
//             บันทึกการแก้ไข
//           </button>
//         </form>
//       </div>
//     </div>
//     </>
//   );
// }
