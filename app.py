from flask import Flask, request, jsonify
from sklearn.neighbors import NearestNeighbors
import numpy as np
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["https://employment-capital.vercel.app", "http://localhost:3000"]
    }
})  # เปิดใช้งาน CORS สำหรับ Vercel และ localhost

def create_feature_vector(data):
    try:
        if 'skill_type_name' not in data or 'skill_level' not in data or 'availability_time' not in data or 'availability_days' not in data:
            raise KeyError("ข้อมูลไม่ครบ: ต้องมี 'skill_type_name', 'skill_level', 'availability_time', และ 'availability_days'")
        
        # Debugging log เพื่อดูขนาดและเนื้อหาของข้อมูล
        print('Skill Type:', data['skill_type_name'])
        print('Skill Level:', data['skill_level'])
        print('Availability Time:', data['availability_time'])
        print('Availability Days:', data['availability_days'])

        # การรวมข้อมูลทั้งหมดเป็นเวกเตอร์เดียว
        feature_vector = np.array([*data["skill_type_name"], *data["skill_level"], *data["availability_time"], *data["availability_days"]])

        # Debugging log เพื่อดูเวกเตอร์ที่สร้างขึ้น
        print('Feature Vector:', feature_vector)
        
        return feature_vector

    except KeyError as e:
        print(f"Error in create_feature_vector: {e}")
        raise


@app.route('/match', methods=['POST'])
def match_students():
    data = request.json
    organizations = data['organizations']
    students = data['students']
    
    # ตรวจสอบข้อมูลก่อนดำเนินการ
    print('Received organization data:', organizations)
    print('Received student data:', students)


    student_vectors = np.array([create_feature_vector(student) for student in students])
    org_vector = create_feature_vector(organizations[0]).reshape(1, -1)

    # ใช้ k-NN สำหรับการจับคู่
    model = NearestNeighbors(n_neighbors=len(students), metric='euclidean')
    model.fit(student_vectors)
    distances, indices = model.kneighbors(org_vector)

    matches = [{"Organization ID": organizations[0]["id"], "Student ID": students[i]["id"], "Distance": distances[0][j]} 
               for j, i in enumerate(indices[0])]
    
    return jsonify(matches)

if __name__ == '__main__':
    app.run(port=5000, debug=True)



# from flask import Flask, request, jsonify
# from sklearn.neighbors import NearestNeighbors
# import numpy as np
# from flask_cors import CORS  # Import CORS

# app = Flask(__name__)
# CORS(app ,resources={r"/*": {"origins": "http://localhost:3000"}})  # เปิดใช้งาน CORS สำหรับทุกเส้นทาง

# # ฟังก์ชันการสร้าง feature vector
# def create_feature_vector(data):
#     return np.array([*data["skills"], *data["skill_levels"], *data["availability_time"], *data["availability_days"]])

# @app.route('/match', methods=['POST'])
# def match_students():
#     data = request.json
#     organizations = data['organizations']
#     students = data['students']

#     student_vectors = np.array([create_feature_vector(student) for student in students])
#     org_vector = create_feature_vector(organizations[0]).reshape(1, -1)

#     # ใช้ k-NN สำหรับการจับคู่
#     model = NearestNeighbors(n_neighbors=len(students), metric='euclidean')
#     model.fit(student_vectors)
#     distances, indices = model.kneighbors(org_vector)

#     matches = [{"Organization ID": organizations[0]["id"], "Student ID": students[i]["id"], "Distance": distances[0][j]} 
#                for j, i in enumerate(indices[0])]
    
#     return jsonify(matches)


# if __name__ == '__main__':
#     app.run(port=5000, debug=True)
