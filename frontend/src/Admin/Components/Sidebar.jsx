import "../style/sidebar.css";
import { Link } from "react-router-dom";
import Home from "../assets/home.png";
import Complain from "../assets/complain.png";
import User from "../assets/user.png";
import Verify from "../assets/verify.png";
import Admin from "../assets/male.png";
import Logout from "../assets/logout.png";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="account">
        <img src={Admin} alt="admin" />
      </div>
      <ul>
        <Link to="/dashboard">
          <li>
            <img src={Home} alt="home" />
            Home
          </li>
        </Link>
        <Link to="/dashboard/menu/personil">
          <li>
            <img src={Complain} alt="complain" />
            Personil EDP
          </li>
        </Link>
        <Link to="/dashboard/menu/liststokbarang">
          <li>
            <img src={Verify} alt="complain" />
            Stok&nbsp;Barang
          </li>
        </Link>
        <Link to="/dashboard/menu/addstokbarang">
          <li>
            <img src={Verify} alt="complain" />
            Tambah Stok&nbsp;Barang
          </li>
        </Link>
        <Link to="/dashboard/menu/alluser">
          <li>
            <img src={User} alt="complain" />
            Lihat User
          </li>
        </Link>
        <Link to="/dashboard/menu/addpersonil">
          <li>
            <img src={Verify} alt="complain" />
            Tambah&nbsp;Personil
          </li>
        </Link>
        <Link to="/" onClick={() => localStorage.removeItem("nama")}>
          <li>
            <img src={Logout} alt="logout" />
            Keluar
          </li>
        </Link>
      </ul>
    </div>
  );
}
