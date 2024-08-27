import { NextResponse } from "next/server";
import Student from "../../../../models/student"; // Importing the Student model

// POST: Create a new student
export async function POST(req) {
  try {
    const studentData = await req.json(); // Get the student data from the request

    await Student.create(studentData); // Use the create method from the Student model

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

// PUT: Update a student
export async function PUT(req) {
  try {
    const {
      std_id,
      student_id,
      student_firstname,
      student_lastname,
      student_faculty,
      student_field,
      student_curriculum,
      student_year,
      student_gpa,
      student_phone,
    } = await req.json(); // Get the student data from the request

    // Use the update method from the Student model
    await Student.update(std_id, {
      student_id,
      student_firstname,
      student_lastname,
      student_faculty,
      student_field,
      student_curriculum,
      student_year,
      student_gpa,
      student_phone,
    });

    return NextResponse.json(
      { message: "อัปเดตข้อมูลนักเรียนสำเร็จ." },
      { status: 200 }
    );
  } catch (error) {
    console.error("เกิดข้อผิดพลาดระหว่างการอัปเดต:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดระหว่างการอัปเดต." },
      { status: 500 }
    );
  }
}


// DELETE: Delete a student
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const std_id = url.searchParams.get('std_id'); // Get std_id from URL query parameter

    if (!std_id) {
      return NextResponse.json(
        { message: "Student ID is required." },
        { status: 400 }
      );
    }

    await Student.delete(std_id); // Use the delete method from the Student model

    return NextResponse.json(
      { message: "ลบข้อมูลนักเรียนสำเร็จ." },
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

// GET: Fetch all students
export async function GET(req) {
  try {
    const students = await Student.getAll(); // Use the getAll method from the Student model

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดระหว่างการดึงข้อมูล:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดระหว่างการดึงข้อมูล." },
      { status: 500 }
    );
  }
}
