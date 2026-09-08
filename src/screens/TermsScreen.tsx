import React from 'react';
import { InfoPage } from '../components/InfoPage';

export const TermsScreen: React.FC = () => {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Terms of Service"
      description="Please read these terms carefully before using HisabBazaar. By using the application, you agree to these terms."
      sections={[
        {
          heading: 'Acceptance of Terms',
          paragraphs: [
            'By accessing or using HisabBazaar, you confirm that you accept these Terms of Service and agree to comply with them. If you do not agree, please do not use the application.',
          ],
        },
        {
          heading: 'Use of the Service',
          paragraphs: [
            'HisabBazaar is provided as a financial planning and calculation tool for e-commerce sellers. The calculations and figures are estimates intended to guide your decisions. Always verify final amounts with your marketplace, bank, CA, or tax advisor.',
          ],
        },
        {
          heading: 'No Financial or Legal Advice',
          paragraphs: [
            'HisabBazaar does not provide professional tax, accounting, legal, or investment advice. Marketplace fee structures, GST rules and tax rates may change. You are responsible for verifying the accuracy of any figures against official sources and consulting professionals where required.',
          ],
        },
        {
          heading: 'Intellectual Property',
          paragraphs: [
            'All content, branding, code, and design elements of HisabBazaar are the property of HisabBazaar unless otherwise stated. You may not copy, modify, distribute or commercially exploit any part of the application without prior written permission.',
          ],
        },
        {
          heading: 'Limitation of Liability',
          paragraphs: [
            'HisabBazaar is provided "as is" without any warranties of any kind, express or implied. To the maximum extent permitted by law, we will not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the application or reliance on its calculations.',
          ],
        },
        {
          heading: 'Changes to the Service',
          paragraphs: [
            'We may modify, suspend or discontinue the application, features, or these terms at any time. You agree that we are not liable to you for any such change.',
          ],
        },
        {
          heading: 'Governing Law',
          paragraphs: [
            'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of India.',
          ],
        },
      ]}
      lastUpdated="September 2026"
    />
  );
};
