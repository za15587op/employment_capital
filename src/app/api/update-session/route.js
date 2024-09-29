import { getSession } from "next-auth/react";
import { NextResponse } from "next/server"; // Import this for Next.js API responses

export async function POST(req) {
  const session = await getSession({ req });

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const { student_id } = await req.json(); // รับข้อมูล student_id จาก body request

    if (!student_id) {
      return NextResponse.json({ message: "student_id is required" }, { status: 400 });
    }

    // อัปเดต session ของผู้ใช้ด้วย student_id
    session.user.student_id = student_id;

    // ส่ง response กลับไปว่าทำงานสำเร็จ
    return NextResponse.json({ message: "Session updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

export async function GET(req) {
  const session = await getSession({ req });

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({ session }, { status: 200 });
}
