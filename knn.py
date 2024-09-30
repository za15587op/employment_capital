import pymysql
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

# เชื่อมต่อกับฐานข้อมูล
try:
    connection = pymysql.connect(
        host='srv1656.hstgr.io',
        user='u932401017_admin5',
        password=';plk4GT$r8',
        db='u932401017_employment_cap',
        port=3306
    )
    print("Connection to the database was successful!")
except Exception as e:
    print(f"Error connecting to the database: {e}")
    exit()


try:
    with connection.cursor() as cursor:
        # ดึงข้อมูลคุณสมบัติ (features) จากตาราง
        cursor.execute("""
            SELECT student.student_id, student.student_firstname, student.student_lastname,
                student.student_faculty, student.student_curriculum, student.student_year,
                student.student_gpa, student.student_phone, scholarshipregistrations.student_status,
                scholarshipregistrations.join_org, scholarshipregistrations.regist_id,
                GROUP_CONCAT(DISTINCT skills.skill_name ORDER BY skills.skill_name ASC) AS skill_names,
                GROUP_CONCAT(DISTINCT studentskills.skill_level ORDER BY studentskills.skill_level ASC) AS skill_levels,
                datetimeavailable.date_available, organization.organization_name
            FROM scholarshipregistrations
            INNER JOIN student ON scholarshipregistrations.student_id = student.student_id
            LEFT JOIN studentskills ON student.student_id = studentskills.student_id
            LEFT JOIN skills ON studentskills.skill_id = skills.skill_id
            INNER JOIN scholarships ON scholarshipregistrations.scholarship_id = scholarships.scholarship_id
            INNER JOIN scholarshiporganization ON scholarships.scholarship_id = scholarshiporganization.scholarship_id
            INNER JOIN datetimeavailable ON datetimeavailable.regist_id = scholarshipregistrations.regist_id
            INNER JOIN organization ON organization.organization_id = scholarshiporganization.organization_id
            GROUP BY student.student_id, scholarshipregistrations.join_org,
                datetimeavailable.date_available, organization.organization_name, scholarshipregistrations.regist_id;
        """)
        X = np.array(cursor.fetchall())
        print(f"Fetched features successfully, shape: {X.shape}")

        # ดึงข้อมูลป้ายกำกับ (labels) จากตาราง
        cursor.execute("""SELECT 
        scholarshiprequirement.required_level,
        scholarshiporganization.workType,
        scholarshiporganization.workTime,
        skilltypes.skill_type_id,
        skilltypes.skill_type_name
      FROM scholarshiprequirement
      INNER JOIN scholarshiporganization 
        ON scholarshiprequirement.scholarship_organ_id = scholarshiporganization.scholarship_organ_id
      INNER JOIN skilltypes 
        ON scholarshiprequirement.skill_type_id = skilltypes.skill_type_id""")
        y = np.array(cursor.fetchall()).flatten()  # flatten เพื่อแปลงข้อมูลเป็น array แบบ 1 มิติ
        print(f"Fetched labels successfully, shape: {y.shape}")
finally:
    connection.close()
    
# ตรวจสอบขนาดข้อมูล
if X.shape[0] != y.shape[0]:
    print(f"Error: Number of samples in X and y are not equal. X has {X.shape[0]} samples, y has {y.shape[0]} samples.")
    exit()

# แบ่งข้อมูลออกเป็น training set และ test set
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# สร้างโมเดล KNN
knn = KNeighborsClassifier(n_neighbors=3)

# ฝึกโมเดลด้วย training data
knn.fit(X_train, y_train)

# ทำนายผลด้วย test data
y_pred = knn.predict(X_test)

# ตรวจสอบความแม่นยำ
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy}")
