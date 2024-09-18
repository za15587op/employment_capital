import { NextResponse } from "next/server";
import Scholarship from "../../../../../models/scholarships";

// รองรับเฉพาะ PUT method
export async function PUT(req) {
  try {
    const { scholarship_id, scholarship_status } = await req.json();

    if (!scholarship_id || scholarship_status === undefined) {
      return NextResponse.json({ message: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    // อัปเดตสถานะของทุนการศึกษา
    const updatedScholarship = await Scholarship.findByIdAndUpdateStatus(
      scholarship_id,
      scholarship_status
    );

    if (!updatedScholarship) {
      return NextResponse.json({ message: "ไม่พบทุนการศึกษาที่ต้องการอัปเดต" }, { status: 404 });
    }

    return NextResponse.json({
      message: "สถานะของทุนการศึกษาได้ถูกอัปเดตเรียบร้อยแล้ว",
      scholarship: updatedScholarship,
    });
  } catch (error) {
    console.error("Error updating scholarship status:", error);
    return NextResponse.json({
      message: "เกิดข้อผิดพลาดขณะอัปเดตสถานะของทุนการศึกษา",
      error: error.message,
    }, { status: 500 });
  }
}
