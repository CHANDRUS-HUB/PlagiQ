import { useState } from "react";
import axios from "axios";
import FileUploader from "../components/ui/FileUploader";
import ResultChart from "../components/ui/ResultChart";
import { Loader2 } from "lucide-react";

export default function Compare() {
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [keyA, setKeyA] = useState(0);
  const [keyB, setKeyB] = useState(0);

  const handleCompare = async () => {
    if (!fileA || !fileB) {
      setError("Please upload both files.");
      return;
    }

    if (fileA.name === fileB.name && fileA.lastModified === fileB.lastModified) {
      setError("Please upload two different files for comparison.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const formData = new FormData();
      formData.append("fileA", fileA);
      formData.append("fileB", fileB);

      const response = await axios.post("http://localhost:7000/api/compare", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      const similarity = response.data.similarity;
      setResult(similarity);
    } catch (err) {
      console.error("Comparison failed:", err);
      if (err.response && err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to compare files.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFileA(null);
    setFileB(null);
    setResult(null);
    setError("");
    setLoading(false);
    setKeyA(prev => prev + 1);
    setKeyB(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-12 px-4">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800 drop-shadow-md">
        Question File Comparison
      </h1>

      <div className="flex flex-col md:flex-row gap-4 justify-center items-start mb-10">
        <FileUploader key={keyA} label="Upload File A" onUpload={setFileA} closeOnUpload />
        <FileUploader key={keyB} label="Upload File B" onUpload={setFileB} closeOnUpload />
      </div>

      <div className="text-center space-x-4">
        <button
          onClick={handleCompare}
          disabled={loading || !fileA || !fileB}
          className={`${
            loading || !fileA || !fileB
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          } text-white px-6 py-3 rounded-xl text-lg shadow-lg transition inline-flex items-center`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              Comparing...
            </>
          ) : (
            "Compare Files"
          )}
        </button>

        <button
          onClick={handleReset}
          className="bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-gray-800 px-5 py-3 rounded-xl text-lg shadow transition"
        >
          Reset
        </button>
      </div>

      {error && <p className="text-red-600 mt-4 text-center font-semibold">{error}</p>}

      {result !== null && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6 drop-shadow-sm">
            Plagiarism Score:{" "}
            <span className="text-indigo-600 font-bold">{result}%</span>
          </h2>
          <ResultChart percentage={result} />
        </div>
      )}
    </div>
  );
}
