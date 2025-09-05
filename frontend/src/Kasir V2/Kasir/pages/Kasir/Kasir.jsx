import React, { useState, useEffect } from "react";
import "../../style/register.css";
import Sidebar from "../../../components/Sidebar";
import Mainbar from "./components/Mainbar";
import Rigthbar from "./components/Rigthbar";
import axios from "axios";

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cartItems, setCartItems] = useState([]);
   const [menu, setMenu] = useState([]);

   const fetchMenu = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/getproduk");
        setMenu(response.data);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

    useEffect(() => {
    fetchMenu();
  }, []);

  const addTocart = (item, qty) => {
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
        <Sidebar />
        <Rigthbar cartItems={cartItems} removeFromCart={removeFromCart} fetchMenu={fetchMenu} />
        <Mainbar
        menu={menu}
        fetchMenu={fetchMenu}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          addTocart={addTocart}
        />
      </div>
    </div>
  );
}
