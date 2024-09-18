import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import ScholarshipRegistrations from "../../../../models/scholarshipregistrations";
import DateTimeAvailable from "../../../../models/datetimeavailable";

// กำหนดโฟลเดอร์ที่จะเก็บไฟล์ที่อัปโหลด
const UPLOAD_DIR = path.resolve(process.cwd(), "/public/uploads");

export const config = {
  api: {
    bodyParser: false, // ปิดการแยกข้อมูลของ Next.js เพื่อจัดการข้อมูล multipart form data
  },
};

/// ฟังก์ชันช่วยจัดการอัปโหลดไฟล์และเปลี่ยนชื่อไฟล์
async function handleFileUpload(formData) {
  const scholarships = JSON.parse(formData.get("scholarships"));

  const file = formData.get("file");
  const student_id = formData.get("student_id");
  const scholarship_id = formData.get("scholarship_id");

  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());

    // ตรวจสอบว่ามีโฟลเดอร์อัปโหลดแล้วหรือไม่ ถ้าไม่มีให้สร้างขึ้นมา
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // สร้างชื่อไฟล์ใหม่โดยใช้รหัสนิสิต, รหัสทุน, ปีการศึกษา และเทอม
    const extension = path.extname(file.name); // นามสกุลไฟล์
    const newFileName = `${student_id}_${scholarship_id}_${scholarships.academic_year}_${scholarships.academic_term}${extension}`;
    const filePath = path.join(UPLOAD_DIR, newFileName);

    // บันทึกไฟล์ไปยังโฟลเดอร์ที่กำหนด
    fs.writeFileSync(filePath, buffer);

    // ส่งคืนพาธไฟล์เพื่อนำไปเก็บในฐานข้อมูล
    return `uploads/${newFileName}`;
  }

  return null; // กรณีที่ไม่มีการอัปโหลดไฟล์
}

export async function POST(req) {
  try {
    // แยกข้อมูลฟอร์มจากร่างกายคำขอ
    const formData = await req.formData();

    const student_id = formData.get("student_id");
    const scholarship_id = formData.get("scholarship_id");
    const related_works = formData.get("related_works");
    const student_status = "Pending";

    // ตรวจสอบว่า student_id และ scholarship_id มีหรือไม่
    if (!student_id || !scholarship_id) {
      return NextResponse.json(
        { success: false, message: "Student ID หรือ Scholarship ID หายไป." },
        { status: 400 }
      );
    }

    // ตรวจสอบว่าผู้ใช้ได้สมัครทุนนี้ไปแล้วหรือยัง
    const existingRegistration = await ScholarshipRegistrations.findOne({
      where: { student_id, scholarship_id },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { success: false, message: "คุณได้สมัครทุนนี้ไปแล้ว." },
        { status: 400 }
      );
    }

    // จัดการการอัปโหลดไฟล์และได้พาธไฟล์
    const filePath = await handleFileUpload(formData);

    const is_parttime = formData.get("is_parttime");
    const date_available = JSON.parse(formData.get("date_available"));

    // ตรวจสอบว่ามีการอัปโหลดไฟล์หรือไม่ ถ้ามี ให้ใช้พาธไฟล์ที่อัปโหลดจริง ๆ
    const fileOrWorksPath = filePath || related_works;

    // เรียกใช้การสร้าง record ในฐานข้อมูล
    const registrationId = await ScholarshipRegistrations.create(
      student_id,
      scholarship_id,
      fileOrWorksPath, // ใช้พาธไฟล์แทนที่ถ้ามีการอัปโหลดไฟล์
      student_status
    );

    // บันทึกข้อมูลวันเวลาที่สามารถทำงานในฐานข้อมูล
    for (const day of date_available) {
      await DateTimeAvailable.create(
        registrationId,
        day,
        is_parttime,
      );
    }

    return NextResponse.json({
      success: true,
      message: "การลงทะเบียนทุนการศึกษาสำเร็จ.",
    });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดระหว่างการลงทะเบียนทุน:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดระหว่างการลงทะเบียน.", error: error.message },
      { status: 500 }
    );
  }
}


