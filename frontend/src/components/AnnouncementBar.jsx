import { useEffect, useState } from "react";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { MessageCircle } from "lucide-react";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const AnnouncementBar = () => {
  const messages = [
    "Opening discount upto 25% off",
    "Free shipping on order above Rs. 5000",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [contact, setContact] = useState({});
  const [loading, setLoading] = useState(true);

  // Rotate messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [messages.length]);

  // Fetch socials (same endpoint as footer)
  useEffect(() => {
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
    fetchContact();
  }, []);

  return (
    <div className="w-full bg-black text-white px-4 py-3 text-sm font-medium flex items-center justify-between md:px-10">
      {/* Left: Social Links */}
      <div className="flex space-x-6 text-lg items-center">
        {!loading && (
          <>
            {contact.facebook && (
              <a href={contact.facebook} target="_blank" rel="noreferrer">
                <FaFacebook className="hover:text-blue-500 transition" />
              </a>
            )}
            {contact.instagram && (
              <a href={contact.instagram} target="_blank" rel="noreferrer">
                <FaInstagram className="hover:text-pink-500 transition" />
              </a>
            )}
            {contact.youtube && (
              <a href={contact.youtube} target="_blank" rel="noreferrer">
                <FaYoutube className="hover:text-red-500 transition" />
              </a>
            )}
            {contact.tiktok && (
              <a href={contact.tiktok} target="_blank" rel="noreferrer">
                <FaTiktok className="hover:text-gray-300 transition" />
              </a>
            )}
            {contact.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="hover:text-green-500 transition" />
              </a>
            )}
          </>
        )}
      </div>

      {/* Right: Rotating Messages */}
      <div className="flex-1 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="inline-block"
          >
            {messages[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Spacer for symmetry */}
      <div className="w-fit md:w-[150px]" />
    </div>
  );
};

export default AnnouncementBar;
