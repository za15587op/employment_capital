"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navber from "@/app/components/Navber";
import Foter from "@/app/components/Foter";
import { useSession } from "next-auth/react";

function OrganizationPage({ params }) {
  const { id: organization_id } = params || {};
  const { id: scholarship_organ_id } = params || {}; // ดึง scholarship_organ_id จาก params

  const [postData, setPostData] = useState({});
  const [organization_name, setOrganizationName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [amount, setAmount] = useState(""); // state สำหรับ amount
  const [required_parttime, setRequiredParttime] = useState(""); // state สำหรับ required_parttime
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const router = useRouter();
  const { data: session, status } = useSession();

  // ตรวจสอบ Session เพื่อบังคับให้ผู้ใช้เข้าสู่ระบบก่อนเข้าหน้านี้
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [status, session, router]);

  // ดึงข้อมูล Organization เมื่อ organization_id เปลี่ยนแปลง
  useEffect(() => {
    if (organization_id) {
      getDataById(organization_id);
    }
  }, [organization_id]);

  // ดึงข้อมูล Scholarship Organization เมื่อ scholarship_organ_id เปลี่ยนแปลง
  useEffect(() => {
    if (scholarship_organ_id) {
      getDataByScholarshipId(scholarship_organ_id);
    }
  }, [scholarship_organ_id]);

  // ฟังก์ชันดึงข้อมูล Organization
  const getDataById = async (organization_id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/organization${organization_id ? `/${organization_id}` : ""}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch organization data");
      }

      const data = await res.json();
      setPostData(data);
      setOrganizationName(data.organization_name || "");
      setContactPhone(data.contactPhone || "");
      setContactEmail(data.contactEmail || "");
    } catch (error) {
      console.log(error);
    }
  };

  // ฟังก์ชันดึงข้อมูล Scholarship Organization
  const getDataByScholarshipId = async (scholarship_organ_id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/scholarshiporganization${scholarship_organ_id ? `/${scholarship_organ_id}` : ""}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch scholarship organization data");
      }

      const data = await res.json();
      setAmount(data.amount || "");
      setRequiredParttime(data.required_parttime || "");
    } catch (error) {
      console.log(error);
    }
  };

  // ฟังก์ชันบันทึกข้อมูล
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!organization_name || !contactPhone || !contactEmail || !amount || !required_parttime) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน!");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/organization${organization_id ? `/${organization_id}` : ""}`,
        {
          method: organization_id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            organization_name,
            contactPhone,
            contactEmail,
          }),
        }
      );

      if (res.ok) {
        // บันทึกข้อมูลลงในตาราง scholarshiporganization
        await fetch(`http://localhost:3000/api/scholarshiporganization${scholarship_organ_id ? `/${scholarship_organ_id}` : ""}`,
          {
            method: scholarship_organ_id ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              scholarship_organ_id, // ใช้ scholarship_organ_id จากการสร้างหรือแก้ไข
              amount,
              required_parttime,
            }),
          }
        );

        setError("");
        setSuccess("บันทึกข้อมูลสำเร็จ");
        e.target.reset();
        router.refresh();
        router.push("/organization");
      } else {
        setError("บันทึกข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      console.log("error", error);
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
            {organization_id ? "Edit Organization" : "Register Organization"}
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
            <h3 className="text-gray-700">อีเมลหน่วยงาน</h3>
            <input
              onChange={(e) => setContactEmail(e.target.value)}
              type="email"
              placeholder="อีเมลหน่วยงาน"
              value={contactEmail}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <h3 className="text-gray-700">จำนวนนิสิตที่รับ</h3>
            <input
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              placeholder="จำนวนนิสิตที่รับ"
              value={amount}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <h3 className="text-gray-700">ทำงานนอกเวลาได้หรือไม่</h3>
            <select
              onChange={(e) => setRequiredParttime(e.target.value)}
              value={required_parttime}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="ได้">ได้</option>
              <option value="ไม่ได้">ไม่ได้</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
              {organization_id ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
      <Foter />
    </div>
  );
}

export default OrganizationPage;
