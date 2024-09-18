"use client";
import React, { useEffect, useState } from "react";
import Navber from "@/app/components/Navber";
import Foter from "../components/Foter";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from 'next/link';

function ShowScholarshipOrganization() {
    const [scholarshipOrganization, setScholarshipOrganization] = useState([]);
    const [error, setError] = useState("");
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // รอจนกว่าจะโหลด session เสร็จ

        if (!session) {
            router.push("/login");
            return;
        }

        const fetchScholarshipOrganization = async () => {
            try {
                // ดึงข้อมูล scholarshiporganization
                const resScholarshipOrganization = await fetch("/api/scholarshiporganization", {
                    method: "GET",
                });

                if (!resScholarshipOrganization.ok) {
                    throw new Error("Failed to fetch scholarship organization data");
                }

                const scholarshipData = await resScholarshipOrganization.json();
                setScholarshipOrganization(scholarshipData);
            } catch (error) {
                console.error("Error fetching scholarship organization data:", error);
                setError("An error occurred while fetching scholarship organization data");
            }
        };

        fetchScholarshipOrganization();
    }, [status, session, router]);

    // ฟังก์ชันลบข้อมูล scholarship organization
    const handleDelete = async (scholarship_organ_id) => {
        const confirmed = confirm("ต้องการลบข้อมูลทุนนี้ใช่หรือไม่?");
        if (confirmed) {
            try {
                const resScholarshipOrganization = await fetch(
                    `/api/scholarshiporganization?scholarship_organ_id=${scholarship_organ_id}`,
                    {
                        method: "DELETE",
                    }
                );

                // ตรวจสอบว่า API การลบข้อมูลทำงานสำเร็จหรือไม่
                if (resScholarshipOrganization.ok) {
                    setScholarshipOrganization((prev) =>
                        prev.filter((scholarship) => scholarship.scholarship_organ_id !== scholarship_organ_id)
                    );
                } else {
                    setError("Failed to delete scholarship organization data");
                }
            } catch (error) {
                setError("An error occurred while deleting scholarship organization data");
            }
        }
    };

    const handleUpdate = (scholarship_organ_id) => {
        router.push(`/scholarshiporganization/edit/${scholarship_organ_id}`);
    };

    return (
        <>
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#DCF2F1] via-[#7FC7D9] via-[#365486] to-[#0F1035]">
                <Navber session={session} />
                <div className="แถบสี"></div>
                <br /><br />
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <h3 className="text-2xl font-bold mb-6 text-center bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600">
                        Scholarship Organization List
                    </h3>
                    <div className="flex justify-between items-center p-4">
                        <div className="flex-grow"></div>
                        <Link
                            href="/scholarshiporganization/create"
                            className="inline-block bg-blue-500 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                            เพิ่มข้อมูลทุน
                        </Link>
                    </div>
                    <br></br>
                    <div className="flex flex-col md:flex-row bg-blue-600 p-2 rounded">
                        <div className="w-full bg-blue-800 p-2 rounded">
                            {error && (
                                <div className="text-red-500 text-center mb-4">{error}</div>
                            )}
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-400 rounded-lg">
                                <thead>
                                    <tr className="bg-gray-100 border-b border-gray-400">
                                        <th className="text-left py-2 px-4 whitespace-nowrap">ชื่อทุน</th>
                                        <th className="text-left py-2 px-4 whitespace-nowrap">จำนวนนิสิตที่รับ</th>
                                        <th className="text-left py-2 px-4 whitespace-nowrap">ประเภทการทำงาน</th>
                                        <th className="text-left py-2 px-4 whitespace-nowrap">เวลาทำงาน</th>
                                        <th className="text-left py-2 px-4 whitespace-nowrap text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scholarshipOrganization.length > 0 ? (
                                        scholarshipOrganization.map(scholarship => (
                                            <tr key={scholarship.scholarship_organ_id} className="border-b border-gray-400 hover:bg-gray-50">
                                                <td className="py-2 px-4 whitespace-nowrap">{scholarship.organization_name}</td> 
                                                <td className="py-2 px-4 whitespace-nowrap">{scholarship.amount}</td>
                                                <td className="py-2 px-4 whitespace-nowrap">{scholarship.workType}</td>
                                                <td className="py-2 px-4 whitespace-nowrap">{scholarship.workTime}</td>
                                                <td className="py-2 px-4 text-right">
                                                    <button
                                                        onClick={() => handleUpdate(scholarship.scholarship_organ_id)}
                                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 ml-2"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(scholarship.scholarship_organ_id)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 ml-2"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4">No data available</td>
                                        </tr>
                                    )}
                                </tbody>

                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <br /><br />
                <Foter />
            </div>
        </>
    );
}

export default ShowScholarshipOrganization;
