import { NextResponse } from 'next/server';
import promisePool from "@/lib/db";  // If you're using absolute imports configured in Next.js

// เช็คว่าผู้ใช้เคยสมัครทุนนี้ไปแล้วหรือยัง
export async function GET(req, { params }) {
  const { id: student_id } = params;

  try {
    // Fetch the scholarship registration details based on the scholarship_id
    const [scholarshipRegistrations] = await promisePool.query(
      'SELECT * FROM ScholarshipRegistrations WHERE student_id = ?',
      [student_id]
    );

    return NextResponse.json({
      scholarshipRegistrations
    });
  } catch (error) {
    console.error('Error fetching scholarship registration details:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}