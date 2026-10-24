import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | Date): string {
  const d = new Date(dateString);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export function getProductImageUrl(imagePath?: string | null): string {
  if (!imagePath) return '/products/placeholder-royal.svg';
  // If it's a full remote URL (Unsplash/Cloudinary) or already starts with /
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/')) {
    return imagePath;
  }
  // Otherwise resolve inside /products/
  return `/products/${imagePath}`;
}

export const ORDER_STATUS_STEPS = [
  { key: 'ORDERED', label: 'Ordered', description: 'Order placed & confirmed' },
  { key: 'PACKED', label: 'Packed', description: 'Carefully wrapped at palace hub' },
  { key: 'SHIPPED', label: 'Shipped', description: 'Handed to express courier' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', description: 'Arriving today at your doorstep' },
  { key: 'DELIVERED', label: 'Delivered', description: 'Treasured parcel delivered' },
];

export function getStatusStepIndex(status: string): number {
  switch (status.toUpperCase()) {
    case 'PENDING':
    case 'CONFIRMED':
      return 0;
    case 'PROCESSING':
    case 'PACKED':
      return 1;
    case 'SHIPPED':
      return 2;
    case 'OUT_FOR_DELIVERY':
      return 3;
    case 'DELIVERED':
      return 4;
    case 'CANCELLED':
    case 'RETURNED':
      return -1;
    default:
      return 0;
  }
}
