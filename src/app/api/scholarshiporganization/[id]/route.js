import { NextResponse } from 'next/server';
import promisePool from "../../../../../lib/db"; // Import connection to MySQL

export async function GET(req, { params }) {
  // ดึง organization_id จาก params
  const organization_id = params.id;

  // ตรวจสอบว่า organization_id มีค่าหรือไม่
  if (!organization_id) {
    return NextResponse.json({ message: "ไม่มีค่า organization_id ที่ถูกต้อง" }, { status: 400 });
  }

  try {
    const [rows] = await promisePool.query(
      `SELECT so.*, 
      o.organization_name, 
      o.contactPhone,
      sr.required_level, 
      st.skill_type_name
      FROM scholarshiporganization so
      INNER JOIN organization o ON so.organization_id = o.organization_id
      INNER JOIN scholarshiprequirement sr ON so.scholarship_organ_id = sr.scholarship_organ_id
      INNER JOIN skilltypes st ON sr.skill_type_id = st.skill_type_id
      WHERE so.organization_id = ?`,
      [organization_id]
      );

    if (rows.length === 0) {
      return NextResponse.json({ message: "ไม่พบข้อมูล" }, { status: 404 });
    }

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const scholarship_organ_id = params.id;

  try {
    const { scholarship_id, organization_id, amount, workType, workTime } = await req.json();

    if (!scholarship_id || !organization_id || !amount || !workType || !workTime) {
      return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
    }

    const workTimeString = Array.isArray(workTime) ? JSON.stringify(workTime) : workTime;

    const [result] = await promisePool.query(
      "UPDATE scholarshiporganization SET scholarship_id = ?, organization_id = ?, amount = ?, workType = ?, workTime = ? WHERE scholarship_organ_id = ?",
      [scholarship_id, organization_id, amount, workType, workTimeString, scholarship_organ_id]
    );

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ message: "Scholarship organization not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Scholarship organization updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error updating scholarship organization data:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const scholarship_organ_id = params.id;

  try {
    const [result] = await promisePool.query(
      "DELETE FROM scholarshiporganization WHERE scholarship_organ_id = ?",
      [scholarship_organ_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Scholarship organization not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Scholarship organization deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting scholarship organization:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
