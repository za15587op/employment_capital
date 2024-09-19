import { NextResponse } from "next/server";
import Scholarship from "../../../../models/scholarships";
// GET: Fetch all scholarshipsโชว์นิสิต
export async function GET(req) {
    try {
      const scholarships = await Scholarship.getAll(); // Use the getAll method from the Scholarship model
  
      return NextResponse.json(scholarships, { status: 200 });
    } catch (error) {
      console.error("Error fetching scholarships:", error);
      return NextResponse.json(
        { message: "An error occurred while fetching scholarships." },
        { status: 500 }
      );
    }
  }