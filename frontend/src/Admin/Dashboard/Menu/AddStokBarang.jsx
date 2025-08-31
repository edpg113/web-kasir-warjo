import React from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";
import { useState } from "react";

export default function AddStokBarang() {
  const [namaBrg, setNamaBrg] = useState("");
  const [qty, setQty] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      namaBrg: namaBrg,
      qty: qty,
    };
    try {
      await axios.post(
        "http://localhost:8000/api/add-stok-barang",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Berhasil di tambahkan");
      setNamaBrg("");
      setQty("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="body">
        <div className="hero">
          <h1>Tambah Barang</h1>
          <div className="container">
            <div className="box">
              <h2>Tambah</h2>
              <div className="inputRegister">
                <div className="inputGroup">
                  <p>Nama Barang</p>
                  <input
                    type="text"
                    required
                    value={namaBrg}
                    onChange={(e) => setNamaBrg(e.target.value)}
                  />
                </div>
                <div className="inputGroup">
                  <p>Qty</p>
                  <input
                    type="text"
                    required
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                  />
                </div>
                <button onClick={handleSubmit}>Tambah</button>
                {message && <p>{message}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
