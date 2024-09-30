"use client";
import { useState } from 'react';

export default function Home() {
  const [features, setFeatures] = useState([5.1, 3.5, 1.4, 0.2]); // ข้อมูลตัวอย่าง
  const [prediction, setPrediction] = useState(null);

  const handlePredict = async () => {
    try {
      const res = await fetch('/api/knn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features }),
      });

      const data = await res.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Error fetching prediction:", error);
    }
  };

  return (
    <div>
      <h1>KNN Prediction</h1>
      <button onClick={handlePredict}>Predict</button>
      {prediction !== null && <div>Prediction: {prediction}</div>}
    </div>
  );
}
