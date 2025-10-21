import React, { useState, type FormEvent, type JSX } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../redux/store";
import { loginUser } from "../../redux/resources/auth/authSlice";
import type { LoginType } from "../../interface";
import { useNavigate } from "react-router-dom";

export default function AuthPage(): JSX.Element {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!isLogin && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      if (isLogin) {
        const payload: LoginType = {
          email: form.email,
          password: form.password,
        };

        // ✅ Dispatch login thunk
        const resultAction = await dispatch(loginUser(payload));

        if (loginUser.fulfilled.match(resultAction)) {
          navigate("/");
          return;
        } else {
          setError("Invalid credentials. Please try again.");
        }
      } else {
        // 🔹 Handle registration manually (or use a Redux thunk if you have one)
        const response = await axios.post("/api/auth/register", {
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
        });

        if (response.status === 201 || response.status === 200) {
          alert("Registration successful! Please log in.");
          setIsLogin(true);
          setForm({ email: "", password: "", confirmPassword: "" });
        }
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "An error occurred.");
      } else {
        setError("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-2">
            TJ
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isLogin
              ? "Sign in to your trading journal"
              : "Start your trading journey today"}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-3 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white shadow transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Please wait…" : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? (
            <p>
              Don’t have an account?{" "}
              <button
                onClick={toggleMode}
                className="text-indigo-600 hover:underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={toggleMode}
                className="text-indigo-600 hover:underline"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
