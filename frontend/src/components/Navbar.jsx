// Navbar.jsx
import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  MessageCircle,
  LogOut,
  RotateCcw 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import axios from "../lib/axios";
import logo from "../assets/logo.webp";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const { cart } = useCartStore();

  // data + UI state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const [contact, setContact] = useState({});
  const [loading, setLoading] = useState(true);

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);

  // bottom nav visibility and scroll detection
  const [showBottomNav, setShowBottomNav] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef(null);

  // topBar height to position drawer below it
  const topBarRef = useRef(null);
  const [topBarHeight, setTopBarHeight] = useState(64); // default

  const categories = [
    { name: "Hair Care", path: "/category/hair-care" },
    { name: "Skin Care", path: "/category/skin-care" },
    { name: "Face & Glow", path: "/category/face-glow" },
    { name: "Body & Baby", path: "/category/body-baby" },
  ];

  // --vh fix for mobile viewport units
  useEffect(() => {
    const setVh = () => {
      // Each unit of --vh is 1% of the viewport height
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  // measure topBar height
  useEffect(() => {
    const measure = () => {
      if (topBarRef.current) {
        const h = topBarRef.current.getBoundingClientRect().height;
        setTopBarHeight(Math.ceil(h));
      }
    };
    // run after render
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // fetch contact
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await axios.get(`/contact`);
        setContact(res.data || {});
      } catch (err) {
        console.error("Failed to fetch contact:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, []);

  // search debounce
  useEffect(() => {
    const fetchProducts = async () => {
      if (!query.trim()) {
        setResults([]);
        setLoadingResults(false);
        return;
      }
      setLoadingResults(true);
      try {
        const res = await axios.get(`/shop/search?query=${encodeURIComponent(query)}`);
        const data = Array.isArray(res.data) ? res.data : res.data.products || [];
        setResults(data);
      } catch (err) {
        console.error("Search failed:", err);
        setResults([]);
      } finally {
        setLoadingResults(false);
      }
    };
    const id = setTimeout(fetchProducts, 400);
    return () => clearTimeout(id);
  }, [query]);

  // lock body scroll when drawer open (but keep topbar visible)
  useEffect(() => {
    document.documentElement.style.overflow = mobileMenuOpen ? "hidden" : "";
    // on ios safari sometimes body overflow doesn't work fully; still helpful
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close search if clicked outside
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

  // Bottom nav scroll hide/show logic (mobile)
  useEffect(() => {
    // Only do mobile behavior - check window width on handler
    const onScroll = () => {
      const currentY = window.scrollY || window.pageYOffset;
      const isMobile = window.innerWidth < 768; // md breakpoint
      if (!isMobile) return;

      // Scrolling down -> hide, scrolling up -> show
      if (currentY > lastScrollY.current && currentY > 50) {
        // scrolling down
        setShowBottomNav(false);
      } else {
        // scrolling up or near top
        setShowBottomNav(true);
      }
      lastScrollY.current = currentY;

      // detect stop scrolling: show nav after small timeout
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setShowBottomNav(true);
      }, 200); // 200ms after user stops
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  // keyboard escape to close mobile drawer
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setSearchOpen(false);
        setDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Helper to close menu and reset states
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`${
          "md:sticky md:top-0 md:left-0 md:w-full md:z-50 md:shadow-md"
        } bg-white`}
        aria-label="Main navigation"
      >
        {/* Top bar content: on mobile a compact bar with menu-left, logo-center, icons-right */}
        <div
          ref={topBarRef}
          className="flex items-center justify-between px-4 sm:px-6 md:px-12 py-3"
        >
          {/* Left: hamburger (mobile) / logo (desktop) */}
          <div className="flex items-center gap-2">
            {/* Mobile hamburger - visible on md:hidden */}
            <button
              onClick={() => setMobileMenuOpen((s) => !s)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="md:hidden p-2 text-black"
            >
              {/* If mobileMenuOpen show X on top-left as well (but requirement said cross should be there even with menu) */}
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Desktop: logo left */}
            <Link to="/" className="hidden md:flex items-center" aria-label="home">
              <img src={logo} alt="Taab e Rukh" className="h-14 w-auto" />
            </Link>
          </div>

          
        {/* Desktop categories nav (kept as before) */}
        <nav className="hidden md:flex gap-4 items-center justify-center bg-white px-12 pt-0">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="px-3 py-2 text-black font-medium rounded-2xl transition-all duration-300 border border-transparent hover:bg-black hover:text-white hover:border-black"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

          {/* Center: Mobile logo centered, Desktop hidden */}
          <div className="flex-1 flex items-center justify-center md:hidden">
            <Link to="/" className="flex items-center" aria-label="home">
              <img src={logo} alt="Taab e Rukh" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Right side icons (search, user, cart) - visible both mobile & desktop */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setSearchOpen((s) => !s)}
                className="p-2 rounded-md text-black"
                aria-expanded={searchOpen ? "true" : "false"}
                aria-label="Toggle search"
              >
                {searchOpen ? <X size={20} /> : <Search size={20} />}
              </button>

              {searchOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 md:w-80 bg-white shadow-lg rounded-md p-3 z-50"
                  role="dialog"
                  aria-label="Product search"
                >
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md outline-none"
                    autoFocus
                  />
                  <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                    {loadingResults ? (
                      <p className="text-sm text-gray-400 px-3">Searching...</p>
                    ) : query ? (
                      results.length > 0 ? (
                        results.map((product) => (
                          <Link
                            key={product._id}
                            to={`/item/${product._id}`}
                            onClick={() => {
                              setSearchOpen(false);
                              setQuery("");
                            }}
                            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
                          >
                            <img
                              src={product.mainImage}
                              alt={product.name}
                              className="h-8 w-8 rounded object-cover"
                            />
                            <span>{product.name}</span>
                          </Link>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 px-3">
                          No products found
                        </p>
                      )
                    ) : (
                      <p className="text-sm text-gray-400 px-3">Type to search...</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User / Profile */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((s) => !s)}
                  className="p-2 rounded-md cursor-pointer text-black"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen ? "true" : "false"}
                >
                  <User size={20} />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 bg-white shadow-md rounded-md w-36 z-50"
                    role="menu"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        toast.success("Logged out successfully");
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <LogOut size={16} className="inline mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="p-2 rounded-md text-black" aria-label="login">
                <User size={20} />
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center px-2 sm:px-3 py-2 rounded-md text-black transition-all duration-300"
              aria-label="cart"
            >
              <ShoppingCart size={20} className="mr-1" />
              <span className="hidden sm:inline">Cart</span>
              {cart && cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-600 text-white rounded-full px-2 py-0.5 text-xs">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>

      </header>

      {/* LEFT-SIDE MOBILE DRAWER (opens below topBar). Visible only on small screens */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-black z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* drawer */}
            <motion.aside
              key="mobile-drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              className="fixed left-0 md:hidden z-50"
              style={{
                // compute top using measured topBarHeight
                top: `${topBarHeight}px`,
                // height: viewport height minus top bar
                height: `calc(var(--vh, 1vh) * 100 - ${topBarHeight}px)`,
                width: "min(86vw, 360px)",
                background: "white",
                boxShadow: "2px 0 18px rgba(0,0,0,0.12)",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
                overflowY: "auto",
              }}
              role="dialog"
              aria-label="Mobile menu"
            >
              <div className="px-5 py-6">
                {/* Optional top of drawer, can include a small logo/title */}
                <div className="flex items-center justify-between mb-4">
                  <Link to="/" onClick={closeMobileMenu} className="flex items-center">
                    <img src={logo} alt="Taab e Rukh" className="h-10 w-auto" />
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                    className="p-2 text-black"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Categories and links */}
                <div className="flex flex-col space-y-4">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      to={cat.path}
                      onClick={closeMobileMenu}
                      className="block font-semibold text-black text-lg"
                    >
                      {cat.name}
                    </Link>
                  ))}

                  <Link
                    to="/contact-us"
                    onClick={closeMobileMenu}
                    className="block font-semibold text-black text-lg"
                  >
                    Contact
                  </Link>
                </div>

                {/* Spacer */}
                <div className="my-6 border-t pt-6 border-gray-100">
                  {!loading && (
                    <div className="flex items-center gap-3">
                      <Link
                        to={user ? "/profile" : "/login"}
                        onClick={closeMobileMenu}
                        className="px-4 py-2 rounded-full bg-black text-white"
                      >
                        {user ? "Profile" : "Login / Signup"}
                      </Link>

                      <div className="flex items-center gap-3 text-xl">
                        {contact.facebook && (
                          <a href={contact.facebook} target="_blank" rel="noreferrer">
                            <FaFacebook />
                          </a>
                        )}
                        {contact.instagram && (
                          <a href={contact.instagram} target="_blank" rel="noreferrer">
                            <FaInstagram />
                          </a>
                        )}
                        {contact.youtube && (
                          <a href={contact.youtube} target="_blank" rel="noreferrer">
                            <FaYoutube />
                          </a>
                        )}
                        {contact.tiktok && (
                          <a href={contact.tiktok} target="_blank" rel="noreferrer">
                            <FaTiktok />
                          </a>
                        )}
                        {contact.whatsapp && (
                          <a
                            href={`https://wa.me/${contact.whatsapp}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <MessageCircle />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>



    {/* MOBILE BOTTOM NAVBAR (shows/hides on scroll) */}
<div
  className="md:hidden fixed left-0 right-0 z-40 flex justify-center"
  style={{ bottom: 0, pointerEvents: "auto" }}
  aria-hidden={false}
>
  <motion.nav
    initial={{ y: 0 }}
    animate={{ y: showBottomNav ? 0 : 100 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    className="mx-4 mb-4 w-[calc(100%-2rem)] bg-white rounded-2xl shadow-lg flex justify-around px-6 py-3"
    role="navigation"
    aria-label="Mobile bottom navigation"
  >

    {/* Profile */}
    <Link to={user ? "/profile" : "/login"} className="flex flex-col items-center gap-1" aria-label="Profile">
      <User size={22} />
      <span className="text-[11px] text-gray-600">{user ? "Profile" : "Login"}</span>
    </Link>

      {/* Cart */}
    <Link to="/cart" className="flex flex-col items-center gap-1" aria-label="Cart">
      <div className="relative">
        <ShoppingCart size={22} />
        {cart && cart.length > 0 && (
          <span className="absolute -top-1 -right-2 bg-emerald-600 text-white rounded-full px-1 py-0.5 text-[10px]">
            {cart.length}
          </span>
        )}
      </div>
      <span className="text-[11px] text-gray-600">Cart</span>
    </Link>

    {/* Return Policy */}
    <Link to="/return-refund-policy" className="flex flex-col items-center gap-1" aria-label="Return Policy">
      <RotateCcw size={22} />
      <span className="text-[11px] text-gray-600">Returns</span>
    </Link>
  </motion.nav>
</div>

    </>
  );
};

export default Navbar;
