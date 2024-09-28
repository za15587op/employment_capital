import { NextResponse } from "next/server";
import promisePool from "@/lib/db";  // ใช้การอ้างอิงแบบ absolute path


export async function POST(req) {
  try {
    const { scholarshipId } = await req.json();

    console.log(scholarshipId,"scholarshipId");
    

    // ดึงข้อมูลความต้องการทักษะของทุน
    const [scholarshipRequirements] = await promisePool.query(
      `SELECT 
        scholarshiprequirement.required_level,
        scholarshiporganization.workType,
        scholarshiporganization.workTime,
        skilltypes.skill_type_id,
        skilltypes.skill_type_name
      FROM scholarshiprequirement
      INNER JOIN scholarshiporganization 
        ON scholarshiprequirement.scholarship_organ_id = scholarshiporganization.scholarship_organ_id
      INNER JOIN skilltypes 
        ON scholarshiprequirement.skill_type_id = skilltypes.skill_type_id
      WHERE scholarshiporganization.scholarship_id = ?`,
      [scholarshipId]
    );

    console.log(scholarshipRequirements,"scholarshipRequirements");
    

    return NextResponse.json(scholarshipRequirements, { status: 200 });

  } catch (error) {
    console.error("Error fetching scholarship requirements:", error);
    return NextResponse.json({ message: "Failed to fetch scholarship requirements" }, { status: 500 });
  }
}
