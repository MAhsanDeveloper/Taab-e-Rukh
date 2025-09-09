import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Suspense, lazy } from "react";
const Footer = lazy(() => import("../components/Footer"));

const MainLayout = () => {
  return (
    <div className="w-full flex flex-col bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Push content below fixed navbar */}
      <div className="pt-[72px]">
        <Outlet />
      </div>

      {/* Footer */}
      <Suspense fallback={<div className="text-center py-10 text-gray-400"></div>}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default MainLayout;
