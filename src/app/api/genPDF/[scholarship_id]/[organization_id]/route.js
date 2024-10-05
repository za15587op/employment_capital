import { NextResponse } from "next/server";
import ScholarshipRegistrations from "models/scholarshipregistrations";

export async function GET(req , {params}) {
    const { scholarship_id, organization_id } = params;

    // ตรวจสอบว่าพารามิเตอร์ถูกส่งมาอย่างถูกต้อง
    if (!scholarship_id || !organization_id) {
      return NextResponse.json({ message: "Missing scholarship_id or organization_id" }, { status: 400 });
    }

    try {
      const students = await ScholarshipRegistrations.getGenPDF(scholarship_id,organization_id);
  
      return NextResponse.json(students, { status: 200 });
    } catch (error) {
      console.error("เกิดข้อผิดพลาดระหว่างการดึงข้อมูล:", error);
      return NextResponse.json(
        { message: "เกิดข้อผิดพลาดระหว่างการดึงข้อมูล." },
        { status: 500 }
      );
    }
  }
  