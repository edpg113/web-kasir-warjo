import Logo from "../Kasir/assets/logo.png";
import "./sidebar.css";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div>
      <div className="sidebar">
        <div className="logo">
          <img src={Logo} alt="Logo" />
          <span>Warjo ID</span>
        </div>
        <div className="list">
          <ul>
            <Link to="/dashboard">
              <li>Dashboard</li>
            </Link>
            <Link to="/kasir">
              <li>Kasir</li>
            </Link>

            <Link to="/produk">
              <li>Produk</li>
            </Link>
            <Link to="/laporan">
              <li>Laporan</li>
            </Link>
             <Link to="/">
              <li>Keluar</li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}
