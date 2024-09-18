import { NextResponse } from "next/server";
import Skills from "../../../../models/skills"; // ตรวจสอบการ import ให้แน่ใจว่า path ถูกต้อง

// POST: Create a new skill
export async function POST(req) {
  const connection = await promisePool.getConnection(); // เริ่มการเชื่อมต่อกับฐานข้อมูล
  try {
    const { skill_name, required_level } = await req.json(); // Get the skill data from the request

    // ตรวจสอบว่าข้อมูลที่จำเป็นมีอยู่ครบถ้วนหรือไม่
    if (!skill_name || !required_level) {
      return NextResponse.json(
        { message: "กรุณากรอกข้อมูลให้ครบถ้วน!" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Skill created successfully." },
      { status: 201 }
    );
  } catch (error) {
    await connection.rollback(); // Rollback หากมีข้อผิดพลาด
    console.error("Error creating skill:", error);
    return NextResponse.json(
      { message: "An error occurred during skill creation." },
      { status: 500 }
    );
  } finally {
    connection.release(); // ปล่อย connection เมื่อเสร็จสิ้น
  }
}


// PUT: Update a skill
export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const skill_id = url.searchParams.get("skill_id"); // ดึง skill_id จาก URL query parameter

    if (!skill_id) {
      return NextResponse.json(
        { message: "Skill ID is required." },
        { status: 400 }
      );
    }

    const { skill_name } = await req.json(); // Get the skill data from the request

    // Use the update method from the Skills model
    await Skills.update(skill_id, { skill_name });

    return NextResponse.json(
      { message: "Skill updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating skill:", error);
    return NextResponse.json(
      { message: "An error occurred during skill update." },
      { status: 500 }
    );
  }
}

// DELETE: Delete a skill
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const skill_id = url.searchParams.get("skill_id"); // Get skill_id from URL query parameter

    if (!skill_id) {
      return NextResponse.json(
        { message: "Skill ID is required." },
        { status: 400 }
      );
    }

    await Skills.delete(skill_id); // Use the delete method from the Skills model

    return NextResponse.json(
      { message: "Skill deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json(
      { message: "An error occurred during skill deletion." },
      { status: 500 }
    );
  }
}

// GET: Fetch all skills
export async function GET(req) {
  try {
    const skills = await Skills.getAll(); // Use the getAll method from the Skills model
    console.log("Fetched Skills:", skills); // ตรวจสอบข้อมูลที่ดึงมา
    return NextResponse.json(skills, { status: 200 });
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching skills." },
      { status: 500 }
    );
  }
}
