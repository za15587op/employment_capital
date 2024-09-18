import { NextResponse } from "next/server";
import promisePool from "../../../../../lib/db";

export async function GET(req, { params }) {
  try {
    const scholarship_id = params.id; // ตรวจสอบให้แน่ใจว่านี่ตรงกับพารามิเตอร์ URL

    console.log(params);
    

    if (!scholarship_id) {
      return NextResponse.json({ message: 'scholarships id is required' }, { status: 400 });
    }

    const [rows] = await promisePool.query('SELECT * FROM scholarships WHERE scholarship_id = ?', [scholarship_id]);

    if (rows.length === 0) {
      return NextResponse.json({ message: 'scholarships not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching scholarships data:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  const connection = await promisePool.getConnection(); // เริ่มการเชื่อมต่อกับฐานข้อมูล

  try {
    const scholarshipData = await req.json(); // รับข้อมูลทุนการศึกษาจาก request
    const { scholarship_id, application_start_date, application_end_date, academic_year, academic_term } = scholarshipData;

    // ตรวจสอบว่ามีทุนการศึกษาที่ใช้ academic_year และ academic_term ซ้ำกันหรือไม่
    const [existingScholarships] = await connection.query(
      'SELECT * FROM scholarships WHERE academic_year = ? AND academic_term = ? AND scholarship_id != ?',
      [academic_year, academic_term, scholarship_id]
    );

    // ถ้ามีทุนการศึกษาซ้ำกัน ให้ส่งสถานะ 400 กลับมา
    if (existingScholarships.length > 0) {
      return NextResponse.json(
        { message: "ไม่สามารถแก้ไขทุนการศึกษาได้ เนื่องจากปีการศึกษาและภาคการศึกษาไม่สามารถซ้ำกันได้" },
        { status: 400 }
      );
    }

    // เริ่มต้น Transaction
    await connection.beginTransaction();

    // อัปเดตข้อมูลในตาราง `scholarships`
    await connection.query(
      'UPDATE scholarships SET application_start_date = ?, application_end_date = ?, academic_year = ?, academic_term = ? WHERE scholarship_id = ?',
      [application_start_date, application_end_date, academic_year, academic_term, scholarship_id]
    );

    // Commit transaction ถ้าขั้นตอนทั้งหมดสำเร็จ
    await connection.commit();

    return NextResponse.json(
      { message: "แก้ไขข้อมูลทุนการศึกษาและข้อมูลที่เกี่ยวข้องเรียบร้อยแล้ว" },
      { status: 200 }
    );
  } catch (error) {
    // Rollback transaction ถ้ามีข้อผิดพลาด
    await connection.rollback();
    console.error("Error updating scholarship:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดระหว่างการแก้ไขทุนการศึกษา" },
      { status: 500 }
    );
  } finally {
    connection.release(); // ปล่อย connection เมื่อเสร็จสิ้น
  }
}

