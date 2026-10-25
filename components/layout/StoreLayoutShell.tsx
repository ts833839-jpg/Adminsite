'use client';

import React from 'react';

export function StoreLayoutShell({ children }: { children: React.ReactNode }) {
  // Pure Admin Studio site: zero customer storefront chrome
  return <>{children}</>;
}
