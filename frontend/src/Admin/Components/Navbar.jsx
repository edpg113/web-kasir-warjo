import "../style/navbar.css";
import Menu from "../assets/menu.png";

export default function Navbar() {
  return (
    <nav>
      <span>
        <img src={Menu} alt="menu" />
        Admin EDP Dashboard
      </span>
    </nav>
  );
}