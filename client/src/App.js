import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import DashboardPage from './DashboardPage';
import InventoryPage from './InventoryPage';
import Navbar from './components/Navbar';
import { useUser } from './UserContext';

function App() {
  const { user } = useUser();
  
  return (
    <>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
      </Routes>
    </>
  );
}

export default App;
