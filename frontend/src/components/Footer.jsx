import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { MessageCircle, MapPin, Phone, Mail, Send, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const Footer = () => {
  const [contact, setContact] = useState({});
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [quickLinksOpen, setQuickLinksOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const categories = [
    { name: "Hair Care", path: "/category/hair-care" },
    { name: "Skin Care", path: "/category/skin-care" },
    { name: "Face & Glow", path: "/category/face-glow" },
    { name: "Body & Baby", path: "/category/body-baby" },
  ];

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

  const handleSubscribe = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setMessage("❌ Please enter a valid email address");
      return;
    }

    setMessage("Thanks For Subscribing!");
    setEmail("");
  };

  return (
    <footer className="bg-black text-white px-6 py-12 md:px-20 mt-12">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-14"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src="/logo.webp"
            alt="Taab e Rukh"
            className="h-24 md:h-28 mb-6 bg-white rounded-full"
          />
          {!loading && (
            <div className="mt-4 md:mt-6 text-gray-300 space-y-2 md:space-y-3 text-sm md:text-base">
              {contact.phone && (
                <p className="flex items-center gap-2">
                  <Phone size={16} />
                  <a href={`tel:${contact.phone}`} className="hover:text-white hover:underline underline-offset-4 transition">
                    {contact.phone}
                  </a>
                </p>
              )}
              {contact.email && (
                <p className="flex items-center gap-2">
                  <Mail size={16} />
                  <a href={`mailto:${contact.email}`} className="hover:text-white hover:underline underline-offset-4 transition">
                    {contact.email}
                  </a>
                </p>
              )}
              {contact.address && (
                <p className="flex items-center gap-2">
                  <MapPin size={16} /> {contact.address}
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3
            className="font-bold text-xl mb-3 flex justify-between items-center md:block cursor-pointer md:cursor-auto"
            onClick={() => setQuickLinksOpen(!quickLinksOpen)}
          >
            Quick Links
            <span className="md:hidden">
              {quickLinksOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </span>
          </h3>
          <ul className={`space-y-2 text-gray-300 text-sm md:text-base md:space-y-2 ${quickLinksOpen ? "block" : "hidden md:block"}`}>
            <li><Link to="/" className="hover:text-white hover:underline underline-offset-4 transition">Home</Link></li>
            <li><Link to="/all-products" className="hover:text-white hover:underline underline-offset-4 transition">All Products</Link></li>
            {categories.map((cat) => (
              <li key={cat.name}>
                <Link to={cat.path} className="hover:text-white hover:underline underline-offset-4 transition">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Information */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3
            className="font-bold text-xl mb-3 flex justify-between items-center md:block cursor-pointer md:cursor-auto"
            onClick={() => setInfoOpen(!infoOpen)}
          >
            Information
            <span className="md:hidden">
              {infoOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </span>
          </h3>
          <ul className={`space-y-2 text-gray-300 text-sm md:text-base md:space-y-3 ${infoOpen ? "block" : "hidden md:block"}`}>
            <li><Link to="/privacy-policy" className="hover:text-white hover:underline underline-offset-4 transition">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className="hover:text-white hover:underline underline-offset-4 transition">Terms of Service</Link></li>
            <li><Link to="/refund-return-policy" className="hover:text-white hover:underline underline-offset-4 transition">Refund & Returns Policy</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-white hover:underline underline-offset-4 transition">Shipping Policy</Link></li>
            <li><Link to="/contact-us" className="hover:text-white hover:underline underline-offset-4 transition">Contact Us</Link></li>
          </ul>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col"
        >
          <div className="border-b border-gray-700 pb-4 mb-4">
            <h3 className="font-bold text-xl">Stay in the loop</h3>
            <p className="text-gray-400 text-sm mt-1">Get exclusive deals & product launches.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center bg-gray-100 rounded-lg overflow-hidden shadow-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 text-black focus:outline-none text-sm sm:text-base"
            />
            <button
              type="submit"
              className="bg-gray-100 text-black rounded-full px-4 py-2 sm:py-2 hover:bg-green-500 flex items-center justify-center gap-2 w-full sm:w-auto transition font-semibold mt-2 sm:mt-0"
            >
              <Send size={14} />
            </button>
          </form>
          {message && (
            <p className={`mt-2 text-sm px-3 py-2 rounded-md transition-all ${message.includes("Thanks") ? "text-green-400 bg-white/20" : "text-red-400 bg-white/10"} flex items-center gap-2`}>
              {message.includes("Thanks") && <CheckCircle size={16} />}
              {message}
            </p>
          )}

          {/* Social Links */}
          <div className="flex space-x-4 mt-4 text-xl sm:text-2xl">
            {contact.facebook && <a href={contact.facebook} target="_blank" rel="noreferrer" className="hover:scale-110 transition cursor-pointer"><FaFacebook className="hover:text-blue-500 transition" /></a>}
            {contact.instagram && <a href={contact.instagram} target="_blank" rel="noreferrer" className="hover:scale-110 transition cursor-pointer"><FaInstagram className="hover:text-pink-500 transition" /></a>}
            {contact.youtube && <a href={contact.youtube} target="_blank" rel="noreferrer" className="hover:scale-110 transition cursor-pointer"><FaYoutube className="hover:text-red-500 transition" /></a>}
            {contact.tiktok && <a href={contact.tiktok} target="_blank" rel="noreferrer" className="hover:scale-110 transition cursor-pointer"><FaTiktok className="hover:text-gray-300 transition" /></a>}
            {contact.whatsapp && <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" className="hover:scale-110 transition cursor-pointer"><MessageCircle className="hover:text-green-500 transition" /></a>}
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
