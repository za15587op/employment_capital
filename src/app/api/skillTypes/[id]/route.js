import { NextResponse } from "next/server";
import promisePool from "@/lib/db";  // If you're using absolute imports configured in Next.js

export async function GET(req, { params }) {
  try {
    const skill_type_id = params.id; // ตรวจสอบให้แน่ใจว่านี่ตรงกับพารามิเตอร์ URL

    console.log(params);
    

    if (!skill_type_id) {
      return NextResponse.json({ message: 'Student ID is required' }, { status: 400 });
    }

    const [rows] = await promisePool.query('SELECT * FROM skilltypes WHERE skill_type_id = ?', [skill_type_id]);

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
    const  skill_type_id   = params.id;
    console.log(skill_type_id);
    
    const {
        newskill_type_name: skill_type_name
    } = await req.json();
  
    // Connect to MySQL
    const connection = await promisePool;
  
    try {
      // Update the student record in MySQL
      const [result] = await connection.query(
        'UPDATE skilltypes SET skill_type_name = ? WHERE skill_type_id  = ?',
        [skill_type_name, skill_type_id ]
      );
  
      if (result.affectedRows === 0) {
        return new Response(JSON.stringify({ message: "Student not found" }), { status: 404 });
      }
  
      return new Response(JSON.stringify({ message: "Student updated" }), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), { status: 500 });
    }
  }