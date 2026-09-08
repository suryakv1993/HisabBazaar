import React from 'react';
import { Home, Calculator, Package, BarChart3, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavigationTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const tabs: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav 
      id="android-bottom-navigation"
      aria-label="Main navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 z-40 shadow-lg"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center justify-center flex-1 py-1 px-1 group focus:outline-none min-h-[48px] select-none"
            >
              {/* Material 3 active pill background */}
              <div 
                className={`relative px-4 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                  isActive 
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300' 
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-150 ${isActive ? 'scale-105 stroke-[2.4]' : 'stroke-[1.8]'}`} />
              </div>
              <span 
                className={`text-[11px] mt-0.5 tracking-tight font-medium transition-colors ${
                  isActive 
                    ? 'text-indigo-700 dark:text-indigo-300 font-semibold' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
