/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const baseURL = import.meta.env.VITE_API_BASE_URL;

const ContactManager = () => {
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState({
    phone: "",
    email: "",
    address: "",
    facebook: "",
    instagram: "",
    youtube: "",
    whatsapp: "",
  });


const fetchContact = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/contact`, {
      withCredentials: true,
    });
    setContact(res.data || {}); // fallback to empty object
  } catch (err) {
    toast.error("Failed to fetch contact");
  } finally {
    setLoading(false); // Always stop loading
  }
};

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${baseURL}/api/contact`, contact, 
        {
          withCredentials: true
        }
      );
      toast.success("Contact updated successfully");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  if (loading) return <p>Loading contact info...</p>;


  return (
    <div className="bg-amber-600 p-4 sm:p-6 rounded-xl max-w-xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4">Manage Contact Info</h2>

      <div className="space-y-4">
        <input
          name="phone"
          value={contact.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full p-2 rounded text-black min-w-0"
        />
        <input
          name="email"
          value={contact.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 rounded text-black min-w-0"
        />
        <input
          name="address"
          value={contact.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full p-2 rounded text-black min-w-0"
        />
        <input
          name="facebook"
          value={contact.facebook}
          onChange={handleChange}
          placeholder="Facebook URL"
          className="w-full p-2 rounded text-black min-w-0"
        />
        <input
          name="whatsapp"
          value={contact.whatsapp}
          onChange={handleChange}
          placeholder="WhatsApp Number (e.g. 923001234567)"
          className="w-full p-2 rounded text-black min-w-0"
        />
        <input
          name="youtube"
          value={contact.youtube}
          onChange={handleChange}
          placeholder="YouTube URL"
          className="w-full p-2 rounded text-black min-w-0"
        />
        <input
          name="instagram"
          value={contact.instagram}
          onChange={handleChange}
          placeholder="Instagram URL"
          className="w-full p-2 rounded text-black min-w-0"
        />
        <button
          onClick={handleUpdate}
          className="bg-white text-amber-700 px-4 py-2 rounded font-bold hover:bg-amber-100"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ContactManager;
