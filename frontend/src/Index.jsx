import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Admin/Dashboard/Login";
import Dashboard from "./Admin/Dashboard/Dashboard";
import Personil from "./Admin/Dashboard/Menu/Personil";
import AddPersonil from "./Admin/Dashboard/Menu/AddPersonil";
import AllUser from "./Admin/Dashboard/Menu/AllUser";
import AddStokBarang from "./Admin/Dashboard/Menu/AddStokBarang";
import ListStokBarang from "./Admin/Dashboard/Menu/ListStokBarang";

export default function Index() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/menu/personil" element={<Personil />} />
          <Route path="/dashboard/menu/addpersonil" element={<AddPersonil />} />
          <Route path="/dashboard/menu/alluser" element={<AllUser />} />
          <Route
            path="/dashboard/menu/addstokbarang"
            element={<AddStokBarang />}
          />
          <Route
            path="/dashboard/menu/liststokbarang"
            element={<ListStokBarang />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
