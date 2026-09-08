import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ActiveScreen, 
  NavigationTab, 
  ProfitCalculationInput, 
  ProfitCalculationResult, 
  ProductItem, 
  BusinessSettings, 
  AppNotification,
  MarketplaceType,
  GSTRate
} from '../types';
import { MARKETPLACE_PRESETS, calculateProfit } from '../utils/calculatorEngine';
import { INITIAL_SETTINGS, SEED_NOTIFICATIONS, getInitialProducts, getInitialHistory } from '../data/seedData';

interface AppContextType {
  activeScreen: ActiveScreen;
  navigateTo: (screen: ActiveScreen) => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  
  // Calculations
  currentResult: ProfitCalculationResult | null;
  setCurrentResult: (result: ProfitCalculationResult | null) => void;
  calculatorDraft: ProfitCalculationInput;
  setCalculatorDraft: React.Dispatch<React.SetStateAction<ProfitCalculationInput>>;
  calculationHistory: ProfitCalculationResult[];
  saveCalculationToHistory: (result: ProfitCalculationResult) => void;
  deleteCalculationFromHistory: (id: string) => void;
  clearAllHistory: () => void;
  
  // Products
  products: ProductItem[];
  addProduct: (product: Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt' | 'netProfit' | 'profitMargin' | 'status'>) => ProductItem;
  updateProduct: (id: string, updates: Partial<ProductItem>) => void;
  deleteProduct: (id: string) => void;
  selectedProduct: ProductItem | null;
  setSelectedProduct: (product: ProductItem | null) => void;
  loadProductIntoCalculator: (product: ProductItem) => void;

  // Settings & Theme
  settings: BusinessSettings;
  updateSettings: (updates: Partial<BusinessSettings>) => void;
  togglePro: () => void;
  resetAllData: () => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // UI States
  snackbar: { message: string; type: 'success' | 'error' | 'info' } | null;
  showSnackbar: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideSnackbar: () => void;

  // Confirmation Modal
  confirmDialog: {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  } | null;
  showConfirmDialog: (title: string, message: string, onConfirm: () => void, confirmText?: string) => void;
  closeConfirmDialog: () => void;

  // Onboarding
  hasSeenOnboarding: boolean;
  completeOnboarding: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'sellerprofit_settings_v1',
  PRODUCTS: 'sellerprofit_products_v1',
  HISTORY: 'sellerprofit_history_v1',
  NOTIFICATIONS: 'sellerprofit_notifs_v1',
  ONBOARDING: 'sellerprofit_onboarding_v1',
};

// --- Hash-based routing helpers ------------------------------------------
// Map each screen to a clean, shareable hash URL. This provides real URLs,
// browser back/forward support and deep-linking (direct URL refresh).
const ROUTE_BY_SCREEN: Record<ActiveScreen, string> = {
  splash: '/',
  onboarding: '/onboarding',
  home: '/',
  calculator: '/calculator',
  result: '/result',
  gst_calculator: '/gst-calculator',
  fee_calculator: '/fee-calculator',
  products: '/products',
  add_product: '/products/new',
  edit_product: '/products/edit',
  product_details: '/products/detail',
  reports: '/reports',
  history: '/history',
  settings: '/settings',
  premium: '/premium',
  about: '/about',
  privacy: '/privacy',
  terms: '/terms',
  contact: '/contact',
};

const SCREEN_BY_ROUTE: Record<string, ActiveScreen> = {
  '/': 'home',
  '/onboarding': 'onboarding',
  '/calculator': 'calculator',
  '/result': 'result',
  '/gst-calculator': 'gst_calculator',
  '/fee-calculator': 'fee_calculator',
  '/products': 'products',
  '/products/new': 'add_product',
  '/products/edit': 'edit_product',
  '/products/detail': 'product_details',
  '/reports': 'reports',
  '/history': 'history',
  '/settings': 'settings',
  '/premium': 'premium',
  '/about': 'about',
  '/privacy': 'privacy',
  '/terms': 'terms',
  '/contact': 'contact',
};

function getScreenFromHash(): ActiveScreen {
  try {
    const hash = window.location.hash.replace(/^#/, '');
    return SCREEN_BY_ROUTE[hash] || 'home';
  } catch {
    return 'home';
  }
}

function isIntroRoute(): boolean {
  const fromHash = getScreenFromHash();
  return fromHash === 'splash' || fromHash === 'onboarding';
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Splash & Onboarding
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ONBOARDING) === 'true';
    } catch {
      return false;
    }
  });

  // Initialize from URL hash so direct refreshes / deep links land correctly.
  // Intro (splash/onboarding) only shows when no route was explicitly requested.
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(() => {
    try {
      const hashPresent = window.location.hash && window.location.hash.length > 1;
      if (hashPresent) {
        return getScreenFromHash();
      }
    } catch {
      // ignore
    }
    return 'splash';
  });
  const [activeTab, setActiveTabState] = useState<NavigationTab>('home');

  // Settings
  const [settings, setSettings] = useState<BusinessSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Products
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : getInitialProducts();
    } catch {
      return getInitialProducts();
    }
  });

  // History
  const [calculationHistory, setCalculationHistory] = useState<ProfitCalculationResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : getInitialHistory();
    } catch {
      return getInitialHistory();
    }
  });

  // Notifications (validated load: handle missing/corrupt localStorage safely)
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (!saved) return SEED_NOTIFICATIONS;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Defensive: ensure every item has the expected shape
        return parsed
          .filter((n) => n && typeof n === 'object')
          .map((n) => ({
            id: typeof n.id === 'string' ? n.id : `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            title: typeof n.title === 'string' ? n.title : 'Update',
            message: typeof n.message === 'string' ? n.message : '',
            time: typeof n.time === 'string' ? n.time : 'Just now',
            read: typeof n.read === 'boolean' ? n.read : false,
            type: ['alert', 'tip', 'update'].includes(n.type) ? n.type : 'update',
          }));
      }
      return SEED_NOTIFICATIONS;
    } catch {
      return SEED_NOTIFICATIONS;
    }
  });

  // Calculator Draft
  const defaultPreset = MARKETPLACE_PRESETS[settings.defaultMarketplace || 'flipkart'];
  const [calculatorDraft, setCalculatorDraft] = useState<ProfitCalculationInput>({
    productName: '',
    sku: '',
    productCost: 180,
    sellingPrice: 499,
    quantity: 1,
    gstRate: settings.defaultGstRate || 18,
    marketplace: settings.defaultMarketplace || 'flipkart',
    commissionRate: defaultPreset.commissionRate,
    fixedFee: defaultPreset.fixedFee,
    shippingFee: defaultPreset.shippingFee,
    paymentCollectionFeeRate: defaultPreset.paymentCollectionFeeRate,
    paymentCollectionFixedFee: defaultPreset.paymentCollectionFixedFee,
    packagingCost: 10,
    advertisingCost: 25,
    discount: 0,
    otherExpenses: 5,
    returnAllowanceRate: 6,
    targetProfitForRecommendation: 100,
  });

  const [currentResult, setCurrentResult] = useState<ProfitCalculationResult | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Snackbars & Modals
  const [snackbar, setSnackbar] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  } | null>(null);

  // Synchronize storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(calculationHistory));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [calculationHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [notifications]);

  // Apply dark mode class to html document
  useEffect(() => {
    const isDark = settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Auto transition from splash
  useEffect(() => {
    if (activeScreen === 'splash') {
      const timer = setTimeout(() => {
        if (!hasSeenOnboarding) {
          navigateTo('onboarding');
        } else {
          navigateTo('home');
        }
      }, 1800);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScreen, hasSeenOnboarding]);

  const navigateTo = (screen: ActiveScreen) => {
    setActiveScreen(screen);
    // Sync URL hash so routing, back/forward and refresh all work.
    try {
      const target = ROUTE_BY_SCREEN[screen];
      if (target && window.location.hash !== '#' + target) {
        window.location.hash = target;
      }
    } catch {
      // ignore
    }
    // Sync tab when screen corresponds to a bottom tab
    if (screen === 'home') setActiveTabState('home');
    else if (screen === 'calculator') setActiveTabState('calculator');
    else if (screen === 'products') setActiveTabState('products');
    else if (screen === 'reports') setActiveTabState('reports');
    else if (screen === 'settings') setActiveTabState('settings');
  };

  // Keep activeScreen in sync with browser navigation (back/forward/refresh).
  useEffect(() => {
    const handleHashChange = () => {
      const next = getScreenFromHash();
      setActiveScreen(next);
      if (next === 'home') setActiveTabState('home');
      else if (next === 'calculator') setActiveTabState('calculator');
      else if (next === 'products') setActiveTabState('products');
      else if (next === 'reports') setActiveTabState('reports');
      else if (next === 'settings') setActiveTabState('settings');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const setActiveTab = (tab: NavigationTab) => {
    setActiveTabState(tab);
    setActiveScreen(tab);
    try {
      const target = ROUTE_BY_SCREEN[tab];
      if (target && window.location.hash !== '#' + target) {
        window.location.hash = target;
      }
    } catch {
      // ignore
    }
  };

  const showSnackbar = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setSnackbar({ message, type });
    setTimeout(() => {
      setSnackbar((prev) => (prev?.message === message ? null : prev));
    }, 3200);
  };

  const hideSnackbar = () => setSnackbar(null);

  const showConfirmDialog = (title: string, message: string, onConfirm: () => void, confirmText?: string) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      confirmText: confirmText || 'Delete',
      onConfirm: () => {
        onConfirm();
        setConfirmDialog(null);
      },
    });
  };

  const closeConfirmDialog = () => setConfirmDialog(null);

  const completeOnboarding = () => {
    setHasSeenOnboarding(true);
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true');
    } catch {}
    navigateTo('home');
    showSnackbar('Welcome to SellerProfit! 🚀', 'success');
  };

  const updateSettings = (updates: Partial<BusinessSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    showSnackbar('Settings updated', 'success');
  };

  const togglePro = () => {
    setSettings((prev) => {
      const nextPro = !prev.isPro;
      return {
        ...prev,
        isPro: nextPro,
        showAds: !nextPro,
      };
    });
    showSnackbar(settings.isPro ? 'Switched to Free Plan' : '🎉 Pro Plan Activated!', 'success');
  };

  const saveCalculationToHistory = (result: ProfitCalculationResult) => {
    setCalculationHistory((prev) => [result, ...prev.filter((c) => c.id !== result.id)]);
    showSnackbar('Calculation saved to history', 'success');
  };

  const deleteCalculationFromHistory = (id: string) => {
    setCalculationHistory((prev) => prev.filter((c) => c.id !== id));
    showSnackbar('Calculation deleted', 'info');
  };

  const clearAllHistory = () => {
    setCalculationHistory([]);
    showSnackbar('History cleared', 'info');
  };

  const addProduct = (prodData: Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt' | 'netProfit' | 'profitMargin' | 'status'>): ProductItem => {
    const calc = calculateProfit({
      productName: prodData.name,
      sku: prodData.sku,
      productCost: prodData.productCost,
      sellingPrice: prodData.sellingPrice,
      quantity: 1,
      gstRate: prodData.gstRate,
      marketplace: prodData.marketplace,
      commissionRate: prodData.commissionRate,
      fixedFee: prodData.fixedFee,
      shippingFee: prodData.shippingFee,
      paymentCollectionFeeRate: prodData.marketplace === 'shopify' ? 2.36 : 2.0,
      paymentCollectionFixedFee: 0,
      packagingCost: prodData.packagingCost,
      advertisingCost: prodData.advertisingCost,
      discount: 0,
      otherExpenses: prodData.otherExpenses,
      returnAllowanceRate: prodData.returnAllowanceRate,
    });

    let status: 'profitable' | 'low_margin' | 'loss' = 'profitable';
    if (calc.netProfit <= 0) status = 'loss';
    else if (calc.profitMarginPercent < 15) status = 'low_margin';

    const newProduct: ProductItem = {
      ...prodData,
      id: `prod-${Date.now()}`,
      netProfit: calc.netProfit,
      profitMargin: calc.profitMarginPercent,
      status,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setProducts((prev) => [newProduct, ...prev]);
    showSnackbar(`"${newProduct.name}" saved to products`, 'success');
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<ProductItem>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const merged = { ...p, ...updates, updatedAt: Date.now() };
        // Recalculate profit metrics
        const calc = calculateProfit({
          productName: merged.name,
          sku: merged.sku,
          productCost: merged.productCost,
          sellingPrice: merged.sellingPrice,
          quantity: 1,
          gstRate: merged.gstRate,
          marketplace: merged.marketplace,
          commissionRate: merged.commissionRate,
          fixedFee: merged.fixedFee,
          shippingFee: merged.shippingFee,
          paymentCollectionFeeRate: merged.marketplace === 'shopify' ? 2.36 : 2.0,
          paymentCollectionFixedFee: 0,
          packagingCost: merged.packagingCost,
          advertisingCost: merged.advertisingCost,
          discount: 0,
          otherExpenses: merged.otherExpenses,
          returnAllowanceRate: merged.returnAllowanceRate,
        });

        let status: 'profitable' | 'low_margin' | 'loss' = 'profitable';
        if (calc.netProfit <= 0) status = 'loss';
        else if (calc.profitMarginPercent < 15) status = 'low_margin';

        const updatedProd = {
          ...merged,
          netProfit: calc.netProfit,
          profitMargin: calc.profitMarginPercent,
          status,
        };
        if (selectedProduct?.id === id) {
          setSelectedProduct(updatedProd);
        }
        return updatedProd;
      })
    );
    showSnackbar('Product updated', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (selectedProduct?.id === id) {
      setSelectedProduct(null);
    }
    showSnackbar('Product removed', 'info');
  };

  const loadProductIntoCalculator = (product: ProductItem) => {
    setCalculatorDraft({
      productName: product.name,
      sku: product.sku,
      productCost: product.productCost,
      sellingPrice: product.sellingPrice,
      quantity: 1,
      gstRate: product.gstRate,
      marketplace: product.marketplace,
      commissionRate: product.commissionRate,
      fixedFee: product.fixedFee,
      shippingFee: product.shippingFee,
      paymentCollectionFeeRate: product.marketplace === 'shopify' ? 2.36 : 2.0,
      paymentCollectionFixedFee: 0,
      packagingCost: product.packagingCost,
      advertisingCost: product.advertisingCost,
      discount: 0,
      otherExpenses: product.otherExpenses,
      returnAllowanceRate: product.returnAllowanceRate,
      targetProfitForRecommendation: 100,
    });
    navigateTo('calculator');
    showSnackbar(`Loaded "${product.name}" into calculator`, 'info');
  };

  const resetAllData = () => {
    localStorage.clear();
    setProducts(getInitialProducts());
    setCalculationHistory(getInitialHistory());
    setSettings(INITIAL_SETTINGS);
    setNotifications(SEED_NOTIFICATIONS);
    showSnackbar('App data restored to default', 'info');
    navigateTo('home');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showSnackbar('All notifications marked as read', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeScreen,
        navigateTo,
        activeTab,
        setActiveTab,
        currentResult,
        setCurrentResult,
        calculatorDraft,
        setCalculatorDraft,
        calculationHistory,
        saveCalculationToHistory,
        deleteCalculationFromHistory,
        clearAllHistory,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        selectedProduct,
        setSelectedProduct,
        loadProductIntoCalculator,
        settings,
        updateSettings,
        togglePro,
        resetAllData,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        snackbar,
        showSnackbar,
        hideSnackbar,
        confirmDialog,
        showConfirmDialog,
        closeConfirmDialog,
        hasSeenOnboarding,
        completeOnboarding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
