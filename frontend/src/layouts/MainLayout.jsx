import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "../components/scrollToTop";
import Navbar from "../components/Navbar";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";
import WhatsappButton from "../components/WhatsappButton";
import { trackPageView } from "../lib/analytics";
import AnnouncementBar from "../components/AnnouncementBar";

const MainLayout = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);
  return (
    <div className="flex flex-col w-full bg-white min-h-screen">
      <AnnouncementBar />

      <Navbar />

      <ScrollToTop />

      <main className="flex-1">
        <Breadcrumbs />
        <Outlet />
      </main>

      <Footer />
      <WhatsappButton />
    </div>
  );
};

export default MainLayout;
