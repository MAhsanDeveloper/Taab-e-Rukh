import { useEffect, useState } from "react";
import axios from "axios";
import { Phone, Mail, MapPin } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const ContactPage = () => {
  const [contact, setContact] = useState(null);
  const [ready, setReady] = useState(false);

   useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    axios
      .get(`${baseURL}/api/contact`)
      .then((res) => setContact(res.data))
      .catch((err) => console.error("Failed to fetch contact info:", err));
  }, []);

  
  if (!ready) return null;       // keeps skeleton on screen
  if (!contact) return null;  

  return (
    <section className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-20">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Contact Us
      </h2>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 sm:p-10 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {contact.phone && (
            <div className="flex items-center gap-4">
              <Phone className="text-green-600 w-5 h-5" />
              <div>
                <h4 className="font-semibold text-gray-700">Phone</h4>
                <p>{contact.phone}</p>
              </div>
            </div>
          )}

          {contact.email && (
            <div className="flex items-center gap-4">
              <Mail className="text-blue-600 w-5 h-5" />
              <div>
                <h4 className="font-semibold text-gray-700">Email</h4>
                <p>{contact.email}</p>
              </div>
            </div>
          )}

          {contact.address && (
            <div className="flex items-center gap-4">
              <MapPin className="text-red-500 w-5 h-5" />
              <div>
                <h4 className="font-semibold text-gray-700">Address</h4>
                <p>{contact.address}</p>
              </div>
            </div>
          )}

          {contact.whatsapp && (
            <div className="flex items-center gap-4">
              <FaWhatsapp className="text-green-500 w-5 h-5" />
              <div>
                <h4 className="font-semibold text-gray-700">WhatsApp</h4>
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                >
                  {contact.whatsapp}
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {contact.facebook && (
            <div className="flex items-center gap-4">
              <FaFacebook className="text-blue-700 w-5 h-5" />
              <a
                href={contact.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                Visit our Facebook Page
              </a>
            </div>
          )}

          {contact.instagram && (
            <div className="flex items-center gap-4">
              <FaInstagram className="text-pink-600 w-5 h-5" />
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:underline font-medium"
              >
                Follow us on Instagram
              </a>
            </div>
          )}

          {contact.youtube && (
            <div className="flex items-center gap-4">
              <FaYoutube className="text-red-600 w-5 h-5" />
              <a
                href={contact.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:underline font-medium"
              >
                Subscribe on YouTube
              </a>
            </div>
          )}

          {contact.tiktok && (
            <div className="flex items-center gap-4">
              <FaTiktok className="text-black w-5 h-5" />
              <a
                href={contact.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:underline font-medium"
              >
                Follow us on TikTok
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
