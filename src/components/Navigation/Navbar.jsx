import React from 'react';
import { Cloud, History } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

const Navbar = ({ currentPage, setPage }) => {
  const { unit, toggleUnit } = useWeather();

  const navItems = [
    { id: 'dashboard', label: 'Real-time', icon: Cloud },
    { id: 'historical', label: 'Historical', icon: History },
  ];

  return (
    <nav className="sticky top-0 z-50 mb-8 px-2 md:px-4">
      <div className="glass-card !p-2 md:!p-3 !rounded-2xl flex flex-row items-center justify-between shadow-xl mt-4 gap-2 md:gap-4 overflow-hidden">
        
        {/* Brand Logo - Compact Icon on Mobile */}
        <div className="flex flex-row items-center gap-2 flex-shrink-0">
          <div className="bg-primary/20 p-2 rounded-xl flex items-center justify-center">
            <Cloud className="text-primary" size={20} md={24} />
          </div>
          <span className="text-lg font-black tracking-tight text-text-main sm:inline hidden">
            SKYLINE<span className="text-primary">.</span>
          </span>
        </div>

        {/* Universal Navigation Pill - scrollable always, but try to fit */}
        <div className="flex flex-row items-center bg-bg-dark/40 p-1 md:p-1.5 rounded-2xl border border-white/10 shadow-inner flex-nowrap overflow-x-auto hide-scrollbar flex-1 min-w-0">
          <div className="flex flex-row items-center gap-1 flex-nowrap">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`flex flex-row items-center gap-1.5 md:gap-2 px-3 md:px-6 py-2 rounded-xl font-black transition-all text-[10px] md:text-sm tracking-tight whitespace-nowrap flex-shrink-0 ${
                  currentPage === item.id 
                    ? 'bg-primary text-bg-dark shadow-lg shadow-primary/30' 
                    : 'text-text-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={13} md={16} strokeWidth={3} className="flex-shrink-0" />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            ))}
          </div>
          
          <div className="h-5 w-[1px] bg-white/10 mx-1.5 flex-shrink-0" />
          
          <button 
            onClick={toggleUnit}
            className="w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-[10px] md:text-xs font-black text-primary border border-primary/20 hover:bg-primary hover:text-bg-dark transition-all bg-primary/10 flex-shrink-0"
          >
            {unit === 'celsius' ? '°C' : '°F'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
