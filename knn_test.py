from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

# โหลดข้อมูล Iris
iris = load_iris()
X = iris.data  # ข้อมูลคุณสมบัติ (features)
y = iris.target  # ข้อมูลป้ายกำกับ (labels)

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
