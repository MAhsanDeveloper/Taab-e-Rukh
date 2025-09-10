// src/skeletons/CartPageSkeleton.jsx
const CartPageSkeleton = () => {
  const items = Array(3).fill(0); // show 3 skeleton items

  return (
    <div className="py-10 px-4 md:px-8 lg:px-16 max-w-screen-xl mx-auto bg-white animate-pulse">
      <h1 className="h-10 w-1/3 bg-gray-300 rounded mb-8 mx-auto lg:mx-0"></h1>

      <div className="lg:flex gap-10">
        {/* Skeleton Cart Items */}
        <div className="flex-1 space-y-6">
          {items.map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Image */}
                <div className="h-24 w-24 md:h-32 md:w-32 bg-gray-300 rounded-lg shrink-0"></div>

                {/* Product Info */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-6 bg-gray-300 w-3/4 rounded"></div>
                  <div className="h-4 bg-gray-200 w-full rounded"></div>
                  <div className="h-4 bg-gray-200 w-5/6 rounded"></div>
                  <div className="h-6 w-20 bg-gray-300 rounded mt-2"></div>
                </div>

                {/* Price + Quantity */}
                <div className="flex flex-col items-end gap-3">
                  <div className="h-6 w-16 bg-gray-300 rounded"></div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                    <div className="h-6 w-6 bg-gray-300 rounded"></div>
                    <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Skeleton Order Summary */}
        <div className="lg:w-96 mt-8 lg:mt-0 space-y-4">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm space-y-3">
            <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-10 w-full bg-gray-300 rounded mt-3"></div>
          </div>

          <div className="h-12 w-full bg-gray-200 rounded"></div> {/* GiftCouponCard */}
        </div>
      </div>
    </div>
  );
};

export default CartPageSkeleton;
