import React from 'react';
import Link from 'next/link';
import { RefreshCw, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Returns & Refunds | Knot & Bloom — Handcrafted Crochet Luxury',
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-ivory-100 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="space-y-4 mb-10 pb-6 border-b border-sand-dark/40">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-gold-700">
          Client Peace of Mind
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-maroon-950">
          Returns & Refunds Policy
        </h1>
        <p className="text-xs text-charcoal-500">7-Day Effortless Palace Exchange Policy</p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-charcoal-700 leading-relaxed font-light">
        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-maroon-950">1. Our 7-Day Guarantee</h2>
          <p>
            We take pride in our heirloom crochet craftsmanship. If for any reason your treasure does not completely delight you, you may request a return or exchange within 7 days of verified parcel delivery.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-maroon-950">2. Eligibility for Return</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>The item must remain in its original, unworn, unwashed condition.</li>
            <li>All royal brand tags and decorative packaging must accompany the piece.</li>
            <li>Customized bespoke orders (e.g. customized names or special bridal threadings) are non-returnable unless defective.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-maroon-950">3. Complimentary Reverse Pickup</h2>
          <p>
            Upon receiving your return request via your My Account dashboard or email, we will arrange a complimentary pickup from your address within 24 to 48 hours.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-maroon-950">4. Refund Processing Time</h2>
          <p>
            Once our atelier workshop inspects and approves the returned creation, your resolution or refund is credited back promptly within 3–5 business days.
          </p>
        </section>

        <div className="pt-6 border-t border-sand-dark/40">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl btn-gold text-xs font-semibold shadow-sm"
          >
            <span>Request Assistance from Concierge</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
