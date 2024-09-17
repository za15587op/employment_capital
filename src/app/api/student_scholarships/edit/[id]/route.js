import { NextResponse } from "next/server";
import ScholarshipRegistrations from "../../../../../../models/scholarshipregistrations";
import path from "path";
import fs from "fs";

export async function GET(req, { params }) {
  try {
    const regist_id = params.id;

    if (!regist_id) {
      return NextResponse.json({ message: 'regist_id is required' }, { status: 400 });
    }

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

const UPLOAD_DIR = path.resolve(process.cwd(), "public/uploads");

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handleFileUpload(formData) {
  const academic_year = JSON.parse(formData.get("academic_year"));
  const academic_term = JSON.parse(formData.get("academic_term"));

  if (!academic_year || !academic_term) {
    throw new Error("ข้อมูล scholarships ไม่สมบูรณ์");
  }

  const file = formData.get("file");
  const student_id = formData.get("student_id");
  const scholarship_id = formData.get("scholarship_id");

  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const extension = path.extname(file.name);
    const newFileName = `${student_id}_${scholarship_id}_${academic_year}_${academic_term}${extension}`;
    const filePath = path.join(UPLOAD_DIR, newFileName);

    fs.writeFileSync(filePath, buffer);

    return `uploads/${newFileName}`;
  }

  return null;
}

export async function PUT(req, { params }) {
  const { id } = params;

  try {
    const formData = await req.formData();

    const related_works = formData.get("related_works");
    const is_parttime = formData.get("is_parttime");
    const filePath = await handleFileUpload(formData);
    const fileOrWorksPath = filePath || related_works;

    const updatedScholarship = await ScholarshipRegistrations.findOneAndUpdate(
      { regist_id: id },
      {
        related_works: fileOrWorksPath,
        is_parttime
      },
      { new: true }
    );

    if (!updatedScholarship) {
      return NextResponse.json({ success: false, message: "Scholarship registration not found" }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: "การอัปเดตข้อมูลทุนการศึกษาสำเร็จ.",
    });
  } catch (error) {
    console.error("Error updating scholarship registration:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดขณะอัปเดตข้อมูล.", error: error.message },
      { status: 500 }
    );
  }
};
