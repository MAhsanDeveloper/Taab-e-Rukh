import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, loading } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login(email, password);

      if (user?.role === "admin") {
        setError("Admin users cannot log in from this page.");
        return;
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="py-10 px-4 md:px-8 lg:px-16 max-w-screen-md mx-auto">
      <motion.div
        className="bg-white p-8 lg:p-12 rounded-2xl shadow-md border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Login to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-2 font-medium">Email Address</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="h-5 w-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-2 font-medium">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="h-5 w-5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 py-3 px-4 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? <Loader className="animate-spin h-5 w-5" /> : <LogIn className="h-5 w-5" />}
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Not a member?{" "}
          <Link
            to="/signup"
            className="font-medium text-emerald-600 hover:text-emerald-500 flex items-center justify-center gap-1"
          >
            Sign up now <ArrowRight className="h-4 w-4" />
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
