import { NextResponse } from "next/server";
import promisePool from "@/lib/db";  // If you're using absolute imports configured in Next.js

export async function GET(req, { params }) {
  try {
    const skill_id = params.id;

    if (!skill_id) {
      return NextResponse.json({ message: "Skill ID is required" }, { status: 400 });
    }

    const [rows] = await promisePool.query(
      "SELECT skill_id, skill_name FROM skills WHERE skill_id = ?",
      [skill_id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching skill data:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const skill_id = params.id;

  try {
    const { skill_name } = await req.json();

    if (!skill_name) {
      return NextResponse.json({ message: "Skill name is required" }, { status: 400 });
    }

    const [result] = await promisePool.query(
      "UPDATE skills SET skill_name = ? WHERE skill_id = ?",
      [skill_name, skill_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Skill updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating skill data:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const skill_id = params.id;

  try {
    const [result] = await promisePool.query(
      "DELETE FROM skills WHERE skill_id = ?",
      [skill_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Skill deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
