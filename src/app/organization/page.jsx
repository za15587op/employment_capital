"use client";
import React, { useEffect, useState } from "react";
import Navber from "@/app/components/Navber";
import Foter from "../components/Foter";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from 'next/link';

function Showorganization() {
    const [organization, setOrganization] = useState([]);
    const [error, setError] = useState("");
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // รอจนกว่าจะโหลด session เสร็จ
      
        if (!session) {
            router.push("/login");
            return;
        }
      
        const fetchOrganization = async () => {
            try {
                // ดึงข้อมูล organization
                const resOrganization = await fetch("/api/organization", {
                    method: "GET",
                });
                const orgData = await resOrganization.json();

                // ดึงข้อมูล scholarshiporganization
                const resScholarship = await fetch("/api/scholarshiporganization", {
                    method: "GET",
                });
                const scholarshipData = await resScholarship.json();

                if (resOrganization.ok && resScholarship.ok) {
                    // รวมข้อมูลจากทั้งสอง API เข้าด้วยกัน โดย match ตาม organization_id
                    const mergedData = orgData.map((org) => {
                        const scholarship = scholarshipData.find(
                            (scholarship) =>
                                scholarship.organization_id === org.organization_id
                        );

                        return {
                            organization_id: org.organization_id,
                            organization_name: org.organization_name,
                            contactPhone: org.contactPhone,
                            contactEmail: org.contactEmail,
                            amount: scholarship?.amount || "N/A", // แสดง "N/A" ถ้าไม่มีข้อมูล
                            required_parttime: scholarship?.required_parttime || "N/A", // แสดง "N/A" ถ้าไม่มีข้อมูล
                        };
                    });
                    setOrganization(mergedData);
                } else {
                    setError("Failed to fetch organization data");
                }
            } catch (error) {
                console.error("Error fetching organization data:", error);
                setError("An error occurred while fetching organization data");
            }
        };
      
        fetchOrganization();
    }, [status, session, router]);
      
    // ฟังก์ชันลบข้อมูล organization
    const handleDelete = async (organization_id) => {
        const confirmed = confirm("ต้องการลบหน่วยงานนี้ใช่หรือไม่?");
        if (confirmed) {
            try {
                // ลบข้อมูลจาก organization
                const resOrganization = await fetch(
                    `/api/organization?organization_id=${organization_id}`,
                    {
                        method: "DELETE",
                    }
                );

                // ลบข้อมูลจาก scholarshiporganization
                const resScholarship = await fetch(
                    `/api/scholarshiporganization?organization_id=${organization_id}`, // ใช้ organization_id
                    {
                        method: "DELETE",
                    }
                );

                if (resOrganization.ok && resScholarship.ok) {
                    setOrganization((prev) =>
                        prev.filter((org) => org.organization_id !== organization_id)
                    );
                } else {
                    setError("Failed to delete organization");
                }
            } catch (error) {
                setError("An error occurred while deleting organization data");
            }
        }
    };
    const handleUpdate = (organization_id) => {
        router.push(`/organization/edit/${organization_id}`);
      };
    return (
        <>
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#DCF2F1] via-[#7FC7D9] via-[#365486] to-[#0F1035]">
                <Navber session={session} />
                <div className="แถบสี"></div>
                <br /><br />
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <h3 className="text-2xl font-bold mb-6 text-center bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600">
                        Organization List
                    </h3>
                    <div className="flex justify-between items-center p-4">
                        <div className="flex-grow"></div>
                        <Link
                            href="/organization/create"
                            className="inline-block bg-blue-500 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                            เพิ่มหน่วยงาน
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
                                            <th className="text-left py-2 px-4 whitespace-nowrap">
                                                ชื่อหน่วยงาน
                                            </th>
                                            <th className="text-left py-2 px-4 whitespace-nowrap">
                                                โทรศัพท์
                                            </th>
                                            <th className="text-left py-2 px-4 whitespace-nowrap">
                                                อีเมล
                                            </th>
                                            <th className="text-left py-2 px-4 whitespace-nowrap">
                                                จำนวนนิสิตที่รับ
                                            </th>
                                            <th className="text-left py-2 px-4 whitespace-nowrap">
                                                ทำงานนอกเวลาได้หรือไม่
                                            </th>
                                            <th className="text-left py-2 px-4 whitespace-nowrap text-right">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {organization.length > 0 ? (
                                            organization.map(org => (
                                                <tr
                                                    key={org.organization_id}
                                                    className="border-b border-gray-400 hover:bg-gray-50"
                                                >
                                                    <td className="py-2 px-4 whitespace-nowrap">
                                                        {org.organization_name}
                                                    </td>
                                                    <td className="py-2 px-4 whitespace-nowrap">
                                                        {org.contactPhone}
                                                    </td>
                                                    <td className="py-2 px-4 whitespace-nowrap">
                                                        {org.contactEmail}
                                                    </td>
                                                    <td className="py-2 px-4 whitespace-nowrap">
                                                        {org.amount} {/* แสดงจำนวน */}
                                                    </td>
                                                    <td className="py-2 px-4 whitespace-nowrap">
                                                        {org.required_parttime} {/* แสดง Required Part-time */}
                                                    </td>
                                                    <td className="py-2 px-4 text-right">
                                                        <button
                                                            onClick={() => handleUpdate(org.organization_id)}
                                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(org.organization_id)}
                                                            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 ml-2"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4">No data available</td>
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

export default Showorganization;
