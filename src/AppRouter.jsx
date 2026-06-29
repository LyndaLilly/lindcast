import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import ProtectedRoute from "./components/ProtectedRoute";


import {
  Home,
  PrivacyPolicy,
  Terms,
  DeleteAccount,
  Disclaimer,
  LeaderBoard,
  Contact,
  Reward,
  OpenChallenge,
} from "./view/guest/pages";

import {
  Register,
  Login,
  VerifyEmail,
  Profile,
  EditProfile,
} from "./view/guest/auth/users";

import ChatAdmin from "./view/admin";

// import { PageNotFound, Forbidden } from "./view/guest/errorpages";

function AppRouter() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const siteTitle = "Stakeova";

    const pageTitleMap = {
      "/": "Home",
      "/delete-account": "Delete Account",
      "/register": "Register",
      "/login": "Login",
      "/deleteaccount": "Profile",
      "/editprofile": "Edit Profile",
      "/404": "Page Not Found",
      "/403": "Page Forbidden",
      "/verify-email": "Verify Email",
      "/privacy": "Privacy Policy",
      "/terms": "Terms & Conditions",
      "/disclaimer": "Disclaimer",
      "/leaderboard": "Leaderboard",
      "/contact": "Contact Us",
      "/reward": "Reward",
      "/admin/chat": "Admin Chat",
    };

    const pageTitle = pageTitleMap[path] || "Page";
    document.title = `${pageTitle} | ${siteTitle}`;
  }, [location.pathname]);

  return (
    <Routes>
      <Route element={<HomeLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reward" element={<Reward />} />
        <Route path="/challenge/:token" element={<OpenChallenge />} />
        <Route path="/admin/chat" element={<ChatAdmin />} />

        <Route
          path="/deleteaccount"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editprofile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* <Route path="/403" element={<Forbidden />} />

    

      <Route path="*" element={<PageNotFound />} /> */}
    </Routes>
  );
}

export default AppRouter;
