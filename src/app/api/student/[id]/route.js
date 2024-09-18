import { NextResponse } from "next/server";
import Student from "../../../../../models/student";

export async function GET(req, { params }) {
  try {
    const student_id = params.id; // ดึง student_id จากพารามิเตอร์ URL

    if (!student_id) {
      return NextResponse.json({ message: 'Student ID is required' }, { status: 400 });
    }

    // ใช้โมเดล Student ในการดึงข้อมูลนักศึกษา
    const student = await Student.findById(student_id);

    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error('Error fetching student data:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const student_id = params.id;
    const { student_firstname, student_lastname, student_faculty, student_field, student_curriculum, student_year, student_gpa, student_phone, skills, studentSkills, selectedSkillTypes } = await req.json();

    if (!student_id) {
      return NextResponse.json({ message: 'Student ID is required' }, { status: 400 });
    }

    // อัปเดตข้อมูลนักศึกษาโดยใช้โมเดล Student
    await Student.update(
      student_id, 
      {
        student_firstname,
        student_lastname,
        student_faculty,
        student_field,
        student_curriculum,
        student_year,
        student_gpa,
        student_phone,
      },
      skills,
      studentSkills,
      selectedSkillTypes
    );

    return NextResponse.json({ message: 'Student updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}