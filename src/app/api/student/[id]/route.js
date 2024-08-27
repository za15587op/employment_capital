import { NextResponse } from "next/server";
import promisePool from "../../../../../lib/db";

export async function GET(req, { params }) {
  try {
    const std_id = params.id; // ตรวจสอบให้แน่ใจว่านี่ตรงกับพารามิเตอร์ URL

    console.log(params);
    

    if (!std_id) {
      return NextResponse.json({ message: 'Student ID is required' }, { status: 400 });
    }

    const [rows] = await promisePool.query('SELECT * FROM student WHERE std_id = ?', [std_id]);

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching student data:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

  export async function PUT(req, { params }) {
    const  std_id   = params.id;
    console.log(std_id);
    
    const {
      newstudent_id: student_id,
      newstudent_firstname: student_firstname,
      newstudent_lastname: student_lastname,
      newstudent_faculty: student_faculty,
      newstudent_field: student_field,
      newstudent_curriculum: student_curriculum,
      newstudent_year: student_year,
      newstudent_gpa: student_gpa,
      newstudent_phone: student_phone
    } = await req.json();
  
    // Connect to MySQL
    const connection = await promisePool;
  
    try {
      // Update the student record in MySQL
      const [result] = await connection.query(
        'UPDATE student SET student_id = ?, student_firstname = ?, student_lastname = ?, student_faculty = ?, student_field = ?, student_curriculum = ?, student_year = ?, student_gpa = ?, student_phone = ? WHERE std_id  = ?',
        [student_id, student_firstname, student_lastname, student_faculty, student_field, student_curriculum, student_year, student_gpa, student_phone, std_id ]
      );
  
      if (result.affectedRows === 0) {
        return new Response(JSON.stringify({ message: "Student not found" }), { status: 404 });
      }
  
      return new Response(JSON.stringify({ message: "Student updated" }), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), { status: 500 });
    }
  }