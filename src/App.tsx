import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ProfitCalculatorScreen } from './screens/ProfitCalculatorScreen';
import { CalculationResultScreen } from './screens/CalculationResultScreen';
import { GSTCalculatorScreen } from './screens/GSTCalculatorScreen';
import { FeeCalculatorScreen } from './screens/FeeCalculatorScreen';
import { ProductsScreen } from './screens/ProductsScreen';
import { AddEditProductScreen } from './screens/AddEditProductScreen';
import { ProductDetailsScreen } from './screens/ProductDetailsScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { PremiumScreen } from './screens/PremiumScreen';
import { AboutScreen } from './screens/AboutScreen';
import { PrivacyScreen } from './screens/PrivacyScreen';
import { TermsScreen } from './screens/TermsScreen';
import { ContactScreen } from './screens/ContactScreen';
import { ResponsiveHeader } from './components/ResponsiveHeader';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { Snackbar } from './components/Snackbar';
import { ConfirmationModal } from './components/ConfirmationModal';

const MainRouter: React.FC = () => {
  const { 
    activeScreen, 
    selectedProduct 
  } = useApp();

  const renderScreen = () => {
    switch (activeScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'onboarding':
        return <OnboardingScreen />;
      case 'home':
        return <HomeScreen />;
      case 'calculator':
        return <ProfitCalculatorScreen />;
      case 'result':
        return <CalculationResultScreen />;
      case 'gst_calculator':
        return <GSTCalculatorScreen />;
      case 'fee_calculator':
        return <FeeCalculatorScreen />;
      case 'products':
        return <ProductsScreen />;
      case 'add_product':
        return <AddEditProductScreen />;
      case 'edit_product':
        return <AddEditProductScreen initialProduct={selectedProduct} />;
      case 'product_details':
        return <ProductDetailsScreen />;
      case 'reports':
        return <ReportsScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'premium':
        return <PremiumScreen />;
      case 'about':
        return <AboutScreen />;
      case 'privacy':
        return <PrivacyScreen />;
      case 'terms':
        return <TermsScreen />;
      case 'contact':
        return <ContactScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const isIntroScreen = ['splash', 'onboarding'].includes(activeScreen);

  // For splash & onboarding: full screen centered
  if (isIntroScreen) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800">
          {renderScreen()}
        </div>
        <Snackbar />
      </div>
    );
  }

  // Full-Width Responsive Web & Mobile Layout
  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans antialiased">
      {/* Universal Responsive Header (Desktop Nav + Mobile Top Bar) */}
      <ResponsiveHeader />

      {/* Responsive Page Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 md:py-4">
        {renderScreen()}
      </main>

      {/* Site Footer (hidden on intro screens) */}
      <Footer />

      {/* Bottom Navigation for Mobile Devices only (hidden on md and larger) */}
      <BottomNav />

      {/* Global Toast Snackbar */}
      <Snackbar />

      {/* Global Confirmation Modal */}
      <ConfirmationModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
