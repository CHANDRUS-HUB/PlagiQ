import { useState } from "react";
import FileUploader from "../components/ui/FileUploader";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PlagiarismCheck() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCheck = async () => {
    if (!file) {
      setError("Please upload a file first");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:7000/api/check-plagiarism", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error during plagiarism check");
        setLoading(false);
        return;
      }

      setResult({
        fileName: data.fileName,
        date: data.date,
        percentage: data.percentage,
        question_count: data.question_count,
        total_duplicates: data.total_duplicates,
        duplicates: data.duplicates,
      });
    } catch (error) {
      console.error("Error during plagiarism check:", error);
      setError("Error during plagiarism check");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 px-4">
      <h1 className="text-4xl font-bold text-center mb-10 mt-2 text-gray-800">
        Single File Plagiarism Check
      </h1>

      <div className="flex flex-col items-center gap-6 max-w-xl mx-auto mb-8">
        <FileUploader label="Upload Question Bank" onUpload={setFile} />
        <Button
          onClick={handleCheck}
          className="bg-indigo-600 mt-5 hover:bg-indigo-700 text-white px-5 py-2 text-lg rounded-xl shadow-lg transition"
          disabled={!file || loading}
        >
          {loading ? "Checking..." : "Check Plagiarism"}
        </Button>
        {error && (
          <p className="text-red-600 mt-4 text-center font-semibold">{error}</p>
        )}
      </div>

      {result && (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Plagiarism Report
          </h2>

          <div className="grid md:grid-cols-2 gap-4 text-gray-700 mb-6">
            <p><strong>File Name:</strong> {result.fileName}</p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(result.date).toLocaleDateString()}
            </p>
            <p><strong>Plagiarism Match:</strong> <span className="text-indigo-600 font-bold">{result.percentage}%</span></p>
            <p><strong>Status:</strong> {result.percentage > 30 ? "High Risk" : "Low Risk"}</p>
          </div>

          {result.duplicates && result.duplicates.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Detected Duplicate Questions:
              </h3>
              <ul className="space-y-4">
                {result.duplicates.map((q, i) => (
                  <li key={i} className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                    <p><strong>Question 1:</strong> {q.q1}</p>
                    <p><strong>Question 2:</strong> {q.q2}</p>
                    <p>
                      <strong>Similarity Score:</strong>{" "}
                      <span className={q.score > 0.8 ? "text-red-600 font-bold" : "text-green-600"}>
                        {q.score}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No duplicates detected</h3>
            </div>
          )}

          <div className="mt-6 text-center">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
