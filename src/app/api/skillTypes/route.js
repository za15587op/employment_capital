import { NextResponse } from "next/server";
import promisePool from "@/lib/db";  // If you're using absolute imports configured in Next.js
import SkillTypes from "../../../../models/skilltypes";

export async function POST(req) {
  const connection = await promisePool.getConnection();

  try {
    const skilltypesData = await req.json();
    console.log("Received data มาจาก User:", skilltypesData);
    const { skills, scholarship_organ_id } = skilltypesData;

    // Validate overall skills input
    if (!Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json(
        { message: "Skills data must be an array and not empty" },
        { status: 400 }
      );
    }

    await connection.beginTransaction();
    const skillTypeIds = [];

    // Retrieve the current maximum scholarship_requirement_id
    const [[{ max_id }]] = await connection.query(
      `SELECT COALESCE(MAX(scholarship_requirement_id), 0) AS max_id FROM scholarshiprequirement`
    );

    // Delete records with NULL skill_type_id or required_level
    await connection.query(
      `DELETE FROM scholarshiprequirement 
       WHERE scholarship_organ_id = ? AND (skill_type_id IS NULL OR required_level IS NULL)`,
      [scholarship_organ_id]
    );

    // // Reset the sequence to continue from the previous maximum ID
    // await connection.query(
    //   `ALTER SEQUENCE scholarshiprequirement RESTART WITH ?`,
    //   [max_id + 1]
    // );

    for (const skill of skills) {
      const { skill_type_name, required_level } = skill;

      // Validate skill inputs
      if (!skill_type_name || !required_level) {
        return NextResponse.json(
          { message: "skill_type_name และ required_level ต้องไม่ว่าง" },
          { status: 400 }
        );
      }

      // Check if the skill already exists
      const [existingSkill] = await connection.query(
        `SELECT skill_type_id FROM skilltypes WHERE skill_type_name = ?`,
        [skill_type_name]
      );

      let skill_type_id;

      if (existingSkill.length > 0) {
        skill_type_id = existingSkill[0].skill_type_id;
        console.log(`Skill already exists with skill_type_id: ${skill_type_id}`);
      } else {
        // Insert new skill type if skill_type_name is not empty
        if (skill_type_name.trim()) {
          const [resultSkillType] = await connection.query(
            'INSERT INTO skilltypes (skill_type_name) VALUES (?)',
            [skill_type_name]
          );
          skill_type_id = resultSkillType.insertId;
          console.log(`New skill created with skill_type_id: ${skill_type_id}`);
        } else {
          console.log(`Skipping insertion for empty skill_type_name`);
          continue; // Skip to next skill if skill_type_name is empty
        }
      }

      skillTypeIds.push(skill_type_id);

      // Update or insert into scholarshiprequirement
      const [existingEntry] = await connection.query(
        `SELECT * FROM scholarshiprequirement WHERE scholarship_organ_id = ? AND skill_type_id = ?`,
        [scholarship_organ_id, skill_type_id]
      );

      if (existingEntry.length > 0) {
        console.log("Found existing entry, updating required_level");

        await connection.query(
          `UPDATE scholarshiprequirement 
           SET required_level = ?
           WHERE scholarship_organ_id = ? AND skill_type_id = ?`,
          [required_level, scholarship_organ_id, skill_type_id]
        );
      } else {
        // Insert only if skill_type_id and required_level are not empty
        if (skill_type_id && required_level) {
          console.log("Inserting new entry into scholarshiprequirement");

          await connection.query(
            `INSERT INTO scholarshiprequirement (scholarship_organ_id, skill_type_id, required_level) 
             VALUES (?, ?, ?)`,
            [scholarship_organ_id, skill_type_id, required_level]
          );
        } else {
          console.log(`Skipping insertion for empty skill_type_id or required_level`);
        }
      }
    }

    await connection.commit();

    return NextResponse.json(
      { message: "Operation successful", skillTypeIds },
      { status: 200 }
    );
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error during update process:", error);
    return NextResponse.json(
      { message: "Error during update", error: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
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

