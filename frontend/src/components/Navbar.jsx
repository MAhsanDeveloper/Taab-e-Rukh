import { useState, useEffect } from "react";
import { ShoppingCart, User, Search, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { MessageCircle } from "lucide-react";
import logo from "../assets/logo.webp";

const Navbar = () => {
  const { user } = useUserStore();
  const { cart } = useCartStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { name: "Hair Care", path: "/category/hair-care" },
    { name: "Skin Care", path: "/category/skin-care" },
    { name: "Face & Glow", path: "/category/face-glow" },
    { name: "Body & Baby", path: "/category/body-baby" },
  ];

  const handleSearch = () => {
    navigate("/search");
  };

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 w-full bg-black shadow-md z-50">
      <div className="flex justify-between items-center w-full px-4 sm:px-6 md:px-12 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 bg-white rounded-full p-1"
        >
          <img src={logo} alt="Taab e Rukh" className="h-11 w-auto" />
        </Link>

        {/* Desktop Categories */}
        <nav className="hidden md:flex gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="px-3 py-2 text-white font-medium rounded-2xl transition-all duration-300 border border-transparent hover:bg-white hover:text-black hover:border-black"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button onClick={handleSearch} className="p-2 rounded-md text-white">
            <Search size={20} />
          </button>

          {/* Hide user icon on mobile */}
          <Link
            to={user ? "/profile" : "/login"}
            className="p-2 rounded-md text-white hidden md:inline-flex"
          >
            <User size={20} />
          </Link>

          <Link
            to="/cart"
            className="relative flex items-center px-2 sm:px-3 py-2 rounded-md text-white transition-all duration-300"
          >
            <ShoppingCart size={20} className="mr-1" />
            <span className="hidden sm:inline">Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -left-2 bg-red-600 text-white rounded-full px-2 py-0.5 text-xs">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobileMenu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed top-0 left-0 w-full h-screen bg-black z-50 overflow-y-auto"
          >
            <div className="pt-[72px] px-4 py-4 flex flex-col gap-3">
              {/* Categories */}
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={cat.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-white font-medium rounded-lg hover:bg-white hover:text-black transition"
                >
                  {cat.name}
                </Link>
              ))}

              {/* User Account */}
              <Link
                to={user ? "/profile" : "/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-white font-medium rounded-lg hover:bg-white hover:text-black transition"
              >
                {user ? "Profile" : "Login / Signup"}
              </Link>

              {/* Social Links */}
              <div className="flex justify-start space-x-4 mt-2">
                <a href="#" className="text-white hover:text-blue-500 transition">
                  <FaFacebook />
                </a>
                <a href="#" className="text-white hover:text-pink-500 transition">
                  <FaInstagram />
                </a>
                <a href="#" className="text-white hover:text-red-500 transition">
                  <FaYoutube />
                </a>
                <a href="#" className="text-white hover:text-gray-300 transition">
                  <FaTiktok />
                </a>
                <a href="#" className="text-white hover:text-green-500 transition">
                  <MessageCircle />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
