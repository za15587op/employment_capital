// "use client";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from 'next/navigation';
// import { usePathname } from 'next/navigation';

// export default function ScholarshipRegistration({ params }) {
//   const { data: session, status } = useSession();
//   const { id: scholarship_id } = params || {};
//   const searchParams = usePathname();
//   if(!scholarship_id){
//     const parts = pathname.split('/');
//     const scholarship_id = parts[parts.length - 1];
    
//   }


//   console.log(session, "session");
//   // console.log(scholarship_id, "scholarship_id");

//   const [related_works, setRelatedWorks] = useState("");
//   const [datetime_available, setDateTimeAvailable ] = useState([{date_available:"",	is_parttime:"", start_time:"", end_time:"" }])


//   const handleDateTimeAvailableChange = (e) => {
//     const { value, checked } = e.target;
//     let newDateAvailable = datetime_available.date_available;

//     // เปลี่ยนค่า date_available ตามการเลือก checkbox
//     if (checked) {
//       if (value === "in_time" && newDateAvailable === "parttime") {
//         newDateAvailable = "both";
//       } else if (value === "out_time" && newDateAvailable === "fulltime") {
//         newDateAvailable = "both";
//       } else {
//         newDateAvailable = value === "in_time" ? "fulltime" : "parttime";
//       }
//     } else {
//       // ถ้า uncheck, ตรวจสอบค่าและปรับใหม่
//       if (value === "in_time" && newDateAvailable === "both") {
//         newDateAvailable = "parttime";
//       } else if (value === "out_time" && newDateAvailable === "both") {
//         newDateAvailable = "fulltime";
//       } else {
//         newDateAvailable = "";
//       }
//     }

//     // อัปเดตสถานะ
//     setDateTimeAvailable({
//       ...datetime_available,
//       date_available: newDateAvailable,
//     });
//   };


//   const handleSubmit = async (event) => {
//     event.preventDefault();


//     // const formData = new FormData();

//     // // เพิ่มข้อมูลลงใน FormData
//     // formData.append("student_id", session.user.student_id);
//     // formData.append("skills", JSON.stringify(skills));
//     // formData.append("scholarshipRegistrations", JSON.stringify(scholarshipRegistrations));
//     // formData.append("selectedSkillTypes", JSON.stringify(selectedSkillTypes));
//     // formData.append("studentSkills", JSON.stringify(studentSkills));
  
//     // // เพิ่มไฟล์ที่เลือกลงใน FormData
//     // const fileInput = event.target.querySelector('input[type="file"]');
//     // if (fileInput.files.length > 0) {
//     //   formData.append("file", fileInput.files[0]);
//     // }
  


//     try {
//       const response = await fetch("/api/student_scholarships", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           student_id: session.user.student_id,
//           related_works,
//           datetime_available
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("การส่งฟอร์มล้มเหลว");
//       }

//       const result = await response.json();

//       if (result.success) {
//         alert("สมัครทุนการศึกษาสำเร็จ!");

//         // router.push(
//         //   `/welcome/showStudentScholarships/${session.user.student_id}`
//         // );
//       } else {
//         alert("การสมัครทุนการศึกษาไม่สำเร็จ");
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert("เกิดข้อผิดพลาดขณะส่งฟอร์ม");
//     }
//   };

//   return (
//     <div>
//       {/* <Link href={`/welcome/showStudentScholarships/${session.user.student_id}`}>
//         สถานะการศึกษาทุน
//       </Link> */}
//       <h1>สมัครทุนการศึกษา</h1>
//       <form onSubmit={handleSubmit}>
//           <div>
//             <label htmlFor="file">Upload File:</label>
//             <input
//               type="file" id="file" name="file"
//               placeholder="ผลงานที่เกี่ยวข้อง"
//               onChange={(e) => setRelatedWorks(e.target.value)}
//             />
//           </div>

//            <div>
//           <input
//             type="checkbox"
//             id="in_time"
//             value="in_time"
//             checked={
//               datetime_available.date_available === "fulltime" || 
//               datetime_available.date_available === "both"
//             }
//             onChange={handleDateTimeAvailableChange}
//           />
//           <label htmlFor="in_time" className="ml-2">
//             ในเวลา
//           </label>

