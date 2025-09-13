import { motion } from "framer-motion";

const ContactPageSkeleton = () => {
  return (
    <section className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-20 animate-pulse">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Contact Us
      </h2>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 sm:p-10 space-y-6">
        {/* Contact info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-5 h-5 bg-gray-300 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-gray-300 rounded" />
                <div className="h-3 w-40 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Social links grid */}
        <div className="border-t border-gray-200 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-5 h-5 bg-gray-300 rounded-full" />
              <div className="h-4 w-40 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactPageSkeleton;
