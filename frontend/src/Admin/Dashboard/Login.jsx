import React from "react";
import "../style/login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginIcon from "../assets/login.svg";

export default function Login() {
  const [message, setMessage] = useState("");
  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = {
      nik,
      password,
    };
    try {
      const response = await axios.post(
        "http://localhost:8000/api/login",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        setMessage("Berhasil Login!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setMessage("Nik atau Password Salah!");
      }
    } catch (error) {
      console.log(error);
      setMessage("Nik atau Password Salah!");
    }
  };
  return (
    <div>
      <div className="loginForm">
        <div className="imgLogin">
          <img src={LoginIcon} alt="Login" />
        </div>
        <div className="inputForm">
          <form onSubmit={handleLogin}>
            <h1>Admin Dashboard</h1>
            <p>Selamat datang di web dashboard Administrasi EDP.</p>
            <input
              type="text"
              placeholder="NIK"
              required
              value={nik}
              onChange={(e) => setNik(e.target.value)}
            />
            {/* <br /> */}
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button>Login</button>
            {message && <p>{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
