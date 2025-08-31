import React, { useState } from "react";
import Logo from "../assets/logo.png";
import "../style/sidebar.css";

export default function Sidebar({ setSelectedCategory }) {
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      <div className="sidebar">
        <div className="logo">
          <img src={Logo} alt="Logo" />
          <span>Warjo ID</span>
        </div>
        <div className="list">
          <ul>
            <li>
              <button
                className="coffee"
                onClick={() => handleCategoryClick(false)}
              >
                All Menu
              </button>
            </li>
          </ul>
          <h2>Minuman</h2>
          <ul>
            <li>
              <button
                className="coffee"
                onClick={() => handleCategoryClick("kopi")}
              >
                Kopi
              </button>
            </li>
            <li>
              <button
                className="non-coffee"
                onClick={() => handleCategoryClick("non-kopi")}
              >
                Non-Kopi
              </button>
            </li>
          </ul>
          <h2>Makanan</h2>
          <ul>
            <li>
              <button
                className="rice"
                onClick={() => handleCategoryClick("makanan")}
              >
                Makanan Berat
              </button>
            </li>
            <li>
              <button
                className="noodle"
                onClick={() => handleCategoryClick("cemilan")}
              >
                Cemilan
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
