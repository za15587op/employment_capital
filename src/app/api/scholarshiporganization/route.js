import { NextResponse } from "next/server";
import promisePool from "../../../../lib/db"; // Import connection to MySQL
import ScholarshipOrganization from "../../../../models/scholarshiporganization";
import ScholarshipRequirement from "../../../../models/scholarshiprequirement";


// ตรวจสอบการ import ให้แน่ใจว่า path ถูกต้อง

// export async function POST(req) {
//   const connection = await promisePool.getConnection(); // เริ่มการเชื่อมต่อกับฐานข้อมูล

//   try {
//     const scholarshipData = await req.json(); // รับข้อมูลทุนการศึกษาจาก request
//     const { scholarship_id, organization_id, amount, workType, workTime } = scholarshipData;
//     console.log(scholarshipData);
   
//     let scholarship_organ_id;

//     // ตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่
//     const [rows] = await connection.query(
//       `SELECT scholarship_organ_id, amount, workType, workTime 
//        FROM scholarshiporganization 
//        WHERE organization_id = ? AND scholarship_id = ?`,
//       [organization_id, scholarship_id]
//     );
    
//     if (rows.length > 0) {
//       const existingData = rows[0];
//       scholarship_organ_id = existingData.scholarship_organ_id; // ดึง scholarship_organ_id ที่มีอยู่
//       // ตรวจสอบว่ามีข้อมูลใน amount, workType, workTime อยู่หรือไม่
//       if (existingData.amount !== null || existingData.workType !== null || existingData.workTime !== null) {
//         return NextResponse.json(
//           { message: "ข้อมูลนี้มีอยู่แล้ว ไม่สามารถอัปเดตได้" },
//           { status: 400 }
//         );
//       }
//     } else {
//       // ถ้าไม่มีข้อมูลอยู่แล้ว ให้ทำการเพิ่มข้อมูลใหม่ และรับ scholarship_organ_id
//       const [result] = await connection.query(
//         'INSERT INTO scholarshiporganization (scholarship_id, organization_id, amount, workType, workTime) VALUES (?, ?, ?, ?, ?)',
//         [scholarship_id, organization_id, amount, workType, workTime]
//       );
//       scholarship_organ_id = result.insertId; // รับ scholarship_organ_id ที่เพิ่งสร้างใหม่
//     }

//     return NextResponse.json(
//       { message: "บันทึก scholarship_id ลงในตารางที่เกี่ยวข้องเรียบร้อยแล้ว", scholarship_organ_id },
//       { status: 201 }
//     );
//   } catch (error) {
//     // Rollback transaction ถ้ามีข้อผิดพลาด
//     await connection.rollback();
//     console.error("Error creating scholarship:", error);
//     return NextResponse.json(
//       { message: "เกิดข้อผิดพลาดระหว่างการสร้างทุนการศึกษา" },
//       { status: 500 }
//     );
//   } finally {
//     connection.release(); // ปล่อย connection เมื่อเสร็จสิ้น
//   }
// }


