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
  Bell,
  Sun,
  Moon,
  Crown,
  LayoutDashboard
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
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
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
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
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

          {notifications.length === 0 ? (
            <div className="py-10 text-center">
              <Bell className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                You're all caught up
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[240px] mx-auto leading-relaxed">
                No notifications right now. We'll let you know about fee updates,
                margin alerts and fresh tips here.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
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
                    <div className="flex items-start justify-between gap-2 flex-1 min-w-0">
                      <h3 className={`text-xs font-bold ${notif.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <span className="shrink-0 w-2 h-2 mt-1 rounded-full bg-indigo-500" aria-label="Unread" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </BottomSheet>
    </>
  );
};
