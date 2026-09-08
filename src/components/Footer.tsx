import React from 'react';
import { useApp } from '../context/AppContext';
import { Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  const productLinks = [
    { label: 'Profit Calculator', screen: 'calculator' as const },
    { label: 'GST Calculator', screen: 'gst_calculator' as const },
    { label: 'Fee Matrix', screen: 'fee_calculator' as const },
    { label: 'Products Catalog', screen: 'products' as const },
  ];

  const resourceLinks = [
    { label: 'Reports', screen: 'reports' as const },
    { label: 'History', screen: 'history' as const },
    { label: 'Settings', screen: 'settings' as const },
    { label: 'Go Pro', screen: 'premium' as const },
  ];

  const legalLinks = [
    { label: 'About Us', screen: 'about' as const },
    { label: 'Privacy Policy', screen: 'privacy' as const },
    { label: 'Terms of Service', screen: 'terms' as const },
    { label: 'Contact', screen: 'contact' as const },
  ];

  const handleGoHome = () => navigateTo('home');

  return (
    <footer
      id="site-footer"
      className="mt-8 md:mt-10 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 pb-24 md:pb-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <button
              onClick={handleGoHome}
              className="flex items-center gap-2.5 text-left group"
              aria-label="HisabBazaar home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-black text-sm shadow-md shadow-indigo-600/20">
                ₹
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100">
                Hisab<span className="text-indigo-600 dark:text-indigo-400">Bazaar</span>
              </span>
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-3 max-w-xs">
              The trusted profit, fee &amp; GST calculator for Indian e-commerce sellers on Flipkart,
              Amazon, Meesho, Shopify and D2C channels.
            </p>
            <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-500 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>Made in India</span>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Calculators
            </h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.screen}>
                  <button
                    onClick={() => navigateTo(link.screen)}
                    className="text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Manage
            </h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.screen}>
                  <button
                    onClick={() => navigateTo(link.screen)}
                    className="text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Company
            </h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.screen}>
                  <button
                    onClick={() => navigateTo(link.screen)}
                    className="text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
            <a
              href="mailto:support@hisabbazaar.com"
              className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mt-4"
            >
              <Mail className="w-4 h-4" />
              <span>support@hisabbazaar.com</span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>© {new Date().getFullYear()} HisabBazaar. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Built for Indian e-commerce sellers · GST &amp; marketplace fee accuracy
          </span>
        </div>
      </div>
    </footer>
  );
};
