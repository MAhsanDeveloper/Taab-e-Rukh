import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { trackEvent } from "../lib/analytics";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const Footer = () => {
  const [contact, setContact] = useState({});
  const [loading, setLoading] = useState(true);

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

  const handleSocialClick = (platform, url) => {
  trackEvent({
    action: "social_click",
    category: "footer",
    label: platform,
    value: url
  });
};

  return (
    <footer className="bg-black text-white mb-8 px-6 py-12 md:px-20 mt-12">
   <motion.div
  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-14"
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
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
                  <a
                    href={`tel:${contact.phone}`}
                    className="hover:text-white hover:underline underline-offset-4 transition"
                  >
                    {contact.phone}
                  </a>
                </p>
              )}
              {contact.email && (
                <p className="flex items-center gap-2">
                  <Mail size={16} />
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:text-white hover:underline underline-offset-4 transition"
                  >
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
              {quickLinksOpen ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </span>
          </h3>
          <ul
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              quickLinksOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            } space-y-2 text-gray-300 text-sm md:text-base md:space-y-2 md:max-h-none md:opacity-100`}
          >
            <li>
              <Link
                to="/"
                className="hover:text-white hover:underline underline-offset-4 transition"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/all-products"
                className="hover:text-white hover:underline underline-offset-4 transition"
              >
                All Products
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.name}>
                <Link
                  to={cat.path}
                  className="hover:text-white hover:underline underline-offset-4 transition"
                >
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
          <ul
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              infoOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            } space-y-2 text-gray-300 text-sm md:text-base md:space-y-3 md:max-h-none md:opacity-100`}
          >
            <li>
              <Link
                to="/privacy-policy"
                className="hover:text-white hover:underline underline-offset-4 transition"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/terms-of-service"
                className="hover:text-white hover:underline underline-offset-4 transition"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                to="/return-refund-policy"
                className="hover:text-white hover:underline underline-offset-4 transition"
              >
                Refund & Returns Policy
              </Link>
            </li>
            <li>
              <Link
                to="/shipping-policy"
                className="hover:text-white hover:underline underline-offset-4 transition"
              >
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link
                to="/contact-us"
                className="hover:text-white hover:underline underline-offset-4 transition"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col"
        >

          {/* Social Links */}
          <div className="flex justify-around sm:justify-start sm:space-x-7 mt-4 text-xl sm:text-2xl w-full">
            {contact.facebook && (
              <a
                href={contact.facebook}
                target="_blank"
                rel="noreferrer"
                  onClick={() => handleSocialClick("Facebook", contact.facebook)}
                className="hover:scale-110 transition cursor-pointer"
              >
                <FaFacebook className="hover:text-blue-500 transition" />
              </a>
            )}
            {contact.instagram && (
              <a
                href={contact.instagram}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleSocialClick("Instagram", contact.instagram)}
                className="hover:scale-110 transition cursor-pointer"
              >
                <FaInstagram className="hover:text-pink-500 transition" />
              </a>
            )}
            {contact.youtube && (
              <a
                href={contact.youtube}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleSocialClick("YouTube", contact.youtube)}
                className="hover:scale-110 transition cursor-pointer"
              >
                <FaYoutube className="hover:text-red-500 transition" />
              </a>
            )}
            {contact.tiktok && (
              <a
                href={contact.tiktok}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleSocialClick("TikTok", contact.tiktok)}
                className="hover:scale-110 transition cursor-pointer"
              >
                <FaTiktok className="hover:text-gray-300 transition" />
              </a>
            )}
            {contact.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="hover:scale-110 transition cursor-pointer"
              >
                <MessageCircle className="hover:text-green-500 transition" />
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
