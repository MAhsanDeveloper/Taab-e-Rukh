import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Define hidden routes
  const hiddenRoutes = ["/", "/login", "/signup", "/billing", "/checkout"];

  // ❌ Hide breadcrumbs for exact matches
  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  // ❌ Hide breadcrumbs for dynamic routes like /item/:id
  if (location.pathname.startsWith("/item/")) {
    return null;
  }

  return (
    <nav className="bg-gray-50 px-4 sm:px-8 py-4 text-base md:text-lg font-medium text-gray-700 shadow-sm">
      <ol className="flex flex-wrap items-center gap-3">
        {/* Home icon link */}
        <li>
          <Link
            to="/"
            className="flex items-center gap-2 hover:text-black transition"
          >
            <Home size={24} className="text-gray-600 hover:text-black" />
          </Link>
        </li>

        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          // Skip numeric IDs or UUID-like segments
          if (/^[0-9a-fA-F]+$/.test(name)) return null;

          return (
            <li key={name} className="flex items-center gap-3">
              <ChevronRight size={18} className="text-gray-400" />
              {isLast ? (
                <span className="text-gray-500 capitalize tracking-wide">
                  {name.replace(/-/g, " ")}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="hover:text-black capitalize tracking-wide transition"
                >
                  {name.replace(/-/g, " ")}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
