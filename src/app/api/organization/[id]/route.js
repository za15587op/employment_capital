import { NextResponse } from "next/server";
import promisePool from "../../../../../lib/db";

export async function GET(req, { params }) {
  try {
    const scholarship_id = params.id;

    if (!scholarship_id) {
      return NextResponse.json(
        { message: "Scholarship ID is required" },
        { status: 400 }
      );
    }

    // Query เพื่อดึงข้อมูลหน่วยงานที่เกี่ยวข้องกับ scholarship_id
    const [rows] = await promisePool.query(
      `SELECT o.organization_id, o.organization_name, o.contactPhone
       FROM organization o`,
      // [scholarship_id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "No organizations found for this scholarship" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  const organization_id = params.id;

  try {
    // ตรวจสอบว่า organization_id ถูกส่งมาหรือไม่
    if (!organization_id) {
      return NextResponse.json(
        { message: "Organization ID is required." },
        { status: 400 }
      );
    }

    // รับข้อมูลจาก body ของ request
    const { organization_name, contactPhone } = await req.json();

    // ตรวจสอบว่า organization_name และ contactPhone ถูกส่งมาหรือไม่
    if (!organization_name || !contactPhone) {
      return NextResponse.json(
        { message: "organization_name and contactPhone are required." },
        { status: 400 }
      );
    }

    // อัปเดตข้อมูลในฐานข้อมูล
    const [result] = await promisePool.query(
      "UPDATE organization SET organization_name = ?, contactPhone = ? WHERE organization_id = ?",
      [organization_name, contactPhone, organization_id]
    );

    // ตรวจสอบว่าอัปเดตสำเร็จหรือไม่
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    // ส่งข้อความตอบกลับเมื่ออัปเดตสำเร็จ
    return NextResponse.json(
      { message: "Organization updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    // จัดการข้อผิดพลาดในกรณีที่เกิดข้อผิดพลาดในการทำงาน
    console.error("Error updating organization data:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE request to delete an organization
export async function DELETE(req, { params }) {
  const organization_id = params.id;

  try {
    if (!organization_id) {
      return NextResponse.json({ message: "Organization ID is required" }, { status: 400 });
    }

    // ลบข้อมูลจากฐานข้อมูล
    const [result] = await promisePool.query(
      "DELETE FROM organization WHERE organization_id = ?",
      [organization_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Organization not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Organization deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting organization:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
