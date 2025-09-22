import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "../components/scrollToTop";
import Navbar from "../components/Navbar";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";
import WhatsappButton from "../components/WhatsappButton";
import { trackPageView } from "../lib/analytics";

const MainLayout = () => {
  const location = useLocation();

   useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);
  return (
    // ensure this container fills viewport height so flex-1 pushes footer to bottom
    <div className="flex flex-col w-full bg-white min-h-screen">
      <Navbar />

      <ScrollToTop />

      {/* main is the scrollable content area. flex-1 will expand between navbar & footer */}
      <main className="pt-[72px] flex-1 min-h-[calc(100vh-72px-200px)]">
        <Breadcrumbs />
        <Outlet />
      </main>

      <Footer />

      <WhatsappButton />
    </div>
  );
};

export default MainLayout;
