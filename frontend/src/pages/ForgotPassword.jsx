import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:7000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message);
        setStep(2);
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:7000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message);
        setStep(1);
        setEmail("");
        setOtp("");
        setNewPassword("");
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-purple-200 via-pink-100 to-indigo-100 p-4">
      <Card className="w-full max-w-md rounded-3xl shadow-xl backdrop-blur bg-white/80 border border-white/30">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-3xl p-6">
          <CardTitle className="text-2xl font-bold text-center">
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {error && (
            <div className="text-sm bg-red-100 text-red-600 px-4 py-2 rounded-md border border-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm bg-green-100 text-green-700 px-4 py-2 rounded-md border border-green-200">
              {success}
            </div>
          )}

          {/* Step Indicator */}
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className={`h-2 w-10 rounded-full ${step === 1 ? "bg-indigo-500" : "bg-indigo-200"}`} />
            <div className={`h-2 w-10 rounded-full ${step === 2 ? "bg-indigo-500" : "bg-indigo-200"}`} />
          </div>

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <Button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow"
              >
                Request OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <Label htmlFor="otp" className="text-gray-700 font-medium">
                  OTP
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <Label htmlFor="newPassword" className="text-gray-700 font-medium">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <Button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow"
              >
                Reset Password
              </Button>
            </form>
          )}

          <div className="pt-4 text-center">
            <Link
              to="/signin"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
            >
              &larr; Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
