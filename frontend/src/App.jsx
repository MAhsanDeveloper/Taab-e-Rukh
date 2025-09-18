import { lazy, Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// --- Direct Imports ---
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./components/CategoryCarousel";
import WhatsappButton from "./components/WhatsappButton";

// --- Skeletons ---
import CartPageSkeleton from "./skeletons/CartPageSkeleton";
import BillingPageSkeleton from "./skeletons/BillingPageSkeleton";
import ProductPageSkeleton from "./skeletons/ProductCardSkeleton";
import LoginPageSkeleton from "./skeletons/LoginPageSkeleton";
import ItemDetailsSkeleton from "./skeletons/ItemDetailsSkeleton";
import ContactPageSkeleton from "./skeletons/ContactPageSkeleton";

// --- Page Wrapper ---
import PageWrapper from "./skeletons/PageWrapper";

// --- Lazy Pages ---
const CartPage = lazy(() => import("./pages/CartPage"));
const BillingPage = lazy(() => import("./pages/BillingPage"));
const AllProductsPage = lazy(() => import("./pages/AllProductsPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PurchaseSuccessPage = lazy(() => import("./pages/PurchaseSuccessPage"));
const PurchaseCancelPage = lazy(() => import("./pages/PurchaseCancelPage"));
const ItemDetailsPage = lazy(() => import("./pages/ItemDetails"));
const NotFound = lazy(() => import("./pages/NotFound"));

const ShippingPolicy = lazy(() => import("./pages/policies/ShippingPolicy"));
const PrivacyPolicy = lazy(() => import("./pages/policies/PrivacyPolicy"));
const ReturnRefundPolicy = lazy(() => import("./pages/policies/ReturnRefundPolicy"));
const TermsOfService = lazy(() => import("./pages/policies/TermsOfService"));

// --- Admin ---
const ProtectedAdminRoute = lazy(() => import("./components/ProtectedAdminRoute"));
const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const AdminHome = lazy(() => import("./admin/AdminHome"));
const AdminAnalytics = lazy(() => import("./admin/AdminAnalytics"));
const HomePageManager = lazy(() => import("./admin/HomePageManager"));
const ShopManager = lazy(() => import("./admin/ShopManager"));
const ContactManager = lazy(() => import("./admin/ContactManager"));
const OrderManager = lazy(() => import("./admin/OrderManager"));
const CategoryManager = lazy(() => import("./admin/AdminCategorySection"));
const CouponManager = lazy(() => import("./admin/CouponManager"));
const AdminLogin = lazy(() => import("./admin/AdminLogin"));

// --- Env variables ---
const adminLoginPath = import.meta.env.VITE_ADMIN_LOGIN_PATH;
const adminPanelPath = import.meta.env.VITE_ADMIN_PANEL_PATH;

// --- Wrapped Pages (lazy only) ---
const WrappedCartPage = PageWrapper(CartPage, <CartPageSkeleton />);
const WrappedBillingPage = PageWrapper(BillingPage, <BillingPageSkeleton />);
const WrappedAllProductsPage = PageWrapper(AllProductsPage, <ProductPageSkeleton />);
const WrappedLoginPage = PageWrapper(LoginPage, <LoginPageSkeleton />);
const WrappedSignUpPage = PageWrapper(SignUpPage, <LoginPageSkeleton />);
const WrappedContactPage = PageWrapper(ContactPage, <ContactPageSkeleton />);
const WrappedPurchaseSuccessPage = PageWrapper(PurchaseSuccessPage);
const WrappedPurchaseCancelPage = PageWrapper(PurchaseCancelPage);
const WrappedItemDetailsPage = PageWrapper(ItemDetailsPage, <ItemDetailsSkeleton />);
const WrappedNotFound = PageWrapper(NotFound);
const WrappedShippingPolicy = PageWrapper(ShippingPolicy);
const WrappedPrivacyPolicy = PageWrapper(PrivacyPolicy);
const WrappedReturnRefundPolicy = PageWrapper(ReturnRefundPolicy);
const WrappedTermsOfService = PageWrapper(TermsOfService);

// --- Admin Wrapped Pages ---
const WrappedAdminLayout = PageWrapper(AdminLayout);
const WrappedAdminHome = PageWrapper(AdminHome);
const WrappedAdminAnalytics = PageWrapper(AdminAnalytics);
const WrappedHomePageManager = PageWrapper(HomePageManager);
const WrappedShopManager = PageWrapper(ShopManager);
const WrappedContactManager = PageWrapper(ContactManager);
const WrappedOrderManager = PageWrapper(OrderManager);
const WrappedCategoryManager = PageWrapper(CategoryManager);
const WrappedCouponManager = PageWrapper(CouponManager);
const WrappedAdminLogin = PageWrapper(AdminLogin);

// --- Direct Imports (NOT wrapped) ---
const WrappedProductPage = ProductPage;
const WrappedCategoryPage = CategoryPage;

// --- Router ---
const router = createBrowserRouter([
  // Routes WITH Navbar
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage />, errorElement: <WrappedNotFound /> },
      { path: "/all-products", element: <WrappedAllProductsPage /> },
      { path: "/item/:id", element: <WrappedItemDetailsPage /> },
      { path: "/category/:category", element: <WrappedProductPage /> },
      { path: "/category/", element: <WrappedCategoryPage /> },
      { path: "/cart", element: <WrappedCartPage /> },
      { path: "/place-your-order", element: <WrappedBillingPage /> },
      { path: "/order-success", element: <WrappedPurchaseSuccessPage /> },
      { path: "/cancel", element: <WrappedPurchaseCancelPage /> },
      { path: "/shipping-policy", element: <WrappedShippingPolicy /> },
      { path: "/privacy-policy", element: <WrappedPrivacyPolicy /> },
      { path: "/refund-return-policy", element: <WrappedReturnRefundPolicy /> },
      { path: "/terms-of-service", element: <WrappedTermsOfService /> },
      { path: "/contact-us", element: <WrappedContactPage /> },
    ],
  },

  // Routes WITHOUT Navbar
  { path: "/login", element: <WrappedLoginPage /> },
  { path: "/signup", element: <WrappedSignUpPage /> },
  { path: adminLoginPath, element: <WrappedAdminLogin /> },

  // Admin Panel (guarded)
  {
    path: adminPanelPath,
    element: (
      <Suspense fallback={<div className="py-10 text-center">Loading admin...</div>}>
        <ProtectedAdminRoute>
          <WrappedAdminLayout />
        </ProtectedAdminRoute>
      </Suspense>
    ),
    children: [
      { index: true, element: <WrappedAdminHome /> },
      { path: "analytics", element: <WrappedAdminAnalytics /> },
      { path: "home-images", element: <WrappedHomePageManager /> },
      { path: "shop", element: <WrappedShopManager /> },
      { path: "contact", element: <WrappedContactManager /> },
      { path: "orders", element: <WrappedOrderManager /> },
      { path: "coupons", element: <WrappedCouponManager /> },
      { path: "categories-section", element: <WrappedCategoryManager /> },
    ],
  },

  // Catch-all
  { path: "*", element: <WrappedNotFound /> },
]);

const App = () => (
  <>
    <RouterProvider router={router} />
    <Toaster position="top-center" />
    <WhatsappButton />
  </>
);

export default App;
