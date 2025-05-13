import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Layers, ShieldCheck } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col items-center justify-center px-6 py-16">
            
            <div className="max-w-4xl text-center animate-fade-in">
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 leading-tight mb-6">
                    Smart Plagiarism Detection
                </h1>
                <p className="text-gray-600 text-lg md:text-xl mb-8">
                    Detect duplicate or semantically similar questions using AI-powered analysis. Ensure content originality and maintain academic integrity.
                </p>
                <Link to="/signup">
                    <Button className="w-48 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-lg px-6 py-3 rounded-2xl shadow-lg transition-transform transform hover:scale-105 duration-300">
                        Get Started
                    </Button>
                </Link>
            </div>

            <div className="mt-20 max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="p-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md border hover:shadow-xl transition-transform transform hover:scale-105 duration-300">
                    <Sparkles className="mx-auto text-blue-600 mb-4" size={32} />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Semantic Matching</h3>
                    <p className="text-gray-600 text-sm">
                        Identify meaning-based similarities, not just exact matches.
                    </p>
                </div>
                <div className="p-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md border hover:shadow-xl transition-transform transform hover:scale-105 duration-300">
                    <Layers className="mx-auto text-blue-600 mb-4" size={32} />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Grouping & Tagging</h3>
                    <p className="text-gray-600 text-sm">
                        Group similar questions and classify duplicates by type.
                    </p>
                </div>
                <div className="p-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md border hover:shadow-xl transition-transform transform hover:scale-105 duration-300">
                    <ShieldCheck className="mx-auto text-blue-600 mb-4" size={32} />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure & Scalable</h3>
                    <p className="text-gray-600 text-sm">
                        Built using modern technologies like Node.js and React for fast, safe performance.
                    </p>
                </div>
            </div>
        </div>
    );
}
