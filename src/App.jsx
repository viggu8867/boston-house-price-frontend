import { useState } from "react";
import ResultsCard from "./components/ResultsCard";


function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const handleUpload = async () => {
    setError(null);
    setResult(null);

    if (!file) {
      setError("⚠ Please upload a CSV file before predicting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://boston-house-price-backend.onrender.com/predict_csv", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("❌ Failed to get predictions. Check CSV format.");

      const data = await res.json();
      setResult(data);

      // Save to history (max 5)
      setHistory((prev) => [data, ...prev].slice(0, 5));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold mb-6">🏡 Boston House Price Predictor</h1>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-xl text-center">
        <p className="mb-4">
          Upload a CSV file with house features to get predictions 📂
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          🚀 Predict
        </button>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
            {error}
          </div>
        )}
      </div>

      {result && <ResultsCard result={result} />}

      {history.length > 1 && (
        <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow w-full max-w-xl text-left">
          <h3 className="font-semibold mb-2">🕒 Recent Predictions</h3>
          <ul className="list-disc list-inside">
            {history.map((h, idx) => (
              <li key={idx}>
                Run {idx + 1}: {h.predictions.length} house(s)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
