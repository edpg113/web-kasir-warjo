const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const moment = require("moment-timezone");
const ExcelJS = require("exceljs");
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// serve gambar statis dari folder 'uploads'
app.use("/images", express.static("images"));

// Konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images"); // Gambar akan disimpan di folder 'assets'
  },
  filename: (req, file, cb) => {
    const namaProduk = req.body.namaProduk.toLowerCase().replace(/\s+/g, "");
    const ext = path.extname(file.originalname);
    cb(null, namaProduk + ext); // Gambar akan dinamai sesuai nama produk
  },
});
const upload = multer({ storage });

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "warjo",
});

if (db) {
  console.log("Database connected successfully");
} else {
  console.log("Database connection failed");
}

// API endpoint to get products in kasir
app.get("/api/getproduk", (req, res) => {
  const query = "SELECT * FROM produk WHERE tampil = 1 AND qty > 0"; // Hanya ambil produk yang tampil
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    return res.status(200).json(result);
  });
});

// API endpoint to get products in produk
app.get("/api/getprodukall", (req, res) => {
  const query = "SELECT * FROM produk "; // Hanya ambil produk yang tampil
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    return res.status(200).json(result);
  });
});

// API endpoint to add a new product
app.post("/api/addproduk", upload.single("gambar"), (req, res) => {
  const { namaProduk, hargaBeli, hargaProduk, kategori, qty } = req.body;
  const tampil = 0;
  const query =
    "INSERT INTO produk (namaProduk, hargaBeli,hargaProduk,kategori, tampil,qty ) VALUES (?, ?,?, ?, ?, ?)";
  db.query(
    query,
    [namaProduk, hargaBeli, hargaProduk, kategori, tampil, qty],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
      return res.status(200).json({ message: "Produk berhasil di tambahkan!" });
    }
  );
});

// API endpoint to edit a product
app.put("/api/editproduk/:id", (req, res) => {
  const { id } = req.params;
  const { namaProduk, hargaBeli, hargaProduk, tampil, qty } = req.body;
  const sql =
    "UPDATE produk SET namaProduk = ?, hargaBeli = ?,hargaProduk = ?, tampil = ?, qty = ? WHERE id = ?";
  db.query(
    sql,
    [namaProduk, hargaBeli, hargaProduk, tampil, qty, id],
    (err, result) => {
      if (err) return res.status(500).send("Gagal mengubah produk");
      res.status(200).send("Produk berhasil diupdate");
    }
  );
});

// API endpoint to delete a qty from a product
app.post("/api/deleteqty/", (req, res) => {
  const items = req.body;

  const updatePromises = items.map((item) => {
    const sql = "UPDATE produk SET qty = qty - ? WHERE id = ? AND qty >= ?";
    return new Promise((resolve, reject) => {
      db.query(sql, [item.qty, item.id, item.qty], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  });

  Promise.all(updatePromises)
    .then(() => res.status(200).send("Qty produk berhasil diupdate"))
    .catch((err) => res.status(500).send("Gagal mengupdate qty produk"));
});

// API endpoint to delete a product
app.delete("/api/deleteproduk/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM produk WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send("Gagal menghapus produk");
    res.status(200).send("Produk berhasil dihapus");
  });
});

// API endpoint to get dashboard statistics
app.get("/api/statistik-dashboard", (req, res) => {
  // Query penjualan hari ini
  db.query(
    `SELECT SUM(total) as totalPenjualanHariIni FROM transaksi WHERE DATE(tanggal) = CURDATE()`,
    (err, penjualanHariIniResult) => {
      if (err) {
        console.error("Gagal mengambil statistik:", err);
        return res.status(500).json({ error: "Gagal mengambil statistik" });
      }

      // Query total seluruh penjualan
      db.query(
        `SELECT SUM(total) as totalSeluruhPenjualan FROM transaksi`,
        (err, seluruhPenjualanResult) => {
          if (err) {
            console.error("Gagal mengambil statistik:", err);
            return res.status(500).json({ error: "Gagal mengambil statistik" });
          }

          // Query produk tersedia
          db.query(
            `SELECT COUNT(*) as totalProdukTersedia FROM produk WHERE qty > 0 AND tampil = 1`,
            (err, produkTersediaResult) => {
              if (err) {
                console.error("Gagal mengambil statistik:", err);
                return res
                  .status(500)
                  .json({ error: "Gagal mengambil statistik" });
              }
              res.json({
                totalPenjualanHariIni:
                  penjualanHariIniResult[0].totalPenjualanHariIni || 0,
                totalSeluruhPenjualan:
                  seluruhPenjualanResult[0].totalSeluruhPenjualan || 0,
              });
            }
          );
        }
      );
    }
  );
});

