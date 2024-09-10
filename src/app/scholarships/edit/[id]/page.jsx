"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navber from '@/app/components/Navber';

function EditScholarshipsPage({ params }) {
  const { id: scholarship_id } = params;
  const [postData, setPostData] = useState({});
  const router = useRouter();

  // Initialize state with empty strings
  const [newapplication_start_date, setNewApplicationStartDate] = useState("");
  const [newapplication_end_date, setNewApplicationEndDate] = useState("");
  const [newacademic_year, setNewAcademicYear] = useState("");
  const [newacademic_term, setNewAcademicTerm] = useState("");

  // Utility function to format the date to "yyyy-MM-dd"
  const formatDateToYYYYMMDD = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // "yyyy-MM-dd"
  };

  const getDataById = async (scholarship_id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/scholarships/${scholarship_id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
     
      setPostData(data);

      // Set state with formatted dates
      setNewApplicationStartDate(formatDateToYYYYMMDD(data.application_start_date) || "");
      setNewApplicationEndDate(formatDateToYYYYMMDD(data.application_end_date) || "");
      setNewAcademicYear(data.academic_year || "");
      setNewAcademicTerm(data.academic_term || "");

      console.log(data, "data");
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (scholarship_id) {
      getDataById(scholarship_id);
    }
  }, [scholarship_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch(`http://localhost:3000/api/scholarships/${scholarship_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          application_start_date: newapplication_start_date,
          application_end_date: newapplication_end_date,
          academic_year: newacademic_year,
          academic_term: newacademic_term,
        }),
      });
  
      if (!res.ok) {
        throw new Error("Fail to update");
      }
  
      console.log(res, 'res');
  
      router.refresh();
      router.push("/welcome");
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <div>
    <div className=" min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-3 sm:skew-y-0 sm:-rotate-3 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h3 className="text-2xl font-bold mb-4 text-center">Edit Scholarships Page</h3>
          {scholarship_id && <div className="text-center mb-4">Editing Scholarship ID: {scholarship_id}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              onChange={(e) => setNewAcademicYear(e.target.value)}
              type="number"
              placeholder={"ปีการศึกษา"}
              value={newacademic_year}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              onChange={(e) => setNewAcademicTerm(e.target.value)}
              type="number"
              placeholder={"เทอมการศึกษา"}
              value={newacademic_term}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              onChange={(e) => setNewApplicationStartDate(e.target.value)}
              type="date"
              placeholder={"Start Date"}
              value={newapplication_start_date}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              onChange={(e) => setNewApplicationEndDate(e.target.value)}
              type="date"
              placeholder={"End Date"}
              value={newapplication_end_date}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button type="submit" className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}

export default EditScholarshipsPage;
