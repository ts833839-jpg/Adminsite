'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  ShoppingBag,
  Users,
  Boxes,
  Ticket,
  BarChart3,
  ExternalLink,
  ShieldCheck,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  // If on login page, don't show admin chrome
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-charcoal-950">{children}</div>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex items-center justify-center text-ivory-100">
        <div className="text-center space-y-3">
          <span className="text-3xl text-gold-500 font-serif inline-block animate-spin">⚜</span>
          <p className="font-serif text-sm text-gold-300">Verifying Administrative Clearance...</p>
        </div>
      </div>
    );
  }

  // Not logged in or not an ADMIN: Block completely
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-charcoal-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-charcoal-900 border border-gold-500/40 rounded-3xl p-8 text-center space-y-5 shadow-royal-lg">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-ivory-100">
            Restricted Admin Console
          </h2>
          <p className="text-xs text-ivory-400 leading-relaxed">
            This area requires verified administrator credentials. Unauthorized access attempts are monitored and prohibited.
          </p>
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl btn-gold text-xs font-semibold shadow-gold-glow"
          >
            Authenticate at Admin Login
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: 'Atelier Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Creations Portfolio', href: '/admin/products', icon: Package },
    { label: 'Add New Creation', href: '/admin/products/new', icon: PlusCircle },
    { label: 'Collections', href: '/admin/categories', icon: FolderTree },
    { label: 'Client Inquiries', href: '/admin/inquiries', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-charcoal-950 text-ivory-100 border-r border-gold-500/20 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Admin Title */}
          <div className="p-6 border-b border-gold-500/15">
            <Link href="/admin" className="flex items-center gap-2 group">
              <span className="text-gold-400 text-lg font-serif">⚜</span>
              <span className="font-serif text-xl font-bold tracking-[0.16em] text-ivory-100 group-hover:text-gold-400 transition-colors">
                KNOT & BLOOM
              </span>
            </Link>
            <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold uppercase tracking-wider text-gold-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Palace Command Center</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-xs font-medium">
            {menuItems.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-maroon-900 text-gold-300 font-bold border border-gold-500/40 shadow-sm'
                      : 'text-ivory-400 hover:text-ivory-100 hover:bg-charcoal-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-gold-500/70'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & External Store Link */}
        <div className="p-4 border-t border-gold-500/15 space-y-2">
          <a
            href="https://knotndbloom.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-gold-400 hover:bg-charcoal-900 transition-colors"
          >
            <span>View Live Customer Site ↗</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-red-400 hover:bg-red-950/40 rounded-xl transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace Area */}
      <main className="flex-1 p-6 sm:p-10 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
