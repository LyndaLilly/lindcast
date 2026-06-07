import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer"
import "../assets/css/home.css";


function HomeLayout() {
  const [loading, setLoading] = useState(true);

  return (
     <div className="home-page">
      <Navbar />

      <div>
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

export default HomeLayout;
