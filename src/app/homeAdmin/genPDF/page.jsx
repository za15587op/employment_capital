// "use client";
// import { jsPDF } from "jspdf";
// import "jspdf-autotable";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import "@/fonts/THSarabunNew-normal.js"; // นำฟอนต์เข้ามาเพื่อใช้ภาษาไทย
// import Navbar from "@/app/components/Navbar";
// import Foter from "@/app/components/Foter";
// import { useSession } from "next-auth/react";

// function ShowScholarshipGenPDF() {
//   const [getData, setGetData] = useState([]);
//   const { data: session, status } = useSession();
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true); // เพิ่มสถานะการโหลด
//   const [showSuccess, setShowSuccess] = useState(false); // เพิ่ม state สำหรับแสดง success message
//   const [success, setSuccess] = useState("PDF ถูกสร้างเรียบร้อยแล้ว!");
//   const router = useRouter();
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//   useEffect(() => {
//       if (status === "loading") return; // รอจนกว่าจะโหลด session เสร็จ
//       if (!session) {
//           router.push("/login");
//       }
//   }, [session, status, router]); 
//   // ฟังก์ชันดึงข้อมูลนักศึกษาจาก API
//   const fetchGetData = async () => {
//     try {
//       const res = await fetch(`${apiUrl}/api/genPDF/`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (res.ok) {
//         const data = await res.json();
//         console.log(data);
        
//         setGetData(data);
//         setLoading(false); // ปิดการโหลดข้อมูลเมื่อเสร็จสิ้น
//       } else {
//         setError("Failed to fetch data");
//         setLoading(false); // ปิดการโหลดเมื่อเกิดข้อผิดพลาด
//       }
//     } catch (error) {
//       setError("An error occurred while fetching data");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchGetData();
//   }, []);

//   // ฟังก์ชันสำหรับสร้าง PDF
//   const generatePDF = () => {
//     if (getData.length === 0) {
//       alert("ไม่มีข้อมูลในการสร้าง PDF");
//       return;
//     }

//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.getWidth(); // กำหนดความกว้างของหน้า PDF

//     // ตั้งค่าฟอนต์เป็น THSarabunNew
//     doc.setFont("THSarabunNew", "normal");

//     // ใส่หัวข้อในเอกสาร PDF (จัดให้อยู่กึ่งกลางโดยคำนวณจากความกว้างของหน้า PDF)
//     doc.setFontSize(18);
//     doc.text("รายชื่อนักศึกษาที่ผ่านทุนจ้างงาน", pageWidth / 2, 22, { align: "center" });
//     doc.text("ทุนจ้างงานปีการศึกษาที่", pageWidth / 2, 30, { align: "center" });
//     doc.text("เทอมศึกษาที่", pageWidth / 2, 36, { align: "center" });

//     // เตรียมข้อมูลนักศึกษาที่จะแสดงในตาราง
//     const studentsData = getData.map((student, index) => [
//       index + 1,
//       student.student_id,
//       `${student.student_firstname} ${student.student_lastname}`,
//       student.student_faculty,
//       student.student_curriculum,
//       student.student_gpa
//     ]);

//     // สร้างตารางข้อมูลนักศึกษา
//     doc.autoTable({
//       head: [["ลำดับที่", "รหัสนิสิต", "ชื่อ-นามสกุล", "คณะ", "สาขา", "GPA", ]],
//       body: studentsData,
//       startY: 44, // กำหนดตำแหน่งของตาราง (หลังจากหัวข้อทั้งหมด)
//       styles: { font: "THSarabunNew", fontSize: 14 }, // เพิ่มการตั้งค่าฟอนต์และขนาดในตาราง
//       didDrawPage: (data) => {
//         doc.setFontSize(10);
//         doc.text(`${doc.internal.getNumberOfPages()}`, pageWidth - 20, 285); // แสดงหน้าที่มุมขวาล่าง
//       },
//     });

//     // บันทึกไฟล์ PDF
//     doc.save("students_list.pdf");

//     // แสดงข้อความ success หลังจากสร้าง PDF
//     setShowSuccess(true);
//     setTimeout(() => setShowSuccess(false), 3000); // แสดงข้อความ success เป็นเวลา 3 วินาที
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#DCF2F1] via-[#7FC7D9] via-[#365486] to-[#0F1035]">
//       <Navbar session={session} />
//       <div className="container mx-auto px-4 py-6">
//         <div className="bg-white shadow-lg rounded-lg px-6 py-6 w-full mb-6">
//           <div className="bg-blue-500 text-white px-5 py-3 rounded-lg w-full text-center shadow-lg">
//             <h3 className="text-2xl font-bold">พิมพ์รายชื่อนิสิตจ้างงาน ที่ผ่านการคัดเลือก</h3>
//           </div>
  
