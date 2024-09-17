// "use client";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { usePathname } from "next/navigation";
// import { useRouter } from "next/navigation";

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

//   // สถานะที่ต้องใช้ในฟอร์ม
//   const [related_works, setRelatedWorks] = useState("");
//   const [isPartTime, setIsPartTime] = useState(""); // เก็บค่า fulltime หรือ parttime หรือ both
//   const [dateAvailable, setDateAvailable] = useState([]); // เก็บวันที่สามารถทำงานได้
//   const [startTime, setStartTime] = useState({}); // เก็บเวลาเริ่มต้นในแต่ละวัน
//   const [endTime, setEndTime] = useState({}); // เก็บเวลาสิ้นสุดในแต่ละวัน

//   const [scholarships, setScholarships] = useState({});

//   // กำหนดวันต่างๆ
//   const weekDays = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์"];
//   const weekendDays = ["เสาร์", "อาทิตย์"];

//   // ฟังก์ชันจัดการการเปลี่ยนแปลงของเวลางาน (นอกเวลา, ในเวลา หรือทั้ง 2)
//   const handlePartTimeChange = (e) => {
//     const { value, checked } = e.target;
//     if (checked) {
//       if (value === "in_time" && isPartTime === "parttime") {
//         setIsPartTime("both");
//       } else if (value === "out_time" && isPartTime === "fulltime") {
//         setIsPartTime("both");
//       } else {
//         setIsPartTime(value === "in_time" ? "fulltime" : "parttime");
//       }
//     } else {
//       setIsPartTime("");
//     }
//   };

//   // ฟังก์ชันจัดการการเลือกวัน
//   const handleDaySelectionChange = (e, day) => {
//     const { checked } = e.target;
//     if (checked) {
//       setDateAvailable([...dateAvailable, day]);
//     } else {
//       setDateAvailable(dateAvailable.filter((selectedDay) => selectedDay !== day));
//       setStartTime({ ...startTime, [day]: "" });
//       setEndTime({ ...endTime, [day]: "" });
//     }
//   };

//   // ฟังก์ชันจัดการเวลาเริ่มและเวลาสิ้นสุด
//   const handleTimeChange = (e, day, type) => {
//     const { value } = e.target;
//     if (type === "start_time") {
//       setStartTime({ ...startTime, [day]: value });
//     } else {
//       setEndTime({ ...endTime, [day]: value });
//     }
//   };

//   // ดึงข้อมูลทุนโดยใช้ scholarship_id
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

//   // เมื่อ component ถูก mount
//   useEffect(() => {
//     if (scholarship_id) {
//       getDataById(scholarship_id);
//     }
//   }, [scholarship_id]);

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const fileInput = event.target.querySelector('input[type="file"]');
//     const formData = new FormData();

//     // ตรวจสอบว่ามี session.user และ scholarship_id
//     if (!session?.user?.student_id || !scholarship_id) {
//       alert("Student ID หรือ Scholarship ID หายไป.");
//       return;
//     }

//     try {
//       // เช็คว่าผู้ใช้เคยสมัครทุนนี้ไปแล้วหรือยัง
//       const checkRegistrationResponse = await fetch(`/api/student_scholarships/?student_id=${session.user.student_id}`,
//         {
//           method: "GET",
//         }
//       );

//       const checkRegistrationData = await checkRegistrationResponse.json();

//       if (checkRegistrationData.exists) {
//         // ถ้าเคยสมัครแล้วให้แสดงข้อความและหยุดการสมัคร
//         alert("เคยสมัครไปแล้ว");
//         return;
//       }

//       // เพิ่มข้อมูลลงใน FormData
//       formData.append("student_id", session.user.student_id);
//       formData.append("scholarship_id", scholarship_id); // ส่ง scholarship_id ด้วย
//       formData.append("related_works", related_works);
//       formData.append("is_parttime", isPartTime);
//       formData.append("date_available", JSON.stringify(dateAvailable));
//       formData.append("start_time", JSON.stringify(startTime));
//       formData.append("end_time", JSON.stringify(endTime));
//       formData.append("scholarships", JSON.stringify(scholarships));

//       if (fileInput.files.length > 0) {
//         formData.append("file", fileInput.files[0]);
//       }

//       const response = await fetch("/api/student_scholarships", {
//         method: "POST",
//         body: formData, // ใช้ FormData เพื่อรองรับการอัปโหลดไฟล์
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
//           router.push(`/welcome/showStudentScholarships`);
//         } else {
//           alert("การสมัครทุนการศึกษาไม่สำเร็จ");
//         }
//       }

//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert("เกิดข้อผิดพลาดขณะส่งฟอร์ม");
//     }
//   };

//   // แสดง checkbox สำหรับการเลือกวันที่สามารถทำงานได้
//   const renderDaysCheckboxes = () => {
//     let daysToRender = [];

//     if (isPartTime === "fulltime") {
//       daysToRender = weekDays; // แสดงวันจันทร์-ศุกร์
//     } else if (isPartTime === "parttime" || isPartTime === "both") {
//       daysToRender = [...weekDays, ...weekendDays]; // แสดงวันจันทร์-อาทิตย์
//     }

