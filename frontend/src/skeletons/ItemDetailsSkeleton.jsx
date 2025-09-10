// src/skeletons/ItemDetailsSkeleton.jsx
const ItemDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-6 animate-pulse">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="w-full h-96 bg-gray-200 rounded-xl" />
          <div className="flex gap-2">
            <div className="w-20 h-20 bg-gray-300 rounded-lg" />
            <div className="w-20 h-20 bg-gray-300 rounded-lg" />
            <div className="w-20 h-20 bg-gray-300 rounded-lg" />
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-between space-y-6">
          {/* Title and Description */}
          <div className="space-y-4">
            <div className="w-3/4 h-8 bg-gray-300 rounded" />
            <div className="w-full h-4 bg-gray-200 rounded" />
            <div className="w-5/6 h-4 bg-gray-200 rounded" />
            <div className="w-2/6 h-4 bg-gray-200 rounded" />
          </div>

          {/* Stock & Price */}
          <div className="space-y-2">
            <div className="w-32 h-6 bg-gray-300 rounded" />
            <div className="w-24 h-6 bg-gray-200 rounded" />
            <div className="w-16 h-4 bg-gray-200 rounded" />
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4">
            <div className="w-full h-12 bg-gray-300 rounded-full" />
            <div className="w-full h-12 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsSkeleton;
