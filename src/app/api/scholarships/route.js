import { NextResponse } from "next/server";
import promisePool from "../../../../lib/db"; // Import connection to MySQL
import Scholarship from "../../../../models/scholarships"; // Import the Scholarship model

export async function POST(req) {
  const connection = await promisePool.getConnection(); // เริ่มการเชื่อมต่อกับฐานข้อมูล

  try {
    const scholarshipData = await req.json(); // รับข้อมูลทุนการศึกษาจาก request
    const { academic_year, academic_term } = scholarshipData; // เพิ่ม organization_id ด้วย

    // ตรวจสอบว่ามีทุนการศึกษาที่ใช้ academic_year และ academic_term ซ้ำกันหรือไม่
    const existingScholarships = await Scholarship.findByAcademicYearAndTerm(academic_year, academic_term);

    // ถ้ามีทุนการศึกษาที่ซ้ำกันอยู่แล้ว
    if (existingScholarships.length > 0) {
      return NextResponse.json(
        { message: "ไม่สามารถสร้างทุนการศึกษาได้ เนื่องจากปีการศึกษาและภาคการศึกษาไม่สามารถซ้ำกันได้" },
        { status: 400 }
      );
    }

    // เริ่มต้น Transaction
    await connection.beginTransaction();
    const scholarship_status = 1;
    // ถ้าไม่มีทุนการศึกษาซ้ำกัน ทำการสร้างทุนการศึกษาใหม่ในตาราง `scholarships`
    const [resultScholarship] = await connection.query(
      'INSERT INTO scholarships (application_start_date, application_end_date, academic_year, academic_term,scholarship_status) VALUES (?, ?, ?, ?,?)',
      [
        scholarshipData.application_start_date,
        scholarshipData.application_end_date,
        academic_year,
        academic_term,
        scholarship_status
      ]
    );

    const scholarship_id = resultScholarship.insertId; // รับ scholarship_id ที่เพิ่งสร้างใหม่
    // เพิ่ม `scholarship_id`  ลงในตาราง `scholarshiporganization`
    await connection.query(
      'INSERT INTO scholarshiporganization (scholarship_id) VALUES (?)',
      [scholarship_id]
    );

    // Commit transaction ถ้าขั้นตอนทั้งหมดสำเร็จ
    await connection.commit();

    return NextResponse.json(
      { message: "สร้างทุนการศึกษาและบันทึก scholarship_id ลงในตารางที่เกี่ยวข้องเรียบร้อยแล้ว" },
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



// // PUT: Update a scholarship
export async function PUT(req) {
  try {
    const {
      application_start_date,
      application_end_date,
      academic_year,
      academic_term,
    } = await req.json(); // Get the scholarship data from the request

    // Use the update method from the Scholarship model
    await Scholarship.update(scholarship_id, {
      application_start_date,
      application_end_date,
      academic_year,
      academic_term,
    });

    return NextResponse.json(
      { message: "Scholarship updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating scholarship:", error);
    return NextResponse.json(
      { message: "An error occurred during scholarship update." },
      { status: 500 }
    );
  }
}

// DELETE: Delete a scholarship
export async function DELETE(req) {
  const connection = await promisePool.getConnection(); // เริ่มการเชื่อมต่อกับฐานข้อมูล

  try {
    const url = new URL(req.url);
    const scholarship_id = url.searchParams.get('scholarship_id'); // Get scholarship_id from URL query parameter

    if (!scholarship_id) {
      return NextResponse.json(
        { message: "Scholarship ID is required." },
        { status: 400 }
      );
    }

    // เริ่มต้น Transaction
    await connection.beginTransaction();

    // ลบข้อมูลในตาราง `scholarshiporganization` ที่เกี่ยวข้องกับ `scholarship_id`
    await connection.query(
      'DELETE FROM scholarshiporganization WHERE scholarship_id = ?',
      [scholarship_id]
    );

    // ลบข้อมูลจากตาราง `scholarships`
    await connection.query(
      'DELETE FROM scholarships WHERE scholarship_id = ?',
      [scholarship_id]
    );

    // Commit transaction ถ้าขั้นตอนทั้งหมดสำเร็จ
    await connection.commit();

    return NextResponse.json(
      { message: "Scholarship and related data deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    // Rollback transaction ถ้ามีข้อผิดพลาด
    await connection.rollback();
    console.error("Error deleting scholarship:", error);
    return NextResponse.json(
      { message: "An error occurred during scholarship deletion." },
      { status: 500 }
    );
  } finally {
    connection.release(); // ปล่อย connection เมื่อเสร็จสิ้น
  }
}


// GET: Fetch all scholarshipsโชวแอดมิน
export async function GET(req) {
  try {
    const scholarships = await Scholarship.getAllShowAd(); // Use the getAll method from the Scholarship model

    return NextResponse.json(scholarships, { status: 200 });
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching scholarships." },
      { status: 500 }
    );
  }
}
