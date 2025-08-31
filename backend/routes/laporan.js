import express from "express";
import db from "../db.js";
import ExcelJS from "exceljs";

const router = express.Router();

router.get("/download-laporan/:tanggal", (req, res) => {
  const { tanggal } = req.params;
  const sql =
    "SELECT nama_produk, qty, harga, subtotal, waktu FROM transaksi_detail WHERE DATE(waktu) = ?";

  db.query(sql, [tanggal], async (err, rows) => {
    if (err) return res.status(500).send(err);

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

    // rows.forEach((row) => worksheet.addRow(row));

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

    worksheet.getColumn("C").numFmt = "Rp #,##0";
    worksheet.getColumn("D").numFmt = "Rp #,##0";
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

export default router;
