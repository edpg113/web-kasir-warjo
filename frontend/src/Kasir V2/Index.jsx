import { BrowserRouter, Routes, Route } from 'react-router';
import Dashboard from './Dashboard/pages/Dashboard';
import Kasir from "./Kasir/pages/Kasir/Kasir"
import Produk from './Produk/pages/Produk';
import Laporan from './Laporan/pages/Laporan';
import Login from './Login/pages/Login';
import ProtectedRoute from './Login/components/ProtectedRoute';

export default function Index() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path='/' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/kasir' element={<Kasir />} />
        <Route path='/produk' element={<Produk />} />
        <Route path='/laporan' element={<Laporan />} />
      </Routes>
    </BrowserRouter>
  )
}
