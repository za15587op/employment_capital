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

  export async function PUT(req, { params }) {
    const  scholarship_id   = params.id;
    console.log(scholarship_id);
    
    const {
        newapplication_start_date: application_start_date,
        newapplication_end_date: application_end_date,
        newacademic_year: academic_year,
        newacademic_term: academic_term,

    } = await req.json();
  
    // Connect to MySQL
    const connection = await promisePool;
  
    try {
      const [result] = await connection.query(
        'UPDATE scholarships SET application_start_date = ?, application_end_date = ?, academic_year = ?, academic_term = ? WHERE scholarship_id  = ?',
        [application_start_date, application_end_date, academic_year, academic_term, scholarship_id ]
      );
  
      if (result.affectedRows === 0) {
        return new Response(JSON.stringify({ message: "scholarships not found" }), { status: 404 });
      }
  
      return new Response(JSON.stringify({ message: "scholarships updated" }), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), { status: 500 });
    }
  }