//           <div className="mt-6">
//             {error && <div className="text-red-500 mb-4">{error}</div>}
//             {loading ? (
//               <p>กำลังโหลดข้อมูล...</p>
//             ) : getData.length > 0 ? (
//               <>
//                 {/* Moved the button to the right */}
//                 <div className="mt-6 text-right">
//                   <button
//                     onClick={generatePDF}
//                     className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                   >
//                     Generate PDF
//                   </button>
//                 </div>
  
//                 {/* ตัวอย่างแสดงข้อมูลนักศึกษา */}
//                 <div className="mt-6">
//                   {getData.map((student, index) => (
//                     <div
//                       key={`${student.student_id}-${index}`}
//                       className="mb-4 border-b pb-2"
//                     >
//                       <div className="flex flex-wrap gap-4">
//                         <p className="flex-shrink-0">
//                           <strong>
//                             {student.student_firstname} {student.student_lastname}
//                           </strong>{" "}
//                           (ID: {student.student_id})
//                         </p>
//                         <p className="flex-shrink-0">
//                           คณะ: {student.student_faculty}
//                         </p>
//                         <p className="flex-shrink-0">
//                           สาขา: {student.student_field}
//                         </p>
//                         <p className="flex-shrink-0">
//                           GPA: {student.student_gpa}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             ) : (
//               <p>ไม่พบข้อมูลนักศึกษา</p>
//             )}
//           </div>
  
//           {/* Success Message */}
//           {showSuccess && (
//             <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[60%] lg:w-[40%] p-6 bg-gradient-to-r from-[#0fef76] to-[#09c9f6] border-2 border-[#0F1035] rounded-lg shadow-[0px_0px_20px_5px_rgba(15,239,118,0.5)] text-center transition-all duration-500 ease-out animate-pulse">
//               <div className="flex items-center justify-center space-x-4">
//                 <div className="p-2 bg-green-100 rounded-full shadow-lg">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     className="w-10 h-10 text-green-600"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                 </div>
//                 <div className="text-2xl font-bold text-white drop-shadow-lg">
//                   {success}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//       <Foter />
//     </div>
//   );
//   }
  

// export default ShowScholarshipGenPDF;


// // "use client";
// // import { jsPDF } from "jspdf";
// // import "jspdf-autotable";
// // import { useEffect, useState } from "react";
// // import { useRouter } from "next/navigation";
// // import "@/fonts/THSarabunNew-normal.js"; // นำฟอนต์เข้ามาเพื่อใช้ภาษาไทย
// // import Navbar from "@/app/components/Navbar";
// // import Foter from "@/app/components/Foter";
// // import { useSession } from "next-auth/react";

// // function ShowScholarshipGenPDF() {
// //   const [getData, setGetData] = useState([]);
// //   const { data: session, status } = useSession();
// //   const [error, setError] = useState("");
// //   const [loading, setLoading] = useState(true);
// //   const [showSuccess, setShowSuccess] = useState(false);
// //   const [success, setSuccess] = useState("PDF ถูกสร้างเรียบร้อยแล้ว!");
// //   const router = useRouter();
// //   const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// //   useEffect(() => {
// //     if (status === "loading") return;
// //     if (!session) {
// //       router.push("/login");
// //     }
// //   }, [session, status, router]);

// //   // ฟังก์ชันดึงข้อมูลนักศึกษาจาก API
// //   const fetchGetData = async () => {
// //     try {
// //       const res = await fetch(`${apiUrl}/api/genPDF/`, {
// //         method: "GET",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //       });

// //       if (res.ok) {
// //         const data = await res.json();
// //         console.log(data);
        
// //         setGetData(data);
// //         setLoading(false);
// //       } else {
// //         setError("ดึงข้อมูลไม่สำเร็จ");
// //         setLoading(false);
// //       }
// //     } catch (error) {
// //       setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchGetData();
// //   }, []);


// //   const generatePDF = () => {
// //     if (getData.length === 0) {
// //       alert("ไม่มีข้อมูลในการสร้าง PDF");
// //       return;
// //     }
  
// //     const doc = new jsPDF();
// //     const pageWidth = doc.internal.pageSize.getWidth();
  
// //     // ตั้งค่าฟอนต์เป็น THSarabunNew
// //     doc.setFont("THSarabunNew", "normal");
  
// //     // ใส่หัวข้อในเอกสาร PDF
// //     doc.setFontSize(20);
// //     doc.setTextColor(0, 0, 0); // สีดำสำหรับข้อความ
// //     doc.text("รายชื่อนักศึกษาที่ผ่านทุนจ้างงาน", pageWidth / 2, 20, { align: "center" });
  
// //     // เพิ่มเส้นแบ่งใต้หัวข้อ
// //     doc.setLineWidth(0.5);
// //     doc.setDrawColor(0, 0, 0); // สีดำสำหรับเส้น
// //     doc.line(15, 25, pageWidth - 15, 25);
  
