import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import axios from "axios";
import logo from "../assets/logo.webp";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const Navbar = () => {
  const { user } = useUserStore();
  const { cart } = useCartStore();
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);

  const [contact, setContact] = useState({});
  const [loading, setLoading] = useState(true);

  // ✅ Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const categories = [
    { name: "Hair Care", path: "/category/hair-care" },
    { name: "Skin Care", path: "/category/skin-care" },
    { name: "Face & Glow", path: "/category/face-glow" },
    { name: "Body & Baby", path: "/category/body-baby" },
  ];

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(query.toLowerCase())
  );

  const fetchContact = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/contact`);
      setContact(res.data || {});
    } catch (err) {
      console.error("Failed to fetch contact:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
  }, [mobileMenuOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    }
    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchOpen]);

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
        <div className="flex items-center gap-3 relative">
          {/* ✅ Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-md text-white cursor-pointer"
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>

          {/* ✅ Search Dropdown */}
          {searchOpen && (
            <div
              ref={searchRef}
              className="absolute top-12 right-0 w-64 bg-white  cursor-pointer shadow-lg rounded-md p-3 z-50"
            >
              <input
                type="text"
                placeholder="Search categories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-3 py-2 border rounded-md outline-none text-black"
              />

              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                {query ? (
                  filteredCategories.length > 0 ? (
                    filteredCategories.map((cat) => (
                      <Link
                        key={cat.name}
                        to={cat.path}
                        onClick={() => {
                          setSearchOpen(false);
                          setQuery("");
                        }}
                        className="block px-3 py-2 rounded hover:bg-gray-100 text-black"
                      >
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 px-3">
                      No results found
                    </p>
                  )
                ) : (
                  <p className="text-sm text-gray-400 px-3">
                    Type to search...
                  </p>
                )}
              </div>
            </div>
          )}

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
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="md:hidden fixed bottom-0 left-0 w-full h-[85vh] bg-white rounded-t-2xl rounded-tr-2xl text-gray-500 z-50 flex flex-col"
          >
            {/* Close Button + Logo */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-700">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <img src={logo} alt="Taab e Rukh" className="h-10 w-auto" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-black"
              >
                <X size={28} />
              </button>
            </div>

            {/* Categories */}
            <div className="flex-1 flex flex-col justify-start items-center px-6 py-6 space-y-6 text-lg">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={cat.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-semibold text-black hover:text-gray-300 transition-all duration-200"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Social Links */}
            {!loading && (
              <div className="flex justify-around items-center space-x-6 py-5 border-t border-gray-700">
                <Link
                  to={user ? "/profile" : "/login"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-semibold text-white bg-black px-4 py-2 rounded-full cursor-pointer hover:text-gray-300 transition-all duration-200"
                >
                  {user ? "Profile" : "Login / Signup"}
                </Link>

                {contact.facebook && (
                  <a href={contact.facebook} target="_blank" rel="noreferrer">
                    <FaFacebook
                      size={24}
                      className="hover:text-blue-500 transition"
                    />
                  </a>
                )}
                {contact.instagram && (
                  <a href={contact.instagram} target="_blank" rel="noreferrer">
                    <FaInstagram
                      size={24}
                      className="hover:text-pink-500 transition"
                    />
                  </a>
                )}
                {contact.youtube && (
                  <a href={contact.youtube} target="_blank" rel="noreferrer">
                    <FaYoutube
                      size={24}
                      className="hover:text-red-500 transition"
                    />
                  </a>
                )}
                {contact.tiktok && (
                  <a href={contact.tiktok} target="_blank" rel="noreferrer">
                    <FaTiktok
                      size={24}
                      className="hover:text-gray-300 transition"
                    />
                  </a>
                )}
                {contact.whatsapp && (
                  <a
                    href={`https://wa.me/${contact.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle
                      size={24}
                      className="hover:text-green-500 transition"
                    />
                  </a>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