//           <br />

//           <input
//             type="checkbox"
//             id="out_time"
//             value="out_time"
//             checked={
//               datetime_available.date_available === "parttime" || 
//               datetime_available.date_available === "both"
//             }
//             onChange={handleDateTimeAvailableChange}
//           />
//           <label htmlFor="out_time" className="ml-2">
//             นอกเวลา
//           </label>
//         </div>


//         <button type="submit">สมัคร</button>
//       </form>
//     </div>
//   );
// }

"use client";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from 'next/navigation';

export default function ScholarshipRegistration({ params }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  let scholarship_id = params?.id;
  if (!scholarship_id) {
    const parts = pathname.split('/');
    scholarship_id = parts[parts.length - 1];
  }

  console.log(scholarship_id, "scholarship_id");
  

  const [related_works, setRelatedWorks] = useState("");
  const [datetime_available, setDateTimeAvailable] = useState({
    is_parttime: "", // เก็บว่าเป็นในเวลา นอกเวลา หรือทั้งสอง
    date_available: [], // เก็บวันที่เลือก
    start_time: {}, // เก็บเวลาเริ่มต้นของแต่ละวัน
    end_time: {} // เก็บเวลาสิ้นสุดของแต่ละวัน
  });

  // กำหนดวันต่างๆ
  const weekDays = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์"];
  const weekendDays = ["เสาร์", "อาทิตย์"];

  // ฟังก์ชันจัดการการเปลี่ยนแปลงของเวลางาน (นอกเวลา, ในเวลา หรือทั้ง 2)
  const handleDateTimeAvailableChange = (e) => {
    const { value, checked } = e.target;
    let newIsPartTime = datetime_available.is_parttime;

    if (checked) {
      if (value === "in_time" && newIsPartTime === "parttime") {
        newIsPartTime = "both";
      } else if (value === "out_time" && newIsPartTime === "fulltime") {
        newIsPartTime = "both";
      } else {
        newIsPartTime = value === "in_time" ? "fulltime" : "parttime";
      }
    } else {
      // ถ้า uncheck, ตรวจสอบค่าและปรับใหม่
      if (value === "in_time" && newIsPartTime === "both") {
        newIsPartTime = "parttime";
      } else if (value === "out_time" && newIsPartTime === "both") {
        newIsPartTime = "fulltime";
      } else {
        newIsPartTime = "";
      }

      // รีเซ็ตค่าเมื่อยกเลิกการเลือก
      setDateTimeAvailable((prev) => ({
        ...prev,
        date_available: [], // ลบวันที่เลือกทั้งหมด
        start_time: {},  // รีเซ็ตเวลาเริ่มต้น
        end_time: {},    // รีเซ็ตเวลาสิ้นสุด
      }));
    }

    setDateTimeAvailable((prev) => ({
      ...prev,
      is_parttime: newIsPartTime,
    }));
  };

  // ฟังก์ชันจัดการการเลือกวันและรีเซ็ตค่าเวลาเมื่อ uncheck
  const handleDaySelectionChange = (e, day) => {
    const { checked } = e.target;
    let newDateAvailable = [...datetime_available.date_available];

    if (checked) {
      newDateAvailable.push(day);
    } else {
      // ถ้า uncheck วันนั้น, ลบวันนั้นออกจากรายการ และรีเซ็ตเวลาเริ่ม-สิ้นสุด
      newDateAvailable = newDateAvailable.filter(selectedDay => selectedDay !== day);
      
      setDateTimeAvailable(prev => ({
        ...prev,
        start_time: {
          ...prev.start_time,
          [day]: "" // รีเซ็ตเวลาเริ่ม
        },
        end_time: {
          ...prev.end_time,
          [day]: "" // รีเซ็ตเวลาสิ้นสุด
        }
      }));
    }

    setDateTimeAvailable(prev => ({
      ...prev,
      date_available: newDateAvailable
    }));
  };

  // ฟังก์ชันจัดการเวลาเริ่มและเวลาสิ้นสุด
  const handleTimeChange = (e, day, type) => {
    const { value } = e.target;
    setDateTimeAvailable(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [day]: value // เก็บเวลาเริ่มหรือสิ้นสุดของแต่ละวัน
      }
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const fileInput = event.target.querySelector('input[type="file"]');
    const formData = new FormData();
  
    // ตรวจสอบว่ามี session.user และ scholarship_id
    if (!session?.user?.student_id || !scholarship_id) {
      alert("Student ID หรือ Scholarship ID หายไป.");
      return;
    }
  
    // เพิ่มข้อมูลลงใน FormData
    formData.append("student_id", session.user.student_id);
    formData.append("scholarship_id", scholarship_id); // ส่ง scholarship_id ด้วย
    formData.append("related_works", related_works);
    formData.append("datetime_available", JSON.stringify(datetime_available));
  
    if (fileInput.files.length > 0) {
      formData.append("file", fileInput.files[0]);
    }

    // เช็คค่า formData ก่อนส่ง
  for (let [key, value] of formData.entries()) {
    console.log(key, value , "formData");
  }
    
  
    try {
      const response = await fetch("/api/student_scholarships", {
        method: "POST",
        body: formData, // ใช้ FormData เพื่อรองรับการอัปโหลดไฟล์
      });
  
      if (!response.ok) {
        throw new Error("การส่งฟอร์มล้มเหลว");
      }
  
      const result = await response.json();
  
      if (result.success) {
        alert("สมัครทุนการศึกษาสำเร็จ!");
      } else {
        alert("การสมัครทุนการศึกษาไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("เกิดข้อผิดพลาดขณะส่งฟอร์ม");
    }
  };
  
  const renderDaysCheckboxes = () => {
    let daysToRender = [];

    if (datetime_available.is_parttime === "fulltime") {
      daysToRender = weekDays; // แสดงวันจันทร์-ศุกร์
    } else if (datetime_available.is_parttime === "parttime") {
      daysToRender = [...weekDays, ...weekendDays]; // แสดงวันจันทร์-อาทิตย์
    } else if (datetime_available.is_parttime === "both") {
      daysToRender = [...weekDays, ...weekendDays]; // แสดงวันจันทร์-อาทิตย์
    }

    return (
      <>
        <label>เลือกวันที่คุณสามารถทำงานได้:</label>
        {daysToRender.map((day, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`day_${index}`}
              value={day}
              checked={datetime_available.date_available.includes(day)}
              onChange={(e) => handleDaySelectionChange(e, day)}
            />
            <label htmlFor={`day_${index}`} className="ml-2">{day}</label>

            <div>
              <label>เวลาเริ่ม:</label>
              <input
                type="time"
                value={datetime_available.start_time[day] || ""}
                onChange={(e) => handleTimeChange(e, day, "start_time")}
                disabled={!datetime_available.date_available.includes(day)} // ปิดการใช้งานเมื่อไม่ได้เลือกวัน
              />
            </div>
            <div>
              <label>เวลาสิ้นสุด:</label>
              <input
                type="time"
                value={datetime_available.end_time[day] || ""}
                onChange={(e) => handleTimeChange(e, day, "end_time")}
                disabled={!datetime_available.date_available.includes(day)} // ปิดการใช้งานเมื่อไม่ได้เลือกวัน
              />
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div>
      <h1>สมัครทุนการศึกษา</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="file">Upload File:</label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={(e) => setRelatedWorks(e.target.value)}
          />
        </div>

        <div>
          <input
            type="checkbox"
            id="in_time"
            value="in_time"
            checked={
              datetime_available.is_parttime === "fulltime" || 
              datetime_available.is_parttime === "both"
            }
            onChange={handleDateTimeAvailableChange}
          />
          <label htmlFor="in_time" className="ml-2">ในเวลา</label>

          <br />

          <input
            type="checkbox"
            id="out_time"
            value="out_time"
            checked={
              datetime_available.is_parttime === "parttime" || 
              datetime_available.is_parttime === "both"
            }
            onChange={handleDateTimeAvailableChange}
          />
          <label htmlFor="out_time" className="ml-2">นอกเวลา</label>
        </div>

        {/* แสดง checkbox วันจันทร์ - อาทิตย์ และ input เวลาเริ่ม-สิ้นสุด */}
        {datetime_available.is_parttime && renderDaysCheckboxes()}

        <button type="submit">สมัคร</button>
      </form>
    </div>
  );
}
