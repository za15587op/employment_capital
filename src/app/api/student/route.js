// import { NextResponse } from "next/server";
// import Student from "../../../../models/student"; // Student Model
// import Skills from "../../../../models/skills"; // Skills Model
// import StudentSkills from "../../../../models/studentskills"; // StudentSkills Model
// import Skills_SkillTypes from "../../../../models/skills_skilltypes"; // Skills_SkillTypes Model

// // POST: Create a new student
// export async function POST(req) {
//   try {
//     const studentData = await req.json(); // Parse the incoming student data
    

//     // Destructure incoming data
//     const {
//       student_id,
//       student_firstname,
//       student_lastname,
//       student_faculty,
//       student_curriculum,
//       student_year,
//       student_gpa,
//       student_phone,
//       user_id,
//       join_org,
//       skills, // Array of skills from frontend
//       selectedSkillTypes, // Skill type array from frontend
//       studentSkills, // Skill levels array from frontend
//     } = studentData;

//     console.log(join_org);
    

//     // Create a student record
//     const createdStudent = await Student.create({
//       student_id,
//       student_firstname,
//       student_lastname,
//       student_faculty,
//       student_curriculum,
//       student_year,
//       student_gpa,
//       student_phone,
//       join_org,
//       user_id,
//     });

//     // Check if student creation was successful
//     if (!createdStudent) {
//       throw new Error("Unable to create student");
//     }

//     if (!skills || !skills.length) {
//       console.error("Skills array is missing or empty");
//       throw new Error("Skills data is required");
//     }
    
//     if (!studentSkills || !studentSkills.length) {
//       console.error("StudentSkills array is missing or empty");
//       throw new Error("StudentSkills data is required");
//     }
    
//     if (!selectedSkillTypes || !selectedSkillTypes.length) {
//       console.error("SelectedSkillTypes array is missing or empty");
//       throw new Error("SelectedSkillTypes data is required");
//     }
    

// // Loop through the skills array and process each skill
// for (let i = 0; i < skills.length; i++) {
//   const { name: skill_name, level: skill_level } = skills[i]; // ปรับการ destructure ให้ตรงกับโครงสร้างจริง
//   const { skill_type_id } = selectedSkillTypes[i]; // ตรวจสอบว่ามีการใช้ selectedSkillTypes อย่างถูกต้อง


//   console.log(skill_name);
  
//   // Create the skill in the Skills table
//   const createdSkill = await Skills.create({
//     skill_name,
//   });

//   // If skill creation fails, throw an error
//   if (!createdSkill) {
//     throw new Error("Unable to create skill");
//   }

//   // Link the skill to its type in the Skills_SkillTypes table
//   await Skills_SkillTypes.create({
//     student_id: createdStudent.id, // Use the ID of the newly created student
//     skill_id: createdSkill.id, // Use the ID of the newly created skill
//     skill_type_id,
//   });

//   // Link the student to the skill in the StudentSkills table
//   await StudentSkills.create({
//     student_id: createdStudent.id, // Use the ID of the newly created student
//     skill_id: createdSkill.id, // Use the ID of the newly created skill
//     skill_level,
//   });
// }



//     // Return success response
//     return NextResponse.json(
//       { message: "Student and skills registered successfully." },
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

// // GET: Fetch all students
// export async function GET(req) {
//   try {
//     const students = await Student.findAll(); // Use Sequelize's findAll method to retrieve all students

//     return NextResponse.json(students, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching students:", error);
//     return NextResponse.json(
//       { message: "Error occurred while fetching students." },
//       { status: 500 }
//     );
//   }
// }


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
      join_org,
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
      join_org,
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
