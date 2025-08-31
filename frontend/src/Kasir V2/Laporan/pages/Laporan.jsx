import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import "../style/laporan.css";
import moment from "moment-timezone";
import Swal from "sweetalert2";

export default function Laporan() {
  const [tanggal, setTanggal] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format YYYY-MM-DD
  });

  const [transaksi, setTransaksi] = useState([]);
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);
  const [detail, setDetail] = useState([]);

  useEffect(() => {
    fetchTransaksi();
  }, [tanggal]);

  const fetchTransaksi = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/histori-transaksi",
        {
          params: { tanggal },
        }
      );
      setTransaksi(res.data);
    } catch (err) {
      console.error("Gagal mengambil data transaksi:", err);
    }
  };

  useEffect(() => {
    if (selectedTransaksi) {
      axios
        .get(
          `http://localhost:8000/api/detail-transaksi/${selectedTransaksi.id}`
        )
        .then((res) => setDetail(res.data))
        .catch(() => setDetail([]));
    } else {
      setDetail([]);
    }
  }, [selectedTransaksi]);

  // download laporan
  const downloadLaporan = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/download-laporan/${tanggal}`,
        {
          responseType: "blob", // Set response type to blob for file download
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `laporan_transaksi_${tanggal}.xlsx`); // Set the file name
      document.body.appendChild(link);
      link.click();
      link.remove(); // Clean up the link element
      Swal.fire({
                icon: "success",
                title: "Laporan berhasil di unduh",
                text: "Cek laporan produk di unduhan",
                confirmButtonColor: "#3085d6",
              });
    } catch (error) {
      Swal.fire({
              icon: "error",
              title: "Gagal mengunduh laporan",
              text: "Terjadi kesalahan saat mengunduh laporan.",
            });
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="laporan-container">
        <h1>Laporan Transaksi</h1>
        <div className="filter-tanggal">
          <label>Pilih Tanggal: </label>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
          />
          <button onClick={downloadLaporan}>Export ke Excel</button>
        </div>

        <div className="transaksi-list">
          {transaksi.length > 0 ? (
            transaksi.map((trx) => (
              <div
                key={trx.id}
                className="transaksi-box"
                onClick={() => setSelectedTransaksi(trx)}
              >
                <p>
                  <strong>ID:</strong> {trx.id}
                </p>
                <p>
                  <strong>Waktu:</strong>{" "}
                  {moment(trx.tanggal)
                    .tz("Asia/Jakarta")
                    .format("DD-MM-YYYY HH:mm")}
                </p>
                <p>
                  <strong>Total:</strong> Rp {trx.total.toLocaleString("id-ID")}
                </p>
              </div>
            ))
          ) : (
            <p>Tidak ada transaksi di tanggal ini</p>
          )}
        </div>

        {selectedTransaksi && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedTransaksi(null)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Detail Transaksi</h3>
              <p style={{ padding: "10px 0" }}>
                Waktu :
                {selectedTransaksi.tanggal
                  ? moment(selectedTransaksi.tanggal)
                      .tz("Asia/Jakarta")
                      .format("DD-MM-YYYY HH:mm")
                  : "Tidak ada waktu transaksi"}
              </p>
              {detail.length > 0 ? (
                <table border="1">
                  <thead>
                    <tr>
                      <th>Produk</th>
                      <th>Qty</th>
                      <th>Harga</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.nama_produk}</td>
                        <td>{item.qty}</td>
                        <td>Rp. {item.harga.toLocaleString("id-ID")}</td>
                        <td>Rp. {item.subtotal.toLocaleString("id-ID")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Tidak ada detail</p>
              )}
              <div className="modal-footer">
                <h4>
                  Total : Rp. {selectedTransaksi.total.toLocaleString("id-ID")}
                </h4>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
