import React, { useState, useEffect } from "react";
import "../style/mainbar.css";
import axios from "axios";

export default function Mainbar({
  selectedCategory,
  setSelectedCategory,
  addTocart,
}) {
  const [menu, setMenu] = useState([]);
  const [qtyInputs, setQtyInputs] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [modalQty, setModalQty] = useState(1);
  const [catatan, setCatatan] = useState("");

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
    setQtyInputs([]);
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

  // Buka modal saat tombol "Beli" diklik
  const handleBeliClick = (item) => {
    setModalItem(item);
    setModalQty(qtyInputs[item.id] || 1);
    setCatatan("");
    setShowModal(true);
  };

  // Tambah ke keranjang dan tutup modal
  const handleModalSubmit = (e) => {
    e.preventDefault();
    addTocart({ ...modalItem, catatan }, modalQty);
    setQtyInputs((prev) => ({
      ...prev,
      [modalItem.id]: modalQty,
    }));
    setShowModal(false);
  };
  // Gambar nama produk
  const getGambarProduk = (namaProduk) => {
    const namaFile = namaProduk.toLowerCase().replace(/\s+/g, "") + ".jpg";
    return `http://localhost:8000/images/${namaFile}`;
  };
  return (
    <div className="mainbar">
      <div className="navbar">
        <h1>Kasir</h1>
      </div>
      <div className="filtered">
        <ul>
          <li onClick={() => setSelectedCategory("")}>
            <button>Semua</button>
          </li>
          <li onClick={() => setSelectedCategory("makanan")}>
            <button>Makanan</button>
          </li>
          <li onClick={() => setSelectedCategory("cemilan")}>
            <button>Cemilan</button>
          </li>
          <li onClick={() => setSelectedCategory("kopi")}>
            <button>Kopi</button>
          </li>
          <li onClick={() => setSelectedCategory("non-kopi")}>
            <button>Non-Kopi</button>
          </li>
        </ul>
      </div>
      <div className="flex">
        {filteredMenu.length > 0 ? (
          filteredMenu.map((item) => (
            <div className="container" key={item.id}>
              <div className="icon">
                <img src={getGambarProduk(item.namaProduk)} alt={item.produk} />
              </div>
              <p>{item.namaProduk}</p>
              <div className="menuItem">
                <div className="menuInfo">
                  <h4 className="price">
                    Rp. {item.hargaProduk.toLocaleString("id-ID")}
                  </h4>
                  <button onClick={() => handleBeliClick(item)}>Beli</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data">Tidak ada menu tersedia</p>
        )}
      </div>
      {/* Modal */}
      {showModal && (
        <div className="boxModal">
          <form onSubmit={handleModalSubmit}>
            <h3>Tambahkan Catatan</h3>
            <div>
              <label>Qty : </label>
              <input
                type="number"
                min="1"
                value={modalQty}
                onChange={(e) => setModalQty(parseInt(e.target.value))}
                style={{ width: "60px", border: "none", margin: "10px" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              {/* <p>
                Sisa Stok :{" "}
                {modalItem && modalItem.qty !== undefined ? modalItem.qty : 0}
              </p> */}
              <textarea placeholder="Tambahkan catatan (opsional)"></textarea>
            </div>
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
            >
              <button
                style={{
                  width: "70px",
                  height: "35px",
                  background: "rgb(54, 52, 52)",
                  border: "none",
                  color: "white",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
                type="button"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button
                style={{
                  width: "170px",
                  height: "35px",
                  background: "rgb(19, 209, 136)",
                  border: "none",
                  color: "white",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
                type="submit"
              >
                Tambah Ke Keranjang
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
