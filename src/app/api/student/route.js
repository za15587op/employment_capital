import { NextResponse } from "next/server";
import Student from "../../../../models/student"; // โมเดล Student
import Skills from "../../../../models/skills"; // โมเดล Skills
import StudentSkills from "../../../../models/studentskills"; // โมเดล StudentSkills
import Skills_SkillTypes from "../../../../models/skills_skilltypes"; // โมเดล Skills_SkillTypes

// POST: Create a new student
export async function POST(req) {
  try {
    const studentData = await req.json(); // รับข้อมูลนักศึกษาจากคำขอ

    // สร้างข้อมูลนักศึกษาในตาราง Student
    const {
      student_id,
      student_firstname,
      student_lastname,
      student_faculty,
      student_curriculum,
      student_year,
      student_gpa,
      student_phone,
      user_id,
      skills, // ทักษะที่รับมาจาก frontend
      selectedSkillTypes, // ประเภทของทักษะที่เลือก
      studentSkills, // ระดับทักษะของนักศึกษา
    } = studentData;

    // สร้างข้อมูลนักศึกษาในฐานข้อมูล
    const createdStudent = await Student.create({
      student_id,
      student_firstname,
      student_lastname,
      student_faculty,
      student_curriculum,
      student_year,
      student_gpa,
      student_phone,
      user_id,
    });
    

    // ตรวจสอบว่าได้สร้างข้อมูลนักศึกษาสำเร็จหรือไม่
    if (!createdStudent) {
      throw new Error("Unable to create student");
    }

    // สร้างทักษะและเชื่อมโยงกับนักศึกษา
    for (let i = 0; i < skills.length; i++) {
      const { skill_name } = skills[i];
      const { skill_level } = studentSkills[i];
      const { skill_type_id } = selectedSkillTypes[i];

      // สร้างทักษะในตาราง Skills
      const createdSkill = await Skills.create({
        skill_name,
      });

      // สร้างความสัมพันธ์ระหว่างทักษะและประเภทของทักษะในตาราง Skills_SkillTypes
      await Skills_SkillTypes.create({
        student_id,
        skill_id: createdSkill.insertId, // ใช้ insertId เพื่อรับค่า skill_id ของทักษะที่เพิ่งสร้าง
        skill_type_id,
      });

      // สร้างความสัมพันธ์ระหว่างนักศึกษาและทักษะในตาราง StudentSkills
      await StudentSkills.create({
        student_id, // ใช้ insertId เพื่อรับค่า student_id ของนักศึกษาที่เพิ่งสร้าง
        skill_id: createdSkill.insertId,
        skill_level,
      });
    }

    return NextResponse.json(
      { message: "User and skills registered successfully." },
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


// // POST: Create a new student
// export async function POST(req) {
//   try {
//     const studentData = await req.json(); // Get the student data from the request

//     console.log(studentData,"studentData");
    

//     await Student.create(studentData); // Use the create method from the Student model


//     return NextResponse.json(
//       { message: "User registered successfully." },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error during registration:", error);
//     return NextResponse.json(
//       { message: "An error occurred during registration." },
//       { status: 500 }
//     );
//   }
// }

// // PUT: Update a student
// export async function PUT(req) {
//   try {
//     const {
//       student_id,
//       student_firstname,
//       student_lastname,
//       student_faculty,
//       student_curriculum,
//       student_year,
//       student_gpa,
//       student_phone,
//       user_id
//     } = await req.json(); // Get the student data from the request

//     // Use the update method from the Student model
//     await Student.update(student_id, {
//       student_id,
//       student_firstname,
//       student_lastname,
//       student_faculty,
//       student_curriculum,
//       student_year,
//       student_gpa,
//       student_phone,
//       user_id
//     });

//     return NextResponse.json(
//       { message: "อัปเดตข้อมูลนักเรียนสำเร็จ." },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("เกิดข้อผิดพลาดระหว่างการอัปเดต:", error);
//     return NextResponse.json(
//       { message: "เกิดข้อผิดพลาดระหว่างการอัปเดต." },
//       { status: 500 }
//     );
//   }
// }


// // DELETE: Delete a student
// export async function DELETE(req) {
//   try {
//     const url = new URL(req.url);
//     const student_id = url.searchParams.get('student_id'); // Get student_id from URL query parameter

//     if (!student_id) {
//       return NextResponse.json(
//         { message: "Student ID is required." },
//         { status: 400 }
//       );
//     }

//     await Student.delete(student_id); // Use the delete method from the Student model

//     return NextResponse.json(
//       { message: "ลบข้อมูลนักเรียนสำเร็จ." },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("เกิดข้อผิดพลาดระหว่างการลบ:", error);
//     return NextResponse.json(
//       { message: "เกิดข้อผิดพลาดระหว่างการลบ." },
//       { status: 500 }
//     );
//   }
// }

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
