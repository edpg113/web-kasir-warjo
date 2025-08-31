import express from "express";
import db from "../db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// statistik dashboard
router.get("/statistik-dashboard", (req, res) => {
  db.query("SELECT SUM(total) as totalPenjualanHariIni FROM transaksi WHERE DATE(tanggal) = CURDATE()", (err, penjualanHariIniResult) => {
    if (err) return res.status(500).json({ error: "Gagal mengambil statistik" });

    db.query("SELECT SUM(total) as totalSeluruhPenjualan FROM transaksi", (err, seluruhPenjualanResult) => {
      if (err) return res.status(500).json({ error: "Gagal mengambil statistik" });

      db.query("SELECT COUNT(*) as totalProdukTersedia FROM produk WHERE qty > 0 AND tampil = 1", (err) => {
        if (err) return res.status(500).json({ error: "Gagal mengambil statistik" });

        res.json({
          totalPenjualanHariIni: penjualanHariIniResult[0].totalPenjualanHariIni || 0,
          totalSeluruhPenjualan: seluruhPenjualanResult[0].totalSeluruhPenjualan || 0,
        });
      });
    });
  });
});

// pendapatan harian
router.get("/pendapatan-harian", (req, res) => {
  const sql = `
    SELECT DATE(tanggal) AS tanggal, SUM(total) AS totalPendapatan
    FROM transaksi
    GROUP BY DATE(tanggal)
    ORDER BY tanggal ASC
  `;
  db.query(sql, (err, result) => (err ? res.status(500).send(err) : res.json(result)));
});

// pendapatan bulanan
router.get("/pendapatan-bulanan", (req, res) => {
  const sql = `
    SELECT DATE_FORMAT(tanggal, '%Y-%m') AS bulan, SUM(total) AS totalPendapatan
    FROM transaksi
    GROUP BY bulan
    ORDER BY bulan ASC
  `;
  db.query(sql, (err, result) => (err ? res.status(500).send(err) : res.json(result)));
});

export default router;
