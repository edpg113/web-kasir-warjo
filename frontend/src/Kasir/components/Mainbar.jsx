import React, { useState, useEffect } from "react";
import "../style/mainbar.css";
import MenuData from "../data/data.json";

export default function Mainbar({
  selectedCategory,
  setSelectedCategory,
  addTocart,
}) {
  const [menu, setMenu] = useState([]);
  const [qtyInputs, setQtyInputs] = useState({});

  useEffect(() => {
    setMenu(MenuData);
  }, []);

  // Filter
  const filteredMenu = selectedCategory
    ? menu.filter((item) => item.kategori === selectedCategory)
    : menu;

  const handleQtyChange = (id, qty) => {
    setQtyInputs((prev) => ({
      ...prev,
      [id]: qty,
    }));
  };

  return (
    <div className="mainbar">
      <div className="navbar">
        <h1>Daftar Menu</h1>
      </div>
      <div className="flex">
      {filteredMenu.length > 0 ? (
        filteredMenu.map((item) => (
          <div className="container" key={item.id}>
            <h3>{item.produk}</h3>
            <div className="menuItem">
              <div className="icon">
                <img src={item.gambar} alt={item.produk} />
              </div>
              <div className="menuInfo">
                <p>
                  Qty:{" "}
                  <input
                    type="number"
                    value={qtyInputs[item.id] || 1}
                    min="1"
                    onChange={(e) =>
                      handleQtyChange(item.id, parseInt(e.target.value))
                    }
                  />
                </p>
                {/* <textarea placeholder="Catatan..."></textarea> */}
                <button onClick={() => addTocart(item, qtyInputs[item.id] || 1)}>
                  Beli
                </button>
                <h2 className="price">Rp. {item.harga.toLocaleString()}</h2>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="no-data">Tidak ada menu tersedia</p>
      )}
    </div>
    </div>
  );
}
