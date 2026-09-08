import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calculator, 
  Package, 
  BarChart3, 
  Receipt, 
  Percent, 
  History as HistoryIcon, 
  Settings as SettingsIcon,
  PlusCircle,
  Bell,
  Sun,
  Moon,
  Crown,
  TrendingUp,
  LayoutDashboard,
  Check,
  X
} from 'lucide-react';
import { BottomSheet } from './BottomSheet';

export const ResponsiveHeader: React.FC = () => {
  const { 
    activeScreen, 
    navigateTo, 
    settings, 
    updateSettings, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead 
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navLinks = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calculator', label: 'Profit Calculator', icon: Calculator },
    { id: 'products', label: 'Products Catalog', icon: Package },
    { id: 'gst_calculator', label: 'GST Calculator', icon: Receipt },
    { id: 'fee_calculator', label: 'Fee Matrix', icon: Percent },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'history', label: 'History', icon: HistoryIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ] as const;

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  return (
    <>
      {/* ================= DESKTOP & TABLET NAVBAR (md and up) ================= */}
      <header className="hidden md:block w-full sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left: Brand Logo & Title */}
            <div 
              onClick={() => navigateTo('home')}
              className="flex items-center gap-3 cursor-pointer group shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-black text-base shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                <span>₹</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100">
                    Hisab<span className="text-indigo-600 dark:text-indigo-400">Bazaar</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                    India E-Com
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block truncate max-w-[160px]">
                  {settings.businessName || 'Seller Hub'}
                </span>
              </div>
            </div>

            {/* Center: Primary Navigation Links */}
            <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none" aria-label="Desktop primary">
              {navLinks.map((item) => {
                const isActive = activeScreen === item.id || 
                  (item.id === 'calculator' && activeScreen === 'result') ||
                  (item.id === 'products' && ['add_product', 'edit_product', 'product_details'].includes(activeScreen));
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    id={`desktop-nav-${item.id}`}
                    onClick={() => navigateTo(item.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right: Quick Actions & Settings Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Quick Calculate Button */}
              <button
                id="header-quick-calc-btn"
                onClick={() => navigateTo('calculator')}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold shadow-xs transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Calculate</span>
              </button>

              {/* Theme Toggle Button */}
              <button
                id="header-theme-toggle"
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title={settings.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
              >
                {settings.theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )}
              </button>

              {/* Notifications Button */}
              <button
                id="header-notifications-btn"
                onClick={() => setNotificationsOpen(true)}
                className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              {/* Pro Badge */}
              <button
                onClick={() => navigateTo('premium')}
                className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  settings.isPro
                    ? 'bg-amber-400/20 text-amber-600 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{settings.isPro ? 'PRO' : 'Upgrade'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MOBILE TOP APP BAR (phones < md) ================= */}
      <div className="md:hidden w-full sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-2.5 flex items-center justify-between shadow-xs select-none">
        <div 
          onClick={() => navigateTo('home')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
            ₹
          </div>
          <div>
            <span className="font-black text-sm tracking-tight text-slate-900 dark:text-slate-100">
              Hisab<span className="text-indigo-600 dark:text-indigo-400">Bazaar</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Notifications */}
          <button
            onClick={() => setNotificationsOpen(true)}
            className="relative p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>
        </div>
      </div>

      {/* Notifications Drawer / Sheet */}
      <BottomSheet
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        title="Notifications & Updates"
      >
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500">
              {unreadCount} unread update{unreadCount === 1 ? '' : 's'}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  notif.read
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800/60 opacity-70'
                    : 'bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-900 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {notif.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </BottomSheet>
    </>
  );
};
