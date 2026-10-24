// Types for Knot & Bloom E-Commerce Platform

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  phone?: string | null;
  avatar?: string | null;
  createdAt: string;
}

export interface ProductVariantType {
  id: string;
  name: string;
  sku?: string | null;
  price?: number | null;
  stock: number;
  size?: string | null;
  color?: string | null;
  colorHex?: string | null;
}

export interface ProductImageType {
  id: string;
  url: string;
  alt?: string | null;
  isPrimary: boolean;
  order: number;
}

export interface ReviewType {
  id: string;
  productId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  rating: number;
  title?: string | null;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  subtitle?: string | null;
  description: string;
  details?: string | null;
  materials?: string | null;
  dimensions?: string | null;
  careInstructions?: string | null;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  price: number;
  mrp: number;
  discountPercent: number;
  stock: number;
  sku: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isUnder499: boolean;
  badge?: string | null;
  tags?: string | null;
  images: ProductImageType[];
  variants?: ProductVariantType[];
  reviews?: ReviewType[];
  createdAt: string;
}

export interface CategoryType {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  bannerImage?: string | null;
  order: number;
  isActive: boolean;
  _count?: {
    products: number;
  };
}

export interface CartItemType {
  id: string;
  productId: string;
  product: ProductType;
  variantId?: string | null;
  variant?: ProductVariantType | null;
  quantity: number;
}

export interface CartType {
  id: string;
  items: CartItemType[];
  subtotal: number;
  total: number;
  discount: number;
}

export interface WishlistItemType {
  id: string;
  productId: string;
  product: ProductType;
  createdAt: string;
}

export interface AddressType {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  landmark?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export type PaymentMethod = 'UPI' | 'CARD' | 'DEBIT' | 'NETBANKING' | 'COD';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface OrderItemType {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  variantName?: string | null;
}

export interface OrderType {
  id: string;
  orderNumber: string;
  userId: string;
  user?: SafeUser;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  couponCode?: string | null;
  trackingNumber?: string | null;
  estimatedDeliveryDate?: string | null;
  shippingAddressSnapshot: string;
  customerNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemType[];
}

export interface CouponType {
  id: string;
  code: string;
  description?: string | null;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number | null;
  usageLimit?: number | null;
  usageCount: number;
  expiresAt?: string | null;
  isActive: boolean;
}
