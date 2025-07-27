// src/routes/AppRoutes.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

import ProtectedRoute from "../components/ProtectedRoute";
import SkeletonLoader from "@/components/SkeletonLoader";
import PublicRoute from "@/components/PublicRoute";
import NotFound from "@/pages/NotFound";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const ProductCategory = lazy(() => import("../pages/ProductCategory"));
const ProductDetail = lazy(() => import("../pages/ProductDetail"));
const Cart = lazy(() => import("../pages/Cart"));
const Checkout = lazy(() => import("../pages/Checkout"));
const SuccessPage = lazy(() => import("../pages/SuccessPage"));
const AddressPage = lazy(() => import("../pages/userDetail/Address"));
const EditAddressPage = lazy(() =>
  import("../pages/userDetail/EditAddressPage")
);
const OrdersPage = lazy(() => import("../pages/userDetail/OrdersPage"));

const AppRoutes = () => {
  const location = useLocation();
  const fallback =
    location.pathname === "/" ? (
      <SkeletonLoader />
    ) : (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    );
  return (
    <Suspense fallback={fallback}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        {/* <Route path="/:categoryName" element={<ProductCategory />} />
        <Route path="/:categoryName/:id" element={<ProductDetail />} /> */}

        <Route path="/products" element={<ProductCategory />} />
        <Route path="/products/product-detail" element={<ProductDetail />} />

        {/* Protected Routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-success"
          element={
            <ProtectedRoute>
              <SuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addresses"
          element={
            <ProtectedRoute>
              <AddressPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-address/:id"
          element={
            <ProtectedRoute>
              <EditAddressPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
