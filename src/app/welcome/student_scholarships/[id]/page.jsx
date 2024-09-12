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
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function ScholarshipRegistration({ params }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  
  let scholarship_id = params?.id;
  if (!scholarship_id) {
    const parts = pathname.split('/');
    scholarship_id = parts[parts.length - 1];
  }

  const [related_works, setRelatedWorks] = useState("");
  const [datetime_available, setDateTimeAvailable] = useState({
    date_available: "",
    is_parttime: "",
    start_time: "",
    end_time: ""
  });

  const handleDateTimeAvailableChange = (e) => {
    const { value, checked } = e.target;
    let newDateAvailable = datetime_available.date_available;

    // เปลี่ยนค่า date_available ตามการเลือก checkbox
    if (checked) {
      if (value === "in_time" && newDateAvailable === "parttime") {
        newDateAvailable = "both";
      } else if (value === "out_time" && newDateAvailable === "fulltime") {
        newDateAvailable = "both";
      } else {
        newDateAvailable = value === "in_time" ? "fulltime" : "parttime";
      }
    } else {
      // ถ้า uncheck, ตรวจสอบค่าและปรับใหม่
      if (value === "in_time" && newDateAvailable === "both") {
        newDateAvailable = "parttime";
      } else if (value === "out_time" && newDateAvailable === "both") {
        newDateAvailable = "fulltime";
      } else {
        newDateAvailable = "";
      }
    }

    // อัปเดตสถานะ
    setDateTimeAvailable((prev) => ({
      ...prev,
      date_available: newDateAvailable,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const fileInput = event.target.querySelector('input[type="file"]');
    const formData = new FormData();

    // เพิ่มข้อมูลลงใน FormData
    formData.append("student_id", session.user.student_id);
    formData.append("related_works", related_works);
    formData.append("datetime_available", JSON.stringify(datetime_available));

    // เพิ่มไฟล์ที่เลือกลงใน FormData
    if (fileInput.files.length > 0) {
      formData.append("file", fileInput.files[0]);
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
              datetime_available.date_available === "fulltime" || 
              datetime_available.date_available === "both"
            }
            onChange={handleDateTimeAvailableChange}
          />
          <label htmlFor="in_time" className="ml-2">
            ในเวลา
          </label>

          <br />

          <input
            type="checkbox"
            id="out_time"
            value="out_time"
            checked={
              datetime_available.date_available === "parttime" || 
              datetime_available.date_available === "both"
            }
            onChange={handleDateTimeAvailableChange}
          />
          <label htmlFor="out_time" className="ml-2">
            นอกเวลา
          </label>
        </div>

        <button type="submit">สมัคร</button>
      </form>
    </div>
  );
}


