import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/scrollToTop";
import Navbar from "../components/Navbar";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";
import WhatsappButton from "../components/WhatsappButton";

const MainLayout = () => {
  return (
    <div className="w-full flex flex-col bg-white">
      <Navbar />

      <ScrollToTop />

      <div className="pt-[72px]">
        <Breadcrumbs />

        <Outlet />
      </div>

      <Footer />

      <WhatsappButton />
    </div>
  );
};

export default MainLayout;
