import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import img2 from "../assets/img2.jpg";
import { useAuth } from "../components/Authcontext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:7000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        toast.error(data.message || "Login failed");
      } else {
        toast.success("Login successful!");
        await checkAuth();

        if (data.user?.role === "admin") {
          navigate("/AdminStats");
        } else {
          navigate("/dashboard");
        }
      }

    } catch (err) {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-gray-100">
      <div className="bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl flex w-[900px]">
        {/* Left Image Section */}
        <div className="hidden md:block w-1/2">
          <img
            src={img2}
            alt="Login Illustration"
            className="rounded-3xl object-cover h-full w-full"
          />
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 px-6">
          <Card className="bg-transparent shadow-none">
            <CardHeader>
              <CardTitle className="text-4xl font-extrabold text-center text-gray-800">
                Welcome Back
              </CardTitle>
              <p className="text-center text-gray-500 mt-2 text-sm">
                Log in to continue your journey!
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleLogin}>
                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="mt-1 pr-10 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300"
                >
                  Log In
                </Button>
              </form>

              {/* Links */}
              <p className="text-center text-gray-600 mt-4 text-sm">
                <a href="/forgot-password" className="text-blue-600 hover:underline font-medium">
                  Forgot your password?
                </a>
              </p>

              <p className="text-center text-gray-600 mt-6 text-sm">
                Don’t have an account?{" "}
                <a href="/signup" className="text-blue-600 hover:underline font-medium">
                  Sign up
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
