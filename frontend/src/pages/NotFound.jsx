const NotFound = () => (
  <div className="h-screen flex flex-col items-center justify-center text-center">
    <h1 className="text-5xl font-bold text-emerald-500 mb-4">404</h1>
    <p className="text-gray-600 mb-6">Oops! Page not found.</p>
    <a
      href="/"
      className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
    >
      Back to Home
    </a>
  </div>
);

export default NotFound;