export async function POST(req) {
  try {
    const scholarshipData = await req.json(); // รับข้อมูลจาก request
    console.log(scholarshipData, "scholarshipData");
    
    const { scholarship_id, organization_id, amount, workType, workTime, selectedSkillTypes } = scholarshipData;

    // ตรวจสอบว่าข้อมูลมีอยู่แล้วหรือไม่ใน Model `ScholarshipOrganization`
    let scholarship_organ_id;
    const existingRecord = await ScholarshipOrganization.findOne({
      where: { organization_id, scholarship_id }
    });

    // ถ้าไม่มีข้อมูล ให้ทำการเพิ่มข้อมูลใหม่
    if (!existingRecord) {
      const newRecord = await ScholarshipOrganization.create({
        scholarship_id,
        organization_id,
        amount,
        workType,
        workTime
      });

      // ใช้ insertId เพื่อเก็บ scholarship_organ_id ที่ถูกสร้าง
      scholarship_organ_id = newRecord.scholarship_organ_id || newRecord.insertId;
      console.log("scholarship_organ_id:", scholarship_organ_id);

      // เพิ่มข้อมูลลงในตาราง `scholarshiprequirement`
      for (const selectedSkillType of selectedSkillTypes) {
        const { skill_type_id, required_level } = selectedSkillType;
        await ScholarshipRequirement.create({
          scholarship_organ_id,
          skill_type_id,
          required_level
        });
      }

    } else {
      return NextResponse.json(
        { message: "ข้อมูลนี้มีอยู่แล้ว" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "บันทึกข้อมูลเรียบร้อยแล้ว", scholarship_organ_id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดระหว่างการบันทึกข้อมูล" },
      { status: 500 }
    );
  }
}




// // PUT: Update a scholarship organization
// export async function PUT(req) {
//   const connection = await promisePool.getConnection(); // เริ่มการเชื่อมต่อกับฐานข้อมูล

//   try {
//     const url = new URL(req.url);
//     const scholarship_organ_id = url.searchParams.get("scholarship_organ_id"); // ดึง scholarship_organ_id จาก URL query parameter

//     if (!scholarship_organ_id) {
//       return NextResponse.json(
//         { message: "ScholarshipOrganization ID is required." },
//         { status: 400 }
//       );
//     }

//     const { scholarship_id, organization_id, amount, workType, workTime } = await req.json(); // รับข้อมูล scholarship organization จาก request

//     // เริ่มต้น Transaction
//     await connection.beginTransaction();

//     // อัปเดตข้อมูลในตาราง `scholarshiporganization`
//     await connection.query(
//       'UPDATE scholarshiporganization SET scholarship_id = ?, organization_id = ?, amount = ?, workType = ?, workTime = ? WHERE scholarship_organ_id = ?',
//       [scholarship_id, organization_id, amount, workType, workTime, scholarship_organ_id]
//     );

//     // Commit transaction ถ้าขั้นตอนทั้งหมดสำเร็จ
//     await connection.commit();

//     return NextResponse.json(
//       { message: "Scholarship organization updated successfully." },
//       { status: 200 }
//     );
//   } catch (error) {
//     // Rollback transaction ถ้ามีข้อผิดพลาด
//     await connection.rollback();
//     console.error("Error updating scholarship organization:", error);
//     return NextResponse.json(
//       { message: "An error occurred during scholarship organization update." },
//       { status: 500 }
//     );
//   } finally {
//     connection.release(); // ปล่อย connection เมื่อเสร็จสิ้น
//   }
// }

// DELETE: Delete a scholarship organization
export async function DELETE(req) {
  const connection = await promisePool.getConnection(); // เริ่มการเชื่อมต่อกับฐานข้อมูล

  try {
    const url = new URL(req.url);
    const scholarship_organ_id = url.searchParams.get("scholarship_organ_id"); // ดึง scholarship_organ_id จาก URL query parameter

    if (!scholarship_organ_id) {
      return NextResponse.json(
        { message: "ScholarshipOrganization ID is required." },
        { status: 400 }
      );
    }

    // เริ่มต้น Transaction
    await connection.beginTransaction();

    // ลบข้อมูลจากตาราง `scholarshiporganization`
    await connection.query(
      'DELETE FROM scholarshiporganization WHERE scholarship_organ_id = ?',
      [scholarship_organ_id]
    );

    // Commit transaction ถ้าขั้นตอนทั้งหมดสำเร็จ
    await connection.commit();

    return NextResponse.json(
      { message: "Scholarship organization deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    // Rollback transaction ถ้ามีข้อผิดพลาด
    await connection.rollback();
    console.error("Error deleting scholarship organization:", error);
    return NextResponse.json(
      { message: "An error occurred during scholarship organization deletion." },
      { status: 500 }
    );
  } finally {
    connection.release(); // ปล่อย connection เมื่อเสร็จสิ้น
  }
}


// GET: Fetch all scholarship organizations
export async function GET(req) {
  console.log(req);
  // return NextResponse.json("Test Something", { status: 200 });

  try {
    const scholarshiporganizations = await scholarshiporganization.getAll();
    console.log("Fetched Scholarship Organizations:", scholarshiporganizations); // ตรวจสอบข้อมูลที่ดึงมา
    return NextResponse.json(scholarshiporganizations, { status: 200 });
  } catch (error) {
    console.error("Error fetching scholarshiporganizations:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching scholarshiporganizations." },
      { status: 500 }
    );
  }
}