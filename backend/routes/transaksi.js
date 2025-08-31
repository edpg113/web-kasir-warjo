import express from "express";
import db from "../db.js";
import moment from "moment-timezone";

const router = express.Router();

// tambah transaksi
router.post("/tambah-transaksi", (req, res) => {
  const { total, items } = req.body;
  const tanggal = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

  db.query(
    "INSERT INTO transaksi (tanggal, total) VALUES (?, ?)",
    [tanggal, total],
    (err, result) => {
      if (err) return res.status(500).send("Gagal menambahkan transaksi");

      const transaksiId = result.insertId;

      if (Array.isArray(items) && items.length > 0) {
        const detailValues = items.map((item) => [
          transaksiId,
          item.id,
          item.namaProduk,
          item.qty,
          item.hargaProduk,
          item.qty * item.hargaProduk,
          tanggal,
        ]);

        db.query(
          "INSERT INTO transaksi_detail (transaksi_id, produk_id, nama_produk, qty, harga, subtotal, waktu) VALUES ?",
          [detailValues],
          (err2) => {
            if (err2)
              return res.status(500).send("Gagal menambahkan detail transaksi");
            res.send("Transaksi & detail berhasil ditambahkan");
          }
        );
      } else {
        res.send("Transaksi berhasil ditambahkan (tanpa detail)");
      }
    }
  );
});

// histori transaksi
router.get("/histori-transaksi", (req, res) => {
  const { tanggal } = req.query;
  db.query(
    "SELECT * FROM transaksi WHERE DATE(tanggal) = ? ORDER BY id DESC",
    [tanggal],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    }
  );
});

// detail transaksi
router.get("/detail-transaksi/:id", (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT nama_produk, qty, harga, subtotal FROM transaksi_detail WHERE transaksi_id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    }
  );
});

export default router;
