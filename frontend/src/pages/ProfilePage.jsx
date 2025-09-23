import React, { useEffect, useState } from "react";
import axios from "../lib/axios";
import { useUserStore } from "../stores/useUserStore";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const { token } = useUserStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
       const res = await axios.get("/auth/profile");
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, [token]);

  if (!profile) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex flex-col min-h-[calc(100vh-72px)] bg-gray-50 items-center pt-10 pb-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>

      <div className="max-w-2xl w-full space-y-6">
        {/* User Info */}
        <div className="rounded-2xl shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-2">User Information</h2>
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
