import multer from "multer";
import path from "path";

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

export default upload;
