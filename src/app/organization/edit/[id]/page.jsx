"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navber from "@/app/components/Navber";
import Foter from "@/app/components/Foter";
import { useSession } from "next-auth/react";

function EditorganizationPage({ params }) {
  const { id: organization_id } = params;
  const [postData, setPostData] = useState({});
  const router = useRouter();
  const { data: session, status } = useSession();

  const [newOrganizationName, setNewOrganizationName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [amount, setAmount] = useState(""); // เพิ่ม state สำหรับ amount
  const [requiredParttime, setRequiredParttime] = useState("ได้"); // เพิ่ม state สำหรับ required_parttime

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [status, session, router]);

  const getDataById = async (organization_id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/organization/${organization_id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
      setPostData(data);

      setNewOrganizationName(data.organization_name || "");
      setNewContactPhone(data.contactPhone || "");
      setNewContactEmail(data.contactEmail || "");
      setAmount(data.amount || ""); // ตั้งค่าเริ่มต้น amount
      setRequiredParttime(data.required_parttime || "ได้"); // ตั้งค่าเริ่มต้น required_parttime
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (organization_id) {
      getDataById(organization_id);
    }
  }, [organization_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/api/organization/${organization_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organization_name: newOrganizationName,
          contactPhone: newContactPhone,
          contactEmail: newContactEmail,
          amount, // ส่งค่า amount
          required_parttime: requiredParttime, // ส่งค่า required_parttime
        }),
      });

      if (!res.ok) {
        throw new Error("Fail to update");
      }

      router.refresh();
      router.push("/organization");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navber session={session} />
      <div className="แถบสี"></div>
      <br /><br />
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-blue-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-blue-600 transform scale-110"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h3 className="text-2xl font-bold mb-4 text-center">Edit Organization</h3>
          {organization_id && <div className="text-center mb-4">Editing Organization ID: {organization_id}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-gray-700">ชื่อหน่วยงานที่ต้องการ</h3>
              <input
                onChange={(e) => setNewOrganizationName(e.target.value)}
                type="text"
                placeholder="ชื่อหน่วยงานที่ต้องการ"
                value={newOrganizationName}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <h3 className="text-gray-700">เบอร์โทรศัพท์ติดต่อหน่วยงาน</h3>
              <input
                onChange={(e) => setNewContactPhone(e.target.value)}
                type="text"
                placeholder="เบอร์โทรศัพท์ติดต่อหน่วยงาน"
                value={newContactPhone}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <h3 className="text-gray-700">อีเมลติดต่อ</h3>
              <input
                onChange={(e) => setNewContactEmail(e.target.value)}
                type="email"
                placeholder="อีเมลติดต่อ"
                value={newContactEmail}
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
                value={requiredParttime}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="ได้">ได้</option>
                <option value="ไม่ได้">ไม่ได้</option>
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <br /><br /><Foter />
    </>
  );
}

export default EditorganizationPage;
