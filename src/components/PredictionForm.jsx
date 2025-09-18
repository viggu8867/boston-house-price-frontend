import { useState } from "react";

// ✅ API URL from .env
const API_URL = import.meta.env.VITE_API_URL;

export default function PredictionForm({ onResult }) {
  const [formData, setFormData] = useState({
    CRIM: "", ZN: "", INDUS: "", CHAS: "", NOX: "", RM: "",
    AGE: "", DIS: "", RAD: "", TAX: "", PTRATIO: "", B: "", LSTAT: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.error) {
        setError("❌ " + data.error);
      } else {
        onResult(data);
      }
    } catch (err) {
      setError("❌ Failed to get prediction. Please try again.");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-2 gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-3xl"
    >
      {Object.keys(formData).map((field) => (
        <div key={field} className="flex flex-col">
          <label className="text-sm font-semibold mb-1">{field}</label>
          <input
            type="number"
            step="any"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded mt-4 disabled:opacity-50"
      >
        {loading ? "⏳ Predicting..." : "Predict"}
      </button>

      {error && <p className="col-span-2 text-red-600 mt-3">{error}</p>}
    </form>
  );
}