//     return (
//       <>
//         <label>เลือกวันที่คุณสามารถทำงานได้:</label>
//         {daysToRender.map((day, index) => (
//           <div key={index}>
//             <input
//               type="checkbox"
//               id={`day_${index}`}
//               value={day}
//               checked={dateAvailable.includes(day)}
//               onChange={(e) => handleDaySelectionChange(e, day)}
//             />
//             <label htmlFor={`day_${index}`} className="ml-2">
//               {day}
//             </label>

//             <div>
//               <label>เวลาเริ่ม:</label>
//               <input
//                 type="time"
//                 value={startTime[day] || ""}
//                 onChange={(e) => handleTimeChange(e, day, "start_time")}
//                 disabled={!dateAvailable.includes(day)} // ปิดการใช้งานเมื่อไม่ได้เลือกวัน
//               />
//             </div>
//             <div>
//               <label>เวลาสิ้นสุด:</label>
//               <input
//                 type="time"
//                 value={endTime[day] || ""}
//                 onChange={(e) => handleTimeChange(e, day, "end_time")}
//                 disabled={!dateAvailable.includes(day)} // ปิดการใช้งานเมื่อไม่ได้เลือกวัน
//               />
//             </div>
//           </div>
//         ))}
//       </>
//     );
//   };

//   return (
//     <div>
//       <h1>สมัครทุนการศึกษา</h1>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="file">Upload File:</label>
//           <input
//             type="file"
//             id="file"
//             name="file"
//             onChange={(e) => setRelatedWorks(e.target.value)}
//           />
//         </div>

//         <div>
//           <input
//             type="checkbox"
//             id="in_time"
//             value="in_time"
//             checked={isPartTime === "fulltime" || isPartTime === "both"}
//             onChange={handlePartTimeChange}
//           />
//           <label htmlFor="in_time" className="ml-2">
//             ในเวลา
//           </label>

//           <br />

//           <input
//             type="checkbox"
//             id="out_time"
//             value="out_time"
//             checked={isPartTime === "parttime" || isPartTime === "both"}
//             onChange={handlePartTimeChange}
//           />
//           <label htmlFor="out_time" className="ml-2">
//             นอกเวลา
//           </label>
//         </div>

//         {/* แสดง checkbox วันจันทร์ - อาทิตย์ และ input เวลาเริ่ม-สิ้นสุด */}
//         {isPartTime && renderDaysCheckboxes()}

//         <button type="submit">สมัคร</button>
//       </form>
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Navber from "@/app/components/Navber";

export default function ScholarshipRegistration({ params }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  let scholarship_id = params?.id;
  if (!scholarship_id) {
    const parts = pathname.split("/");
    scholarship_id = parts[parts.length - 1];
  }

  console.log(scholarship_id, "scholarship_id");

  const [related_works, setRelatedWorks] = useState("");
  const [isPartTime, setIsPartTime] = useState("");
  const [scholarships, setScholarships] = useState({});

  const getDataById = async (scholarship_id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/scholarships/${scholarship_id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
      setScholarships(data);
      console.log(data, "data");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (scholarship_id) {
      getDataById(scholarship_id);
    }
  }, [scholarship_id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    console.log(isPartTime, "isPartTime before submit");
    
    if (!isPartTime) {
      alert("กรุณาเลือกประเภทงานในเวลา/นอกเวลา");
      return;
    }
  
    const fileInput = event.target.querySelector('input[type="file"]');
    const formData = new FormData();
  
    if (!session?.user?.student_id || !scholarship_id) {
      alert("Student ID หรือ Scholarship ID หายไป.");
      return;
    }
  
    try {
      const checkRegistrationResponse = await fetch(`/api/student_scholarships/?student_id=${session.user.student_id}`,
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
          router.push("/welcome/showStudentScholarships");
        } else {
          alert("การสมัครทุนการศึกษาไม่สำเร็จ");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("เกิดข้อผิดพลาดขณะส่งฟอร์ม");
    }
  };
  
  return (
    <>
    <Navber session={session}/> 
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-500">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center mb-6">สมัครทุนการศึกษา</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="file" className="font-medium text-gray-700">Upload File:</label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={(e) => setRelatedWorks(e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700">ปฎิบัติงานนอกเวลาได้หรือไม่</label>
            <div className="flex items-center space-x-4">
              <div>
                <input
                  type="radio"
                  id="in_time"
                  value="Yes"
                  name="is_parttime"
                  checked={isPartTime === "Yes"}
                  onChange={(e) => setIsPartTime(e.target.value)}
                  className="focus:ring-blue-500"
                />
                <label htmlFor="in_time" className="ml-2 text-gray-600">ปฎิบัติงานนอกเวลาได้</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="out_time"
                  value="No"
                  name="is_parttime"
                  checked={isPartTime === "No"}
                  onChange={(e) => setIsPartTime(e.target.value)}
                  className="focus:ring-blue-500"
                />
                <label htmlFor="out_time" className="ml-2 text-gray-600">ปฎิบัติงานนอกเวลาไม่ได้</label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
          >
            สมัคร
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
