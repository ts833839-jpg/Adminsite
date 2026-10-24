import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Knot & Bloom Boutique',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ivory-100 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="space-y-4 mb-10 pb-6 border-b border-sand-dark/40">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-gold-700">
          Trust & Confidentiality
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-maroon-950">
          Privacy Policy
        </h1>
        <p className="text-xs text-charcoal-500">Last updated: October 2026</p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-charcoal-700 leading-relaxed font-light">
        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-maroon-950">1. Our Royal Promise</h2>
          <p>
            At Knot & Bloom, safeguarding your privacy is treated with the highest dignity. We collect only the information necessary to fulfill your handcrafted orders, provide real-time courier tracking, and personalize your luxury shopping experience.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-maroon-950">2. Information We Collect</h2>
          <p>
            We collect personal identification data such as your name, delivery address, phone number, and email address when you create an account, place an order, or subscribe to our royal gazette. Payment data is processed securely through encrypted tokenized gateways and is never stored in plaintext on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-maroon-950">3. How Your Data is Utilized</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To process, dispatch, and track your handcrafted crochet parcels.</li>
            <li>To communicate SMS shipping alerts and order confirmations.</li>
            <li>To provide personalized concierge support for custom inquiries.</li>
            <li>To prevent fraudulent transactions and maintain platform security.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-maroon-950">4. Data Sharing & Third Parties</h2>
          <p>
            We do not sell, rent, or lease your personal information to third parties. We share delivery information strictly with our verified air courier partners (e.g. DTDC, Delhivery, Bluedart) solely for completing delivery to your doorstep.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-maroon-950">5. Your Rights</h2>
          <p>
            You have the right to inspect, update, or request the deletion of your account records at any time. Simply connect with our privacy officer at <span className="font-semibold text-maroon-900">privacy@knotandbloom.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
