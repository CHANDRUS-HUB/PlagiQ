import { useState, useRef} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "react-hot-toast";

export default function VerifyOtp() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [searchParams] = useSearchParams();
    // const email = searchParams.get("email");
    const navigate = useNavigate();
    const inputRefs = useRef([]);
    const email =
    location?.state?.email || searchParams.get("email"); // fallback to query param
  const username = location?.state?.username;
  const password = location?.state?.password;
    const handleChange = (e, index) => {
        const value = e.target.value;

        if (/[^0-9]/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const otpString = otp.join("");

        try {
            const response = await fetch("http://localhost:7000/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({username, email, otp: otpString,password }),
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("OTP Verified! Account created.");
                navigate("/signin");
            } else {
                toast.error(data.message || "OTP verification failed");
            }
        } catch (err) {
            toast.error("Error verifying OTP.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResendLoading(true);

        try {
            const response = await fetch("http://localhost:7000/resend-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("OTP resent successfully!");
            } else {
                toast.error(data.message || "Failed to resend OTP");
            }
        } catch (err) {
            toast.error("Error resending OTP.");
            console.error(err);
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-2xl space-y-6 w-full max-w-md"
            >
                <h2 className="text-3xl font-extrabold text-center text-gray-800">
                    Verify OTP
                </h2>
                <p className="text-center text-sm text-gray-600">
                    We sent an OTP to your email: <strong>{email}</strong>
                </p>

                <div className="flex justify-between space-x-2">
                    {otp.map((digit, index) => (
                        <Input
                            key={index}
                            type="text"
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            maxLength="1"
                            className="w-14 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            ref={(el) => (inputRefs.current[index] = el)}
                        />
                    ))}
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-300"
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </Button>

                <div className="text-center mt-4">
                    <Button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendLoading}
                        className="text-blue-600 hover:text-blue-700 underline font-medium transition duration-300"
                    >
                        {resendLoading ? "Resending..." : "Resend OTP"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
