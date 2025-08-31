import React from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";
import { useState } from "react";
import "../../style/addPersonil.css";

export default function AddPersonil() {
  const [nik, setNik] = useState("");
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [area, setArea] = useState("");
  const [tim, setTim] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      nik: nik,
      nama: nama,
      jabatan: jabatan,
      area: area,
      tim: tim,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/add-personil",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Personil berhasil ditambahkan");
      setShowMessage(true);
      setNik("");
      setNama("");
      setJabatan("");
      setArea("");
      setTim("");
      setTimeout(() => {
        setShowMessage(false);
      }, 2000); // Notifikasi akan hilang setelah 3 detik
    } catch (error) {
      console.log(error);
      setMessage("Personil gagal ditambahkan");
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 2000); // Notifikasi akan hilang setelah 3 detik
    }
  };

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="body">
        <div className="hero">
          <h1>Tambah Personil</h1>
          <div className="container">
            <div className="box">
              <h2>Tambah</h2>
              <div className="inputRegister">
                <div className="inputGroup">
                  <p>Nik</p>
                  <input
                    type="text"
                    required
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                  />
                </div>
                <div className="inputGroup">
                  <p>Nama</p>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                  />
                </div>
                <div className="inputGroup">
                  <p>Jabatan</p>
                  <select
                    value={jabatan}
                    onChange={(e) => setJabatan(e.target.value)}
                  >
                    <option>-- Pilih --</option>
                    <option value="Manager">Manager</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Officer">Officer</option>
                    <option value="Clerk">Clerk</option>
                  </select>
                </div>
                <div className="inputGroup">
                  <p>Area</p>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  >
                    <option>-- Pilih --</option>
                    <option value="Bogor">Bogor</option>
                    <option value="Jakarta">Jakarta</option>
                    <option value="Sukabumi">Sukabumi</option>
                    <option value="Cianjur">Cianjur</option>
                  </select>
                </div>
                <div className="inputGroup">
                  <p>Tim</p>
                  <select value={tim} onChange={(e) => setTim(e.target.value)}>
                    <option>-- Pilih --</option>
                    <option value="Lapangan">Lapangan</option>
                    <option value="Network">Network</option>
                  </select>
                </div>
                <button onClick={handleSubmit}>Tambah</button>
                {showMessage && <p>{message}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
