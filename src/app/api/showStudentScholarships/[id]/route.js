import promisePool from "../../../../../lib/db";

export async function GET(req, { params }) {
  let connection;

  try {
    const { id: student_id } = params;

    connection = await promisePool.getConnection();

    const [rows] = await connection.query(
      `
      SELECT 
        student.student_firstname, 
        student.student_lastname, 
        scholarships.academic_year, 
        scholarships.academic_term,
        skills.skill_name,
        scholarshipregistrations.student_id,    	
        student.student_field	,
        student.student_curriculum	,
        student.student_year	,
        student.student_phone	,
        student.student_gpa	,
        scholarshipregistrations.student_status	
      FROM scholarshipregistrations
      JOIN student ON scholarshipregistrations.student_id = student.student_id
      JOIN scholarships ON scholarshipregistrations.scholarship_id = scholarships.scholarship_id
      JOIN studentskills ON student.student_id = studentskills.student_id
      JOIN skills ON studentskills.skill_id = skills.skill_id
      WHERE scholarshipregistrations.student_id = ?
      `,
      // JOIN skills_skilltypes ON skills.skill_id = skills_skilltypes.skill_id
      // JOIN skilltypes ON skills_skilltypes.skill_type_id = skilltypes.skill_type_id
      // WHERE scholarshipregistrations.scholarship_id = ?
      [student_id]
    );

    if (rows.length === 0) {
      return new Response(JSON.stringify({ success: false, message: 'ไม่พบข้อมูลทุนการศึกษา.' }), { status: 404 });
    }

    return new Response(JSON.stringify(rows[0]), { status: 200 });
  } catch (error) {
    console.error('Error fetching scholarship data:', error);
    return new Response(JSON.stringify({ success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลทุนการศึกษา.' }), { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}


export async function DELETE(req, { params }) {
  const { id: student_id } = params;  // ดึงค่า `student_id` จาก `params` อย่างถูกต้อง

  try {
    const [result] = await promisePool.query('DELETE FROM scholarshipregistrations WHERE student_id = ?', [student_id]);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: 'ไม่พบ scholarshipregistrations' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'ลบ scholarshipregistrations สำเร็จแล้ว' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting scholarshipregistrations:', error);
    return new Response(JSON.stringify({ error: 'เกิดข้อผิดพลาดขณะลบ scholarshipregistrations' }), { status: 500 });
  }
}