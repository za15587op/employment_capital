from flask import Flask, request, jsonify
from sklearn.neighbors import KNeighborsClassifier
import numpy as np

app = Flask(__name__)

# ตัวอย่างข้อมูลการฝึกโมเดล (คุณสามารถแก้ไขได้ตามความต้องการ)
X_train = np.array([[5.1, 3.5, 1.4, 0.2], [6.0, 3.0, 4.8, 1.8], [6.9, 3.1, 5.4, 2.1]])
y_train = np.array([0, 1, 2])

# สร้างโมเดล KNN และฝึกด้วยข้อมูล
knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_train, y_train)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # รับข้อมูลจาก request ที่ส่งมาในรูปแบบ JSON
    features = np.array(data['features']).reshape(1, -1)  # แปลงข้อมูลเป็น numpy array
    prediction = knn.predict(features)  # ทำนายผล
    return jsonify({'prediction': int(prediction[0])})  # ส่งผลลัพธ์กลับไปในรูปแบบ JSON

if __name__ == '__main__':
    app.run(debug=True)
