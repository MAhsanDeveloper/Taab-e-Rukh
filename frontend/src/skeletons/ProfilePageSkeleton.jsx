import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 animate-pulse">
      <div className="h-10 w-48 bg-gray-300 rounded mb-6"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl w-full">
        {/* Order Tracking Skeleton */}
        <div className="rounded-2xl shadow-md border border-gray-200 p-6 text-center">
          <div className="h-6 w-32 bg-gray-300 rounded mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mx-auto mb-3 w-3/4"></div>
          <div className="h-8 w-24 bg-gray-300 rounded mx-auto"></div>
        </div>

        {/* Review System Skeleton */}
        <div className="rounded-2xl shadow-md border border-gray-200 p-6 text-center">
          <div className="h-6 w-32 bg-gray-300 rounded mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mx-auto mb-3 w-3/4"></div>
          <div className="h-8 w-24 bg-gray-300 rounded mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
