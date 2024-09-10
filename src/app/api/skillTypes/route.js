import { NextResponse } from "next/server";
import SkillTypes from "../../../../models/skilltypes";

// POST: Create a new student
export async function POST(req) {
  try {
    const skillTypesData = await req.json(); // Get the student data from the request

    await SkillTypes.create(skillTypesData); // Use the create method from the Student model

    return NextResponse.json(
      { message: "User registered successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { message: "An error occurred during registration." },
      { status: 500 }
    );
  }
}


// GET: Fetch all skillTypes
export async function GET(req) {
    try {
      const skillTypes = await SkillTypes.getAll(); // Use the getAll method from the Student model
  
      return NextResponse.json(skillTypes, { status: 200 });
    } catch (error) {
      console.error("เกิดข้อผิดพลาดระหว่างการดึงข้อมูล:", error);
      return NextResponse.json(
        { message: "เกิดข้อผิดพลาดระหว่างการดึงข้อมูล." },
        { status: 500 }
      );
    }
  }

  // DELETE: Delete a skilltypes
export async function DELETE(req) {
    try {
      const url = new URL(req.url);
      const skill_type_id = url.searchParams.get('skill_type_id'); // Get std_id from URL query parameter
  
      if (!skill_type_id) {
        return NextResponse.json(
          { message: "skilltypes skill_type_id is required." },
          { status: 400 }
        );
      }
  
      await SkillTypes.delete(skill_type_id); // Use the delete method from the skilltypes model
  
      return NextResponse.json(
        { message: "ลบข้อมูลประเภททักษะสำเร็จ." },
        { status: 200 }
      );
    } catch (error) {
      console.error("เกิดข้อผิดพลาดระหว่างการลบ:", error);
      return NextResponse.json(
        { message: "เกิดข้อผิดพลาดระหว่างการลบ." },
        { status: 500 }
      );
    }
  }
  
  