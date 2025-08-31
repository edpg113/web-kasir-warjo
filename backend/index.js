import express from "express";
import cors from "cors";

// middleware
import { verifyToken } from "./middleware/auth.js";

import loginRoutes from "./routes/login.js"
import produkRoutes from "./routes/produk.js";
import transaksiRoutes from "./routes/transaksi.js";
import statistikRoutes from "./routes/statistik.js";
import laporanRoutes from "./routes/laporan.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));

// daftarin routes
app.use("/api", loginRoutes)
app.use("/api", produkRoutes);
app.use("/api", transaksiRoutes);
app.use("/api", statistikRoutes);
app.use("/api", laporanRoutes);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
