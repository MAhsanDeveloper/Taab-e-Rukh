import React from "react";

const ProfilePage = () => {
  return (
<div className="flex flex-col min-h-[calc(100vh-72px)] bg-gray-50 items-center pt-10 pb-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl w-full">
        {/* Order Tracking */}
        <div className="rounded-2xl shadow-md border border-gray-200 p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Order Tracking</h2>
          <p className="text-gray-500 mb-3">
            We will be adding order tracking soon to make your shopping
            experience smoother.
          </p>
          <button
            disabled
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-400 cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>

        {/* Review System */}
        <div className="rounded-2xl shadow-md border border-gray-200 p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Review System</h2>
          <p className="text-gray-500 mb-3">
            A product review system will be available soon for sharing your
            feedback.
          </p>
          <button
            disabled
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-400 cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
