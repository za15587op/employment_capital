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

    const student_status = "Pending";

    const {
      student_id,
      skills,
      scholarshipRegistrations,
      // skillTypes,
      selectedSkillTypes,
      studentSkills,
    } = await req.json();

    console.log(student_id,'req');
    

    // รับการเชื่อมต่อจากพูล
    connection = await promisePool.getConnection();

    // เริ่มทำธุรกรรมฐานข้อมูล
    await connection.beginTransaction();

    const skillTypeIdMap = {};

// สร้างแผนที่เพื่อเก็บ skill_id ที่ได้รับการแทรกใหม่และจับคู่กับ skill_id เก่า
const skillIdMap = {};

// วนลูปเพื่อแทรกข้อมูลทักษะ (skills) เข้าในตาราง skills
for (const skill of skills) {
  const [skillResult] = await connection.query(
    `INSERT INTO skills (skill_name) VALUES (?)`,
    [skill.skill_name]
  );

  if (skillResult) {
    const skill_id = skillResult.insertId; // ใช้ insertId เพื่อรับ skill_id ที่เพิ่งเพิ่มเข้าไป
    skillIdMap[skill.skill_id] = skill_id; // สร้างแผนที่จาก skill_id เก่าไปยัง skill_id ใหม่
    console.log(skill_id, "skill_id");
  }
}

// แทรกข้อมูลหลายค่าลงในตาราง studentskills โดยใช้ skill_id จากข้อมูล skill เอง เพื่อไม่ให้ซ้ำ
for (const studentSkill of studentSkills) {
  // ใช้ skill_id จาก skill เอง หรือจาก skillIdMap หากมีการเปลี่ยนแปลง
  const actualSkillId = skillIdMap[studentSkill.skill_id]
  console.log(actualSkillId,"actualSkillId");
  
  // ตรวจสอบว่า actualSkillId มีค่าหรือไม่
  if (actualSkillId) {
    // ตรวจสอบว่าทักษะนี้มีอยู่แล้วในตารางหรือไม่
    const [existingSkill] = await connection.query(
      `SELECT * FROM studentskills WHERE student_id = ? AND skill_id = ?`,
      [student_id, actualSkillId]
    );

    if (!existingSkill.length) {
      // เพิ่มข้อมูลทักษะใหม่ในตาราง studentskills
      await connection.query(
        `INSERT INTO studentskills (student_id, skill_id, skill_level) VALUES (?, ?, ?)`,
        [student_id, actualSkillId, studentSkill.skill_level]
      );
      console.log('เพิ่มทักษะใหม่:', actualSkillId);
    } else {
      console.log('ทักษะนี้ถูกเพิ่มให้กับนักเรียนแล้ว:', student_id, 'และทักษะ:', actualSkillId);
    }
  } else {
    console.error("Skill ID not found in map:", studentSkill.skill_id);
  }
}



    // เพิ่มข้อมูลการลงทะเบียนทุนการศึกษา
    for (const registration of scholarshipRegistrations) {
      await connection.query(
        `INSERT INTO scholarshipregistrations (student_id, scholarship_id, is_parttime, is_parttimedate, related_works, student_status) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          student_id,
          registration.scholarship_id,
          registration.is_parttime,
          registration.is_parttimedate,
          registration.related_works,
          student_status
        ]
      );
    }

    for (const skill of skills) {
      const actualSkillId = skillIdMap[skill.skill_id]; // รับ skill_id ที่ถูกสร้างขึ้นใหม่จากแผนที่
      
      for (const selectedSkillType of selectedSkillTypes) {
        if (actualSkillId && selectedSkillType.skill_type_id) {
          // ตรวจสอบว่าข้อมูล skill_id และ skill_type_id นี้มีอยู่ในตารางแล้วหรือไม่
          const [existingSkillType] = await connection.query(
            `SELECT * FROM skills_skilltypes WHERE skill_id = ? AND skill_type_id = ?`,
            [actualSkillId, selectedSkillType.skill_type_id]
          );
    
          if (!existingSkillType.length) {
            // หากยังไม่มีข้อมูลในตาราง ให้เพิ่มข้อมูลใหม่
            await connection.query(
              `INSERT INTO skills_skilltypes (skill_id, skill_type_id) VALUES (?, ?)`,
              [actualSkillId, selectedSkillType.skill_type_id]
            );
          } else {
            console.log(
              'ข้อมูลนี้มีอยู่แล้ว: skill_id:', actualSkillId, ' skill_type_id:', selectedSkillType.skill_type_id
            );
          }
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


// // สร้างแผนที่เพื่อเก็บ skill_id ที่ได้รับการแทรกใหม่และจับคู่กับ skill_id เก่า
// const skillIdMap = {};

// // วนลูปเพื่อแทรกข้อมูลทักษะ (skills) เข้าในตาราง skills
// for (const skill of skills) {
//   const [skillResult] = await connection.query(
//     `INSERT INTO skills (skill_name) VALUES (?)`,
//     [skill.skill_name]
//   );

//   if (skillResult) {
//     const skill_id = skillResult.insertId; // ใช้ insertId เพื่อรับ skill_id ที่เพิ่งเพิ่มเข้าไป
//     skillIdMap[skill.skill_id] = skill_id; // สร้างแผนที่จาก skill_id เก่าไปยัง skill_id ใหม่
//     console.log(skill_id, "skill_id");
//   }
// }

// // แทรกข้อมูลหลายค่าลงในตาราง studentskills โดยใช้ skill_id จากข้อมูล skill เอง เพื่อไม่ให้ซ้ำ
// for (const studentSkill of studentSkills) {
//   // ใช้ skill_id จาก skill เอง หรือจาก skillIdMap หากมีการเปลี่ยนแปลง
//   const actualSkillId = skillIdMap[studentSkill.skill_id]
//   console.log(actualSkillId,"actualSkillId");
  
//   // ตรวจสอบว่า actualSkillId มีค่าหรือไม่
//   if (actualSkillId) {
//     // ตรวจสอบว่าทักษะนี้มีอยู่แล้วในตารางหรือไม่
//     const [existingSkill] = await connection.query(
//       `SELECT * FROM studentskills WHERE student_id = ? AND skill_id = ?`,
//       [student_id, actualSkillId]
//     );

//     if (!existingSkill.length) {
//       // เพิ่มข้อมูลทักษะใหม่ในตาราง studentskills
//       await connection.query(
//         `INSERT INTO studentskills (student_id, skill_id, skill_level) VALUES (?, ?, ?)`,
//         [student_id, actualSkillId, studentSkill.skill_level]
//       );
//       console.log('เพิ่มทักษะใหม่:', actualSkillId);
//     } else {
//       console.log('ทักษะนี้ถูกเพิ่มให้กับนักเรียนแล้ว:', student_id, 'และทักษะ:', actualSkillId);
//     }
//   } else {
//     console.error("Skill ID not found in map:", studentSkill.skill_id);
//   }
// }