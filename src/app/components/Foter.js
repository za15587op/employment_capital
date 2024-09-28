export default function Foter() {
    return (
        <footer 
  className="text-white py-8" 
  style={{ background: 'linear-gradient(to right, #DCF2F1, #7FC7D9, #365486, #0F1035)' }}
>
  <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
    
    {/* ส่วนที่ 1: โลโก้และข้อมูลการติดต่อ */}
    <div className="flex flex-col space-y-4"> 
      <div className="flex items-start space-x-4"> 
      <img src="/logoicon.png" alt="Logo" className="w-full h-auto max-w-[30%]" />
        <div>
          <h3 className="text-lg font-semibold leading-none">
           ฝ่ายกิจการนิสิต สำนักงานมหาวิทยาลัยทักษิณ วิทยาเขตพัทลุง
          </h3>
          <p className="mt-2 text-sm opacity-75 leading-relaxed">
            222 หมู่ 2 ต.บ้านพร้าว อ.ป่าพะยอม จ.พัทลุง 93210  <br />
            Tel: <strong>0-7460-9600</strong>
          </p>
        </div>
      </div>
    </div>

    {/* ส่วนที่ 2: หน่วยงานบริการ ตรงกลาง */}
    <div className="flex justify-center"> 
      <div>
        <h3 className="text-lg font-semibold text-center">หน่วยงานบริการ</h3>
        <ul className="mt-4 space-y-2 text-sm text-center">
          <li><a href="#" className="hover:text-red-400 transition-colors duration-300">สำนักงานกิจการนิสิต</a></li>
          <li><a href="#" className="hover:text-red-400 transition-colors duration-300">สำนักงานทะเบียนนิสิต</a></li>

        </ul>
      </div>
    </div>
    
    {/* ส่วนที่ 3: Social Media ย้ายไปขวาสุด */}
    <div className="flex justify-end pr-10"> {/* pr-10 เพิ่ม padding-right 10 เพื่อระยะห่างจากขอบขวา */}
      <div>
        <h3 className="text-lg font-semibold">Follow us</h3>
        <div className="flex space-x-4 mt-4">
          <a href="https://www.facebook.com/share/AHdEVg5qQuoq9qmr/?mibextid=qi2Omg" className="hover:scale-110 transition-transform duration-300">
            <img src="/facebook.png" alt="Facebook" className="w-8 h-8" />
          </a>
          <a href="https://line.me/R/ti/p/dada.kunchao" className="hover:scale-110 transition-transform duration-300">
            <img src="/line.png" alt="Line" className="w-8 h-8" />
          </a>
          <a href="mailto:nudada2529@gmail.com" className="hover:scale-110 transition-transform duration-300">
            <img src="/email.png" alt="Email" className="w-8 h-8" />
          </a>
        </div>
      </div>
    </div>
  </div>
        {/* ลิขสิทธิ์และนโยบาย */}
        <div className="bg-[#4979ff] text-white py-4 mt-8 shadow-lg">
          <div className="container mx-auto flex justify-between items-center px-4">
            {/* นโยบายของเว็บไซต์ทางซ้าย */}
            <p className="text-sm opacity-90">
            Copyright © 2024 | Thaksin University
            </p>
  
            {/* Copyright ทางขวา */}
            <p className="text-sm opacity-90 text-right">
            พัฒนาโดย : นายธนพล เพชรกาศ,นายพงษ์ศักดิ์ พิริยะยรรยง มหาวิทยาลัยทักษิณ วิทยาเขตพัทลุง
            </p>
          </div>
        </div>
      </footer>
    );
  }
  