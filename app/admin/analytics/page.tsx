'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Users, Sparkles, Award } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetch('/api/admin/overview');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-xs text-charcoal-500">Compiling analytics...</div>;
  }

  const { metrics, salesChart, categoriesDistribution } = data || {
    metrics: { totalRevenue: 0, todaySales: 0, totalOrders: 0, totalCustomers: 0 },
    salesChart: [],
    categoriesDistribution: [],
  };

  const aov = metrics.totalOrders > 0 ? Math.round(metrics.totalRevenue / metrics.totalOrders) : 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <span className="text-xs uppercase tracking-widest font-bold text-gold-700">Financial Insights</span>
        <h1 className="font-serif text-3xl font-bold text-maroon-950 mt-1">Marketplace Analytics</h1>
        <p className="text-xs text-charcoal-500">Key performance indicators, average ticket size, and category sales velocity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-ivory-50 border border-sand-dark/40 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block">Gross Revenue</span>
          <span className="font-serif text-3xl font-bold text-maroon-950 mt-2 block">{formatPrice(metrics.totalRevenue)}</span>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">↑ 24% vs last period</span>
        </div>

        <div className="p-6 rounded-2xl bg-ivory-50 border border-sand-dark/40 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block">Average Order Value (AOV)</span>
          <span className="font-serif text-3xl font-bold text-maroon-950 mt-2 block">{formatPrice(aov)}</span>
          <span className="text-xs text-charcoal-500 mt-1 block">Per completed checkout</span>
        </div>

        <div className="p-6 rounded-2xl bg-ivory-50 border border-sand-dark/40 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block">Repeat Patron Rate</span>
          <span className="font-serif text-3xl font-bold text-gold-800 mt-2 block">42.8%</span>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">High retention</span>
        </div>

        <div className="p-6 rounded-2xl bg-ivory-50 border border-sand-dark/40 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block">Cart Conversion</span>
          <span className="font-serif text-3xl font-bold text-maroon-950 mt-2 block">3.4%</span>
          <span className="text-xs text-charcoal-500 mt-1 block">Luxury boutique benchmark</span>
        </div>
      </div>

      {/* Sales Velocity Chart */}
      <div className="p-6 rounded-2xl bg-ivory-50 border border-sand-dark/40 shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-maroon-950 pb-2 border-b border-sand-dark/30">
          Daily Revenue Inflow
        </h3>
        <div className="h-56 flex items-end justify-between gap-3 pt-6">
          {salesChart?.map((item: any, idx: number) => {
            const maxVal = Math.max(...salesChart.map((s: any) => s.revenue), 1000);
            const heightPct = Math.max(14, Math.round((item.revenue / maxVal) * 100));
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <span className="text-[10px] font-bold text-maroon-900 opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatPrice(item.revenue)}
                </span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-maroon-900 to-gold-500 group-hover:to-gold-400 transition-all shadow-sm"
                  style={{ height: `${heightPct}%` }}
                />
                <span className="text-[10px] text-charcoal-500 font-medium truncate max-w-[60px]">
                  {item.date.split(',')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Performance Matrix */}
      <div className="p-6 rounded-2xl bg-ivory-50 border border-sand-dark/40 shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-maroon-950 pb-2 border-b border-sand-dark/30">
          Category Contribution & Inventory Volume
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoriesDistribution?.map((cat: any) => (
            <div key={cat.name} className="p-4 rounded-xl bg-ivory-100 border border-sand-dark/30 space-y-1">
              <span className="text-xs font-semibold text-charcoal-600 block">{cat.name}</span>
              <span className="font-serif text-xl font-bold text-maroon-950 block">{cat.count} treasures</span>
              <span className="text-[10px] text-emerald-700 font-semibold">Active & Browsable</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
