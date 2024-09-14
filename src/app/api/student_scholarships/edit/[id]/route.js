import { NextResponse } from "next/server";
import ScholarshipRegistrations from "../../../../../../models/scholarshipregistrations";

export async function GET(req, { params }) {
  try {
    const regist_id = params.id; // ดึง regist_id จากพารามิเตอร์ URL

    if (!regist_id) {
      return NextResponse.json({ message: 'regist_id is required' }, { status: 400 });
    }

    // ใช้โมเดล Student ในการดึงข้อมูลนักศึกษา
    const registration = await ScholarshipRegistrations.findById(regist_id);

    if (!registration) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(registration, { status: 200 });
  } catch (error) {
    console.error('Error fetching student data:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}