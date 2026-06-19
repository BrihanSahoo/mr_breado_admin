// Common API envelopes
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  last: boolean;
}

// ============================================================================
// AUTH & ACCOUNT
// ============================================================================

export interface LoginRequest {
  email?: string;
  mobile?: string;
  password: string;
  fcmToken?: string;
  deviceType?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  data?: unknown;
}

export interface AdminProfileResponse {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
  emailChangeUsed?: string;
  createdAt: string;
}

export interface UpdateEmailRequest {
  email: string;
}

export interface UpdatePhoneRequest {
  phoneNumber: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface SendEmailOtpRequest {
  email: string;
}

export interface SendPasswordOtpRequest {
  email: string;
}

export interface AdminProfileUpdateRequest {
  name?: string;
  phoneNumber?: string;
}

// ============================================================================
// DASHBOARD
// ============================================================================

export interface AdminDashboardResponse {
  totalUsers: number;
  totalCustomers: number;
  totalSellers: number;
  totalDrivers: number;
  totalRestaurants: number;
  totalOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  totalPlatformFee: number;
  codCollected: number | boolean;
  onlinePaid: number | boolean;
  driverCashPending: number;
  restaurantPayable: number;
  adminCommission: number;
  cashLimitBlockedDrivers: number;
}

export interface AdminMrBreadoDashboardResponse {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  activeProducts: number;
  pendingOrders: number;
  preparingOrders: number;
  readyOrders: number;
}

// ============================================================================
// ORDERS
// ============================================================================

export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "READY_FOR_PICKUP"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "REJECTED";

export interface SellerOrderResponse {
  id: number;
  orderNumber: string;
  slug?: string;
  customerName: string;
  customerMobile: string;
  customerEmail?: string;
  status: OrderStatus | string;
  statusLabel?: string;
  paymentStatus?: string;
  paymentType?: string;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  tax: number;
  grandTotal: number;
  deliveryAddress?: string;
  createdAt: string;
  updatedAt?: string;
  orderType?: string;
  outletId?: number;
  outletName?: string;
  riderName?: string;
  riderPhone?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface SellerOrderDetailResponse extends SellerOrderResponse {
  restaurantCharges?: number;
  platformFee?: number;
  walletUsed?: number;
  estimatedDeliveryMinutes?: number;
  cancelledAt?: string;
  deliveredAt?: string;
  cancellationReason?: string;
}

export interface SellerOrderRejectRequest {
  reason: string;
}

// ============================================================================
// PRODUCTS
// ============================================================================

export interface ProductResponse {
  id: number;
  title: string;
  slug?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  images?: string;
  price: number;
  discountPrice?: number;
  effectivePrice?: number;
  currency?: string;
  isVeg?: boolean;
  isBestseller?: boolean;
  isAvailable?: boolean;
  isFeatured?: boolean;
  rating?: number;
  totalReviews?: number;
  preparationTime?: string;
  distanceKm?: number;
  restaurant?: string;
}

// Restaurants
export interface AdminRestaurantResponse {
  id: number;
  name: string;
  slug?: string;
  logo?: string;
  banner?: string;
  address?: string;
  city?: string;
  status?: string;
  verificationStatus?: string;
  visibilityStatus?: string;
  rating?: number;
  totalReviews?: number;
  productCount?: number | string;
  open?: boolean;
  featured?: boolean;
  promoted?: boolean;
  grossSales?: number;
  adminCommission?: number;
  restaurantPayable?: number;
  createdAt?: string;
}

// Users
export type UserRole = "USER" | "SELLER" | "DRIVER" | "ADMIN";
export interface AdminUserResponse {
  id: number;
  name: string;
  email?: string;
  mobile?: string;
  role: UserRole | string;
  profileImage?: string;
  walletBalance?: number;
  totalOrders?: number;
  totalReviews?: number;
  enabled?: boolean;
  blocked?: boolean;
  deleted?: boolean;
  createdAt?: string;
}

// Drivers cash
export interface AdminDriverCashResponse {
  profileId: number;
  driverId: number;
  driverName: string;
  driverEmail?: string;
  driverMobile?: string;
  online?: boolean;
  available?: boolean;
  verified?: boolean;
  verificationStatus?: string;
  blocked?: boolean;
  cashInHand?: number;
  cashLimit?: number;
  remainingLimit?: number;
  cashLimitBlocked?: number | boolean;
  totalCashCollected?: number;
  totalCashDeposited?: number;
  totalDeliveries?: number;
  totalEarnings?: number;
  pendingPayout?: number;
  paidEarnings?: number;
  upiId?: string;
  payoutAccount?: Record<string, unknown>;
  latestLocation?: { latitude?: number; longitude?: number; recordedAt?: string } | null;
  payouts?: Array<{ id: string; amount: number; status: string; periodStart?: string; periodEnd?: string; upiId?: string; paymentReference?: string; paidAt?: string; note?: string }>;
  orders?: Array<{ id?: number; orderNumber?: string; status?: string; total?: number; paymentMethod?: string; paymentStatus?: string; distanceKm?: number; outletName?: string; customerName?: string; deliveredAt?: string; createdAt?: string }>;
  verificationRequest?: { id?: string; status?: string; documents?: Array<{ url?: string; alt?: string }>; note?: string; createdAt?: string } | null;
  rating?: number;
}
export interface AdminDriverCashDepositRequest {
  amount: number;
  paymentMethod?: string;
  paymentReference?: string;
  note?: string;
}

// Banners
export interface BannerResponse {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  position?: string;
  offerType?: string;
  actionType?: string;
  actionValue?: number;
  discountType?: string;
  discountValue?: number;
  couponCode?: string | boolean;
  enabled?: boolean;
  active?: boolean;
  priority?: string | number;
  startsAt?: string;
  endsAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface BannerRequest {
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  position?: string;
  offerType?: string;
  actionType?: string;
  actionValue?: number;
  discountType?: string;
  discountValue?: number;
  couponCode?: string;
  enabled?: boolean;
  priority?: string | number;
  startsAt?: string;
  endsAt?: string;
}

// Offers
export interface OfferResponse {
  id: number;
  title?: string;
  name?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  image?: string;
  banner?: string;
  offerType?: string;
  type?: string;
  actionType?: string;
  actionValue?: number;
  couponCode?: string;
  discountType?: string;
  discountValue?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  active?: boolean;
  enabled?: boolean;
  startsAt?: string;
  endsAt?: string;
}
export type OfferRequest = Partial<OfferResponse>;

// Coupons
export interface Coupon {
  id: number;
  code: string;
  title?: string;
  description?: string;
  type?: string;
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount?: number;
  perUserLimit?: number;
  startsAt?: string;
  expiresAt?: string;
  enabled?: boolean;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface AdminCouponRequest {
  code: string;
  title?: string;
  description?: string;
  type?: string;
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  perUserLimit?: number;
  startsAt?: string;
  expiresAt?: string;
  enabled?: boolean;
  appliesToAllOutlets?: boolean;
  outletIds?: Array<string | number>;
}

// Payments
export interface AdminPaymentSummaryResponse {
  codCollected?: number | boolean;
  onlineSuccess?: number | boolean;
  failedAmount?: number;
  refundedAmount?: number;
  platformFee?: number;
  restaurantPayable?: number;
  adminCommission?: number;
  totalCollected?: number;
  totalTransactions?: number;
}
export interface AdminMrBreadoPaymentsResponse {
  codAmount?: number;
  onlineAmount?: number;
  failedAmount?: number;
  refundedAmount?: number;
  grossSales?: number;
  adminCommission?: number;
  restaurantPayable?: number;
  totalTransactions?: number;
}

// Settlements
export interface AdminRestaurantPayoutResponse {
  id: number;
  restaurantId: number;
  restaurantName: string;
  grossAmount?: number;
  commissionAmount?: number;
  payableAmount?: number;
  totalOrders?: number;
  status?: string;
  periodStart?: string;
  periodEnd?: string;
  paidAt?: string | boolean;
  paymentMethod?: string;
  paymentReference?: string;
  message?: string;
  createdAt?: string;
}
export interface AdminRestaurantPayoutPaidRequest {
  paymentMethod?: string;
  paymentReference?: string;
  message?: string;
}

// Reviews
export interface OrderReviewResponse {
  id: number;
  orderId: number;
  orderNumber: string;
  restaurantRating?: number;
  driverRating?: number;
  restaurantComment?: string;
  driverComment?: string;
  createdAt?: string;
}

// ============================================================================
// REPORTS
// ============================================================================

export interface RestaurantReportResponse {
  id: number;
  restaurantId: number;
  restaurantName: string;
  reportedBy?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "RESOLVED";
  reason?: string;
  description?: string;
  evidence?: string;
  createdAt?: string;
  updatedAt?: string;
  resolvedAt?: string;
}

export interface AdminReportStatusRequest {
  status: "PENDING" | "APPROVED" | "REJECTED" | "RESOLVED";
  reason?: string;
  comment?: string;
}

// ============================================================================
// MESSAGING
// ============================================================================

export interface AdminSellerMessageResponse {
  id: number;
  senderId: number;
  senderName: string;
  senderEmail?: string;
  recipientId: number;
  recipientName: string;
  subject?: string;
  message: string;
  isRead?: boolean;
  attachments?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminSellerMessageRequest {
  recipientId: number;
  subject?: string;
  message: string;
  attachments?: string[];
}

// ============================================================================
// PAYMENT LEDGER
// ============================================================================

export interface PaymentLedgerEntryResponse {
  id: number;
  transactionId: string;
  type: "DELIVERY" | "RESTAURANT" | "DRIVER" | "PLATFORM";
  amount: number;
  status: "SUCCESS" | "FAILED" | "PENDING";
  description?: string;
  reference?: string;
  createdAt?: string;
}

// ============================================================================
// ADDITIONAL TYPES
// ============================================================================

export interface DeliveryCashTransactionResponse {
  id: number;
  driverId: number;
  driverName: string;
  type: "DEPOSIT" | "COLLECTION" | "PAYMENT";
  amount: number;
  status: string;
  reference?: string;
  note?: string;
  createdAt?: string;
}

export interface BannerStatusRequest {
  enabled?: boolean;
  active?: boolean;
}

export interface AdminProductAvailabilityRequest {
  isAvailable: boolean;
}

export interface AdminMrBreadoProductRequest {
  title: string;
  subtitle?: string;
  description?: string;
  price: number;
  discountPrice?: number;
  image?: string;
  isVeg?: boolean;
  isBestseller?: boolean;
  preparationTime?: number;
  categoryId?: number;
}

export interface AdminRestaurantStatusRequest {
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
  reason?: string;
}

export interface AdminCouponStatusRequest {
  enabled: boolean;
}

export interface AdminSellerPayoutVerifyRequest {
  verified: boolean;
  verificationNote?: string;
}

export interface SellerPayoutAccountResponse {
  id: number;
  sellerId: number;
  sellerName?: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  verified?: boolean;
  verificationStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminPaymentSettingsResponse {
  platformCommissionPercentage?: number;
  minimumOrderAmount?: number;
  deliveryChargeBase?: number;
  taxPercentage?: number;
}

export interface AdminPaymentSettingsRequest {
  platformCommissionPercentage?: number;
  minimumOrderAmount?: number;
  deliveryChargeBase?: number;
  taxPercentage?: number;
}

export interface AdminPlatformSettingsResponse {
  platformName?: string;
  supportEmail?: string;
  supportPhone?: string;
  timezoneOffset?: number;
  maintenanceMode?: boolean;
}

export interface AdminPlatformSettingsRequest {
  platformName?: string;
  supportEmail?: string;
  supportPhone?: string;
  maintenanceMode?: boolean;
}
