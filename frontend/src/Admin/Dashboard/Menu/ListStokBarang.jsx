import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";

export default function ListStokBarang() {
  const [listBrg, setListBrg] = useState([]);
  const [editData, setEditData] = useState(null);
  const [namaBrg, setNamaBrg] = useState("");
  const [qty, setQty] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/list-stok-barang",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setListBrg(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (item) => {
    setEditData(item);
    setNamaBrg(item.namabarang);
    setQty(item.qty);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/update-stok-barang/${editData.id}`,
        { namaBrg, qty }
      );
      alert("Data berhasil diperbarui!");
      setEditData(null);
      fetchData();
    } catch (error) {
      console.log("Gagal update data!", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus data ini ?")) {
      try {
        await axios.delete(
          `http://localhost:8000/api/delete-stok-barang/${id}`
        );
        alert("Data berhasil dihapus");
        fetchData();
      } catch (error) {
        console.log("Gagal menghapus data", error);
      }
    }
  };

  function FormatWaktu({ waktu }) {
    const convert = new Date(waktu).toLocaleDateString("id-ID");
    return <span>{convert}</span>;
  }

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="body">
        <div className="hero">
          <h1>List Stok Barang</h1>
          <div className="container">
            <table border="1">
              <thead>
                <tr>
                  {/* <th>No</th> */}
                  <th>Nama Barang</th>
                  <th>Qty</th>
                  <th>Aksi</th>
                  <th>Waktu</th>
                </tr>
              </thead>
              <tbody>
                {listBrg.map((item) => (
                  <tr key={item.id}>
                    {/* <td>{item.id}</td> */}
                    <td>{item.namabarang}</td>
                    <td>{item.qty}</td>
                    <td>
                      <button onClick={() => handleEdit(item)}>Edit</button> |{" "}
                      <button onClick={() => handleDelete(item.id)}>
                        Hapus
                      </button>
                    </td>
                    <td>
                      <FormatWaktu waktu={item.timestamp} />
                      {/* {item.timestamp} */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {editData && (
            <div className="hero" style={{ margin: "-33% 0 0 20%", position: "absolute" }}>
              <h2>Edit Data</h2>
              <div
                className="container"
                style={{ width: "350px", marginTop: "10%", padding: "10%" }}
              >
                <input
                  type="text"
                  value={namaBrg}
                  onChange={(e) => setNamaBrg(e.target.value)}
                  style={{
                    width: "200px",
                    height: "40px",
                    padding: "10px",
                    marginBottom: "5%",
                  }}
                />
                <input
                  type="text"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  style={{ width: "200px", height: "40px", padding: "10px", marginBottom: "10%" }}
                />
                <br />
                <button onClick={handleUpdate} style={{width: "80px", height: "35px", marginRight: "5%"}}>Update</button>
                <button onClick={() => setEditData(null)} style={{width: "80px", height: "35px"}}>Batal</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
