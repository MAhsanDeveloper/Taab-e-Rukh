import { Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";

//  Helper HOC for Suspense
// eslint-disable-next-line no-unused-vars
const withSuspense = (Component) => {
  return (props) => (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
};

const AdminAnalytics = withSuspense(lazy(() => import("./admin/AdminAnalytics")));
const ProductPage = withSuspense(lazy(() => import("./pages/ProductPage")));
const AdminHome = withSuspense(lazy(() => import("./admin/AdminHome")));
const HomePageManager = withSuspense(
  lazy(() => import("./admin/HomePageManager"))
);
const ShopManager = withSuspense(lazy(() => import("./admin/ShopManager")));
const ContactManager = withSuspense(
  lazy(() => import("./admin/ContactManager"))
);
const OrderManager = withSuspense(lazy(() => import("./admin/OrderManager")));
const CategoryManager = withSuspense(lazy(() => import("./admin/AdminCategorySection")));
const CouponManager = withSuspense(lazy(() => import("./admin/CouponManager")));
const AdminLogin = withSuspense(lazy(() => import("./admin/AdminLogin")));
const AdminLayout = withSuspense(lazy(() => import("./admin/AdminLayout")));
const CartPage = withSuspense(lazy(() => import("./pages/CartPage")));
const PurchaseSuccessPage = withSuspense(
  lazy(() => import("./pages/PurchaseSuccessPage"))
);
const PurchaseCancelPage = withSuspense(
  lazy(() => import("./pages/PurchaseCancelPage"))
);
const ItemDetailsPage = withSuspense(lazy(() => import("./pages/ItemDetails")));
const AllProductsPage = withSuspense(
  lazy(() => import("./pages/AllProductsPage"))
);
const LoginPage = withSuspense(lazy(() => import("./pages/LoginPage")));
const SignUpPage = withSuspense(lazy(() => import("./pages/SignUpPage")));
const BillingPage = withSuspense(lazy(() => import("./pages/BillingPage")));
const NotFound = withSuspense(lazy(() => import("./pages/NotFound")));


const ShippingPolicy  = withSuspense(lazy(() => import("./pages/policies/ShippingPolicy")));
const PrivacyPolicy  = withSuspense(lazy(() => import("./pages/policies/PrivacyPolicy")));
const ReturnRefundPolicy  = withSuspense(lazy(() => import("./pages/policies/ReturnRefundPolicy")));
const TermsOfService  = withSuspense(lazy(() => import("./pages/policies/TermsOfService")));

// ❌ DO NOT wrap this one — it's a guard/wrapper, not a standalone page
const ProtectedAdminRoute = lazy(() =>
  import("./components/ProtectedAdminRoute")
);

// Env variables
const adminLoginPath = import.meta.env.VITE_ADMIN_LOGIN_PATH;
const adminPanelPath = import.meta.env.VITE_ADMIN_PANEL_PATH;

const router = createBrowserRouter([
  // Routes WITH Navbar
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage />, errorElement: <NotFound /> },
      { path: "/all-products", element: <AllProductsPage /> },
      { path: "/item/:id", element: <ItemDetailsPage /> },
      { path: "/category/:category", element: <ProductPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/order-success", element: <PurchaseSuccessPage /> },
      { path: "/cancel", element: <PurchaseCancelPage /> },
      { path: "/shipping-policy", element: <ShippingPolicy /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/refund-return-policy", element: <ReturnRefundPolicy /> },
      { path: "/terms-of-service", element: <TermsOfService /> },
    ],
  },

  // ❌ Routes WITHOUT Navbar
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignUpPage /> },
  { path: "/place-your-order", element: <BillingPage /> },
  { path: adminLoginPath, element: <AdminLogin /> },

  //  Admin Panel (guarded)
  {
    path: adminPanelPath,
    element: (
      <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
        <ProtectedAdminRoute>
          <AdminLayout />
        </ProtectedAdminRoute>
      </Suspense>
    ),
    children: [
      { index: true, element: <AdminHome /> },
      { path: "analytics", element: <AdminAnalytics /> },
      { path: "home-images", element: <HomePageManager /> },
      { path: "shop", element: <ShopManager /> },
      { path: "contact", element: <ContactManager /> },
      { path: "orders", element: <OrderManager /> },
      {  path: "coupons", element: <CouponManager />, },
      {  path: "categories-section", element: <CategoryManager />, },
    ],
  },

  //  Catch-all
  { path: "*", element: <NotFound /> },
]);

const App = () => (
  <>
    <RouterProvider router={router} />
    <Toaster position="top-center" />
  </>
);

export default App;
