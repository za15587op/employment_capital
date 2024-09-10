import promisePool from "../../../../lib/db";

export async function GET(req, { params }) {
  try {
    // const student_id = params.id; // ตรวจสอบให้แน่ใจว่านี่ตรงกับพารามิเตอร์ URL

    // console.log(params);

    if (!student_id) {
      return NextResponse.json(
        { message: "Student ID is required" },
        { status: 400 }
      );
    }

    const [rows] = await promisePool.query(
      "SELECT * FROM student WHERE student_id = ?",
      [student_id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching student data:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  let connection;

  try {
    const {
      student_id,
      skills,
      scholarshipRegistrations,
      // skillTypes,
      selectedSkillTypes,
      studentSkills,
    } = await req.json();

    // รับการเชื่อมต่อจากพูล
    connection = await promisePool.getConnection();

    // เริ่มทำธุรกรรมฐานข้อมูล
    await connection.beginTransaction();

    const skillTypeIdMap = {};

    // สร้างแผนที่เพื่อเก็บ skill_id ที่ได้รับการแทรกใหม่และจับคู่กับ skill_id เก่า
    const skillIdMap = {};

    console.log(studentSkills, "studentSkills");

    // วนลูปเพื่อแทรกข้อมูลทักษะ (skills) เข้าในตาราง skills
    for (const skill of skills) {
      const [skillResult] = await connection.query(
        `INSERT INTO skills (skill_name) VALUES (?)`,
        [skill.skill_name]
      );

      if (skillResult) {
        const skill_id = skillResult.insertId; // ใช้ insertId เพื่อรับ skill_id ที่เพิ่งเพิ่มเข้าไป
        skillIdMap[skill.skill_id] = skill_id; // สร้างแผนที่จาก skill_id เก่าไปยัง skill_id ใหม่
      }
    }

    // แทรกข้อมูลหลายค่าลงในตาราง studentskills
    for (const skill of skills) {
      const actualSkillId = skillIdMap[skill.skill_id]; // ดึง skill_id ที่แท้จริงจากแผนที่
      for(const studentSkill of studentSkills){
        if (actualSkillId) {
          // ตรวจสอบว่า actualSkillId มีค่าหรือไม่
          await connection.query(
            `INSERT INTO studentskills (student_id, skill_id, skill_level) VALUES (?, ?, ?)`,
            [student_id, actualSkillId, studentSkill.skill_level]
          );
          console.log();
        } else {
          console.error("Skill ID not found in map:", skill.skill_id);
          
        }
      }
      
    }

    // เพิ่มข้อมูลการลงทะเบียนทุนการศึกษา
    for (const registration of scholarshipRegistrations) {
      await connection.query(
        `INSERT INTO scholarshipregistrations (student_id, scholarship_id, is_parttime, is_parttimedate, related_works) VALUES (?, ?, ?, ?, ?)`,
        [
          student_id,
          registration.scholarship_id,
          registration.is_parttime,
          registration.is_parttimedate,
          registration.related_works,
        ]
      );
    }

    for (const skill of skills) {
      const actualSkillId = skillIdMap[skill.skill_id];
      for (const selectedSkillType of selectedSkillTypes) {
        if (actualSkillId && selectedSkillType.skill_type_id) {
          // ตรวจสอบว่ามีค่าที่ถูกต้อง
          await connection.query(
            `INSERT INTO skills_skilltypes (skill_id, skill_type_id) VALUES (?, ?)`,
            [actualSkillId, selectedSkillType.skill_type_id]
          );
        } else {
          console.error(
            "Skill or Skill Type ID not found:",
            skill.skill_id,
            selectedSkillType.skill_type_id
          );
        }
      }
    }

    // ยืนยันธุรกรรม
    await connection.commit();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error inserting data:", error);

    // ย้อนกลับธุรกรรมในกรณีเกิดข้อผิดพลาด
    if (connection) await connection.rollback();

    return new Response(
      JSON.stringify({
        success: false,
        message: "Error submitting the scholarship registration.",
      }),
      { status: 500 }
    );
  } finally {
    // ปล่อยการเชื่อมต่อกลับไปที่พูล
    if (connection) connection.release();
  }
}