import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { useEffect, useState } from "react";
import "../style/monitoring.css";

export default function Monitoring() {
  const [data, setData] = useState([]);
  const [mode, setMode] = useState("harian");

  useEffect(() => {
    const url =
      mode === "harian"
        ? "http://localhost:8000/api/pendapatan-harian"
        : "http://localhost:8000/api/pendapatan-bulanan";
    axios
      .get(url)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, [mode]);

  const formatTanggalIndo = (tanggalStr) => {
    const tanggal = new Date(tanggalStr);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(tanggal);
  };
  return (
    <div className="chart-container">
      <h2>Statistik Pendapatan</h2>

      <select value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="harian">Per Hari</option>
        <option value="bulanan">Per Bulan</option>
      </select>

      <ResponsiveContainer
        width="100%"
        height={300}
        // style={{ marginTop: "20px", marginLeft: "20px" }}
        className="cart-responsive"
      >
        <BarChart
          data={data}
          margin={{ top: 20, right: 0, bottom: 0, left: 50 }}
        >
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis
            dataKey={mode === "harian" ? "tanggal" : "bulan"}
            tickFormatter={
              mode === "harian"
                ? formatTanggalIndo
                : (bulan) => {
                    const [year, month] = bulan.split("-");
                    const date = new Date(`${year}-${month}-01`);
                    return date.toLocaleString("id-ID", {
                      month: "long",
                      year: "numeric",
                    });
                  }
            }
          />
          <YAxis
            tickFormatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
          />
          <Tooltip
            formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
            labelFormatter={formatTanggalIndo}
          />
          <Bar dataKey="totalPendapatan" fill="#169ed4ff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