// API endpoint pendapatan harian
app.get("/api/pendapatan-harian", (req, res) => {
  const sql = `
    SELECT DATE(tanggal) AS tanggal, 
           SUM(total) AS totalPendapatan
    FROM transaksi
    GROUP BY DATE(tanggal)
    ORDER BY tanggal ASC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// API endpoint pendapatan bulanan
app.get("/api/pendapatan-bulanan", (req, res) => {
  const sql = `
  SELECT DATE_FORMAT(tanggal, '%Y-%m') AS bulan, SUM
  (total) AS totalPendapatan
  FROM transaksi
  GROUP BY bulan
  ORDER BY bulan ASC`;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// API endpoint to add a transaction
app.post("/api/tambah-transaksi", (req, res) => {
  const { total, items } = req.body;

  // Set waktu Jakarta tanpa offset ganda
  const tanggal = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

  const sql = "INSERT INTO transaksi (tanggal, total) VALUES (?, ?)";
  db.query(sql, [tanggal, total], (err, result) => {
    if (err) return res.status(500).send("Gagal menambahkan transaksi");
    // res.status(200).send("Transaksi berhasil ditambahkan");

    const transaksiId = result.insertId;

    // Insert detail transaksi jika ada items
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
      const detailSql = `
        INSERT INTO transaksi_detail
        (transaksi_id, produk_id, nama_produk, qty, harga, subtotal, waktu)
        VALUES ?
      `;
      db.query(detailSql, [detailValues], (err2) => {
        if (err2)
          return res.status(500).send("Gagal menambahkan detail transaksi");
        res.status(200).send("Transaksi & detail berhasil ditambahkan");
      });
    } else {
      res.status(200).send("Transaksi berhasil ditambahkan (tanpa detail)");
    }
  });
});

// API endpoint history transaksi
app.get("/api/histori-transaksi", (req, res) => {
  const { tanggal } = req.query;

  const query = `SELECT * FROM transaksi WHERE DATE(tanggal) = ? ORDER BY id DESC`;

  db.query(query, [tanggal], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// API endpoint to get transaction details
app.get("/api/detail-transaksi/:id", (req, res) => {
  const { id } = req.params;
  const sql = `SELECT nama_produk, qty, harga, subtotal FROM transaksi_detail WHERE transaksi_id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// API endpoint to export transactions to Excel
app.get("/api/download-laporan/:tanggal", async (req, res) => {
  const { tanggal } = req.params;

  const query = `
    SELECT nama_produk, qty, harga, subtotal, waktu FROM transaksi_detail WHERE DATE(waktu) = ?
  `;

  db.query(query, [tanggal], async (err, rows) => {
    if (err) return res.status(500).send(err);

    // const ExcelJS = require("exceljs");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laporan Transaksi");

    // atur header kolom
    worksheet.columns = [
      { header: "Nama Produk", key: "nama_produk", width: 30 },
      { header: "Qty", key: "qty", width: 10 },
      { header: "Harga", key: "harga", width: 15 },
      { header: "Subtotal", key: "subtotal", width: 15 },
      { header: "Waktu", key: "waktu", width: 25 },
    ];

    // styling header
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1E90FF" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Tambahkan data + styling
    rows.forEach((row) => {
      worksheet.addRow({
        nama_produk: row.nama_produk,
        qty: row.qty,
        harga: row.harga,
        subtotal: row.subtotal,
        waktu: row.waktu,
      });
    });

    // Styling setiap data row
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber !== 1) {
        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      }
    });

    // Format kolom harga & subtotal jadi IDR
    ["C", "D"].forEach((col) => {
      worksheet.getColumn(col).numFmt = "Rp #,##0";
    });
    worksheet.getColumn("E").numFmt = "dd-mm-yyyy hh:mm:ss";

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Laporan_${tanggal}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();
  });
});
