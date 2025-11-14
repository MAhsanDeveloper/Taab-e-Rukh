export default function PolicyPageSkeleton() {
  return (
    <div className="animate-pulse px-6 md:px-20 py-12 max-w-4xl mx-auto">

      {/* Title */}
      <div className="h-8 w-2/5 bg-gray-300 rounded mb-10"></div>

      {/* Sections */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="mb-12 space-y-4">

          {/* Section heading */}
          <div className="h-5 w-1/4 bg-gray-300 rounded"></div>

          {/* Paragraph lines */}
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-11/12 bg-gray-200 rounded"></div>
          <div className="h-4 w-10/12 bg-gray-200 rounded"></div>
          <div className="h-4 w-9/12 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}
