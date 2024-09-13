import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import ScholarshipRegistrations from "../../../../models/scholarshipregistrations";
import DateTimeAvailable from "../../../../models/datetimeavailable";

// กำหนดโฟลเดอร์ที่จะเก็บไฟล์ที่อัปโหลด
const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");

export const config = {
  api: {
    bodyParser: false, // ปิดการแยกข้อมูลของ Next.js เพื่อจัดการข้อมูล multipart form data
  },
};

// ฟังก์ชันช่วยจัดการอัปโหลดไฟล์
async function handleFileUpload(formData) {
  const file = formData.get("file");

  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());

    // ตรวจสอบว่ามีโฟลเดอร์อัปโหลดแล้วหรือไม่ ถ้าไม่มีให้สร้างขึ้นมา
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // บันทึกไฟล์ไปยังโฟลเดอร์ที่กำหนด
    const filePath = path.join(UPLOAD_DIR, file.name);
    fs.writeFileSync(filePath, buffer);

    // ส่งคืนพาธไฟล์เพื่อนำไปเก็บในฐานข้อมูล
    return `/uploads/${file.name}`;
  }

  return null; // กรณีที่ไม่มีการอัปโหลดไฟล์
}

export async function POST(req) {
  try {
    // แยกข้อมูลฟอร์มจากร่างกายคำขอ
    const formData = await req.formData();

    console.log(formData, "formData");
    

    // จัดการการอัปโหลดไฟล์และได้พาธไฟล์
    const filePath = await handleFileUpload(formData);

    const student_id = formData.get("student_id");
    const scholarship_id = formData.get("scholarship_id");
    const related_works = formData.get("related_works");
    const student_status = "Pending";

   // ดึงและแปลงข้อมูล datetime_available จาก JSON string เป็น object
   const datetime_available = JSON.parse(formData.get("datetime_available"));

    console.log(datetime_available, "datetime_available");
    

    // ตรวจสอบว่า student_id และ scholarship_id มีหรือไม่
    if (!student_id || !scholarship_id) {
      return NextResponse.json(
        { success: false, message: "Student ID หรือ Scholarship ID หายไป." },
        { status: 400 }
      );
    }

    // เรียกใช้การสร้าง record ในฐานข้อมูล
    const registration = await ScholarshipRegistrations.create(student_id, scholarship_id, related_works, student_status);

    // บันทึกข้อมูลวันเวลาที่สามารถทำงานในฐานข้อมูล
    for (const day of datetime_available.date_available) {
      await DateTimeAvailable.create({
        regist_id: registration,
        date_available: day,
        is_parttime: datetime_available.is_parttime,
        start_time: datetime_available.start_time[day] || null,
        end_time: datetime_available.end_time[day] || null,
      });
    }

    return NextResponse.json({
      success: true,
      message: "การลงทะเบียนทุนการศึกษาสำเร็จ.",
    });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดระหว่างการลงทะเบียนทุน:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดระหว่างการลงทะเบียน.", error: error.message },
      { status: 500 }
    );
  }
}