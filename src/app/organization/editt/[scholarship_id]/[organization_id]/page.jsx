"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navber from "@/app/components/Navber";
import Foter from "@/app/components/Foter";
import { useSession } from "next-auth/react";

function EditorganizationPage({ params }) {
  const { organization_id } = params || {};  
  const { scholarship_id } = params; 
  const [organization_name, setOrganizationName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();
  const { data: session, status } = useSession();


  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [status, session, router]);

  // ฟังก์ชันดึงข้อมูล organization
  const getDataById = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/organization/${organization_id}`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch organization data");
      }

      const data = await res.json();
      setOrganizationName(data.organization_name);
      setContactPhone(data.contactPhone);
    } catch (error) {
      console.error("Error fetching organization data:", error);
      setError("เกิดข้อผิดพลาดระหว่างการดึงข้อมูล");
    }
  };

  // ดึงข้อมูลเมื่อ organization_id เปลี่ยนแปลง
  useEffect(() => {
    if (organization_id) {
      getDataById();
    }
  }, [organization_id]);

  // ฟังก์ชันอัปเดตข้อมูล organization
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!organization_name || !contactPhone) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน!");
      return;
    }

    try {
      const organizationRes = await fetch(`/api/organization/${organization_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organization_name,
          contactPhone,
        }),
      });

      if (!organizationRes.ok) {
        throw new Error("Failed to update organization data");
      }

      setError("");
      setSuccess("อัปเดตข้อมูลสำเร็จ");
      
      // กลับไปที่หน้าของทุนการศึกษาหลังจากอัปเดตเสร็จ
      setTimeout(() => {
        router.push(`/organization/show/${scholarship_id}`);
      }, 1000);
    } catch (error) {
      setError("เกิดข้อผิดพลาดระหว่างการส่งข้อมูล");
    }
  };
  return (
    <div>
      <Navber session={session} />
      <div className="แถบสี"></div>
      <div className="max-w-lg mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Edit Organization
          </h3>
          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
          {success && <div className="text-green-500 text-sm mb-4 text-center">{success}</div>}

          <div>
            <h3 className="text-gray-700">ชื่อหน่วยงาน</h3>
            <input
              onChange={(e) => setOrganizationName(e.target.value)}
              type="text"
              placeholder="ชื่อหน่วยงาน"
              value={organization_name}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <h3 className="text-gray-700">เบอร์โทรศัพท์ติดต่อ</h3>
            <input
              onChange={(e) => setContactPhone(e.target.value)}
              type="text"
              placeholder="เบอร์โทรศัพท์ติดต่อ"
              value={contactPhone}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
              Update
            </button>
          </div>
        </form>
      </div>
      <Foter />
    </div>
  );
}

export default EditorganizationPage;
