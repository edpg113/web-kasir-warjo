import Sidebar from "../../components/Sidebar";
import Monitoring from "../components/Monitoring";
import "../style/monitoring.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Cashin from "../../../../public/assets/stockup.png";
import Profit from "../../../../public/assets/profit.png";

export default function Dashboard() {
  const [pendapatanHariIni, setPendapatanHariIni] = useState(0);
  const [stats, setStats] = useState({
    totalPenjualanHariIni: 0,
    totalProdukTersedia: 0,
    produkTerjual: 0,
    totalSeluruhPenjualan: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/statistik-dashboard")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Gagal ambil statistik:", err));

    axios
      .get("http://localhost:8000/api/pendapatan-harian")
      .then((res) => {
        const today = new Date().toISOString().slice(0, 10); // format YYYY-MM-DD
        const found = res.data.find((item) => item.tanggal === today);
        setPendapatanHariIni(found ? found.totalPendapatan : 0);
      })
      .catch((err) => console.error("Error fetching pendapatan harian:", err));
  }, []);

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <h1>Dashboard</h1>
        <div className="info-cards">
          <div className="card">
            <h4>Total Penjualan Hari Ini</h4>
            <p>Rp.{stats.totalPenjualanHariIni.toLocaleString("id-ID")}</p>
              {/* <img src={Cashin} alt="" /> */}
            <span className="stockup">
              Cash Inflow
            </span>
          </div>

          <div className="card">
            <h4>Total Uang Toko</h4>
            <p>Rp.{stats.totalSeluruhPenjualan.toLocaleString("id-ID")}</p>
              {/* <img src={Profit} alt="" /> */}
            <span className="stockdown">
             Profit
            </span>
          </div>
        </div>
        <Monitoring />
      </div>
    </div>
  );
}
