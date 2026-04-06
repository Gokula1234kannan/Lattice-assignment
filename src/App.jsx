import React, { useState } from 'react';
import { WeatherProvider } from './context/WeatherContext';
import Navbar from './components/Navigation/Navbar';
import Dashboard from './pages/Dashboard';
import Historical from './pages/Historical';

function App() {
  const [currentPage, setPage] = useState('dashboard');

  return (
    <WeatherProvider>
      <div className="min-h-screen relative overflow-hidden">
        <Navbar currentPage={currentPage} setPage={setPage} />
        <main className="container pb-12 animate-fade-in" key={currentPage}>
          {currentPage === 'dashboard' ? <Dashboard /> : <Historical />}
        </main>
      </div>
    </WeatherProvider>
  );
}

export default App;
