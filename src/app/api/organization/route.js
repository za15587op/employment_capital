import { NextResponse } from "next/server";
import promisePool from "../../../../lib/db"; // ตรวจสอบว่า path ถูกต้องกับที่ใช้งาน
import Organization from "../../../../models/organization"; // ตรวจสอบการ import ให้แน่ใจว่า path ถูกต้อง

export async function POST(req) {
  const connection = await promisePool.getConnection(); // เริ่มการเชื่อมต่อกับฐานข้อมูล
  try {
    const organizationData = await req.json(); // รับข้อมูลจาก request
    const { organization_name, contactPhone, scholarship_id } = organizationData; // รับ scholarship_id จาก form

    // ตรวจสอบว่ามีชื่อหน่วยงานหรือเบอร์โทรศัพท์ซ้ำกันหรือไม่
    const [existingOrganization] = await connection.query(
      'SELECT * FROM organization WHERE organization_name = ? OR contactPhone = ?',
      [organization_name, contactPhone]
    );

    let organizationId;
    if (existingOrganization.length > 0) {
      // ถ้าพบว่ามี organization ที่ซ้ำกัน ให้ใช้ organization_id ที่มีอยู่แล้ว
      organizationId = existingOrganization[0].organization_id;
    } else {
      // ถ้าไม่มีข้อมูลซ้ำ ให้สร้าง organization ใหม่
      const [resultOrganization] = await connection.query(
        'INSERT INTO organization (organization_name, contactPhone) VALUES (?, ?)',
        [organization_name, contactPhone]
      );
      organizationId = resultOrganization.insertId; 
    }

    // Commit transaction ถ้าขั้นตอนทั้งหมดสำเร็จ
    await connection.commit();

    return NextResponse.json(
      { message: "เพิ่มหรืออัปเดต organization_id สำเร็จแล้ว" },
      { status: 201 }
    );
  } catch (error) {
    // Rollback transaction ถ้ามีข้อผิดพลาด
    await connection.rollback();
    console.error("Error adding organization:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดระหว่างการเพิ่ม organization_id ใน scholarshiporganization", error: error.message },
      { status: 500 }
    );
  } finally {
    connection.release(); // ปล่อย connection เมื่อเสร็จสิ้น
  }
}






// PUT: Update an organization
export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const organization_id = url.searchParams.get("organization_id"); // ดึง organization_id จาก URL query parameter

    if (!organization_id) {
      return NextResponse.json(
        { message: "Organization ID is required." },
        { status: 400 }
      );
    }

    const { organization_name, contactPhone, scholarship_id } = await req.json(); // Get the organization data from the request

    // ตรวจสอบว่ามีชื่อหน่วยงานหรือเบอร์โทรศัพท์ซ้ำกันหรือไม่ โดยไม่รวมข้อมูลของ organization_id ปัจจุบัน
    const [existingOrganization] = await promisePool.query(
      'SELECT * FROM organization WHERE (organization_name = ? OR contactPhone = ?) AND organization_id != ?',
      [organization_name, contactPhone, organization_id]
    );

    // ถ้าข้อมูลซ้ำให้แจ้งกลับไป
    if (existingOrganization.length > 0) {
      return NextResponse.json(
        { message: "ชื่อหน่วยงานหรือเบอร์โทรศัพท์ซ้ำกัน" },
        { status: 400 }
      );
    }

    // ถ้าไม่มีข้อมูลซ้ำให้ทำการอัปเดตข้อมูลในฐานข้อมูล
    await Organization.update(organization_id, {
      organization_name,
      contactPhone,
      scholarship_id,
    });

    return NextResponse.json(
      { message: "Organization updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating organization:", error);
    return NextResponse.json(
      { message: "An error occurred during organization update." },
      { status: 500 }
    );
  }
}


// DELETE: Delete an organization and related data
export async function DELETE(req) {
  const connection = await promisePool.getConnection(); // เริ่มการเชื่อมต่อกับฐานข้อมูล

  try {
    const url = new URL(req.url);
    const organization_id = url.searchParams.get('organization_id'); // รับ organization_id จาก URL query parameter

    if (!organization_id) {
      return NextResponse.json(
        { message: "Organization ID is required." },
        { status: 400 }
      );
    }

    // เริ่มต้น Transaction
    await connection.beginTransaction();

    // ลบข้อมูลจากตาราง `scholarshiprequirement` ที่อ้างอิงกับ `scholarship_organ_id` ผ่าน `scholarshiporganization`
    const deleteScholarshipRequirement = `
      DELETE sr
      FROM scholarshiprequirement sr
      JOIN scholarshiporganization so ON sr.scholarship_organ_id = so.scholarship_organ_id
      WHERE so.organization_id = ?
    `;
    await connection.query(deleteScholarshipRequirement, [organization_id]);

    // ลบข้อมูลจากตาราง `skills_skilltypes` ที่อ้างอิงกับ `skill_type_id`
    const deleteSkillsSkillTypes = `
    DELETE FROM skills_skilltypes WHERE skill_type_id IN (
      SELECT st.skill_type_id FROM skills_skilltypes st
      LEFT JOIN scholarshiprequirement sr ON st.skill_type_id = sr.skill_type_id
      WHERE sr.skill_type_id IS NULL
    )

    `;
    // await connection.query(deleteSkillsSkillTypes);

    // // ลบข้อมูลจากตาราง `skilltypes` ที่ไม่มีการอ้างอิงจาก `scholarshiprequirement`
    // const deleteSkillTypes = `
    //   DELETE st
    //   FROM skilltypes st
    //   LEFT JOIN scholarshiprequirement sr ON st.skill_type_id = sr.skill_type_id
    //   WHERE sr.skill_type_id IS NULL
    // `;
    // await connection.query(deleteSkillTypes);

    // ลบข้อมูลจากตาราง `scholarshiporganization` ที่เกี่ยวข้องกับ `organization_id`
    const deleteScholarshipOrganization = `
      DELETE FROM scholarshiporganization WHERE organization_id = ?
    `;
    await connection.query(deleteScholarshipOrganization, [organization_id]);

    // ลบข้อมูลจากตาราง `organization`
    const deleteOrganization = `
      DELETE FROM organization WHERE organization_id = ?
    `;
    const [organizationResult] = await connection.query(deleteOrganization, [organization_id]);

    // ตรวจสอบว่าข้อมูลถูกลบจริงหรือไม่
    if (organizationResult.affectedRows === 0) {
      await connection.rollback();
      return NextResponse.json(
        { message: "Failed to delete organization." },
        { status: 400 }
      );
    }

    // Commit transaction ถ้าขั้นตอนทั้งหมดสำเร็จ
    await connection.commit();

    return NextResponse.json(
      { message: "Organization and related data deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    // Rollback transaction ถ้ามีข้อผิดพลาด
    await connection.rollback();
    console.error("Error deleting organization:", error);
    return NextResponse.json(
      { message: "An error occurred during organization deletion.", error: error.message },
      { status: 500 }
    );
  } finally {
    connection.release(); // ปล่อย connection เมื่อเสร็จสิ้น
  }
}


// GET: Fetch all organization
export async function GET(req) {
  try {
    const organization = await Organization.getAll(); // Use the getAll method from the Organization model

    return NextResponse.json(organization, { status: 200 });
  } catch (error) {
    console.error("Error fetching organization:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching organization." },
      { status: 500 }
    );
  }
}
