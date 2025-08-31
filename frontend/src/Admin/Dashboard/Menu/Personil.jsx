import React from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Personil() {
  const [personil, setPersonil] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/all-personil"
        );
        setPersonil(response.data);
        console.log(response.data);
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
          <h1>Personil</h1>
          <div className="container">
            <table border="1">
              <thead>
                <tr>
                  <th>NIK</th>
                  <th>Nama</th>
                  <th>Jabatan</th>
                  <th>Area</th>
                  <th>Tim</th>
                </tr>
              </thead>
              <tbody>
                {personil.map((data) => (
                  <tr key={data.id}>
                    <td>{data.nik}</td>
                    <td>{data.nama}</td>
                    <td>{data.jabatan}</td>
                    <td>{data.area}</td>
                    <td>{data.tim}</td>
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
