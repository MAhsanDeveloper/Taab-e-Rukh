import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { trackEvent } from "../lib/analytics";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const adminPanelPath = import.meta.env.VITE_ADMIN_PANEL_PATH;
const adminLoginPath = import.meta.env.VITE_ADMIN_LOGIN_PATH;

const WhatsappButton = () => {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const location = useLocation();

  const handleClick = () => {
  trackEvent({
    action: "social_click",
    category: "floating_button",
    label: "WhatsApp",
    value: whatsappNumber
  });
};

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/contact`);
        setWhatsappNumber(res.data.whatsapp);
      } catch (err) {
        console.error("Failed to fetch contact info", err);
      }
    };

    fetchContact();
  }, []);

  // Hide button if number is invalid or on admin routes
  if (!whatsappNumber || whatsappNumber.trim().length !== 12) return null;
  if (location.pathname.startsWith(adminPanelPath)) return null;
  if (location.pathname.startsWith(adminLoginPath)) return null;

  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent("Hi, I want to ")}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="fixed bottom-25 right-5 z-50 flex items-center gap-2 bg-white/80 p-2 px-3 rounded-full shadow-lg hover:bg-white transition"
    >
      <span className="text-sm text-gray-700 font-medium hidden sm:inline">
        Chat with us
      </span>
      <div className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition">
        <FaWhatsapp size={24} />
      </div>
    </a>
  );
};

export default WhatsappButton;