// //     // เตรียมข้อมูลนักศึกษาทั้งหมด
// //     const studentsData = getData.map((student, idx) => [
// //       idx + 1,
// //       student.student_id,
// //       `${student.student_firstname} ${student.student_lastname}`,
// //       student.student_curriculum,
// //       student.student_gpa,
// //     ]);
  
// //     // สร้างตารางข้อมูลนักศึกษาใน PDF เป็นขาวดำ
// //     doc.autoTable({
// //       head: [["ลำดับที่", "รหัสนิสิต", "ชื่อ-นามสกุล", "สาขา", "GPA"]],
// //       body: studentsData,
// //       startY: 30, // เริ่มต้นตารางใต้หัวข้อ
// //       styles: {
// //         font: "THSarabunNew",
// //         fontSize: 14,
// //         textColor: [0, 0, 0], // สีดำสำหรับข้อความในตาราง
// //       },
// //       headStyles: {
// //         fillColor: [200, 200, 200], // สีเทาอ่อนสำหรับหัวตาราง
// //         textColor: [0, 0, 0], // สีดำสำหรับข้อความหัวตาราง
// //       },
// //       bodyStyles: {
// //         fillColor: [255, 255, 255], // สีขาวสำหรับพื้นหลัง
// //       },
// //       theme: "grid", // เพิ่มเส้นตารางรอบข้อมูล
// //       didDrawPage: (data) => {
// //         doc.setFontSize(10);
// //         doc.setTextColor(0, 0, 0); // สีดำสำหรับหมายเลขหน้า
// //         doc.text(`${doc.internal.getNumberOfPages()}`, pageWidth - 20, 285);
// //       },
// //     });
  
// //     // บันทึก PDF
// //     doc.save("students_list.pdf");
  
// //     setShowSuccess(true);
// //     setTimeout(() => setShowSuccess(false), 3000);
// //   };
  
  

// //   return (
// //     <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#DCF2F1] via-[#7FC7D9] via-[#365486] to-[#0F1035]">
// //       <Navbar session={session} />
// //       <div className="container mx-auto px-4 py-6">
// //         <div className="bg-white shadow-lg rounded-lg px-6 py-6 w-full mb-6">
// //           <div className="bg-blue-500 text-white px-5 py-3 rounded-lg w-full text-center shadow-lg">
// //             <h3 className="text-2xl font-bold">พิมพ์รายชื่อนิสิตจ้างงาน ที่ผ่านการคัดเลือก</h3>
// //           </div>
  
// //           <div className="mt-6">
// //             {error && <div className="text-red-500 mb-4">{error}</div>}
// //             {loading ? (
// //               <p>กำลังโหลดข้อมูล...</p>
// //             ) : getData.length > 0 ? (
// //               <>
// //                 <div className="mt-6 text-right">
// //                   <button
// //                     onClick={generatePDF}
// //                     className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// //                   >
// //                     Generate PDF
// //                   </button>
// //                 </div>
  
// //                 {/* แสดงข้อมูลนิสิตที่ผ่านการคัดเลือกทั้งหมด */}
// //                 <div className="mt-6">
// //                   {getData.map((student, index) => (
// //                     <div
// //                       key={`${student.student_id}-${index}`}
// //                       className="mb-4 border-b pb-2"
// //                     >
// //                       <div className="flex flex-wrap gap-4">
// //                         <p className="flex-shrink-0">
// //                           <strong>
// //                             {student.student_firstname} {student.student_lastname}
// //                           </strong>{" "}
// //                           (ID: {student.student_id})
// //                         </p>
// //                         <p className="flex-shrink-0">สาขา: {student.student_curriculum}</p>
// //                         <p className="flex-shrink-0">GPA: {student.student_gpa}</p>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </>
// //             ) : (
// //               <p>ไม่พบข้อมูลนักศึกษา</p>
// //             )}
// //           </div>
  
// //           {showSuccess && (
// //             <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[60%] lg:w-[40%] p-6 bg-gradient-to-r from-[#0fef76] to-[#09c9f6] border-2 border-[#0F1035] rounded-lg shadow-[0px_0px_20px_5px_rgba(15,239,118,0.5)] text-center transition-all duration-500 ease-out animate-pulse">
// //               <div className="flex items-center justify-center space-x-4">
// //                 <div className="p-2 bg-green-100 rounded-full shadow-lg">
// //                   <svg
// //                     xmlns="http://www.w3.org/2000/svg"
// //                     fill="none"
// //                     viewBox="0 0 24 24"
// //                     stroke="currentColor"
// //                     className="w-10 h-10 text-green-600"
// //                   >
// //                     <path
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       strokeWidth={2}
// //                       d="M5 13l4 4L19 7"
// //                     />
// //                   </svg>
// //                 </div>
// //                 <div className="text-2xl font-bold text-white drop-shadow-lg">{success}</div>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //       <Foter />
// //     </div>
// //   );
  
// // }

// // export default ShowScholarshipGenPDF;
