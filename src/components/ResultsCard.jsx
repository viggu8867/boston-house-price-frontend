import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function ResultsCard({ result }) {
  if (!result || !result.predictions) return null;

  const predictions = result.predictions;

  // Always prepare chart data (at least 2 bars if only 1 prediction)
  let chartData = predictions.map((price, idx) => ({
    house: `House ${idx + 1}`,
    price: price.toFixed(2),
  }));

  if (predictions.length === 1) {
    chartData.push({ house: "House 2", price: 0 }); // dummy bar for balance
  }

  // --- Download predictions as CSV ---
  const handleDownloadCSV = () => {
    const rows = [["House", "Predicted Price"]];
    predictions.forEach((p, idx) => {
      rows.push([`House ${idx + 1}`, p.toFixed(2)]);
    });

    const csvContent = rows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "predictions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 shadow-lg rounded-lg p-6 text-left">
      <h2 className="text-2xl font-bold mb-4">🔮 Prediction Results</h2>

      <p className="mb-2 font-medium">
        Predicted Prices for {predictions.length} House
        {predictions.length > 1 ? "s" : ""}:
      </p>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="house" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="price" fill="#3b82f6" barSize={40} />
        </BarChart>
      </ResponsiveContainer>

      {/* Single prediction display */}
      {predictions.length === 1 && (
        <p className="mt-4 text-lg">
          Predicted House Price:{" "}
          <span className="font-semibold text-green-600 dark:text-green-400">
            {predictions[0].toFixed(2)} (in $1000s)
          </span>
        </p>
      )}

      {/* Summary stats for multiple houses */}
      {predictions.length > 1 && (
        <div className="mt-4 bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">📊 Summary Statistics</h3>
          <p>
            Minimum Price:{" "}
            <span className="font-medium">
              {Math.min(...predictions).toFixed(2)}
            </span>
          </p>
          <p>
            Maximum Price:{" "}
            <span className="font-medium">
              {Math.max(...predictions).toFixed(2)}
            </span>
          </p>
          <p>
            Average Price:{" "}
            <span className="font-medium">
              {(
                predictions.reduce((a, b) => a + b, 0) / predictions.length
              ).toFixed(2)}
            </span>
          </p>
        </div>
      )}

      {/* Download button */}
      <button
        onClick={handleDownloadCSV}
        className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
      >
        📥 Download Predictions as CSV
      </button>
    </div>
  );
}

export default ResultsCard;
