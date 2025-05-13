import { useEffect, useState } from "react";
import { Upload } from "lucide-react";

export default function FileUploader({ label, onUpload }) {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onUpload(file);
    }
  };

  useEffect(() => {
    // Reset file name when component remounts due to key change
    setFileName("");
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto text-center">
      <label className="block mb-4 text-gray-700 text-lg font-semibold">
        {label}
      </label>

      <div className="border-2 border-dashed border-gray-400 rounded-lg p-8 bg-white flex flex-col items-center justify-center space-y-4">
        <Upload className="w-8 h-8 text-gray-500" />
        <p className="text-gray-600 text-sm">Drag and drop a file here, or</p>
        <label className="relative inline-block cursor-pointer">
          <input
            type="file"
           accept=".txt, .pdf, .docx, .doc"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <span className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition">
            Choose Files
          </span>
        </label>
        {fileName && (
          <p className="text-sm text-gray-500 truncate font-semibold">
            Selected: <span className="font-bold">{fileName}</span>
          </p>
        )}
      </div>
    </div>
  );
}
