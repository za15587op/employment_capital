"use client"; 
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navber from "@/app/components/Navber";
import Foter from "@/app/components/Foter";
import { useSession } from "next-auth/react";

function EditorganizationPage({ params }) {
  const { id: organization_id } = params || {}; // ใช้แค่ organization_id เท่านั้น
  const { id: scholarship_id } = params; // ใช้ scholarship_id สำหรับการดึงข้อมูลทุนการศึกษา
  const [organization_name, setOrganizationName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newacademic_year, setNewAcademicYear] = useState("");
  const [newacademic_term, setNewAcademicTerm] = useState("");
  const [existingOrganizations, setExistingOrganizations] = useState([]); // state สำหรับข้อมูล organization ที่มีอยู่แล้ว
  const router = useRouter();
  const { data: session, status } = useSession();

  // ตรวจสอบ Session เพื่อบังคับให้ผู้ใช้เข้าสู่ระบบก่อนเข้าหน้านี้
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [status, session, router]);

  // ฟังก์ชันสำหรับดึงข้อมูลทุนการศึกษาตาม scholarship_id
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
              
                console.log(data); // log ข้อมูลเพื่อตรวจสอบว่าได้ข้อมูลอะไรมา
              
                // ตรวจสอบว่า data เป็น object ที่ถูกต้อง
                if (data && data.academic_year && data.academic_term) {
                  setNewAcademicYear(data.academic_year); // อัปเดตปีการศึกษา
                  setNewAcademicTerm(data.academic_term); // อัปเดตเทอมการศึกษา
                } else {
                  console.log("ไม่มีข้อมูลที่เหมาะสม");
                }
              } catch (error) {
                console.log(error); // แสดง error หาก fetch ข้อมูลไม่สำเร็จ
              }
            };
          
            useEffect(() => {
              if (scholarship_id) {
                getDataById(scholarship_id); // ดึงข้อมูลทุนการศึกษา
              }
            }, [scholarship_id]);
            
            
            const fetchOrganizationList = async () => {
              try {
                const res = await fetch("/api/organization", {
                  method: "GET",
                });
                if (!res.ok) {
                  throw new Error("Failed to fetch organization list");
                }
                const data = await res.json();
                setExistingOrganizations(data); // เก็บข้อมูลใน state สำหรับ organizations ที่มีอยู่แล้ว
              } catch (error) {
                console.error("Error fetching organization list:", error);
              }
            };
          
            useEffect(() => {
              fetchOrganizationList(); // ดึงข้อมูลหน่วยงานที่มีอยู่แล้วเมื่อ component ถูก mount
            }, []);
          
            // ฟังก์ชันสำหรับการเลือกข้อมูลจากรายการที่มีอยู่แล้ว
            const handleSelectOrganization = (organization) => {
              setOrganizationName(organization.organization_name);
              setContactPhone(organization.contactPhone); };

              const handleSubmit = async (e) => {
                e.preventDefault();
                
              if (!organization_name || !contactPhone) {
                setError("กรุณากรอกข้อมูลให้ครบถ้วน!");
                return;
              }

              try {
                // บันทึกข้อมูล Organization
                const organizationRes = await fetch("http://localhost:3000/api/organization", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    organization_name,
                    contactPhone,
                    scholarship_id,
                  }),
                });

                const data = await organizationRes.json();

                // ตรวจสอบว่า request สำเร็จหรือไม่
                if (!organizationRes.ok) {
                  throw new Error(data.message || "Failed to create organization");
                }

                // หากสำเร็จให้แสดงข้อความและเปลี่ยนหน้า
                setError("");
                setSuccess("บันทึกข้อมูลสำเร็จ");
                e.target.reset();
                router.push(`/organization/show/${organization_id}`);
                
              } catch (error) {
                console.error("Error:", error);
                setError("ข้อมูลหน่วยงานซ้ำกันทำให้ไม่สามารถเพิ่มหน่วยงานได้ กรุณาแก้ไขข้อมูลที่กรอกมา");
              }
            };

  return (
<div>
      <Navber session={session} />
      <div className="แถบสี"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-8">
        <h3 className=" text-2xl font-bold mb-6 text-center bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600">
          ปีการศึกษา <span >{newacademic_year } เทอมการศึกษาที่ <span >{newacademic_term }</span></span>
        </h3>
      </div>
      <div className="max-w-lg mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Edit Organization
          </h3>
          
          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4 text-center">{success}</div>}
          <div>
            <h3 className="text-gray-700">ชื่อหน่วยงานที่ต้องการ</h3>
            <input
              onChange={(e) => setOrganizationName(e.target.value)}
              type="text"
              placeholder="ชื่อหน่วยงานที่ต้องการ"
              value={organization_name}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <h3 className="text-gray-700">เบอร์โทรศัพท์ติดต่อหน่วยงาน</h3>
            <input
              onChange={(e) => setContactPhone(e.target.value)}
              type="text"
              placeholder="เบอร์โทรศัพท์ติดต่อหน่วยงาน"
              value={contactPhone}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
        <h3 className="text-lg mt-6 mb-4">หน่วยงานที่มีอยู่แล้ว</h3>
        <ul className="list-disc pl-5">
          {existingOrganizations.map((org) => (
            <li key={org.organization_id}>
              {org.organization_name} - {org.contactPhone}{" "}
              <button
                onClick={() => handleSelectOrganization(org)}
                className="ml-2 text-blue-500 underline"
              >
                เพิ่ม
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Foter />
    </div>
  );
}

export default EditorganizationPage;
