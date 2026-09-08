import React from 'react';
import { InfoPage } from '../components/InfoPage';

export const AboutScreen: React.FC = () => {
  return (
    <InfoPage
      eyebrow="About"
      title="About HisabBazaar"
      description="HisabBazaar is a modern financial utility platform designed specifically for Indian e-commerce sellers. We help you calculate your real profit after every marketplace fee, tax and operating cost — before you list a single product."
      sections={[
        {
          heading: 'Our Mission',
          paragraphs: [
            'Every day, thousands of Indian sellers on Flipkart, Amazon, Meesho and Shopify run their businesses without knowing their true margins. Marketplace commissions, fixed closing fees, shipping charges, payment gateway fees, and 18% GST on services quietly eat into profits.',
            'HisabBazaar exists to bring complete financial clarity to sellers. We turn complex fee structures and tax rules into simple, accurate, instant calculations — in Indian Rupees, with Indian GST rules, and with language that makes sense for Indian business owners.',
          ],
        },
        {
          heading: 'Who It\'s For',
          paragraphs: [
            'HisabBazaar is built for Flipkart sellers, Amazon sellers, Meesho resellers, Shopify store owners, D2C brands, small online businesses and Indian retailers who want to know their exact profit before they commit inventory, or after every sale.',
          ],
        },
        {
          heading: 'What We Offer',
          paragraphs: [
            'A complete suite of tools: a marketplace profit calculator, GST (inclusive/exclusive) calculator, marketplace fee & payout matrix, product catalog with margin tracking, business reports with export options, and calculation history.',
            'All calculations follow current Indian GST slabs (0%, 5%, 12%, 18%, 28%), standard marketplace commission matrices, and 18% GST on marketplace services.',
          ],
        },
        {
          heading: 'Our Values',
          paragraphs: [
            'Accuracy — every formula is verified against real marketplace rate cards. Transparency — we show every fee deduction in plain numbers. Simplicity — no unnecessary complexity, just clear financial answers.',
          ],
        },
      ]}
      lastUpdated="September 2026"
    />
  );
};
