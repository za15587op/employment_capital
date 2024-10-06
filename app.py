from flask import Flask, request, jsonify
from sklearn.neighbors import NearestNeighbors
import numpy as np
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app ,resources={r"/*": {"origins": "https://employment-capital.vercel.app"}})  # เปิดใช้งาน CORS สำหรับทุกเส้นทาง

# ฟังก์ชันการสร้าง feature vector
def create_feature_vector(data):
    return np.array([*data["skills"], *data["skill_levels"], *data["availability_time"], *data["availability_days"]])

# @app.route('/api/knn/student/<int:scholarship_id>/<int:organization_id>', methods=['GET'])
# def get_student_data(scholarship_id, organization_id):
#     # ดึงข้อมูลตาม scholarship_id และ organization_id ที่ส่งมา
#     return jsonify(student_data)


@app.route('/match', methods=['POST'])
def match_students():
    data = request.json
    organizations = data['organizations']
    students = data['students']

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
