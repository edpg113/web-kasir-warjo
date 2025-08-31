import express from "express";
import db from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const secret = "rahasia";

// get profile
router.get("/getprofile", (req, res) => {
  const sql = "SELECT * FROM profile";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json("Error mendapatkan user.");
    res.json(result);
  });
});

// login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM profile WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Terjadi kesalahan server" });
    }

    if (data.length === 0) {
      return res.status(401).json({ message: "Username/Password salah!" });
    }

    // return res.status(200).json({ message: "Sukses" });

    const user = data[0];

    // Buat JWT Token
    const token = jwt.sign(
      { id: user.id, role: user.role }, //payload
      secret,
      { expiresIn: "1h" }
    );
    return res.status(200).json({
      message: "Sukses",
      token,
      role: user.role,
    });
  });
});

export default router;