export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const student_id = searchParams.get('student_id');
  const scholarship_id = searchParams.get('scholarship_id');

  try {
    const existingRegistration = await ScholarshipRegistrations.findOne({
      student_id,
      scholarship_id,
    });

<<<<<<< HEAD
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
=======
    if (existingRegistration) {
      return NextResponse.json({ exists: true });
>>>>>>> origin/New_P
    } else {
      return NextResponse.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking registration:", error);
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาดขณะตรวจสอบการสมัคร' }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const regist_id = url.searchParams.get('regist_id'); 

    if (!regist_id) {
      return NextResponse.json(
        { message: "ID is required." },
        { status: 400 }
      );
    }
    await DateTimeAvailable.delete(regist_id);

    await ScholarshipRegistrations.delete(regist_id); 

    return NextResponse.json(
      { message: "ScholarshipRegistrations deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting ScholarshipRegistrations:", error);
    return NextResponse.json(
      { message: "An error occurred during ScholarshipRegistrations deletion." },
      { status: 500 }
    );
  }
}


<<<<<<< HEAD
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
=======
// import { NextResponse } from "next/server";
// import path from "path";
// import fs from "fs";
// import ScholarshipRegistrations from "../../../../models/scholarshipregistrations";
// import DateTimeAvailable from "../../../../models/datetimeavailable";

// // กำหนดโฟลเดอร์ที่จะเก็บไฟล์ที่อัปโหลด
// const UPLOAD_DIR = path.resolve(process.cwd(), "public/uploads");

// export const config = {
//   api: {
//     bodyParser: false, // ปิดการแยกข้อมูลของ Next.js เพื่อจัดการข้อมูล multipart form data
//   },
// };

// // ฟังก์ชันช่วยจัดการอัปโหลดไฟล์และเปลี่ยนชื่อไฟล์
// async function handleFileUpload(formData) {
//   const scholarships = JSON.parse(formData.get("scholarships"));

//   const file = formData.get("file");
//   const student_id = formData.get("student_id");
//   const scholarship_id = formData.get("scholarship_id");

//   if (file) {
//     const buffer = Buffer.from(await file.arrayBuffer());

//     // ตรวจสอบว่ามีโฟลเดอร์อัปโหลดแล้วหรือไม่ ถ้าไม่มีให้สร้างขึ้นมา
//     if (!fs.existsSync(UPLOAD_DIR)) {
//       fs.mkdirSync(UPLOAD_DIR, { recursive: true });
//     }

//     // สร้างชื่อไฟล์ใหม่โดยใช้รหัสนิสิต, รหัสทุน, ปีการศึกษา และเทอม
//     const extension = path.extname(file.name); // นามสกุลไฟล์
//     const newFileName = `${student_id}_${scholarship_id}_${scholarships.academic_year}_${scholarships.academic_term}${extension}`;
//     const filePath = path.join(UPLOAD_DIR, newFileName);

//     // บันทึกไฟล์ไปยังโฟลเดอร์ที่กำหนด
//     fs.writeFileSync(filePath, buffer);

//     // ส่งคืนพาธไฟล์เพื่อนำไปเก็บในฐานข้อมูล
//     return `uploads/${newFileName}`;
//   }

//   return null; // กรณีที่ไม่มีการอัปโหลดไฟล์
// }

// export async function POST(req) {
//   try {
//     // แยกข้อมูลฟอร์มจากร่างกายคำขอ
//     const formData = await req.formData();

//     const student_id = formData.get("student_id");
//     const scholarship_id = formData.get("scholarship_id");
//     const related_works = formData.get("related_works");
//     const is_parttime = formData.get("is_parttime");
//     const student_status = "Pending";
   
//     // ตรวจสอบว่า student_id และ scholarship_id มีหรือไม่
//     if (!student_id || !scholarship_id) {
//       return NextResponse.json(
//         { success: false, message: "Student ID หรือ Scholarship ID หายไป." },
//         { status: 400 }
//       );
//     }

//     // ตรวจสอบว่าผู้ใช้ได้สมัครทุนนี้ไปแล้วหรือยัง
//     const existingRegistration = await ScholarshipRegistrations.findOne({
//       where: { student_id, scholarship_id },
//     });

//     if (existingRegistration) {
//       return NextResponse.json(
//         { success: false, message: "คุณได้สมัครทุนนี้ไปแล้ว." },
//         { status: 400 }
//       );
//     }

//     // จัดการการอัปโหลดไฟล์และได้พาธไฟล์
//     const filePath = await handleFileUpload(formData);

//     // ตรวจสอบว่ามีการอัปโหลดไฟล์หรือไม่ ถ้ามี ให้ใช้พาธไฟล์ที่อัปโหลดจริง ๆ
//     const fileOrWorksPath = filePath || related_works;

//     // เรียกใช้การสร้าง record ในฐานข้อมูล
//     const registrationId = await ScholarshipRegistrations.create(
//       student_id,
//       scholarship_id,
//       fileOrWorksPath, // ใช้พาธไฟล์แทนที่ถ้ามีการอัปโหลดไฟล์
//       is_parttime,
//       student_status
//     );

//     return NextResponse.json({
//       success: true,
//       message: "การลงทะเบียนทุนการศึกษาสำเร็จ.",
//     });
//   } catch (error) {
//     console.error("เกิดข้อผิดพลาดระหว่างการลงทะเบียนทุน:", error);
//     return NextResponse.json(
//       { success: false, message: "เกิดข้อผิดพลาดระหว่างการลงทะเบียน.", error: error.message },
//       { status: 500 }
//     );
//   }
// }


// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const student_id = searchParams.get('student_id');
//   const scholarship_id = searchParams.get('scholarship_id');

//   try {
//     const existingRegistration = await ScholarshipRegistrations.findOne({
//       student_id,
//       scholarship_id,
//     });

//     if (existingRegistration) {
//       return NextResponse.json({ exists: true });
//     } else {
//       return NextResponse.json({ exists: false });
//     }
//   } catch (error) {
//     console.error("Error checking registration:", error);
//     return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาดขณะตรวจสอบการสมัคร' }, { status: 500 });
//   }
// }


// export async function DELETE(req) {
//   try {
//     const url = new URL(req.url);
//     const regist_id = url.searchParams.get('regist_id'); 

//     if (!regist_id) {
//       return NextResponse.json(
//         { message: "ID is required." },
//         { status: 400 }
//       );
//     }

//     await ScholarshipRegistrations.delete(regist_id); 

//     return NextResponse.json(
//       { message: "ScholarshipRegistrations deleted successfully." },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error deleting ScholarshipRegistrations:", error);
//     return NextResponse.json(
//       { message: "An error occurred during ScholarshipRegistrations deletion." },
//       { status: 500 }
//     );
>>>>>>> origin/New_P
//   }
// }