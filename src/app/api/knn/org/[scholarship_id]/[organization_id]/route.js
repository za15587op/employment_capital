// src/app/api/showScholarshipAll/showStdOrgan/[scholarship_id]/[organization_id]/route.js

import { NextResponse } from "next/server";
import ScholarshipOrganization from "models/scholarshiporganization";

// ฟังก์ชัน API ที่ถูกต้องพร้อมพารามิเตอร์จาก dynamic route
export async function GET(req, { params }) {
  const { scholarship_id, organization_id } = params;

  // ตรวจสอบว่าพารามิเตอร์ถูกส่งมาอย่างถูกต้อง
  if (!scholarship_id || !organization_id) {
    return NextResponse.json({ message: "Missing scholarship_id or organization_id" }, { status: 400 });
  }

  try {
    // ดึงข้อมูลโดยใช้พารามิเตอร์ที่ส่งมา
    const result = await ScholarshipOrganization.findByOrgMatching({
      scholarship_id,
      organization_id,
    });

    if (!result) {
      return NextResponse.json({ message: "No data found" }, { status: 404 });
    }
    
    console.log(result, "result");
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ message: "An error occurred while fetching data." }, { status: 500 });
  }
}
