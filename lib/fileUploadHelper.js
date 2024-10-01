const SFTPClient = require('ssh2-sftp-client');
const path = require('path');

const sftp = new SFTPClient();

async function uploadFileToHostinger(file, student_id, scholarship_id, scholarships) {
  const fileName = `${student_id}_${scholarship_id}_${scholarships.academic_year}_${scholarships.academic_term}${path.extname(file.name)}`;
  const remoteFilePath = `/public_html/uploads/${fileName}`; // เส้นทางที่ต้องการอัปโหลดบน Hostinger

  try {
    // เชื่อมต่อกับ Hostinger ผ่าน SFTP
    await sftp.connect({
      host: process.env.HOSTINGER_HOST,
      port: process.env.HOSTINGER_PORT, // ใช้พอร์ต 22 สำหรับ SFTP
      username: process.env.HOSTINGER_USER,
      password: process.env.HOSTINGER_PASS,
    });

    // อัปโหลดไฟล์
    await sftp.put(file.path, remoteFilePath);

    console.log('Upload success!');
    return `https://employment-capital-vercel-app.preview-domain.com//public/uploads/${fileName}`; // URL ของไฟล์ที่อัปโหลด
  } catch (err) {
    console.error('Upload failed:', err);
    throw new Error('เกิดข้อผิดพลาดในการอัปโหลดไฟล์');
  } finally {
    sftp.end(); // ปิดการเชื่อมต่อ SFTP
  }
}

module.exports = { uploadFileToHostinger };
