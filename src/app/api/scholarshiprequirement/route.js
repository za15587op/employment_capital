import { NextResponse } from "next/server";
import promisePool from "@/lib/db";  // If you're using absolute imports configured in Next.js
import scholarshiprequirement from "../../../../models/scholarshiprequirement"; // ตรวจสอบการ import ให้แน่ใจว่า path ถูกต้อง

export async function POST(req) {
  const connection = await promisePool.getConnection(); // เริ่มการเชื่อมต่อกับฐานข้อมูล

  try {
    const scholarshiptData = await req.json(); // รับข้อมูลจาก request
    const { scholarship_organ_id, skill_type_id, required_level } = scholarshiptData; // ดึงข้อมูลที่ต้องใช้จาก request
    console.log(scholarshiptData);
    
    // อัปเดตข้อมูลในตาราง scholarshiprequirement
    await connection.query(
      `UPDATE scholarshiprequirement 
       SET required_level = ?, skill_type_id = ? 
       WHERE scholarship_organ_id = ?`,
      [required_level, skill_type_id, scholarship_organ_id] // ใส่ค่าพารามิเตอร์
    );

    return NextResponse.json(
      { message: "บันทึก scholarship_organ_id ลงในตารางที่เกี่ยวข้องเรียบร้อยแล้ว" },
      { status: 201 }
    );
  } catch (error) {
    // Rollback transaction ถ้ามีข้อผิดพลาด
    await connection.rollback();
    console.error("Error creating scholarship:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดระหว่างการสร้างทุนการศึกษา" },
      { status: 500 }
    );
  } finally {
    connection.release(); // ปล่อย connection เมื่อเสร็จสิ้น
  }
}


// PUT: Update a scholarship requirement
export async function PUT(req) {
  const connection = await promisePool.getConnection(); // เริ่มการเชื่อมต่อกับฐานข้อมูล

  try {
    const url = new URL(req.url);
    const scholarship_requirement_id = url.searchParams.get("scholarship_requirement_id"); // ดึง scholarship_requirement_id จาก URL query parameter

    if (!scholarship_requirement_id) {
      return NextResponse.json(
        { message: "Scholarship Requirement ID is required." },
        { status: 400 }
      );
    }

    const { scholarship_organ_id, skill_type_id, required_level } = await req.json(); // รับข้อมูล scholarship requirement จาก request

    // เริ่มต้น Transaction
    await connection.beginTransaction();

    // อัปเดตข้อมูลในตาราง `scholarshiprequirement`
    await connection.query(
      'UPDATE scholarshiprequirement SET scholarship_organ_id = ?, skill_type_id = ?, required_level = ? WHERE scholarship_requirement_id = ?',
      [scholarship_organ_id, skill_type_id, required_level, scholarship_requirement_id]
    );

    // Commit transaction ถ้าขั้นตอนทั้งหมดสำเร็จ
    await connection.commit();

    return NextResponse.json(
      { message: "Scholarship requirement updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    // Rollback transaction ถ้ามีข้อผิดพลาด
    await connection.rollback();
    console.error("Error updating scholarship requirement:", error);
    return NextResponse.json(
      { message: "An error occurred during scholarship requirement update." },
      { status: 500 }
    );
  } finally {
    connection.release(); // ปล่อย connection เมื่อเสร็จสิ้น
  }
}

// DELETE: Delete a scholarship requirement
export async function DELETE(req) {
  const connection = await promisePool.getConnection(); // เริ่มการเชื่อมต่อกับฐานข้อมูล

  try {
    const url = new URL(req.url);
    const scholarship_requirement_id = url.searchParams.get("scholarship_requirement_id"); // ดึง scholarship_requirement_id จาก URL query parameter

    if (!scholarship_requirement_id) {
      return NextResponse.json(
        { message: "Scholarship Requirement ID is required." },
        { status: 400 }
      );
    }

    // เริ่มต้น Transaction
    await connection.beginTransaction();

    // ลบข้อมูลจากตาราง `scholarshiprequirement`
    await connection.query(
      'DELETE FROM scholarshiprequirement WHERE scholarship_requirement_id = ?',
      [scholarship_requirement_id]
    );

    // Commit transaction ถ้าขั้นตอนทั้งหมดสำเร็จ
    await connection.commit();

    return NextResponse.json(
      { message: "Scholarship requirement deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    // Rollback transaction ถ้ามีข้อผิดพลาด
    await connection.rollback();
    console.error("Error deleting scholarship requirement:", error);
    return NextResponse.json(
      { message: "An error occurred during scholarship requirement deletion." },
      { status: 500 }
    );
  } finally {
    connection.release(); // ปล่อย connection เมื่อเสร็จสิ้น
  }
}


// GET: Fetch all scholarship requirements
export async function GET(req) {
  try {
    const scholarshiprequirement = await scholarshiprequirement.getAll();
    console.log("Fetched Scholarship Requirement:", scholarshiprequirement); // ตรวจสอบข้อมูลที่ดึงมา
    return NextResponse.json(scholarshiprequirement, { status: 200 });
  } catch (error) {
    console.error("Error fetching scholarship requirements:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching scholarship requirements." },
      { status: 500 }
    );
  }
}
