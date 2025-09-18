import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function FeatureImportanceChart() {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://boston-house-price-backend.onrender.com/feature_importance");
      const data = await response.json();
      if (data.features) {
        setFeatures(data.features);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mt-6 w-full">
      <h2 className="text-xl font-bold mb-4 text-center">
        📊 Feature Importance
      </h2>
      {features.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={features} layout="vertical" margin={{ left: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="feature" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="importance" fill="#3b82f6" /> {/* Tailwind blue-600 */}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500">Loading feature importance...</p>
      )}
    </div>
  );
}

export default FeatureImportanceChart;
