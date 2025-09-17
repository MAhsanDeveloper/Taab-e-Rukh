import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const WhatsappButton = () => {
  const [whatsappNumber, setWhatsappNumber] = useState("");

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

  if (!whatsappNumber || whatsappNumber.trim().length !== 12) return null; // don't show the button until loaded, or if admin mistankly types something wrong

    const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent("Hi, I want to ")}`;

  return (
     <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-white/80 p-2 px-3 rounded-full shadow-lg hover:bg-white transition"
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
