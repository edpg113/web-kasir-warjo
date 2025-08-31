import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router';
import Dashboard from './pages/Dashboard';

export default function Index() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path='/' element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
