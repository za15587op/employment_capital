import { NextResponse } from "next/server";
import promisePool from "../../../../../../lib/db";

export async function GET(req, { params }) {
  try {
    const scholarship_requirement_id = params.id;

    if (!scholarship_requirement_id) {
      return NextResponse.json({ message: "Scholarship Requirement ID is required" }, { status: 400 });
    }

    const [rows] = await promisePool.query(
      "SELECT scholarship_requirement_id, scholarship_organ_id, skill_type_id, required_level FROM scholarshiprequirement WHERE scholarship_requirement_id = ?",
      [scholarship_requirement_id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "Scholarship requirement not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching scholarship requirement data:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const scholarship_requirement_id = params.id;

  try {
    const { scholarship_organ_id, skill_type_id, required_level } = await req.json();

    if (!scholarship_organ_id || !skill_type_id || !required_level) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const [result] = await promisePool.query(
      "UPDATE scholarshiprequirement SET scholarship_organ_id = ?, skill_type_id = ?, required_level = ? WHERE scholarship_requirement_id = ?",
      [scholarship_organ_id, skill_type_id, required_level, scholarship_requirement_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Scholarship requirement not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Scholarship requirement updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating scholarship requirement data:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const scholarship_requirement_id = params.id;

  try {
    const [result] = await promisePool.query(
      "DELETE FROM scholarshiprequirement WHERE scholarship_requirement_id = ?",
      [scholarship_requirement_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Scholarship requirement not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Scholarship requirement deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting scholarship requirement:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
