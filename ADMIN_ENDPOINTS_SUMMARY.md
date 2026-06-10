# Admin Endpoints Complete Reference

**Base URL:** `https://food-delivery-digontom.onrender.com/api` (Production)  
**Local Base URL:** `http://localhost:8080/api` (Development)  
**Authentication:** Bearer token in `Authorization` header (`{{adminToken}}`)  
**Standard Response Format:**

```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

---

## Table of Contents

1. [Account Management](#account-management)
2. [Profile & Settings](#profile--settings)
3. [Banners](#banners)
4. [Dashboard & Analytics](#dashboard--analytics)
5. [Driver Management](#driver-management)
6. [Mr. Breado Operations](#mr-breado-operations)
7. [Restaurants Management](#restaurants-management)
8. [Restaurant Settlements & Payouts](#restaurant-settlements--payouts)
9. [Users Management](#users-management)
10. [Payments & Ledger](#payments--ledger)
11. [Coupons & Promotions](#coupons--promotions)
12. [Offers](#offers)
13. [Reviews](#reviews)
14. [Messaging](#messaging)
15. [Seller Payout Accounts](#seller-payout-accounts)
16. [Reports](#reports)
17. [Storage](#storage)

---

## Account Management

### PUT /admin/account/email

Update admin email address

- **Auth:** Admin (Bearer {{adminToken}})
- **Request Body:** `UpdateEmailRequest` (empty JSON)
- **Response:** `AdminProfileResponse`
- **Fields:**
  - `id`: Long
  - `name`: String
  - `email`: String
  - `phoneNumber`: String
  - `role`: String (USER)
  - `status`: String (PENDING)
  - `emailChangeUsed`: String
  - `createdAt`: ISO DateTime

### POST /admin/account/email/otp

Send OTP for email verification

- **Auth:** Admin
- **Request Body:** `SendEmailOtpRequest` (empty)
- **Response:** Void (null data)

### PUT /admin/account/password

Update admin password

- **Auth:** Admin
- **Request Body:** `UpdatePasswordRequest` (empty)
- **Response:** Void (null data)

### POST /admin/account/password/otp

Send OTP for password change verification

- **Auth:** Admin
- **Request Body:** `SendPasswordOtpRequest`
  ```json
  {
    "currentPassword": "Password@123",
    "newPassword": "Password@123"
  }
  ```
- **Response:** Void

### PUT /admin/account/phone

Update admin phone number

- **Auth:** Admin
- **Request Body:** `UpdatePhoneRequest` (empty)
- **Response:** `AdminProfileResponse`

### GET /admin/account/profile

Get current admin account profile

- **Auth:** Admin
- **Query Params:** None
- **Response:** `AdminProfileResponse`

---

## Profile & Settings

### GET /admin/profile

Get admin profile (main profile endpoint)

- **Auth:** Admin
- **Response:** `AdminProfileResponse`

### PUT /admin/profile

Update admin profile information

- **Auth:** Admin
- **Request Body:** `AdminProfileUpdateRequest`
  ```json
  {
    "name": "sample-name",
    "mobile": "9876543210",
    "profileImage": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "upiId": 1,
    "bankAccount": "sample"
  }
  ```
- **Response:** `AdminProfileResponse`

---

## Banners

### GET /admin/banners/

List all banners with pagination

- **Auth:** Admin
- **Query Parameters:**
  - `page`: int (default: 1)
  - `perPage`: int (default: 20)
- **Response:** `PageResponse<BannerResponse>`
- **Banner Fields:**
  - `id`, `title`, `subtitle`, `description`, `image`
  - `position`, `offerType`, `actionType`, `actionValue`
  - `discountType`, `discountValue`, `couponCode`
  - `enabled`, `active`, `priority`
  - `startsAt`, `endsAt`, `createdAt`, `updatedAt`

### POST /admin/banners/

Create a new banner

- **Auth:** Admin
- **Request Body:** `BannerRequest`
  ```json
  {
    "title": "sample-name",
    "subtitle": "sample-name",
    "description": "Sample text",
    "image": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "position": "sample",
    "offerType": "DELIVERY",
    "actionType": "DELIVERY",
    "actionValue": 100.0,
    "discountType": "DELIVERY",
    "discountValue": 100.0,
    "couponCode": true,
    "enabled": true,
    "priority": "sample",
    "startsAt": "2026-06-06T12:00:00Z",
    "endsAt": "2026-06-06T12:00:00Z"
  }
  ```
- **Response:** `BannerResponse`

### PUT /admin/banners/{id}

Update a banner

- **Auth:** Admin
- **Path Params:** `id` (Long)
- **Request Body:** `BannerRequest`
- **Response:** `BannerResponse`

### DELETE /admin/banners/{id}

Delete a banner

- **Auth:** Admin
- **Path Params:** `id` (Long)
- **Response:** Void

### PATCH /admin/banners/{id}/status

Update banner status (enabled/disabled)

- **Auth:** Admin
- **Path Params:** `id` (Long)
- **Request Body:** `BannerStatusRequest`
  ```json
  {
    "enabled": true
  }
  ```
- **Response:** `BannerResponse`

---

## Dashboard & Analytics

### GET /admin/dashboard

Get main admin dashboard statistics

- **Auth:** Admin
- **Response:** `AdminDashboardResponse`
- **Data Fields:**
  - `totalUsers`, `totalCustomers`, `totalSellers`, `totalDrivers`
  - `totalRestaurants`, `totalOrders`, `deliveredOrders`
  - `totalRevenue`, `totalPlatformFee`
  - `codCollected`, `onlinePaid`
  - `driverCashPending`, `restaurantPayable`
  - `adminCommission`, `cashLimitBlockedDrivers`

### GET /admin/mr-breado/dashboard

Get Mr. Breado restaurant dashboard statistics

- **Auth:** Admin
- **Response:** `AdminMrBreadoDashboardResponse`
- **Data Fields:**
  - `restaurantId`, `restaurantName`, `restaurantSlug`
  - `open`, `totalProducts`, `availableProducts`
  - `totalOrders`, `pendingOrders`, `activeOrders`
  - `grossSales`, `totalRevenue`, `adminCommission`, `restaurantPayable`

---

## Driver Management

### GET /admin/drivers/cash

Get driver cash records with pagination

- **Auth:** Admin
- **Query Parameters:**
  - `page`: int
  - `perPage`: int
  - `search`: String (driver name/email/mobile)
- **Response:** `PageResponse<AdminDriverCashResponse>`
- **Driver Fields:**
  - `profileId`, `driverId`, `driverName`, `driverEmail`, `driverMobile`
  - `online`, `available`, `verified`, `blocked`
  - `cashInHand`, `cashLimit`, `remainingLimit`, `cashLimitBlocked`
  - `totalCashCollected`, `totalCashDeposited`
  - `totalDeliveries`, `totalEarnings`, `rating`

### POST /admin/drivers/{driverId}/cash-deposit/verify

Verify and process driver cash deposit

- **Auth:** Admin
- **Path Params:** `driverId` (Long)
- **Request Body:** `AdminDriverCashDepositRequest`
  ```json
  {
    "amount": 100.0,
    "paymentMethod": "sample",
    "paymentReference": "sample",
    "note": "Sample text"
  }
  ```
- **Response:** `AdminDriverCashResponse`

### GET /admin/drivers/{driverId}/cash-transactions

Get driver cash transactions history

- **Auth:** Admin
- **Path Params:** `driverId` (Long)
- **Query Parameters:**
  - `page`: int
  - `perPage`: int
- **Response:** `PageResponse<DeliveryCashTransactionResponse>`
- **Transaction Fields:**
  - `id`, `type`, `amount`, `balanceAfter`
  - `orderNumber`, `paymentMethod`, `paymentReference`, `note`
  - `createdAt`

---

## Mr. Breado Operations

### GET /admin/mr-breado/orders

List Mr. Breado orders

- **Auth:** Admin
- **Query Parameters:**
  - `page`: int
  - `perPage`: int
  - `status`: String (PENDING, ACCEPTED, PREPARING, READY, REJECTED, CANCELLED)
- **Response:** `PageResponse<SellerOrderResponse>`
- **Order Fields:**
  - `id`, `orderNumber`, `slug`, `status`, `statusLabel`
  - `customerName`, `customerMobile`, `customerEmail`
  - `paymentStatus`, `paymentType`
  - `subtotal`, `deliveryCharge`, `discount`, `tax`, `grandTotal`
  - `deliveryAddress`, `deliveryInstruction`
  - `sellerResponseDeadline`, `sellerRespondedAt`, `sellerAccepted`
  - `cancellationReason`, `cancelledBy`, `cancelledAt`
  - `orderType`, `pickupSlot`, `items`
  - `createdAt`, `updatedAt`

### GET /admin/mr-breado/orders/{orderId}

Get detailed order information

- **Auth:** Admin
- **Path Params:** `orderId` (Long)
- **Response:** `SellerOrderDetailResponse` (includes order items)

### POST /admin/mr-breado/orders/{orderId}/accept

Accept an order

- **Auth:** Admin
- **Path Params:** `orderId` (Long)
- **Response:** `SellerOrderDetailResponse`

### POST /admin/mr-breado/orders/{orderId}/preparing

Mark order as preparing

- **Auth:** Admin
- **Path Params:** `orderId` (Long)
- **Response:** `SellerOrderDetailResponse`

### POST /admin/mr-breado/orders/{orderId}/ready

Mark order as ready for pickup

- **Auth:** Admin
- **Path Params:** `orderId` (Long)
- **Response:** `SellerOrderDetailResponse`

### POST /admin/mr-breado/orders/{orderId}/reject

Reject an order

- **Auth:** Admin
- **Path Params:** `orderId` (Long)
- **Request Body:** `SellerOrderRejectRequest`
  ```json
  {
    "reason": "Item unavailable"
  }
  ```
- **Response:** `SellerOrderDetailResponse`

### GET /admin/mr-breado/payments

Get Mr. Breado payment summary

- **Auth:** Admin
- **Response:** `AdminMrBreadoPaymentsResponse`
- **Data Fields:**
  - `codAmount`, `onlineAmount`, `failedAmount`, `refundedAmount`
  - `grossSales`, `adminCommission`, `restaurantPayable`
  - `totalTransactions`

### GET /admin/mr-breado/products

List Mr. Breado products

- **Auth:** Admin
- **Query Parameters:**
  - `page`: int
  - `perPage`: int
- **Response:** `PageResponse<ProductResponse>`
- **Product Fields:**
  - `id`, `title`, `slug`, `subtitle`, `description`, `image`, `images`
  - `price`, `discountPrice`, `effectivePrice`, `currency`
  - `isVeg`, `isBestseller`, `isAvailable`, `isFeatured`
  - `rating`, `totalReviews`, `preparationTime`
  - `distanceKm`, `restaurant`

### POST /admin/mr-breado/products

Create a new Mr. Breado product

- **Auth:** Admin
- **Request Type:** `multipart/form-data`
- **Request Fields:** `AdminMrBreadoProductRequest`
  - `title`, `name`, `subtitle`, `description`
  - `category`, `categoryName`, `foodType`
  - `price`, `discountPrice`, `currency`
  - `veg`, `available`, `bestseller`, `featured`
  - `preparationTime`, `stockQuantity`, `stockTrackingEnabled`
  - `spiceLevel`, `availabilityWindow`, `servingSize`, `calories`
  - `allergens`, `tags`, `packagingCharge`, `taxIncluded`
  - `smallSizePrice`, `mediumSizePrice`, `largeSizePrice`
  - `smallSizeExtra`, `mediumSizeExtra`, `largeSizeExtra`
  - `cakeBaseWeightKg`, `cakeBasePrice`, `cakeExtraHalfKgPrice`
  - `cakeMinWeightKg`, `cakeMaxWeightKg`
  - `cake500gmExtra`, `cake1kgExtra`, `cake1_5kgExtra`, `cake2kgExtra`
  - `cakeMessageCharge`, `cakeMessageEnabled`, `customWeightEnabled`
  - `image`, `file` (MultipartFile)
- **Response:** `ProductResponse`

### PUT /admin/mr-breado/products/{productId}

Update Mr. Breado product

- **Auth:** Admin
- **Path Params:** `productId` (Long)
- **Request Type:** `multipart/form-data`
- **Request Fields:** Same as POST
- **Response:** `ProductResponse`

### DELETE /admin/mr-breado/products/{productId}

Delete Mr. Breado product

- **Auth:** Admin
- **Path Params:** `productId` (Long)
- **Response:** Void

### PATCH /admin/mr-breado/products/{productId}/availability

Update product availability

- **Auth:** Admin
- **Path Params:** `productId` (Long)
- **Request Body:** `AdminProductAvailabilityRequest`
  ```json
  {
    "available": true
  }
  ```
- **Response:** `ProductResponse`

### GET /admin/mr-breado/restaurant

Get Mr. Breado restaurant details

- **Auth:** Admin
- **Response:** `AdminRestaurantResponse`
- **Data Fields:**
  - `id`, `name`, `slug`, `logo`, `banner`
  - `address`, `city`, `status`, `verificationStatus`, `visibilityStatus`
  - `rating`, `totalReviews`, `productCount`
  - `open`, `featured`, `promoted`
  - `grossSales`, `adminCommission`, `restaurantPayable`
  - `createdAt`

### PATCH /admin/mr-breado/restaurant/status

Update Mr. Breado restaurant status

- **Auth:** Admin
- **Request Body:** `AdminRestaurantStatusRequest`
  ```json
  {
    "open": true
  }
  ```
- **Response:** `AdminRestaurantResponse`

---

## Restaurants Management

### GET /admin/restaurants

List all restaurants with filters

- **Auth:** Admin
- **Query Parameters:**
  - `page`: int
  - `perPage`: int
  - `search`: String (restaurant name/city)
  - `verificationStatus`: String (PENDING, APPROVED, REJECTED)
- **Response:** `PageResponse<AdminRestaurantResponse>`

---

## Restaurant Settlements & Payouts

### GET /admin/restaurant-settlements

List restaurant settlement records

- **Auth:** Admin
- **Query Parameters:**
  - `page`: int
  - `perPage`: int
- **Response:** `PageResponse<AdminRestaurantPayoutResponse>`
- **Settlement Fields:**
  - `id`, `restaurantId`, `restaurantName`
  - `grossAmount`, `commissionAmount`, `payableAmount`
  - `totalOrders`, `status` (PENDING, PAID)
  - `periodStart`, `periodEnd`, `paidAt`
  - `paymentMethod`, `paymentReference`, `message`
  - `createdAt`

### POST /admin/restaurant-settlements/{restaurantId}/generate-weekly

Generate weekly settlement for restaurant

- **Auth:** Admin
- **Path Params:** `restaurantId` (Long)
- **Response:** `AdminRestaurantPayoutResponse`

### POST /admin/restaurant-settlements/{settlementId}/mark-paid

Mark settlement as paid

- **Auth:** Admin
- **Path Params:** `settlementId` (Long)
- **Request Body:** `AdminRestaurantPayoutPaidRequest`
  ```json
  {
    "paymentMethod": "sample",
    "paymentReference": "sample",
    "message": "Sample text"
  }
  ```
- **Response:** `AdminRestaurantPayoutResponse`

---

## Users Management

### GET /admin/users

List users with filters and pagination

- **Auth:** Admin
- **Query Parameters:**
  - `page`: int
  - `perPage`: int
  - `role`: String (USER, SELLER, DRIVER)
  - `search`: String (name/email/mobile)
- **Response:** `PageResponse<AdminUserResponse>`
- **User Fields:**
  - `id`, `name`, `email`, `mobile`, `role`
  - `profileImage`, `walletBalance`
  - `totalOrders`, `totalReviews`
  - `enabled`, `blocked`, `deleted`
  - `createdAt`

---

## Payments & Ledger

### GET /admin/payment-ledger

Get payment ledger entries

- **Auth:** Admin
- **Query Parameters:**
  - `page`: int
  - `perPage`: int
  - `type`: String (DELIVERY, RESTAURANT, PAYMENT_RECEIVED)
- **Response:** `PageResponse<PaymentLedgerEntryResponse>`

### GET /admin/payment-settings/

Get payment settings configuration

- **Auth:** Admin
- **Response:** `AdminPaymentSettingsResponse`

### PUT /admin/payment-settings/

Update payment settings configuration

- **Auth:** Admin
- **Request Body:** `AdminPaymentSettingsRequest`
- **Response:** `AdminPaymentSettingsResponse`

### GET /admin/payments/summary

Get payment summary and statistics

- **Auth:** Admin
- **Response:** `AdminPaymentSummaryResponse`
- **Data Fields:**
  - `codCollected`, `onlineSuccess`, `failedAmount`, `refundedAmount`
  - `platformFee`, `restaurantPayable`, `adminCommission`
  - `totalCollected`, `totalTransactions`

---

## Coupons & Promotions

### GET /admin/coupons/

List all coupons

- **Auth:** Admin
- **Query Parameters:**
  - `page`: int
  - `perPage`: int
- **Response:** `PageResponse<Coupon>`

### POST /admin/coupons/

Create a new coupon

- **Auth:** Admin
- **Request Body:** `AdminCouponRequest`
- **Response:** `Coupon`

### PUT /admin/coupons/{couponId}

Update a coupon

- **Auth:** Admin
- **Path Params:** `couponId` (Long)
- **Request Body:** `AdminCouponRequest`
- **Response:** `Coupon`

### DELETE /admin/coupons/{couponId}

Delete a coupon

- **Auth:** Admin
- **Path Params:** `couponId` (Long)
- **Response:** Void

### PATCH /admin/coupons/{couponId}/status

Update coupon status

- **Auth:** Admin
- **Path Params:** `couponId` (Long)
- **Request Body:** `AdminCouponStatusRequest`
- **Response:** `Coupon`

---

## Offers

### GET /admin/offers/

List all offers

- **Auth:** Admin
- **Query Parameters:**
  - `page`: int
  - `perPage`: int
- **Response:** Object (PageResponse<OfferResponse>)

### POST /admin/offers/

Create a new offer

- **Auth:** Admin
- **Request Body:** `OfferRequest`
- **Response:** Object

### PUT /admin/offers/{id}

Update an offer

- **Auth:** Admin
- **Path Params:** `id` (Long)
- **Request Body:** `OfferRequest`
- **Response:** Object

### DELETE /admin/offers/{id}

Delete an offer

- **Auth:** Admin
- **Path Params:** `id` (Long)
- **Response:** Object

### PATCH /admin/offers/{id}/status

Update offer status

- **Auth:** Admin
- **Path Params:** `id` (Long)
- **Response:** Object

---

## Reviews

### GET /admin/reviews

List all reviews

- **Auth:** Admin
- **Query Parameters:**
  - `page`: int
  - `perPage`: int
- **Response:** `PageResponse<OrderReviewResponse>`

---

## Messaging

### GET /admin/seller-messages

List seller messages

- **Auth:** Admin
- **Query Parameters:**
  - `page`: int
  - `perPage`: int
- **Response:** `PageResponse<AdminSellerMessageResponse>`

### POST /admin/seller-messages

Send a message to seller

- **Auth:** Admin
- **Request Body:** `AdminSellerMessageRequest`
- **Response:** `AdminSellerMessageResponse`

---

## Seller Payout Accounts

### GET /admin/seller-payout-accounts

List seller payout accounts

- **Auth:** Admin
- **Query Parameters:**
  - `page`: int
  - `perPage`: int
  - `verified`: Boolean (true/false)
- **Response:** `PageResponse<SellerPayoutAccountResponse>`

### PATCH /admin/seller-payout-accounts/{accountId}/verify

Verify seller payout account

- **Auth:** Admin
- **Path Params:** `accountId` (Long)
- **Request Body:** `AdminSellerPayoutVerifyRequest`
- **Response:** `SellerPayoutAccountResponse`

---

## Reports

### GET /admin/restaurant-reports

List restaurant reports

- **Auth:** Admin
- **Query Parameters:**
  - `page`: int
  - `perPage`: int
  - `status`: String (PENDING, RESOLVED, REJECTED)
- **Response:** `PageResponse<RestaurantReportResponse>`

### PATCH /admin/restaurant-reports/{reportId}/status

Update restaurant report status

- **Auth:** Admin
- **Path Params:** `reportId` (Long)
- **Request Body:** `AdminReportStatusRequest`
- **Response:** `RestaurantReportResponse`

---

## Storage

### POST /admin/uploads/offer-image

Upload offer image

- **Auth:** Admin
- **Request Type:** `multipart/form-data`
- **Response:** Object (URL or upload confirmation)

---

## Common Response Patterns

### Pagination Response

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": {
    "items": [],
    "page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5,
    "last": false
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

### Void Response (No Data)

```json
{
  "success": true,
  "message": "Success message",
  "data": null
}
```

---

## Authentication

All admin endpoints require:

- **Header:** `Authorization: Bearer {{adminToken}}`
- **Content-Type:** `application/json` (or `multipart/form-data` for file uploads)

To obtain `adminToken`:

- Use `/auth/login` endpoint with admin credentials
- Response includes JWT token to be used in subsequent requests

---

## Error Status Codes

- **200 OK** - Request successful
- **400 Bad Request** - Invalid input parameters
- **401 Unauthorized** - Missing or invalid authentication token
- **403 Forbidden** - User lacks permission for this operation
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

---

## Endpoint Summary Table

| Module                | Total Endpoints | Main Operations                                 |
| --------------------- | --------------- | ----------------------------------------------- |
| Account Management    | 6               | Email, Password, Phone updates                  |
| Banners               | 5               | CRUD + Status                                   |
| Mr. Breado Orders     | 6               | List, Details, Accept, Preparing, Ready, Reject |
| Mr. Breado Products   | 5               | CRUD + Availability                             |
| Mr. Breado Restaurant | 2               | View + Status                                   |
| Restaurants           | 1               | List                                            |
| Settlements           | 3               | List, Generate, Mark Paid                       |
| Users                 | 1               | List                                            |
| Payments              | 3               | Ledger, Settings, Summary                       |
| Drivers               | 3               | Cash List, Deposit Verify, Transactions         |
| Coupons               | 5               | CRUD + Status                                   |
| Offers                | 5               | CRUD + Status                                   |
| Reviews               | 1               | List                                            |
| Messaging             | 2               | List, Send                                      |
| Payout Accounts       | 2               | List, Verify                                    |
| Reports               | 2               | List, Update Status                             |
| Storage               | 1               | Upload                                          |
| **TOTAL**             | **54**          | **ADMIN ENDPOINTS**                             |
