import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import img1 from "../assets/img1.jpg";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Dialog } from "@headlessui/react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [otpEmail, setOtpEmail] = useState("");
  const [otpUsername, setOtpUsername] = useState("");
  const [otpPassword, setOtpPassword] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleOtpChange = (e, index) => {
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
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:7000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("OTP sent to your email");
        setOtpEmail(formData.email);
        setOtpUsername(formData.name);
        setOtpPassword(formData.password);
        setIsOtpModalOpen(true);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong.");
    }
  };

  const handleSubmitOtp = async () => {
    setLoading(true);
    const otpString = otp.join("");
    try {
      const response = await fetch("http://localhost:7000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: otpUsername,
          email: otpEmail,
          otp: otpString,
          password: otpPassword,
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("OTP Verified! Account created.");
        setIsOtpModalOpen(false);
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
        body: JSON.stringify({
          email: otpEmail,
          username: otpUsername,
          password: otpPassword,
        }),
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl flex w-[940px]">
        <div className="hidden md:block w-1/2">
          <img
            src={img1}
            alt="Signup Illustration"
            className="rounded-3xl object-cover h-full w-full"
          />
        </div>
        <div className="w-full md:w-1/2 p-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-4xl font-extrabold text-center text-gray-800">
                Create Your Account
              </CardTitle>
              <p className="text-center text-gray-500 mt-2 text-sm">
                Join us and explore the endless possibilities!
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="name" className="text-gray-700 font-medium">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />
                </div>

                <div className="relative">
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[40px] text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <div className="relative">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-[40px] text-gray-500"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-3 rounded-lg">
                  Sign Up
                </Button>
              </form>
              <p className="text-center text-gray-600 mt-6 text-sm">
                Already have an account?{" "}
                <a href="/signin" className="text-blue-600 hover:underline font-medium">
                  Log in
                </a>
              </p>
            </CardContent>
          </Card>

          {/* OTP Modal */}
          <Dialog open={isOtpModalOpen} onClose={() => setIsOtpModalOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4 bg-black bg-opacity-50">
              <Dialog.Panel className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-6">
                <Dialog.Title className="text-2xl font-bold text-center">Verify OTP</Dialog.Title>
                <p className="text-center text-gray-600 text-sm">Sent to: <strong>{otpEmail}</strong></p>

                <div className="flex justify-between space-x-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(e, index)}
                      maxLength="1"
                      className="w-14 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      ref={(el) => (inputRefs.current[index] = el)}
                    />
                  ))}
                </div>

                <Button
                  type="button"
                  onClick={handleSubmitOtp}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendLoading}
                    className="text-blue-600 hover:text-blue-700 underline font-medium"
                  >
                    {resendLoading ? "Resending..." : "Resend OTP"}
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
