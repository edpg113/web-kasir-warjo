import React, { useState } from "react";
import "../style/register.css";
import Sidebar from "../components/Sidebar";
import Mainbar from "../components/Mainbar";
import Rigthbar from "../components/Rigthbar";

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const addTocart = (item, qty) => {
    // setCartItems((prevCartItems) => [...prevCartItems, item]);
    setCartItems((prevCartItems) => {
      const existingItem = prevCartItems.find((i) => i.id === item.id);
      if (existingItem) {
        // Kalau produk sudah ada, update qty
        return prevCartItems.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + qty } : i
        );
      } else {
        // Kalau produk belum ada maka tambah baru
        return [...prevCartItems, { ...item, qty }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => item.id !== id)
    );
  };

  return (
    <div>
      <div className="body">
        <Sidebar setSelectedCategory={setSelectedCategory} />
        <Rigthbar cartItems={cartItems} removeFromCart={removeFromCart} />
        <Mainbar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          addTocart={addTocart}
        />
      </div>
    </div>
  );
}
