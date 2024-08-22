import { NextResponse } from "next/server";
import promisePool from "../../../../lib/db";

export async function POST(req) {
  console.log(req);

  try {
    const {
      student_id,
      student_firstname,
      student_lastname,
      student_faculty,
      student_field,
      student_curriculum,
      student_year,
      student_email,
      student_phone,
    } = await req.json();

    console.log("student_id: ", student_id);
    console.log("student_firstname: ", student_firstname);
    console.log("student_lastname: ", student_lastname);
    console.log("student_faculty: ", student_faculty);
    console.log("student_field: ", student_field);
    console.log("student_curriculum: ", student_curriculum);
    console.log("student_year: ", student_year);
    console.log("student_email: ", student_email);
    console.log("student_phone: ", student_phone);

    // เพิ่มผู้ใช้ใหม่ด้วยรหัสผ่านที่ถูกแฮช
    await promisePool.query(
      "INSERT INTO student (student_id, student_firstname, student_lastname, student_faculty, student_field, student_curriculum, student_year, student_email, student_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        student_id,
        student_firstname,
        student_lastname,
        student_faculty,
        student_field,
        student_curriculum,
        student_year,
        student_email,
        student_phone,
      ]
    );

    return NextResponse.json(
      { message: "User registered successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error); // ช่วยให้คุณเห็นข้อผิดพลาดที่เกิดขึ้น
    return NextResponse.json(
      { message: "An error occurred during registration." },
      { status: 500 }
    );
  }
}

//อัปเดต
export async function PUT(req) {
  try {
    const {
      student_id,
      student_firstname,
      student_lastname,
      student_faculty,
      student_field,
      student_curriculum,
      student_year,
      student_email,
      student_phone,
    } = await req.json();

    await promisePool.query(
      "UPDATE student SET student_firstname=?, student_lastname=?, student_faculty=?, student_field=?, student_curriculum=?, student_year=?, student_email=?, student_phone=? WHERE id=?",
      [
        student_firstname,
        student_lastname,
        student_faculty,
        student_field,
        student_curriculum,
        student_year,
        student_email,
        student_phone,
        student_id,
      ]
    );

    return NextResponse.json({ message: "อัปเดตข้อมูลนักเรียนสำเร็จ." }, { status: 200 });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดระหว่างการอัปเดต:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดระหว่างการอัปเดต." }, { status: 500 });
  }
}


//ลบข้อมูล
export async function DELETE(req) {
  try {
    const { student_id } = await req.json();

    await promisePool.query("DELETE FROM student WHERE student_id=?", [student_id]);

    return NextResponse.json({ message: "ลบข้อมูลนักเรียนสำเร็จ." }, { status: 200 });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดระหว่างการลบ:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดระหว่างการลบ." }, { status: 500 });
  }
}


//โชว์ข้อมูล
export async function GET(req) {
  try {
    const [rows] = await promisePool.query("SELECT * FROM student");

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดระหว่างการดึงข้อมูล:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดระหว่างการดึงข้อมูล." }, { status: 500 });
  }
}

