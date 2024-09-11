import { NextResponse } from "next/server";
import promisePool from "../../../../../lib/db";

// GET request to fetch scholarship organization details
export async function GET(req, { params }) {
  try {
    const scholarship_organ_id = params.id; // Ensure this matches the URL parameter

    console.log(params);
    if (!scholarship_organ_id) {
      return NextResponse.json(
        { message: "Scholarship Organization ID is required" },
        { status: 400 }
      );
    }

    // Query to fetch the specified columns only
    const [rows] = await promisePool.query(
      "SELECT scholarship_organ_id, scholarship_id, organization_id, amount, required_parttime FROM scholarshiporganization WHERE scholarship_organ_id = ?",
      [scholarship_organ_id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Scholarship organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching scholarship organization data:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

// PUT request to update scholarship organization details
export async function PUT(req, { params }) {
  const scholarship_organ_id = params.id;
  console.log(scholarship_organ_id);

  try {
    // Extract only the relevant fields from the request body
    const {
      scholarship_id,
      organization_id,
      amount,
      required_parttime,
    } = await req.json();

    const connection = await promisePool;

    // Update only the specified fields
    const [result] = await connection.query(
      "UPDATE scholarshiporganization SET scholarship_id = ?, organization_id = ?, amount = ?, required_parttime = ? WHERE scholarship_organ_id = ?",
      [scholarship_id, organization_id, amount, required_parttime, scholarship_organ_id]
    );

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ message: "Scholarship organization not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Scholarship organization updated" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating scholarship organization data:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
}