import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import "../style/produk.css";
import axios from "axios";
import Swal from "sweetalert2";

export default function Produk() {
  const [namaProduk, setNamaProduk] = useState("");
  const [kategori, setKategori] = useState("");
  const [hargaBeli, setHargaBeli] = useState("");
  const [hargaProduk, setHarga] = useState("");
  const [gambar, setGambar] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [qty, setQty] = useState(""); // Default quantity
  const [menu, setMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editNama, setEditNama] = useState("");
  const [editHargaBeli, setEditHargaBeli] = useState("");
  const [editHarga, setEditHarga] = useState("");
  const [editTampil, setEditTampil] = useState(true); // default true
  const [editQty, setEditQty] = useState("0"); // default empty

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGambar(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("namaProduk", namaProduk);
    data.append("kategori", kategori);
    data.append("hargaBeli", hargaBeli);
    data.append("hargaProduk", hargaProduk);
    data.append("qty", qty);
    data.append("gambar", gambar);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/addproduk",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const Toast = Swal.mixin({
          toast: true,
          position: "center",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Produk berhasil ditambahkan!",
        });
        // Reset form fields
        setNamaProduk("");
        setKategori("");
        setHargaBeli("");
        setHarga("");
        setQty("");
        setGambar(null);
        setPreviewImage(null);
        document.getElementById("gambar").value = null;

        // Fetch updated menu
        await fetchMenu();
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Gagal menambahkan produk. Silakan coba lagi.");
    }
  };

  const fetchMenu = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/getprodukall"
      );
      setMenu(response.data);
    } catch (error) {
      console.error("Error fetching menu data:", error);
      alert("Gagal mengambil data menu. Silakan coba lagi.");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Yakin ingin menghapus produk ini ?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8000/api/deleteproduk/${id}`);
          Swal.fire({
            title: "Deleted!",
            text: "Produk berhasil dihapus.",
            icon: "success",
          });
          fetchMenu(); // Refresh menu after deletion
          setShowEditModal(false);
        } catch (error) {
          console.error("Error deleting product:", error);
          Swal.fire("Error", "Gagal menghapus produk.", "error");
        }
      }
    });
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Gambar nama produk
  const getGambarProduk = (namaProduk) => {
    const namaFile = namaProduk.toLowerCase().replace(/\s+/g, "") + ".jpg";
    return `http://localhost:8000/images/${namaFile}`;
  };

  // Filter
  const filteredMenu = selectedCategory
    ? menu.filter((item) => item.kategori === selectedCategory)
    : menu;

  const handleEditClick = (item) => {
    setEditItem(item);
    setEditNama(item.namaProduk);
    setEditHargaBeli(item.hargaBeli);
    setEditHarga(item.hargaProduk);
    setEditTampil(item.tampil === 1); // misal dari DB: 1 = true, 0 = false
    setEditQty(item.qty);
    setShowEditModal(true);
  };

  const handleUpdateEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/editproduk/${editItem.id}`, {
        namaProduk: editNama,
        hargaBeli: editHargaBeli,
        hargaProduk: editHarga,
        tampil: editTampil ? 1 : 0,
        qty: editQty,
      });
      Swal.fire("Berhasil!", "Produk berhasil diubah.", "success");
      setShowEditModal(false);
      fetchMenu(); // refresh data
    } catch (error) {
      console.error("Error editing product:", error);
      Swal.fire("Error", "Gagal mengubah produk.", "error");
    }
  };

  // total produk tersedia
  const totalProdukTerdisplay = menu.filter(
    (item) => item.qty > 0 && item.tampil === 1
  ).length;

  return (
    <div>
      <Sidebar />
      <div className="mainbarProduk">
        <h1>Tambah Produk Baru</h1>
        <div className="produk-container">
          <form onSubmit={handleSubmit} className="form-flex">
            <div className="form-row">
              <p>Nama Produk:</p>
              <input
                type="text"
                id="namaProduk"
                name="namaProduk"
                value={namaProduk}
                required
                onChange={(e) => setNamaProduk(e.target.value)}
              />
              <p>Kategori:</p>
              <select
                onChange={(e) => setKategori(e.target.value)}
                value={kategori}
                required
              >
                <option value=""> -- Pilih Kategori --</option>
                <option value="makanan">Makanan</option>
                <option value="cemilan">Cemilan</option>
                <option value="kopi">Kopi</option>
                <option value="non-kopi">Non-Kopi</option>
              </select>
            </div>
            <div className="form-row">
              <p>Harga Beli:</p>
              <input
                type="number"
                id="hargaBeli"
                name="hargaBeli"
                value={hargaBeli}
                required
                onChange={(e) => setHargaBeli(e.target.value)}
              />
              <p>Harga Jual:</p>
              <input
                type="number"
                id="harga"
                name="hargaProduk"
                value={hargaProduk}
                required
                onChange={(e) => setHarga(e.target.value)}
              />
            </div>
            <div className="form-row">
              <p>Qty:</p>
              <input
                type="number"
                id="qty"
                name="qty"
                value={qty}
                required
                onChange={(e) => setQty(e.target.value)}
              />
              <p>Gambar:</p>
              <input
                type="file"
                id="gambar"
                accept="image/*"
                required
                onChange={handleImageChange}
                style={{ paddingTop: "10px" }}
              />
              {previewImage && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              )}

              <button type="submit">Tambah Produk</button>
            </div>
          </form>

          <div className="card">
            <h4>Total Produk Terdisplay: {totalProdukTerdisplay}</h4>
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
                    <img
                      src={getGambarProduk(item.namaProduk)}
                      alt={item.produk}
                    />
                  </div>
                  <strong>{item.namaProduk}</strong>
                  <div className="menuItem">
                    <div className="menuInfo">
                      <h4 className="price">
                        Harga Beli : Rp. {item.hargaBeli.toLocaleString('id-ID')}{" "}
                        <br />
                        Harga Jual : Rp. {item.hargaProduk.toLocaleString('id-ID')}
                      </h4>
                      <p>
                        Stock :{" "}
                        {item.qty && Number(item.qty) > 0 ? (
                          item.qty
                        ) : (
                          <span style={{ color: "red" }}>Stok Habis</span>
                        )}
                        <br />
                        Ditampilkan :{" "}
                        <span
                          style={{
                            color:
                              item.tampil === 1 &&
                              item.qty &&
                              Number(item.qty) > 0
                                ? "green"
                                : "red",
                            fontWeight: "700",
                          }}
                        >
                          {item.tampil === 1 && item.qty && Number(item.qty) > 0
                            ? "Ya"
                            : "Tidak"}
                        </span>
                      </p>
                      <button onClick={() => handleEditClick(item)}>
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">Tidak ada menu tersedia</p>
            )}
          </div>
        </div>
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Edit Produk</h3>
              <form onSubmit={handleUpdateEdit}>
                <p>Nama Produk:</p>
                <input
                  type="text"
                  value={editNama}
                  onChange={(e) => setEditNama(e.target.value)}
                  required
                />
                <p>Harga Beli:</p>
                <input
                  type="number"
                  value={editHargaBeli}
                  onChange={(e) => setEditHargaBeli(e.target.value)}
                  required
                />
                <p>Harga Jual:</p>
                <input
                  type="number"
                  value={editHarga}
                  onChange={(e) => setEditHarga(e.target.value)}
                  required
                />
                <p>Stock:</p>
                <input
                  type="number"
                  value={editQty}
                  onChange={(e) => setEditQty(e.target.value)}
                  required
                />
                <p>Tampilkan Produk:</p>
                <select
                  value={editTampil ? "1" : "0"}
                  onChange={(e) => setEditTampil(e.target.value === "1")}
                >
                  <option value="1">Ya</option>
                  <option value="0">Tidak</option>
                </select>
                <div className="modal-buttons">
                  <button type="button" onClick={() => setShowEditModal(false)}>
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(editItem.id)}
                  >
                    Hapus Produk
                  </button>
                  <button type="submit">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
