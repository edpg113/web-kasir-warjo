import express from "express";
import db from "../db.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// get produk untuk kasir
router.get("/getproduk", (req, res) => {
  const sql = "SELECT * FROM produk WHERE tampil = 1 AND qty > 0";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Internal server error" });
    res.json(result);
  });
});

// get semua produk
router.get("/getprodukall", (req, res) => {
  db.query("SELECT * FROM produk", (err, result) => {
    if (err) return res.status(500).json({ message: "Internal server error" });
    res.json(result);
  });
});

// tambah produk
router.post("/addproduk", upload.single("gambar"), (req, res) => {
  const { namaProduk, hargaBeli, hargaProduk, kategori, qty } = req.body;
  const tampil = 0;
  const sql =
    "INSERT INTO produk (namaProduk, hargaBeli, hargaProduk, kategori, tampil, qty) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [namaProduk, hargaBeli, hargaProduk, kategori, tampil, qty], (err) => {
    if (err) return res.status(500).json({ message: "Internal server error" });
    res.json({ message: "Produk berhasil ditambahkan!" });
  });
});

// edit produk
router.put("/editproduk/:id", (req, res) => {
  const { id } = req.params;
  const { namaProduk, hargaBeli, hargaProduk, tampil, qty } = req.body;
  const sql =
    "UPDATE produk SET namaProduk = ?, hargaBeli = ?, hargaProduk = ?, tampil = ?, qty = ? WHERE id = ?";
  db.query(sql, [namaProduk, hargaBeli, hargaProduk, tampil, qty, id], (err) => {
    if (err) return res.status(500).send("Gagal mengubah produk");
    res.send("Produk berhasil diupdate");
  });
});

// hapus produk
router.delete("/deleteproduk/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM produk WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send("Gagal menghapus produk");
    res.send("Produk berhasil dihapus");
  });
});

// kurangi qty produk
router.post("/deleteqty", (req, res) => {
  const items = req.body;
  const updatePromises = items.map((item) => {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE produk SET qty = qty - ? WHERE id = ? AND qty >= ?",
        [item.qty, item.id, item.qty],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });
  });

  Promise.all(updatePromises)
    .then(() => res.send("Qty produk berhasil diupdate"))
    .catch(() => res.status(500).send("Gagal mengupdate qty produk"));
});

export default router;
