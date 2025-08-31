import React from "react";
import "../style/rightbar.css";

export default function Rigthbar({ cartItems, removeFromCart }) {
  const totalHarga = cartItems.reduce(
    (total, item) => total + item.harga * item.qty,
    0
  );

  const cetakStruk = () => {
    window.print();
  }

  return (
    <div className="rightbar">
      <div className="receipt">
        <h2>🧾 Warjo ID</h2>
        <p>Tanggal: {new Date().toLocaleDateString()}</p>
        <hr />
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              <div className="row">
                <span>{item.produk} x{item.qty}&nbsp;</span>
                <span> Rp {item.harga.toLocaleString()}</span>
                <button onClick={() => removeFromCart(item.id)}>Hapus</button>
              </div>
            </li>
          ))}
        </ul>
        <hr />
        <div className="total">
          <strong>Total:</strong>
          <strong>Rp {totalHarga.toLocaleString()}</strong>
        </div>
        <p className="thank-you">Terima kasih 🙏</p>
        <button className="cetak" onClick={cetakStruk}>🖨️ Cetak Struk</button>
      </div>
    </div>
  );
}
