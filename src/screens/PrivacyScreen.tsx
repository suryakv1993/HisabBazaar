import React from 'react';
import { InfoPage } from '../components/InfoPage';

export const PrivacyScreen: React.FC = () => {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="Your privacy matters to us. This policy explains how HisabBazaar collects, uses and protects your information."
      sections={[
        {
          heading: 'Information We Collect',
          paragraphs: [
            'HisabBazaar is designed to work primarily on your device. We do not require an account or online registration to use the core calculators.',
            'The business information you enter — such as seller name, business name, GSTIN, products, and calculation history — is stored locally on your device using your browser\'s local storage. It is not transmitted to our servers.',
          ],
        },
        {
          heading: 'Local Storage',
          paragraphs: [
            'We use browser local storage to save your settings, products, and calculation history so your data persists between visits. This data stays on your device and is never automatically uploaded anywhere.',
            'You can clear all stored data at any time from Settings → Data Management, or by clearing your browser\'s site data.',
          ],
        },
        {
          heading: 'How We Use Information',
          paragraphs: [
            'We use the locally stored information solely to power the calculators and features you use. We never sell, rent, or share your personal or business information with third parties for marketing purposes.',
          ],
        },
        {
          heading: 'Advertising & Links',
          paragraphs: [
            'The application shows in-app upgrade prompts and may display placeholder sponsor content. We do not serve third-party tracking ads. Outbound links to external services open in your browser at your own discretion.',
          ],
        },
        {
          heading: 'Children\'s Privacy',
          paragraphs: [
            'HisabBazaar is intended for business users aged 18 and above. We do not knowingly collect information from children.',
          ],
        },
        {
          heading: 'Changes to This Policy',
          paragraphs: [
            'We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated revision date.',
          ],
        },
      ]}
      lastUpdated="September 2026"
    />
  );
};
