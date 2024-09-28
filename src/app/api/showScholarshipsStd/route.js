import { NextResponse } from "next/server";
import Scholarship from "../../../../models/scholarships";
// GET: Fetch all scholarshipsโชว์นิสิต
export async function GET(req) {
    try {
      const scholarships = await Scholarship.getAll(); // Use the getAll method from the Scholarship model
  
      return NextResponse.json(scholarships, { status: 200 });
    } catch (error) {
      console.error("Error fetching scholarships:", error);
      return NextResponse.json(
        { message: "An error occurred while fetching scholarships." },
        { status: 500 }
      );
    }
  }

  import mysql from 'mysql2/promise';

async function testConnection() {
  try {
    const connection = await mysql.createConnection(process.env.MYSQL_URI);
    const [rows] = await connection.query('SELECT * FROM employment_capital.user');
    console.log('เชื่อมต่อฐานข้อมูลสำเร็จ:', rows);
  } catch (error) {
    console.error('การเชื่อมต่อฐานข้อมูลล้มเหลว:', error);
  }
}

testConnection();
