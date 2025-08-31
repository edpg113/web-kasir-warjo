import React from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";
import { useState, useEffect } from "react";

export default function AllUser() {
  const [personil, setPersonil] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/all-user", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setPersonil(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="body">
        <div className="hero">
          <h1>All User Admin</h1>
          <div className="container">
            <table border="1">
              <thead>
                <tr>
                  <th>NIK</th>
                  <th>Nama</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                {personil.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nik}</td>
                    <td>{item.nama}</td>
                    <td>{item.password}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
