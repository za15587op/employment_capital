"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

export default function EditScholarshipRegistration({ params }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // รับ `regist_id` จาก params
  let regist_id = params?.id;
  if (!regist_id) {
    const parts = pathname.split("/");
    regist_id = parts[parts.length - 1];
  }

  // สถานะที่ใช้ในฟอร์ม
  const [relatedWorks, setRelatedWorks] = useState(""); // ใช้สำหรับเก็บพาธไฟล์ที่อัปโหลด
  const [file, setFile] = useState(null); // ไฟล์ที่อัปโหลดใหม่
  const [isPartTime, setIsPartTime] = useState(""); // เก็บค่า fulltime หรือ parttime หรือ both
  const [dateAvailable, setDateAvailable] = useState([]); // เก็บวันที่สามารถทำงานได้
  const [startTime, setStartTime] = useState({}); // เก็บเวลาเริ่มต้นในแต่ละวัน
  const [endTime, setEndTime] = useState({}); // เก็บเวลาสิ้นสุดในแต่ละวัน

  const [scholarship_id, setScholarshipId] = useState("");
  const [academic_year, setAcademicYear] = useState("");
  const [academic_term, setAcademicTerm] = useState("");
  // กำหนดวันต่างๆ
  const weekDays = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์"];
  const weekendDays = ["เสาร์", "อาทิตย์"];

  // ฟังก์ชันดึงข้อมูลการสมัครที่มีอยู่
  const getExistingData = async () => {
    try {
      const res = await fetch(`/api/student_scholarships/edit/${regist_id}`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
      console.log(data, "data");

      // ตั้งค่าข้อมูลจากการดึง
      setRelatedWorks(data.related_works); // ตั้งค่าพาธไฟล์
      setIsPartTime(data.datetime_available[0]?.is_parttime); // ตั้งค่า part-time หรือ full-time จากข้อมูลแรก
      setDateAvailable(data.datetime_available.map(d => d.date_available)); // แยกวันที่ออก
      setScholarshipId(data.scholarship_id);
      setAcademicTerm(data.academic_year); // ตั้งค่าพาธไฟล์
      setAcademicYear(data.academic_term); // ตั้งค่าพาธไฟล์
      setStartTime(
        data.datetime_available.reduce((acc, cur) => {
          acc[cur.date_available] = cur.start_time;
          return acc;
        }, {})
      );
      setEndTime(
        data.datetime_available.reduce((acc, cur) => {
          acc[cur.date_available] = cur.end_time;
          return acc;
        }, {})
      );
      
    } catch (error) {
      console.log(error);
    }
  };

  // ใช้ useEffect เพื่อดึงข้อมูลการสมัครเมื่อ component ถูก mount
  useEffect(() => {
    if (regist_id) {
      getExistingData();
    }
  }, [regist_id]);

  // ฟังก์ชันจัดการการส่งฟอร์มในฝั่ง edit
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    try {
      // เพิ่มข้อมูลลงใน FormData
      formData.append("student_id", session.user.student_id); // เหมือนใน create
      formData.append("regist_id", regist_id); // ใช้ regist_id สำหรับการแก้ไข
      formData.append("related_works", relatedWorks); // เหมือนกับที่ใช้ใน create
      formData.append("is_parttime", isPartTime); // เหมือนใน create
      formData.append("date_available", JSON.stringify(dateAvailable));
      formData.append("start_time", JSON.stringify(startTime));
      formData.append("end_time", JSON.stringify(endTime));
      formData.append("academic_year", academic_year); // เหมือนใน create
      formData.append("academic_term", academic_term); // เหมือนใน create
      formData.append("scholarship_id", scholarship_id); // เหมือนใน create

      // อัปโหลดไฟล์
      if (file) {
        formData.append("file", file); // เพิ่มไฟล์ใหม่หากมีการเลือกไฟล์
      }

      // ส่งข้อมูลผ่าน API
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

  // ฟังก์ชันจัดการการเปลี่ยนแปลงในเวลาทำงาน (fulltime, parttime, both)
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
      setIsPartTime(""); // reset when none is selected
    }
  };

  // ฟังก์ชันจัดการการเปลี่ยนแปลงวันที่
  const handleDaySelectionChange = (e, day) => {
    const { checked } = e.target;
    if (checked) {
      setDateAvailable([...dateAvailable, day]);
    } else {
      setDateAvailable(dateAvailable.filter((selectedDay) => selectedDay !== day));
      setStartTime({ ...startTime, [day]: "" });
      setEndTime({ ...endTime, [day]: "" });
    }
  };

  // ฟังก์ชันจัดการเวลาเริ่มและเวลาสิ้นสุด
  const handleTimeChange = (e, day, type) => {
    const { value } = e.target;
    if (type === "start_time") {
      setStartTime({ ...startTime, [day]: value });
    } else {
      setEndTime({ ...endTime, [day]: value });
    }
  };

  // แสดง checkbox สำหรับการเลือกวันที่สามารถทำงานได้
  const renderDaysCheckboxes = () => {
    let daysToRender = [];

    if (isPartTime === "fulltime") {
      daysToRender = weekDays; // แสดงวันจันทร์-ศุกร์
    } else if (isPartTime === "parttime" || isPartTime === "both") {
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
              checked={dateAvailable.includes(day)}
              onChange={(e) => handleDaySelectionChange(e, day)}
            />
            <label htmlFor={`day_${index}`} className="ml-2">
              {day}
            </label>

            <div>
              <label>เวลาเริ่ม:</label>
              <input
                type="time"
                value={startTime[day] || ""}
                onChange={(e) => handleTimeChange(e, day, "start_time")}
                disabled={!dateAvailable.includes(day)} // ปิดการใช้งานเมื่อไม่ได้เลือกวัน
              />
            </div>
            <div>
              <label>เวลาสิ้นสุด:</label>
              <input
                type="time"
                value={endTime[day] || ""}
                onChange={(e) => handleTimeChange(e, day, "end_time")}
                disabled={!dateAvailable.includes(day)} // ปิดการใช้งานเมื่อไม่ได้เลือกวัน
              />
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div>
      <h1>แก้ไขข้อมูลการสมัครทุนการศึกษา</h1>
      <form onSubmit={handleSubmit}>
        <div>
          {relatedWorks && (
            <>
              <label htmlFor="file">ไฟล์ที่อัปโหลดแล้ว:</label>{" "}
              <a href={relatedWorks} target="_blank" rel="noopener noreferrer">
                ดูไฟล์ที่อัปโหลด
              </a>
              <input
                type="file"
                id="file"
                name="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </>
          )}
        </div>

        <div>
          <input
            type="checkbox"
            id="in_time"
            value="in_time"
            checked={isPartTime === "fulltime" || isPartTime === "both"}
            onChange={handlePartTimeChange}
          />
          <label htmlFor="in_time" className="ml-2">
            ในเวลา
          </label>

          <br />

          <input
            type="checkbox"
            id="out_time"
            value="out_time"
            checked={isPartTime === "parttime" || isPartTime === "both"}
            onChange={handlePartTimeChange}
          />
          <label htmlFor="out_time" className="ml-2">
            นอกเวลา
          </label>
        </div>

        {/* แสดงข้อมูล dateAvailable, startTime, endTime */}
        {renderDaysCheckboxes()}

        <button type="submit">บันทึกการแก้ไข</button>
      </form>
    </div>
  );
}
