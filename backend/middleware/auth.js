import jwt from "jsonwebtoken";

const secret = "rahasia";

export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "Tidak ada" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ message: "Token invalid" });
    req.user = user; // simpan payload user (id, role)
    next();
  });
}
