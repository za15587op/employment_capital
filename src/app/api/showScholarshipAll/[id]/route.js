import { NextResponse } from "next/server";
import Scholarship from "../../../../../models/scholarships";
import ScholarshipRegistrations from "../../../../../models/scholarshipregistrations";

export async function GET(req, { params }) {
    const scholarship_id = params.id;

    console.log(scholarship_id,"scholarship_id");
    
    try {
      const data = await ScholarshipRegistrations.findByIdShowScholarReGist(scholarship_id); // Use the getAll method from the Scholarship model
      
      console.log(data);
      
      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      console.error("Error fetching data:", error);
      return NextResponse.json(
        { message: "An error occurred while fetching data." },
        { status: 500 }
      );
    }
  }