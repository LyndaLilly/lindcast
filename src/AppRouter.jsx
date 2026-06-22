import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";

import { Home, PrivacyPolicy, Terms, Disclaimer, LeaderBoard, Contact, Reward} from "./view/guest/pages";

import { Register, Login, VerifyEmail } from "./view/guest/auth/users";

// import { PageNotFound, Forbidden } from "./view/guest/errorpages";

function AppRouter() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const siteTitle = "Crypto Predict";

    const pageTitleMap = {
      "/": "Home",
      "/register" : "Register",
      "/login" : "Login",
      "/404": "Page Not Found",
      "/403": "Page Forbidden",
      "/verify-email": "Verify Email",
      "/privacy": "Privacy Policy",
      "/terms": "Terms & Conditions",
      "/disclaimer": "Disclaimer",
      "/leaderboard": "Leaderboard",
      "/contact": "Contact Us",
      "/reward": "Reward",
    };

    const pageTitle = pageTitleMap[path] || "Page";
    document.title = `${pageTitle} | ${siteTitle}`;
  }, [location.pathname]);

  return (
    <Routes>
      <Route element={<HomeLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reward" element={<Reward />} />
      </Route>

      {/* <Route path="/403" element={<Forbidden />} />

    

      <Route path="*" element={<PageNotFound />} /> */}
    </Routes>
  );
}

export default AppRouter;
