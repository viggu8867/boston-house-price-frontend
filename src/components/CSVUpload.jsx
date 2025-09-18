import { useState } from "react";

function CSVUpload({ onResult }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null); // reset error on new file
  };

  const handleUpload = async () => {
    if (!file) {
      setError("⚠️ Please select a CSV file first!");
      return;
    }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://boston-house-price-backend.onrender.com/predict_csv", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.error) {
        setError("❌ " + data.error);
      } else {
        onResult(data);
      }
    } catch (err) {
      setError("❌ Failed to upload CSV. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-4">📂 Upload CSV File</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4 block w-full text-sm text-gray-700 dark:text-gray-200"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {loading ? "⏳ Uploading..." : "🚀 Predict Prices"}
      </button>

      {/* Error Display */}
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
}

export default CSVUpload;
