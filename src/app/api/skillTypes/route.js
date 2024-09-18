import { NextResponse } from "next/server";
import promisePool from "../../../../lib/db"; // ปรับตามเส้นทางของฐานข้อมูลของคุณ
import SkillTypes from "../../../../models/skilltypes";

export async function POST(req) {
  const connection = await promisePool.getConnection(); 

  try {
    // รับข้อมูลจาก request
    const skilltypesData  = await req.json(); 
    const { skill_type_name,scholarship_organ_id } = skilltypesData;

    console.log("Received skilltypesData:", skilltypesData);
    
    // เริ่มต้น Transaction
    await connection.beginTransaction();

    // เพิ่มข้อมูลใหม่ลงในตาราง `skilltypes`
    const [resultSkillType] = await connection.query(
      'INSERT INTO skilltypes (skill_type_name) VALUES (?)',
      [skill_type_name]
    );

    const skill_type_id = resultSkillType.insertId; // รับ `skill_type_id` ที่เพิ่งสร้างใหม่
    console.log(`New skill created with skill_type_id: ${skill_type_id}`);
    
     connection.query(
      `UPDATE scholarshiprequirement 
       SET skill_type_id = ? 
       WHERE scholarship_organ_id = ?`,
      [skill_type_id,scholarship_organ_id]
    );

    // Commit transaction ถ้าขั้นตอนทั้งหมดสำเร็จ
    await connection.commit();

    return NextResponse.json(
      { message: "สร้างทักษะและบันทึกข้อมูลสำเร็จ", skill_type_id },
      { status: 201 }
    );
  } catch (error) {
    // Rollback transaction ถ้ามีข้อผิดพลาด
    if (connection) await connection.rollback();
    console.error("Error creating skill and scholarship requirement:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดระหว่างการสร้างทักษะและบันทึกข้อมูล", error: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release(); // ปล่อย connection เมื่อเสร็จสิ้น
  }
}


// GET: Fetch all skillTypes
export async function GET(req) {
    try {
      const skillTypes = await SkillTypes.getAll(); // Use the getAll method from the Student model
  
      return NextResponse.json(skillTypes, { status: 200 });
    } catch (error) {
      console.error("เกิดข้อผิดพลาดระหว่างการดึงข้อมูล:", error);
      return NextResponse.json(
        { message: "เกิดข้อผิดพลาดระหว่างการดึงข้อมูล." },
        { status: 500 }
      );
    }
  }

  // DELETE: Delete a skilltypes
export async function DELETE(req) {
    try {
      const url = new URL(req.url);
      const skill_type_id = url.searchParams.get('skill_type_id'); // Get std_id from URL query parameter
  
      if (!skill_type_id) {
        return NextResponse.json(
          { message: "skilltypes skill_type_id is required." },
          { status: 400 }
        );
      }
  
      await SkillTypes.delete(skill_type_id); // Use the delete method from the skilltypes model
  
      return NextResponse.json(
        { message: "ลบข้อมูลประเภททักษะสำเร็จ." },
        { status: 200 }
      );
    } catch (error) {
      console.error("เกิดข้อผิดพลาดระหว่างการลบ:", error);
      return NextResponse.json(
        { message: "เกิดข้อผิดพลาดระหว่างการลบ." },
        { status: 500 }
      );
    }
  }
  
  