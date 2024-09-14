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
  const [relatedWorks, setRelatedWorks] = useState("");
  const [isPartTime, setIsPartTime] = useState(""); // เก็บค่า fulltime หรือ parttime หรือ both
  const [dateAvailable, setDateAvailable] = useState([]); // เก็บวันที่สามารถทำงานได้
  const [startTime, setStartTime] = useState({}); // เวลาเริ่มต้นในแต่ละวัน
  const [endTime, setEndTime] = useState({}); // เวลาสิ้นสุดในแต่ละวัน

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
      setRelatedWorks(data.related_works);
      setIsPartTime(data.is_parttime);
      setDateAvailable(JSON.parse(data.date_available));
      setStartTime(JSON.parse(data.start_time));
      setEndTime(JSON.parse(data.end_time));
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

  console.log(session.user.student_id,"student_id");
  console.log(relatedWorks,"relatedWorks");
  console.log(isPartTime,"isPartTime");


  // ฟังก์ชันจัดการการส่งฟอร์ม
  const handleSubmit = async (event) => {
    event.preventDefault();
    const fileInput = event.target.querySelector('input[type="file"]');
    const formData = new FormData();
    

    try {
      // เพิ่มข้อมูลลงใน FormData
      formData.append("student_id", session.user.student_id);
      formData.append("related_works", relatedWorks);
      formData.append("is_parttime", isPartTime);
      formData.append("date_available", JSON.stringify(dateAvailable));
      formData.append("start_time", JSON.stringify(startTime));
      formData.append("end_time", JSON.stringify(endTime));

      if (fileInput.files.length > 0) {
        formData.append("file", fileInput.files[0]);
      }

      const response = await fetch(`/api/student_scholarships/update_registration`, {
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

  // ฟังก์ชันจัดการการเลือกวันที่
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

        {/* แสดง checkbox วันจันทร์ - อาทิตย์ และ input เวลาเริ่ม-สิ้นสุด */}
        {isPartTime && renderDaysCheckboxes()}

        <button type="submit">บันทึกการแก้ไข</button>
      </form>
    </div>
  );
}
