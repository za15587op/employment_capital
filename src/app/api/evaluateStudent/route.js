import { NextResponse } from "next/server";
import ScholarshipRegistrations from "../../../../models/scholarshipregistrations";

// รองรับเฉพาะ PUT method
export async function PUT(req) {
  try {
    // รับ array ของ {regist_id, student_status} จาก body ของ request
    const updates = await req.json();

    if (!updates || updates.length === 0) {
      return NextResponse.json({ message: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    // วนลูปผ่านแต่ละรายการเพื่ออัปเดตข้อมูล
    for (const update of updates) {
      const { regist_id, student_status } = update;

      if (!regist_id || student_status === undefined) {
        return NextResponse.json({ message: "ข้อมูลไม่ครบถ้วนสำหรับแต่ละรายการ" }, { status: 400 });
      }

      // อัปเดต student_status ตาม regist_id
      const updatedRegistration = await ScholarshipRegistrations.findOneAndUpdateStatus(
        { regist_id },
        { student_status }
      );

      if (!updatedRegistration) {
        return NextResponse.json({ message: `ไม่พบการลงทะเบียนสำหรับ ID: ${regist_id}` }, { status: 404 });
      }
    }

    // ถ้าอัปเดตทั้งหมดสำเร็จ
    return NextResponse.json({
      message: "สถานะของนักเรียนได้รับการอัปเดตเรียบร้อยแล้ว",
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating student statuses:", error);
    return NextResponse.json({
      message: "เกิดข้อผิดพลาดขณะอัปเดตสถานะของนักเรียน",
      error: error.message,
    }, { status: 500 });
  }
}
