
import ScholarshipRegistrations from '../../../../../models/scholarshipregistrations';

// ฟังก์ชันในการดึงข้อมูลทุนการศึกษาของนักเรียน
export async function GET(req, { params }) {
  try {
    const { id: student_id } = params;

    // ดึงข้อมูลการสมัครทุนการศึกษาของนักเรียน
    const getData = await ScholarshipRegistrations.findByIdALL(student_id);
    if (!getData || getData.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "ไม่พบข้อมูลทุนการศึกษา." }),
        { status: 404 }
      );
    }
    

    return new Response(JSON.stringify(getData), { status: 200 });
  } catch (error) {
    console.error("Error fetching getData data:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "เกิดข้อผิดพลาดในการดึงข้อมูลทุนการศึกษา.",
      }),
      { status: 500 }
    );
  }
}


export async function DELETE(req, { params }) {
  const { id: student_id } = params; // ดึงค่า `student_id` จาก `params` อย่างถูกต้อง

  try {
    const [result] = await promisePool.query(
      "DELETE FROM scholarshipregistrations WHERE student_id = ?",
      [student_id]
    );

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ error: "ไม่พบ scholarshipregistrations" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "ลบ scholarshipregistrations สำเร็จแล้ว" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting scholarshipregistrations:", error);
    return new Response(
      JSON.stringify({ error: "เกิดข้อผิดพลาดขณะลบ scholarshipregistrations" }),
      { status: 500 }
    );
  }
}
