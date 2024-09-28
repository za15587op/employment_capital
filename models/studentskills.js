import promisePool from "@/lib/db";  // If you're using absolute imports configured in Next.js

class StudentSkills {
  constructor(student_id, skill_id, skill_level) {
    this.student_id  = student_id ;
    this.skill_id = skill_id;
    this.skill_level = skill_level;
  }

 // สร้างข้อมูลทักษะของนักศึกษา
 static async create(studentSkillData) {
  const { student_id, skill_id, skill_level } = studentSkillData;
  try {
    const [result] = await promisePool.query(
      "INSERT INTO studentskills (student_id, skill_id, skill_level) VALUES (?, ?, ?)",
      [student_id, skill_id, skill_level]
    );
    return result;
  } catch (error) {
    console.error("Error creating student skill:", error);
    throw new Error("Could not create student skill.");
  }
}

// ค้นหาทักษะของนักศึกษาทั้งหมด
static async findAllByStudentId(student_id) {
  try {
    const [rows] = await promisePool.query(
      "SELECT * FROM studentskills WHERE student_id = ?",
      [student_id]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching student skills:", error);
    throw new Error("Could not fetch student skills.");
  }
}
}


export default StudentSkills;