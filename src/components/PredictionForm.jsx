import { useState } from "react";

export default function PredictionForm({ onResult }) {
  const [formData, setFormData] = useState({
    CRIM: "", ZN: "", INDUS: "", CHAS: "", NOX: "", RM: "",
    AGE: "", DIS: "", RAD: "", TAX: "", PTRATIO: "", B: "", LSTAT: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("https://boston-house-price-backend.onrender.com/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    onResult(data);
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
        className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded mt-4"
      >
        Predict
      </button>
    </form>
  );
}
