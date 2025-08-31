import React from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import "../style/dashboard.css";

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="body">
        <div className="hero">
          <h1>Dashboard</h1>
        </div>
      </div>
    </div>
  );
}
