import pymysql
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
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
        
        # Query 1: ดึงข้อมูลของผู้สมัคร
        query_studentskills = """
        SELECT student.join_org, studentskills.skill_level, skills.skill_type_name, 
               datetimeavailable.is_parttime, datetimeavailable.date_available
        FROM studentskills
        INNER JOIN student ON studentskills.student_id = student.student_id
        INNER JOIN skills ON studentskills.skill_id = skills.skill_id
        INNER JOIN datetimeavailable ON student.student_id = datetimeavailable.student_id
        """
        cursor.execute(query_studentskills)
        studentskills_result = cursor.fetchall()
        studentskills_array = np.array(studentskills_result)
        
        # แปลงข้อมูลจาก Query 1
        le_org = LabelEncoder()
        le_skill_level = LabelEncoder()
        le_skill_type_student = LabelEncoder()
        le_is_parttime = LabelEncoder()
        le_date_available = LabelEncoder()
        
        studentskills_array[:, 0] = le_org.fit_transform(studentskills_array[:, 0])  # join_org
        studentskills_array[:, 1] = le_skill_level.fit_transform(studentskills_array[:, 1])  # skill_level
        studentskills_array[:, 2] = le_skill_type_student.fit_transform(studentskills_array[:, 2])  # skill_type_name
        studentskills_array[:, 3] = le_is_parttime.fit_transform(studentskills_array[:, 3])  # is_parttime
        studentskills_array[:, 4] = le_date_available.fit_transform(studentskills_array[:, 4])  # date_available
        
        # ใช้ข้อมูลจากผู้สมัครเป็น features และ skill_level เป็น labels
        X_students = studentskills_array[:, :-1]  # ไม่รวม label
        y_students = studentskills_array[:, 1]  # ใช้ skill_level เป็น label

        # แบ่งข้อมูลเป็น Training และ Test Set
        X_train, X_test, y_train, y_test = train_test_split(X_students, y_students, test_size=0.2, random_state=42)

        # สร้างโมเดล KNN และทดสอบ Query 1
        knn = KNeighborsClassifier(n_neighbors=3)
        knn.fit(X_train, y_train)
        y_pred = knn.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Accuracy for students' skills query: {accuracy}")

        # -----------------------------------------------------------------------------------------
        
        # Query 2: ดึงข้อมูลของหน่วยงาน
        query_scholarshiporganization = """
        SELECT organization.organization_name, scholarshiporganization.amount, 
               skilltypes.skill_type_name, scholarshiporganization.workType, 
               scholarshiporganization.workTime, scholarshiprequirement.required_level
        FROM organization
        INNER JOIN scholarshiporganization ON scholarshiporganization.organization_id = organization.organization_id
        INNER JOIN scholarshiprequirement ON scholarshiporganization.scholarship_organ_id = scholarshiprequirement.scholarship_organ_id
        INNER JOIN skilltypes ON scholarshiprequirement.skill_type_id = skilltypes.skill_type_id
        """
        cursor.execute(query_scholarshiporganization)
        scholarshiporganization_result = cursor.fetchall()
        scholarshiporganization_array = np.array(scholarshiporganization_result)
        
        # แปลงข้อมูลจาก Query 2
        le_org = LabelEncoder()
        le_amount = LabelEncoder()
        le_skill_type_org = LabelEncoder()
        le_workType = LabelEncoder()
        le_workTime = LabelEncoder()
        le_required_level = LabelEncoder()
        
        scholarshiporganization_array[:, 0] = le_org.fit_transform(scholarshiporganization_array[:, 0])  # organization_name
        scholarshiporganization_array[:, 1] = le_amount.fit_transform(scholarshiporganization_array[:, 1])  # amount
        scholarshiporganization_array[:, 2] = le_skill_type_org.fit_transform(scholarshiporganization_array[:, 2])  # skill_type_name
        scholarshiporganization_array[:, 3] = le_workType.fit_transform(scholarshiporganization_array[:, 3])  # workType
        scholarshiporganization_array[:, 4] = le_workTime.fit_transform(scholarshiporganization_array[:, 4])  # workTime
        scholarshiporganization_array[:, 5] = le_required_level.fit_transform(scholarshiporganization_array[:, 5])  # required_level

        # ใช้ข้อมูลจากหน่วยงานเป็น features และ required_level เป็น labels
        X_org = scholarshiporganization_array[:, :-1]  # ไม่รวม label
        y_org = scholarshiporganization_array[:, 5]  # ใช้ required_level เป็น label

        # แบ่งข้อมูลเป็น Training และ Test Set
        X_train_org, X_test_org, y_train_org, y_test_org = train_test_split(X_org, y_org, test_size=0.2, random_state=42)

        # สร้างโมเดล KNN และทดสอบ Query 2
        knn_org = KNeighborsClassifier(n_neighbors=3)
        knn_org.fit(X_train_org, y_train_org)
        y_pred_org = knn_org.predict(X_test_org)
        accuracy_org = accuracy_score(y_test_org, y_pred_org)
        print(f"Accuracy for organizations' requirements query: {accuracy_org}")

except Exception as e:
    print(f"An error occurred: {e}")
finally:
    connection.close()
