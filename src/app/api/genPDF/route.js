import { NextResponse } from "next/server";
import ScholarshipRegistrations from "../../../../models/scholarshipregistrations";

export async function GET(req) {
    try {
      const students = await ScholarshipRegistrations.getGenPDF();
  
      return NextResponse.json(students, { status: 200 });
    } catch (error) {
      console.error("เกิดข้อผิดพลาดระหว่างการดึงข้อมูล:", error);
      return NextResponse.json(
        { message: "เกิดข้อผิดพลาดระหว่างการดึงข้อมูล." },
        { status: 500 }
      );
    }
  }
  