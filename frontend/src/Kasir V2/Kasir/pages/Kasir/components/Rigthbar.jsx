import React from "react";
import "../style/rightbar.css";
import axios from "axios";
import Swal from "sweetalert2";

export default function Rigthbar({ cartItems, removeFromCart, fetchMenu }) {
  const totalHarga = cartItems.reduce(
    (total, item) => total + item.hargaProduk * item.qty,
    0
  );

  const cetakStruk = async () => {
    try {
      // Kurangi stok
      await axios.post("http://localhost:8000/api/deleteqty", cartItems);

      // Post data transaksi
      await axios.post("http://localhost:8000/api/tambah-transaksi", {
        tanggal: new Date().toISOString().split("T")[0],
        total: totalHarga,
        items: cartItems,
      });

      // Event listener setelah print / cancel
      const handleAfterPrint = () => {
        cartItems.forEach((item) => removeFromCart(item.id));

        Swal.fire({
          icon: "success",
          title: "Transaksi Berhasil",
          // text: "Struk sudah direkam ke sistem.",
          confirmButtonColor: "#3085d6",
        }).then(() => {
          fetchMenu()
        })

        window.removeEventListener("afterprint", handleAfterPrint);
      };

      window.addEventListener("afterprint", handleAfterPrint);

      // Buka dialog print
      window.print();
    } catch (error) {
      console.error("Gagal menyelesaikan transaksi:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menyimpan transaksi.",
      });
    }
  };

  return (
    <div className="rightbar">
      <div className="receipt">
        <h2>🧾 Warjo ID</h2>
        <p>Tanggal: {new Date().toLocaleDateString("id-ID")}</p>
        <hr />
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              <div className="row">
                <span>
                  {item.namaProduk} x{item.qty}&nbsp;
                </span>
                <span> Rp {item.hargaProduk.toLocaleString("id-ID")}</span>
                <button onClick={() => removeFromCart(item.id)}>X</button>
              </div>
            </li>
          ))}
        </ul>
        <hr />
        <div className="total">
          <p>Total : </p>
          <p>Rp. {totalHarga.toLocaleString("id-ID")}</p>
        </div>
        <p className="thank-you">Terima kasih 🙏</p>
        <button className="cetak" onClick={cetakStruk}>
          🖨️ Cetak Struk
        </button>
      </div>
    </div>
  );
}
