import React from 'react';
import { useApp } from '../context/AppContext';
import { MarketplaceType, GSTRate } from '../types';
import { 
  Building2, 
  Receipt, 
  Moon, 
  Sun, 
  Crown, 
  Download, 
  Trash2, 
  RotateCcw, 
  HelpCircle, 
  ShieldCheck, 
  ChevronRight,
  Info
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    navigateTo, 
    togglePro, 
    resetAllData, 
    clearAllHistory, 
    showConfirmDialog, 
    showSnackbar,
    products,
    calculationHistory
  } = useApp();

  const gstRates: GSTRate[] = [0, 5, 12, 18, 28];
  const marketplaces: { id: MarketplaceType; name: string }[] = [
    { id: 'flipkart', name: 'Flipkart' },
    { id: 'amazon', name: 'Amazon' },
    { id: 'meesho', name: 'Meesho' },
    { id: 'shopify', name: 'Shopify / D2C' },
    { id: 'custom', name: 'Custom' },
  ];

  const handleExportAllJSON = () => {
    const fullBackup = {
      settings,
      products,
      history: calculationHistory,
      exportedAt: new Date().toISOString(),
      version: '2.4.0',
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `SellerProfit_Backup_${Date.now()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showSnackbar('Full backup exported to JSON file! 📦', 'success');
  };

  return (
    <div id="screen-settings" className="pb-28 pt-2 md:pt-4 select-none">
      
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Account & Preferences
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
          Settings & Configurations
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Configure business details, default tax slabs, appearance & data backups
        </p>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Business Profile & Default Tax Slabs */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Business Profile */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Seller & Business Identity
              </h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Seller / Contact Name
              </label>
              <input
                id="settings-seller-name"
                type="text"
                value={settings.sellerName}
                onChange={(e) => updateSettings({ sellerName: e.target.value })}
                placeholder="e.g., Rajesh Kumar"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Business / Store Trade Name
              </label>
              <input
                id="settings-business-name"
                type="text"
                value={settings.businessName}
                onChange={(e) => updateSettings({ businessName: e.target.value })}
                placeholder="e.g., Apex Retail India"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                GSTIN Number (Goods and Services Tax ID)
              </label>
              <input
                id="settings-gstin"
                type="text"
                value={settings.gstin}
                onChange={(e) => updateSettings({ gstin: e.target.value.toUpperCase() })}
                placeholder="27ABCDE1234F1Z5"
                maxLength={15}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm font-bold uppercase font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Your 15-digit GSTIN is saved locally and printed on export receipts & invoices.
              </p>
            </div>
          </div>

          {/* Defaults Configuration */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Receipt className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Calculator Defaults
              </h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Default Marketplace Channel
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {marketplaces.map((mp) => {
                  const isSelected = settings.defaultMarketplace === mp.id;
                  return (
                    <button
                      key={mp.id}
                      type="button"
                      onClick={() => updateSettings({ defaultMarketplace: mp.id })}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {mp.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Default GST Slab Rate
              </label>
              <div className="grid grid-cols-5 gap-2">
                {gstRates.map((r) => {
                  const isSelected = settings.defaultGstRate === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => updateSettings({ defaultGstRate: r })}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {r}%
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): Pro Plan, Appearance, Data Management */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Pro Plan Card */}
          <div 
            id="settings-pro-card"
            onClick={() => navigateTo('premium')}
            className={`p-5 rounded-3xl border cursor-pointer transition-all shadow-md ${
              settings.isPro 
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-400' 
                : 'bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white border-indigo-800/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                  settings.isPro ? 'bg-black/20 text-slate-950' : 'bg-amber-400 text-slate-950'
                }`}>
                  <Crown className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider block">
                    {settings.isPro ? 'SellerProfit PRO (Active)' : 'Upgrade to SellerProfit PRO'}
                  </span>
                  <span className={`text-xs block mt-0.5 ${settings.isPro ? 'text-slate-900 font-medium' : 'text-slate-300'}`}>
                    {settings.isPro ? 'All premium calculators & exports unlocked' : 'Unlock PDF reports, unlimited SKUs & rate cards'}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 opacity-70 shrink-0" />
            </div>
          </div>

          {/* Theme & Display */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Appearance & Theme
            </h2>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                {settings.theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-indigo-400" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-500" />
                )}
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                    Color Theme
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Currently set to {settings.theme} mode
                  </span>
                </div>
              </div>

              <div className="flex items-center bg-slate-200 dark:bg-slate-700 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => updateSettings({ theme: 'light' })}
                  className={`p-1.5 rounded-lg text-xs font-bold ${
                    settings.theme === 'light'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                  title="Light"
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => updateSettings({ theme: 'dark' })}
                  className={`p-1.5 rounded-lg text-xs font-bold ${
                    settings.theme === 'dark'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                  title="Dark"
                >
                  <Moon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Data & Cloud Storage
            </h2>

            <button
              onClick={handleExportAllJSON}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Download className="w-4 h-4 text-indigo-600" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                    Export Full Backup (JSON)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {products.length} products, {calculationHistory.length} history records
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                showConfirmDialog(
                  'Clear History',
                  'Are you sure you want to clear all calculation history records? Your catalog products will remain intact.',
                  clearAllHistory,
                  'Clear History'
                );
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <RotateCcw className="w-4 h-4" />
                <div>
                  <span className="text-xs font-bold block">Clear Calculation History</span>
                  <span className="text-[11px] text-slate-400">Remove all historical estimates</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                showConfirmDialog(
                  'Reset Everything',
                  'This will erase all custom products, calculation history, and restore default initial settings. This action is irreversible.',
                  resetAllData,
                  'Reset Database'
                );
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-4 h-4" />
                <div>
                  <span className="text-xs font-bold block">Factory Reset App</span>
                  <span className="text-[11px] text-slate-400">Reset local storage and restart fresh</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Legal & Support */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              About & Legal
            </h2>

            {[
              { label: 'About HisabBazaar', icon: HelpCircle, screen: 'about' as const },
              { label: 'Privacy Policy', icon: ShieldCheck, screen: 'privacy' as const },
              { label: 'Terms of Service', icon: Info, screen: 'terms' as const },
            ].map((item) => (
              <button
                key={item.screen}
                onClick={() => navigateTo(item.screen)}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
