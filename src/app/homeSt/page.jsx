"use client";
import React, { useEffect, useState, useRef } from "react";
import Navbar from "@/app/components/Navbar";
import Foter from "../components/Foter";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { BsClockFill } from 'react-icons/bs'; // ไอคอนเวลานับถอยหลัง
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

function HomeStudentPage() {
    const [scholarships, setScholarships] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();
    const videoRefs = [useRef(null)];
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const formatDateToYYYYMMDD = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
    };
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        if (status === "loading") return; // รอจนกว่าจะโหลด session เสร็จ
        if (!session) {
            router.push("/login");
        }
    }, [session, status, router]);
    
    const calculateDaysLeft = (startDate,endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = end - start;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    useEffect(() => {
        const fetchScholarships = async () => {
            try {
                const res = await fetch(`${apiUrl}/api/showScholarshipsStd`);
                if (res.ok) {
                    const data = await res.json();

                              // ฟังก์ชันสำหรับแปลงวันที่ให้เป็นรูปแบบ YYYY-MM-DD และแปลงเป็นพุทธศักราช
const formatDateToBuddhistEra = (dateString) => {
    const date = new Date(dateString);
    const yearBE = date.getFullYear() + 543; // แปลงปีเป็นพุทธศักราช
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // เติม 0 ข้างหน้าเดือนถ้าเป็นเลขตัวเดียว
    const day = date.getDate().toString().padStart(2, "0"); // เติม 0 ข้างหน้าวันถ้าเป็นเลขตัวเดียว
    return `${yearBE}-${month}-${day}`; // ส่งคืนรูปแบบ พ.ศ.-MM-DD
  };

                    const formattedData = data.map((scholarship) => ({
                        ...scholarship,
                        application_start_date: formatDateToBuddhistEra(scholarship.application_start_date),
                        application_end_date: formatDateToBuddhistEra(scholarship.application_end_date),
                        daysLeft: calculateDaysLeft(scholarship.application_start_date , scholarship.application_end_date), // เพิ่มข้อมูลวันเหลือ
                    }));
                    setScholarships(formattedData);
                } else {
                    setError("Failed to fetch scholarships data");
                }
            } catch (error) {
                setError("An error occurred while fetching scholarships data");
            }
        };

        fetchScholarships();
    }, []);

    const handleVideoEnded = () => {
        const nextVideoIndex = (currentVideoIndex + 1) % videoRefs.length; 
        setCurrentVideoIndex(nextVideoIndex);
        videoRefs[nextVideoIndex].current.play();
    };

    const ApplyScholarship = (scholarship_id) => {
        setSuccess(true);
        setTimeout(() => {
            router.push(`${apiUrl}/welcome/student_scholarships/${scholarship_id}`);
        }, 3000);
    };

    useEffect(() => {
        if (videoRefs[currentVideoIndex].current) {
            videoRefs[currentVideoIndex].current.play();
        }
    }, [currentVideoIndex]);

    return (
        <>
            <div className="relative min-h-screen overflow-hidden bg-white">
                <Navbar session={session} />
                <div className="แถบสี"></div>
                <div className="py-10 flex justify-center">
                    <div className="relative inline-block px-10 py-6 bg-gradient-to-r from-blue-200 to-purple-200 rounded-xl shadow-xl">
                        <p className="text-4xl font-extrabold text-center text-blue-900 tracking-wider animate-pulse">
                            ประกาศรับสมัครนิสิตทุนการจ้างงาน
                        </p>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-50 blur-md rounded-lg"></div>
                    </div>
                </div>
                <div className="relative h-screen w-full">
                    <video
                        ref={videoRefs[0]}
                        className={`absolute top-0 left-0 w-full h-full object-cover border-t-4 border-b-4 border-white ${currentVideoIndex === 0 ? 'block' : 'hidden'}`}
                        src="/100.mp4"
                        onEnded={handleVideoEnded}
                        muted
                        disablePictureInPicture
                    />
                    {/* <video
                        ref={videoRefs[1]}
                        className={`absolute top-0 left-0 w-full h-full object-cover border-t-4 border-b-4 border-white ${currentVideoIndex === 1 ? 'block' : 'hidden'}`}
                        src="/200.mp4"
                        onEnded={handleVideoEnded}
                        muted
                        disablePictureInPicture
                    /> */}
                </div>

                <div className="relative z-10 container mx-auto py-8">
                    <div className="relative p-8 bg-gradient-to-r from-blue-200 to-gray-700 rounded-2xl shadow-2xl border border-blue-200 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-400 via-gray-600 to-blue-800 opacity-50 rounded-2xl"></div>
                        <Swiper
                            spaceBetween={5} 
                            slidesPerView={2} 
                            centeredSlides={true} 
                            loop={true} 
                            autoplay={{ delay: 3500, disableOnInteraction: false }}
                            pagination={{ clickable: true, dynamicBullets: true }}
                            navigation={true}
                            modules={[Autoplay, Pagination, Navigation]}
                            className="relative z-10 mySwiper"
                        >
                            {[0, 1, 2, 3, 4, 5].map((num) => (
                                <SwiperSlide key={num} style={{ width: '500px' }}> 
                                    <div className="flex justify-center">
                                        <img
                                            src={`/${num}.jpg`}
                                            alt={`Slide ${num}`}
                                            className="max-w-[500px] max-h-[400px] w-full h-auto rounded-lg shadow-xl border-4 border-transparent hover:border-white transition-all duration-500 transform hover:scale-105"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
                <div className="relative z-10 container mx-auto py-8 text-left">
                    <h1 className="text-4xl font-bold text-gray-900">ประกาศรับสมัครนิสิตทุนการจ้างงาน</h1>
                    <div className="mt-4 text-lg text-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="inline-flex items-center text-gray-600">
                                <img src="/news.png" alt="News Icon" className="w-5 h-5" />
                                <span className="ml-2">ประกาศ ณ วันที่ 25 กันยายน 2567</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative z-10 container mx-auto py-4 text-left text-gray-800">
                    <p>ทุนนิสิตจ้างงานเป็นโครงการหรือรูปแบบการสนับสนุนที่หลายมหาวิทยาลัยทั่วประเทศได้ริเริ่มเพื่อช่วยเหลือนิสิตนักศึกษาในการเพิ่มโอกาสการทำงานควบคู่ไปกับการศึกษา โดยการได้รับทุนประเภทนี้ นิสิตจะมีโอกาสทำงานในสถาบันการศึกษา หน่วยงานภาครัฐ หรือองค์กรเอกชน ซึ่งจะได้รับค่าตอบแทนเป็นรายได้เสริมพร้อมกับประสบการณ์ที่มีคุณค่าในอนาคต ทุนนิสิตจ้างงานนี้ไม่ได้เพียงแต่ช่วยให้นิสิตสามารถมีรายได้เท่านั้น แต่ยังเป็นการเปิดประตูให้พวกเขาได้รับโอกาสในการพัฒนาตัวเองทั้งทางด้านทักษะการทำงาน ความรับผิดชอบ และการปรับตัวเข้ากับชีวิตในอนาคต</p>
                    <h2 className="text-xl font-bold mt-4">คุณสมบัติของผู้สมัครทุนนิสิตจ้างงาน</h2>
                    <ul className="list-disc ml-8">
                        <li>เป็นนักศึกษาระดับปริญญาตรี ของมหาวิทยาลัยทักษิณ</li>
                        <li>มีความรับผิดชอบ และมีคุณสมบัติตรงตามที่หน่วยงานภายในมหาวิทยาลัยกำหนด</li>
                        <li>ผู้สมัครจะต้องยินยอมอนุญาตให้เก็บ รวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลแก่มหาวิทยาลัยอาทิ ประวัติส่วนบุคคล ที่อยู่ เบอร์โทรศัพท์ รูปภาพ และข้อมูล/เอกสาร เป็นต้น เพื่อใช้ประกอบการพิจารณาการคัดเลือกผู้ได้รับทุนการศึกษา ซึ่งไม่เกี่ยวการถกข้อมูลและบันทึกในระบบการรับสมัครทุนแบบออนไลน์การให้บริการสัมภาษณ์ ตลอดจนถึงการประกาศรายชื่อผู้ได้รับทุนการศึกษา</li>
                    </ul>
                </div>
                <div className="relative z-10 container mx-auto py-12">
                    {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                    <div className="flex flex-wrap gap-8 justify-center">
                        {scholarships.map((scholarship) => (
                            <div
                                key={scholarship.scholarship_id}
                                className="relative group bg-white p-8 rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:scale-105 transition-transform duration-500 ease-in-out w-[300px] flex-shrink-0"
                            >
                                <div className="absolute inset-0 -z-10 transform scale-100 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 group-hover:scale-105 transition-transform duration-500 ease-in-out"></div>
                                <div className="flex justify-center mb-4">
                                    <div className="w-16 h-16 p-3 bg-blue-500 rounded-full shadow-md">
                                        <img src="/e.png" alt="Scholarship Icon" className="w-full h-full object-contain" />
                                    </div>
                                </div>
                                <div className="text-center text-gray-700">
                                    <span className="block font-bold text-2xl text-gray-800 mb-2">ปีการศึกษา {scholarship.academic_year}</span>
                                    <span className="block text-sm mb-1">เทอมที่ {scholarship.academic_term}</span>
                                    <span className="block text-sm">เริ่มสมัครได้ตั้งแต่: {scholarship.application_start_date}</span>
                                    <span className="block text-sm">ปิดรับสมัครวันที่: {scholarship.application_end_date}</span>
                                </div>
                                <div className="flex items-center justify-center mt-4 text-red-500">
                                    <BsClockFill className="mr-2" />
                                    <span className="text-sm">เหลือเวลาอีก {scholarship.daysLeft} วันในการสมัคร</span>
                                </div>
                                <div className="mt-6 flex justify-center">
                                    <button
                                        onClick={() => ApplyScholarship(scholarship.scholarship_id)}
                                        className="bg-gradient-to-r from-green-400 to-blue-600 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-500 ease-in-out"
                                    >
                                        สมัครทุน
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {success && (
                    <div className="fixed z-50 top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-80">
                        <div className="relative w-[90%] md:w-[60%] lg:w-[40%] p-6 bg-gradient-to-r from-green-400 to-blue-400 border-2 border-green-600 rounded-lg shadow-2xl text-center transition-all duration-500 ease-out animate-pulse">
                            <div className="flex items-center justify-center space-x-4">
                                <div className="p-2 bg-white rounded-full shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10 text-green-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <p className="mt-4 text-lg text-white font-semibold">ระบบกำลังนำคุณไปยังหน้าสมัครทุนถัดไป...</p>
                        </div>
                    </div>
                )}
                <Foter />
            </div>
        </>
    );
}

export default HomeStudentPage;
