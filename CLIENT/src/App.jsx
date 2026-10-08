import { useEffect, useLayoutEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useAppDispatch } from "./hooks/reduxHooks";
import { GetProfile } from "./features/auth/authThunk";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AuthPage } from "./pages/AuthPage";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { ProductDetails } from "./pages/ProductDetails";
import { Products } from "./pages/Products";
import { About } from "./pages/About";
import { EnquiryList } from "./pages/EnquiryList";
import { Categories } from "./pages/Categories";
import { Contact } from "./pages/Contact";

function Shell({ children }) {
  const location = useLocation();
  return (
    <>
      {!location.pathname.startsWith("/admin") && <Navbar />}
      {children}
      {!location.pathname.startsWith("/admin") && <Footer />}
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(GetProfile());
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<Shell><Home /></Shell>} />
      <Route path="/products" element={<Shell><Products /></Shell>} />
      <Route path="/product/:id" element={<Shell><ProductDetails /></Shell>} />
      <Route path="/enquiry" element={<Shell><EnquiryList /></Shell>} />
      <Route path="/categories" element={<Shell><Categories /></Shell>} />
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route path="/admin/*" element={<Shell><AdminDashboard /></Shell>} />
      </Route>

      <Route path="/about" element={<Shell><About /></Shell>} />
      <Route path="/contact" element={<Shell><Contact /></Shell>} />
      <Route path="*" element={<Shell><NotFound /></Shell>} />
      </Routes>
    </>
  );
}
