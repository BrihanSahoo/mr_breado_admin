# Mr Breado Food Delivery Backend API Documentation

Complete backend API README generated from the uploaded Spring Boot controller files. Use this for the user app, seller app, driver/rider app, admin app, QA testing, and Postman handoff.

## Base URL

```text
https://food-delivery-digontom.onrender.com/api
```

For local testing, use:

```text
http://localhost:8080/api
```

> Frontend note: the client supports a local backend override via `VITE_API_BASE_URL`.
> Create a `.env` file in the project root with:
>
> ```text
> VITE_API_BASE_URL=http://localhost:8080/api
> ```

## Postman Variables

| Variable      | Value                                             | Purpose                               |
| ------------- | ------------------------------------------------- | ------------------------------------- |
| `baseUrl`     | `https://food-delivery-digontom.onrender.com/api` | Backend root with `/api` context path |
| `authToken`   | user JWT                                          | Customer app endpoints                |
| `sellerToken` | seller JWT                                        | Seller app endpoints                  |
| `driverToken` | rider JWT                                         | Delivery/rider endpoints              |
| `adminToken`  | admin JWT                                         | Admin/ops endpoints                   |

## Authentication Header

```http
Authorization: Bearer <JWT_TOKEN>
```

Public endpoints do not require a token. Protected endpoints are marked in the endpoint table.

## Standard JSON Response

```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

## Endpoint Index

### Admin

| Method   | URL                                                                                       | Auth  | Request Body                       | Response Data                                   |
| -------- | ----------------------------------------------------------------------------------------- | ----- | ---------------------------------- | ----------------------------------------------- |
| `PUT`    | `{{baseUrl}}/admin/account/email`                                                         | Admin | `UpdateEmailRequest`               | `AdminProfileResponse`                          |
| `POST`   | `{{baseUrl}}/admin/account/email/otp`                                                     | Admin | `SendEmailOtpRequest`              | `Void`                                          |
| `PUT`    | `{{baseUrl}}/admin/account/password`                                                      | Admin | `UpdatePasswordRequest`            | `Void`                                          |
| `POST`   | `{{baseUrl}}/admin/account/password/otp`                                                  | Admin | `SendPasswordOtpRequest`           | `Void`                                          |
| `PUT`    | `{{baseUrl}}/admin/account/phone`                                                         | Admin | `UpdatePhoneRequest`               | `AdminProfileResponse`                          |
| `GET`    | `{{baseUrl}}/admin/account/profile`                                                       | Admin | `-`                                | `AdminProfileResponse`                          |
| `GET`    | `{{baseUrl}}/admin/banners/?page=1&perPage=1`                                             | Admin | `-`                                | `PageResponse<BannerResponse>`                  |
| `POST`   | `{{baseUrl}}/admin/banners/`                                                              | Admin | `BannerRequest`                    | `BannerResponse`                                |
| `DELETE` | `{{baseUrl}}/admin/banners/{id}`                                                          | Admin | `-`                                | `Void`                                          |
| `PUT`    | `{{baseUrl}}/admin/banners/{id}`                                                          | Admin | `BannerRequest`                    | `BannerResponse`                                |
| `PATCH`  | `{{baseUrl}}/admin/banners/{id}/status`                                                   | Admin | `BannerStatusRequest`              | `BannerResponse`                                |
| `GET`    | `{{baseUrl}}/admin/dashboard`                                                             | Admin | `-`                                | `AdminDashboardResponse`                        |
| `GET`    | `{{baseUrl}}/admin/drivers/cash?page=1&perPage=1&search=sample`                           | Admin | `-`                                | `PageResponse<AdminDriverCashResponse>`         |
| `POST`   | `{{baseUrl}}/admin/drivers/{driverId}/cash-deposit/verify`                                | Admin | `AdminDriverCashDepositRequest`    | `AdminDriverCashResponse`                       |
| `GET`    | `{{baseUrl}}/admin/drivers/{driverId}/cash-transactions?page=1&perPage=1`                 | Admin | `-`                                | `PageResponse<DeliveryCashTransactionResponse>` |
| `GET`    | `{{baseUrl}}/admin/mr-breado/dashboard`                                                   | Admin | `-`                                | `AdminMrBreadoDashboardResponse`                |
| `GET`    | `{{baseUrl}}/admin/mr-breado/orders?page=1&perPage=1&status=PENDING`                      | Admin | `-`                                | `PageResponse<SellerOrderResponse>`             |
| `GET`    | `{{baseUrl}}/admin/mr-breado/orders/{orderId}`                                            | Admin | `-`                                | `SellerOrderDetailResponse`                     |
| `POST`   | `{{baseUrl}}/admin/mr-breado/orders/{orderId}/accept`                                     | Admin | `-`                                | `SellerOrderDetailResponse`                     |
| `POST`   | `{{baseUrl}}/admin/mr-breado/orders/{orderId}/preparing`                                  | Admin | `-`                                | `SellerOrderDetailResponse`                     |
| `POST`   | `{{baseUrl}}/admin/mr-breado/orders/{orderId}/ready`                                      | Admin | `-`                                | `SellerOrderDetailResponse`                     |
| `POST`   | `{{baseUrl}}/admin/mr-breado/orders/{orderId}/reject`                                     | Admin | `SellerOrderRejectRequest`         | `SellerOrderDetailResponse`                     |
| `GET`    | `{{baseUrl}}/admin/mr-breado/payments`                                                    | Admin | `-`                                | `AdminMrBreadoPaymentsResponse`                 |
| `GET`    | `{{baseUrl}}/admin/mr-breado/products?page=1&perPage=1`                                   | Admin | `-`                                | `PageResponse<ProductResponse>`                 |
| `POST`   | `{{baseUrl}}/admin/mr-breado/products`                                                    | Admin | `AdminMrBreadoProductRequest`      | `ProductResponse`                               |
| `DELETE` | `{{baseUrl}}/admin/mr-breado/products/{productId}`                                        | Admin | `-`                                | `Void`                                          |
| `PUT`    | `{{baseUrl}}/admin/mr-breado/products/{productId}`                                        | Admin | `AdminMrBreadoProductRequest`      | `ProductResponse`                               |
| `PATCH`  | `{{baseUrl}}/admin/mr-breado/products/{productId}/availability`                           | Admin | `AdminProductAvailabilityRequest`  | `ProductResponse`                               |
| `GET`    | `{{baseUrl}}/admin/mr-breado/restaurant`                                                  | Admin | `-`                                | `AdminRestaurantResponse`                       |
| `PATCH`  | `{{baseUrl}}/admin/mr-breado/restaurant/status`                                           | Admin | `AdminRestaurantStatusRequest`     | `AdminRestaurantResponse`                       |
| `GET`    | `{{baseUrl}}/admin/payments/summary`                                                      | Admin | `-`                                | `AdminPaymentSummaryResponse`                   |
| `GET`    | `{{baseUrl}}/admin/profile`                                                               | Admin | `-`                                | `AdminProfileResponse`                          |
| `PUT`    | `{{baseUrl}}/admin/profile`                                                               | Admin | `AdminProfileUpdateRequest`        | `AdminProfileResponse`                          |
| `GET`    | `{{baseUrl}}/admin/restaurant-settlements?page=1&perPage=1`                               | Admin | `-`                                | `PageResponse<AdminRestaurantPayoutResponse>`   |
| `POST`   | `{{baseUrl}}/admin/restaurant-settlements/{restaurantId}/generate-weekly`                 | Admin | `-`                                | `AdminRestaurantPayoutResponse`                 |
| `POST`   | `{{baseUrl}}/admin/restaurant-settlements/{settlementId}/mark-paid`                       | Admin | `AdminRestaurantPayoutPaidRequest` | `AdminRestaurantPayoutResponse`                 |
| `GET`    | `{{baseUrl}}/admin/restaurants?page=1&perPage=1&search=sample&verificationStatus=PENDING` | Admin | `-`                                | `PageResponse<AdminRestaurantResponse>`         |
| `GET`    | `{{baseUrl}}/admin/users?page=1&perPage=1&role=USER&search=sample`                        | Admin | `-`                                | `PageResponse<AdminUserResponse>`               |

### Cart

| Method   | URL                                   | Auth | Request Body            | Response Data                     |
| -------- | ------------------------------------- | ---- | ----------------------- | --------------------------------- |
| `DELETE` | `{{baseUrl}}/cart/`                   | User | `-`                     | `Void`                            |
| `GET`    | `{{baseUrl}}/cart/`                   | User | `-`                     | `CartResponse`                    |
| `DELETE` | `{{baseUrl}}/cart/clear`              | User | `-`                     | `Void`                            |
| `POST`   | `{{baseUrl}}/cart/items`              | User | `AddCartItemRequest`    | `CartService.CartSummaryResponse` |
| `DELETE` | `{{baseUrl}}/cart/items/{cartItemId}` | User | `-`                     | `CartService.CartSummaryResponse` |
| `PUT`    | `{{baseUrl}}/cart/items/{cartItemId}` | User | `UpdateCartItemRequest` | `CartService.CartSummaryResponse` |

### Delivery

| Method | URL                                                       | Auth   | Request Body                    | Response Data                                   |
| ------ | --------------------------------------------------------- | ------ | ------------------------------- | ----------------------------------------------- |
| `POST` | `{{baseUrl}}/delivery/cash/deposit`                       | Driver | `DeliveryCashDepositRequest`    | `DeliveryDashboardResponse`                     |
| `GET`  | `{{baseUrl}}/delivery/cash/summary`                       | Driver | `-`                             | `DeliveryDashboardResponse`                     |
| `GET`  | `{{baseUrl}}/delivery/cash/transactions?page=1&perPage=1` | Driver | `-`                             | `PageResponse<DeliveryCashTransactionResponse>` |
| `GET`  | `{{baseUrl}}/delivery/dashboard`                          | Driver | `-`                             | `DeliveryDashboardResponse`                     |
| `POST` | `{{baseUrl}}/delivery/location`                           | Driver | `DeliveryLocationRequest`       | `DeliveryDashboardResponse`                     |
| `GET`  | `{{baseUrl}}/delivery/offers/active`                      | Driver | `-`                             | `List<DeliveryOfferResponse>`                   |
| `POST` | `{{baseUrl}}/delivery/offers/{offerId}/accept`            | Driver | `-`                             | `DeliveryOrderResponse`                         |
| `POST` | `{{baseUrl}}/delivery/offers/{offerId}/reject`            | Driver | `DeliveryRejectRequest`         | `Void`                                          |
| `GET`  | `{{baseUrl}}/delivery/orders/current`                     | Driver | `-`                             | `DeliveryOrderResponse`                         |
| `GET`  | `{{baseUrl}}/delivery/orders/history?page=1&perPage=1`    | Driver | `-`                             | `PageResponse<DeliveryOrderResponse>`           |
| `POST` | `{{baseUrl}}/delivery/orders/{orderId}/cash-collected`    | Driver | `DeliveryCashCollectionRequest` | `DeliveryOrderResponse`                         |
| `POST` | `{{baseUrl}}/delivery/orders/{orderId}/delivered`         | Driver | `-`                             | `DeliveryOrderResponse`                         |
| `POST` | `{{baseUrl}}/delivery/orders/{orderId}/out-for-delivery`  | Driver | `-`                             | `DeliveryOrderResponse`                         |
| `POST` | `{{baseUrl}}/delivery/orders/{orderId}/picked-up`         | Driver | `-`                             | `DeliveryOrderResponse`                         |
| `POST` | `{{baseUrl}}/delivery/orders/{orderId}/reached-drop`      | Driver | `-`                             | `DeliveryOrderResponse`                         |
| `GET`  | `{{baseUrl}}/delivery/profile`                            | Driver | `-`                             | `DeliveryDashboardResponse`                     |
| `POST` | `{{baseUrl}}/delivery/profile/status`                     | Driver | `DeliveryStatusRequest`         | `DeliveryDashboardResponse`                     |

### Engagement

| Method   | URL                                                               | Auth   | Request Body           | Response Data                              |
| -------- | ----------------------------------------------------------------- | ------ | ---------------------- | ------------------------------------------ |
| `GET`    | `{{baseUrl}}/favorites/products?page=1&perPage=1`                 | User   | `-`                    | `PageResponse<FavoriteProductResponse>`    |
| `DELETE` | `{{baseUrl}}/favorites/products/{productId}`                      | User   | `-`                    | `Void`                                     |
| `POST`   | `{{baseUrl}}/favorites/products/{productId}`                      | User   | `-`                    | `Void`                                     |
| `GET`    | `{{baseUrl}}/favorites/restaurants?page=1&perPage=1`              | User   | `-`                    | `PageResponse<FavoriteRestaurantResponse>` |
| `DELETE` | `{{baseUrl}}/favorites/restaurants/{restaurantId}`                | User   | `-`                    | `Void`                                     |
| `POST`   | `{{baseUrl}}/favorites/restaurants/{restaurantId}`                | User   | `-`                    | `Void`                                     |
| `GET`    | `{{baseUrl}}/products/{productId}/reviews?page=1&perPage=1`       | Public | `-`                    | `PageResponse<ReviewResponse>`             |
| `GET`    | `{{baseUrl}}/restaurants/{restaurantId}/reviews?page=1&perPage=1` | Public | `-`                    | `PageResponse<ReviewResponse>`             |
| `POST`   | `{{baseUrl}}/reviews`                                             | User   | `CreateReviewRequest`  | `ReviewResponse`                           |
| `DELETE` | `{{baseUrl}}/search-history/`                                     | User   | `-`                    | `Void`                                     |
| `GET`    | `{{baseUrl}}/search-history/?page=1&perPage=1`                    | User   | `-`                    | `PageResponse<SearchHistoryResponse>`      |
| `POST`   | `{{baseUrl}}/search-history/`                                     | User   | `SearchHistoryRequest` | `SearchHistoryResponse`                    |
| `GET`    | `{{baseUrl}}/user/reviews?page=1&perPage=1`                       | User   | `-`                    | `PageResponse<ReviewResponse>`             |

### Home

| Method | URL                                                                                  | Auth   | Request Body | Response Data                 |
| ------ | ------------------------------------------------------------------------------------ | ------ | ------------ | ----------------------------- |
| `GET`  | `{{baseUrl}}/api/v1/brands?latitude=22.5743533&longitude=88.3628733&category=sample` | Public | `-`          | `PageResponse<BrandResponse>` |
| `GET`  | `{{baseUrl}}/banners?latitude=22.5743533&longitude=88.3628733`                       | Public | `-`          | `Object`                      |
| `GET`  | `{{baseUrl}}/home?latitude=22.5743533&longitude=88.3628733&zoneId=1`                 | Public | `-`          | `HomeResponse`                |
| `GET`  | `{{baseUrl}}/settings`                                                               | Public | `-`          | `Object`                      |

### Menu

| Method | URL                                                                                                                                                                               | Auth   | Request Body | Response Data                       |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------ | ----------------------------------- |
| `GET`  | `{{baseUrl}}/categories?page=1&perPage=1&latitude=22.5743533&longitude=88.3628733&home=True`                                                                                      | Public | `-`          | `PageResponse<CategoryResponse>`    |
| `GET`  | `{{baseUrl}}/categories/sub-categories?page=1&perPage=1&latitude=22.5743533&longitude=88.3628733&filter=sample`                                                                   | Public | `-`          | `PageResponse<SubCategoryResponse>` |
| `GET`  | `{{baseUrl}}/food-categories?page=1&perPage=1&latitude=22.5743533&longitude=88.3628733&home=True`                                                                                 | Public | `-`          | `PageResponse<CategoryResponse>`    |
| `GET`  | `{{baseUrl}}/products/?page=1&perPage=1&latitude=22.5743533&longitude=88.3628733&category=sample&store=sample&search=sample&sort=sample&minPrice=100.0&maxPrice=100.0&isVeg=True` | Public | `-`          | `PageResponse<ProductResponse>`     |
| `GET`  | `{{baseUrl}}/products/{slug}`                                                                                                                                                     | Public | `-`          | `ProductDetailResponse`             |
| `GET`  | `{{baseUrl}}/restaurants/{slug}/menu?latitude=22.5743533&longitude=88.3628733&category=sample`                                                                                    | Public | `-`          | `RestaurantMenuResponse`            |
| `GET`  | `{{baseUrl}}/stores/{slug}/menu?latitude=22.5743533&longitude=88.3628733&category=sample`                                                                                         | Public | `-`          | `RestaurantMenuResponse`            |

### Messaging

| Method  | URL                                                  | Auth   | Request Body                | Response Data                              |
| ------- | ---------------------------------------------------- | ------ | --------------------------- | ------------------------------------------ |
| `GET`   | `{{baseUrl}}/admin/seller-messages?page=1&perPage=1` | Admin  | `-`                         | `PageResponse<AdminSellerMessageResponse>` |
| `POST`  | `{{baseUrl}}/admin/seller-messages`                  | Admin  | `AdminSellerMessageRequest` | `AdminSellerMessageResponse`               |
| `GET`   | `{{baseUrl}}/seller/messages?page=1&perPage=1`       | Seller | `-`                         | `PageResponse<AdminSellerMessageResponse>` |
| `PATCH` | `{{baseUrl}}/seller/messages/{messageId}/read`       | Seller | `-`                         | `AdminSellerMessageResponse`               |

### Offer

| Method   | URL                                                  | Auth   | Request Body              | Response Data |
| -------- | ---------------------------------------------------- | ------ | ------------------------- | ------------- |
| `GET`    | `{{baseUrl}}/admin/offers/?page=1&perPage=1`         | Admin  | `-`                       | `Object`      |
| `POST`   | `{{baseUrl}}/admin/offers/`                          | Admin  | `OfferRequest`            | `Object`      |
| `DELETE` | `{{baseUrl}}/admin/offers/{id}`                      | Admin  | `-`                       | `Object`      |
| `PUT`    | `{{baseUrl}}/admin/offers/{id}`                      | Admin  | `OfferRequest`            | `Object`      |
| `PATCH`  | `{{baseUrl}}/admin/offers/{id}/status`               | Admin  | `-`                       | `Object`      |
| `GET`    | `{{baseUrl}}/offers/?type=DELIVERY&page=1&perPage=1` | Public | `-`                       | `Object`      |
| `POST`   | `{{baseUrl}}/offers/verify`                          | Public | `CouponValidationRequest` | `Object`      |

### Order

| Method   | URL                                                       | Auth   | Request Body             | Response Data                     |
| -------- | --------------------------------------------------------- | ------ | ------------------------ | --------------------------------- |
| `POST`   | `{{baseUrl}}/checkout/summary`                            | Public | `CheckoutSummaryRequest` | `CheckoutSummaryResponse`         |
| `GET`    | `{{baseUrl}}/user/addresses/`                             | User   | `-`                      | `List<AddressResponse>`           |
| `POST`   | `{{baseUrl}}/user/addresses/`                             | User   | `AddressRequest`         | `AddressResponse`                 |
| `DELETE` | `{{baseUrl}}/user/addresses/{addressId}`                  | User   | `-`                      | `Void`                            |
| `PUT`    | `{{baseUrl}}/user/addresses/{addressId}`                  | User   | `AddressRequest`         | `AddressResponse`                 |
| `POST`   | `{{baseUrl}}/user/addresses/{addressId}/default`          | User   | `-`                      | `Void`                            |
| `GET`    | `{{baseUrl}}/user/orders?page=1&perPage=1&status=PENDING` | User   | `-`                      | `PageResponse<OrderListResponse>` |
| `POST`   | `{{baseUrl}}/user/orders`                                 | User   | `PlaceOrderRequest`      | `OrderDetailResponse`             |
| `POST`   | `{{baseUrl}}/user/orders/{orderId}/reorder`               | User   | `-`                      | `OrderDetailResponse`             |
| `GET`    | `{{baseUrl}}/user/orders/{slug}`                          | User   | `-`                      | `OrderDetailResponse`             |
| `POST`   | `{{baseUrl}}/user/orders/{slug}/cancel`                   | User   | `CancelOrderRequest`     | `OrderDetailResponse`             |

### Payment

| Method | URL                                                               | Auth   | Request Body                  | Response Data                              |
| ------ | ----------------------------------------------------------------- | ------ | ----------------------------- | ------------------------------------------ |
| `GET`  | `{{baseUrl}}/admin/payment-ledger?page=1&perPage=1&type=DELIVERY` | Admin  | `-`                           | `PageResponse<PaymentLedgerEntryResponse>` |
| `GET`  | `{{baseUrl}}/admin/payment-settings/`                             | Admin  | `-`                           | `AdminPaymentSettingsResponse`             |
| `PUT`  | `{{baseUrl}}/admin/payment-settings/`                             | Admin  | `AdminPaymentSettingsRequest` | `AdminPaymentSettingsResponse`             |
| `GET`  | `{{baseUrl}}/payment/options`                                     | Public | `-`                           | `PaymentOptionsResponse`                   |
| `GET`  | `{{baseUrl}}/payment/settings`                                    | Public | `-`                           | `PublicPlatformSettingsResponse`           |
| `POST` | `{{baseUrl}}/payments/create-order`                               | Public | `CreatePaymentOrderRequest`   | `CreatePaymentOrderResponse`               |
| `GET`  | `{{baseUrl}}/payments/settings`                                   | Public | `-`                           | `PaymentSettingsResponse`                  |
| `POST` | `{{baseUrl}}/payments/verify`                                     | Public | `VerifyPaymentRequest`        | `PaymentTransactionResponse`               |
| `GET`  | `{{baseUrl}}/seller/payment-ledger?page=1&perPage=1`              | Seller | `-`                           | `PageResponse<PaymentLedgerEntryResponse>` |
| `GET`  | `{{baseUrl}}/user/payments?page=1&perPage=1`                      | User   | `-`                           | `PageResponse<PaymentTransactionResponse>` |

### Platform

| Method | URL                                   | Auth   | Request Body                   | Response Data                    |
| ------ | ------------------------------------- | ------ | ------------------------------ | -------------------------------- |
| `GET`  | `{{baseUrl}}/platform/admin/settings` | Public | `-`                            | `AdminPlatformSettingsResponse`  |
| `PUT`  | `{{baseUrl}}/platform/admin/settings` | Public | `AdminPlatformSettingsRequest` | `AdminPlatformSettingsResponse`  |
| `GET`  | `{{baseUrl}}/platform/settings`       | Public | `-`                            | `PublicPlatformSettingsResponse` |

### Promotion

| Method   | URL                                                | Auth   | Request Body               | Response Data                             |
| -------- | -------------------------------------------------- | ------ | -------------------------- | ----------------------------------------- |
| `GET`    | `{{baseUrl}}/admin/coupons/?page=1&perPage=1`      | Admin  | `-`                        | `PageResponse<Coupon>`                    |
| `POST`   | `{{baseUrl}}/admin/coupons/`                       | Admin  | `AdminCouponRequest`       | `Coupon`                                  |
| `DELETE` | `{{baseUrl}}/admin/coupons/{couponId}`             | Admin  | `-`                        | `Void`                                    |
| `PUT`    | `{{baseUrl}}/admin/coupons/{couponId}`             | Admin  | `AdminCouponRequest`       | `Coupon`                                  |
| `PATCH`  | `{{baseUrl}}/admin/coupons/{couponId}/status`      | Admin  | `AdminCouponStatusRequest` | `Coupon`                                  |
| `POST`   | `{{baseUrl}}/coupons/validate`                     | Public | `ValidateCouponRequest`    | `CouponValidationResponse`                |
| `GET`    | `{{baseUrl}}/notifications/?page=1&perPage=1`      | User   | `-`                        | `PageResponse<NotificationResponse>`      |
| `PATCH`  | `{{baseUrl}}/notifications/read-all`               | User   | `-`                        | `Void`                                    |
| `DELETE` | `{{baseUrl}}/notifications/{notificationId}`       | User   | `-`                        | `Void`                                    |
| `PATCH`  | `{{baseUrl}}/notifications/{notificationId}/read`  | User   | `-`                        | `NotificationResponse`                    |
| `GET`    | `{{baseUrl}}/wallet/`                              | User   | `-`                        | `WalletResponse`                          |
| `GET`    | `{{baseUrl}}/wallet/transactions?page=1&perPage=1` | User   | `-`                        | `PageResponse<WalletTransactionResponse>` |

### Report

| Method  | URL                                                                    | Auth   | Request Body               | Response Data                            |
| ------- | ---------------------------------------------------------------------- | ------ | -------------------------- | ---------------------------------------- |
| `GET`   | `{{baseUrl}}/admin/restaurant-reports?page=1&perPage=1&status=PENDING` | Admin  | `-`                        | `PageResponse<RestaurantReportResponse>` |
| `PATCH` | `{{baseUrl}}/admin/restaurant-reports/{reportId}/status`               | Admin  | `AdminReportStatusRequest` | `RestaurantReportResponse`               |
| `GET`   | `{{baseUrl}}/seller/restaurant-reports?page=1&perPage=1`               | Seller | `-`                        | `PageResponse<RestaurantReportResponse>` |
| `POST`  | `{{baseUrl}}/user/orders/{orderId}/restaurant-report`                  | User   | `RestaurantReportRequest`  | `RestaurantReportResponse`               |
| `GET`   | `{{baseUrl}}/user/restaurant-reports?page=1&perPage=1`                 | User   | `-`                        | `PageResponse<RestaurantReportResponse>` |

### Restaurent

| Method | URL                                                                                                                                                | Auth   | Request Body      | Response Data                      |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----------------- | ---------------------------------- |
| `GET`  | `{{baseUrl}}/delivery-zone/stores?page=1&perPage=1&latitude=22.5743533&longitude=88.3628733&category=sample&search=sample&sort=sample&ratingMin=5` | Driver | `-`               | `PageResponse<RestaurantResponse>` |
| `GET`  | `{{baseUrl}}/restaurants?page=1&perPage=1&latitude=22.5743533&longitude=88.3628733&category=sample&search=sample&sort=sample&ratingMin=5`          | Public | `-`               | `PageResponse<RestaurantResponse>` |
| `GET`  | `{{baseUrl}}/restaurants/nearby?page=1&perPage=1&latitude=22.5743533&longitude=88.3628733&category=sample&search=sample&sort=sample&ratingMin=5`   | Public | `-`               | `PageResponse<RestaurantResponse>` |
| `GET`  | `{{baseUrl}}/restaurants/{slug}?latitude=22.5743533&longitude=88.3628733`                                                                          | Public | `-`               | `RestaurantDetailResponse`         |
| `GET`  | `{{baseUrl}}/stores?page=1&perPage=1&latitude=22.5743533&longitude=88.3628733&category=sample&search=sample&sort=sample&ratingMin=5`               | Public | `-`               | `PageResponse<RestaurantResponse>` |
| `POST` | `{{baseUrl}}/stores/map`                                                                                                                           | Public | `StoreMapRequest` | `List<StoreMapResponse>`           |
| `GET`  | `{{baseUrl}}/stores/{slug}?latitude=22.5743533&longitude=88.3628733`                                                                               | Public | `-`               | `RestaurantDetailResponse`         |

### Review

| Method | URL                                               | Auth   | Request Body         | Response Data                       |
| ------ | ------------------------------------------------- | ------ | -------------------- | ----------------------------------- |
| `GET`  | `{{baseUrl}}/admin/reviews?page=1&perPage=1`      | Admin  | `-`                  | `PageResponse<OrderReviewResponse>` |
| `POST` | `{{baseUrl}}/reviews/order/{orderId}`             | User   | `OrderReviewRequest` | `OrderReviewResponse`               |
| `GET`  | `{{baseUrl}}/reviews/order/{orderId}/eligibility` | User   | `-`                  | `OrderReviewEligibilityResponse`    |
| `GET`  | `{{baseUrl}}/seller/reviews?page=1&perPage=1`     | Seller | `-`                  | `PageResponse<OrderReviewResponse>` |

### Seller

| Method  | URL                                                                       | Auth   | Request Body                       | Response Data                               |
| ------- | ------------------------------------------------------------------------- | ------ | ---------------------------------- | ------------------------------------------- |
| `GET`   | `{{baseUrl}}/admin/seller-payout-accounts?page=1&perPage=1&verified=True` | Admin  | `-`                                | `PageResponse<SellerPayoutAccountResponse>` |
| `PATCH` | `{{baseUrl}}/admin/seller-payout-accounts/{accountId}/verify`             | Admin  | `AdminSellerPayoutVerifyRequest`   | `SellerPayoutAccountResponse`               |
| `GET`   | `{{baseUrl}}/seller/orders/?page=1&perPage=1&status=PENDING`              | Seller | `-`                                | `PageResponse<SellerOrderResponse>`         |
| `GET`   | `{{baseUrl}}/seller/orders/{orderId}`                                     | Seller | `-`                                | `SellerOrderDetailResponse`                 |
| `POST`  | `{{baseUrl}}/seller/orders/{orderId}/accept`                              | Seller | `-`                                | `SellerOrderDetailResponse`                 |
| `POST`  | `{{baseUrl}}/seller/orders/{orderId}/preparing`                           | Seller | `-`                                | `SellerOrderDetailResponse`                 |
| `POST`  | `{{baseUrl}}/seller/orders/{orderId}/ready`                               | Seller | `-`                                | `SellerOrderDetailResponse`                 |
| `POST`  | `{{baseUrl}}/seller/orders/{orderId}/reject`                              | Seller | `SellerOrderRejectRequest`         | `SellerOrderDetailResponse`                 |
| `GET`   | `{{baseUrl}}/seller/payout-account`                                       | Seller | `-`                                | `SellerPayoutAccountResponse`               |
| `PUT`   | `{{baseUrl}}/seller/payout-account`                                       | Seller | `SellerPayoutAccountRequest`       | `SellerPayoutAccountResponse`               |
| `GET`   | `{{baseUrl}}/seller/products/?page=1&perPage=1`                           | Seller | `-`                                | `PageResponse<SellerProductResponse>`       |
| `POST`  | `{{baseUrl}}/seller/products/`                                            | Seller | `SellerProductRequest`             | `SellerProductResponse`                     |
| `PUT`   | `{{baseUrl}}/seller/products/{productId}`                                 | Seller | `SellerProductRequest`             | `SellerProductResponse`                     |
| `PATCH` | `{{baseUrl}}/seller/products/{productId}/availability`                    | Seller | `SellerProductAvailabilityRequest` | `SellerProductResponse`                     |
| `GET`   | `{{baseUrl}}/seller/restaurant/`                                          | Seller | `-`                                | `SellerRestaurantResponse`                  |
| `PUT`   | `{{baseUrl}}/seller/restaurant/`                                          | Seller | `SellerRestaurantRequest`          | `SellerRestaurantResponse`                  |
| `PUT`   | `{{baseUrl}}/seller/restaurant/`                                          | Seller | `SellerRestaurantRequest`          | `SellerRestaurantResponse`                  |
| `PATCH` | `{{baseUrl}}/seller/restaurant/status`                                    | Seller | `SellerRestaurantRequest`          | `SellerRestaurantResponse`                  |

### Storage

| Method | URL                                     | Auth  | Request Body | Response Data |
| ------ | --------------------------------------- | ----- | ------------ | ------------- |
| `POST` | `{{baseUrl}}/admin/uploads/offer-image` | Admin | `-`          | `Object`      |

### Tracking

| Method | URL                                              | Auth   | Request Body                    | Response Data              |
| ------ | ------------------------------------------------ | ------ | ------------------------------- | -------------------------- |
| `POST` | `{{baseUrl}}/delivery/orders/{orderId}/location` | Driver | `DeliveryLocationUpdateRequest` | `DeliveryTrackingResponse` |
| `GET`  | `{{baseUrl}}/user/orders/{orderId}/tracking`     | User   | `-`                             | `DeliveryTrackingResponse` |

### User

| Method   | URL                                | Auth   | Request Body            | Response Data  |
| -------- | ---------------------------------- | ------ | ----------------------- | -------------- |
| `POST`   | `{{baseUrl}}/auth/login`           | Public | `LoginRequest`          | `AuthResponse` |
| `POST`   | `{{baseUrl}}/auth/logout`          | Public | `-`                     | `Void`         |
| `POST`   | `{{baseUrl}}/auth/register`        | Public | `RegisterRequest`       | `AuthResponse` |
| `DELETE` | `{{baseUrl}}/user/account`         | User   | `-`                     | `Void`         |
| `PUT`    | `{{baseUrl}}/user/change-password` | User   | `ChangePasswordRequest` | `Void`         |
| `GET`    | `{{baseUrl}}/user/profile`         | User   | `-`                     | `UserResponse` |
| `POST`   | `{{baseUrl}}/user/profile`         | User   | `ProfileUpdateRequest`  | `UserResponse` |
| `PUT`    | `{{baseUrl}}/user/profile`         | User   | `ProfileUpdateRequest`  | `UserResponse` |

## Detailed Endpoint Samples

### PUT /admin/account/email

**Auth:** Admin  
**Controller:** `AdminAccountController.java`  
**Handler:** `updateEmail`  
**Success message:** `Admin email updated successfully`

**Request body (`UpdateEmailRequest`)**

```json
{}
```

**Response body (`AdminProfileResponse`)**

```json
{
  "success": true,
  "message": "Admin email updated successfully",
  "data": {
    "id": 1,
    "name": "sample-name",
    "email": "user@example.com",
    "phoneNumber": "9876543210",
    "role": "USER",
    "status": "PENDING",
    "emailChangeUsed": "user@example.com",
    "createdAt": "2026-06-06T12:00:00Z"
  }
}
```

### POST /admin/account/email/otp

**Auth:** Admin  
**Controller:** `AdminAccountController.java`  
**Handler:** `sendEmailOtp`  
**Success message:** `Email update OTP sent successfully`

**Request body (`SendEmailOtpRequest`)**

```json
{}
```

**Response body (`Void`)**

```json
{
  "success": true,
  "message": "Email update OTP sent successfully",
  "data": null
}
```

### PUT /admin/account/password

**Auth:** Admin  
**Controller:** `AdminAccountController.java`  
**Handler:** `updatePassword`  
**Success message:** `Password updated successfully`

**Request body (`UpdatePasswordRequest`)**

```json
{}
```

**Response body (`Void`)**

```json
{
  "success": true,
  "message": "Password updated successfully",
  "data": null
}
```

### POST /admin/account/password/otp

**Auth:** Admin  
**Controller:** `AdminAccountController.java`  
**Handler:** `sendPasswordOtp`  
**Success message:** `Password update OTP sent successfully`

**Request body (`SendPasswordOtpRequest`)**

```json
{
  "currentPassword": "Password@123",
  "newPassword": "Password@123"
}
```

**Response body (`Void`)**

```json
{
  "success": true,
  "message": "Password update OTP sent successfully",
  "data": null
}
```

### PUT /admin/account/phone

**Auth:** Admin  
**Controller:** `AdminAccountController.java`  
**Handler:** `updatePhone`  
**Success message:** `Admin phone number updated successfully`

**Request body (`UpdatePhoneRequest`)**

```json
{}
```

**Response body (`AdminProfileResponse`)**

```json
{
  "success": true,
  "message": "Admin phone number updated successfully",
  "data": {
    "id": 1,
    "name": "sample-name",
    "email": "user@example.com",
    "phoneNumber": "9876543210",
    "role": "USER",
    "status": "PENDING",
    "emailChangeUsed": "user@example.com",
    "createdAt": "2026-06-06T12:00:00Z"
  }
}
```

### GET /admin/account/profile

**Auth:** Admin  
**Controller:** `AdminAccountController.java`  
**Handler:** `profile`  
**Success message:** `Admin profile fetched successfully`

**Request body:** none

**Response body (`AdminProfileResponse`)**

```json
{
  "success": true,
  "message": "Admin profile fetched successfully",
  "data": {
    "id": 1,
    "name": "sample-name",
    "email": "user@example.com",
    "phoneNumber": "9876543210",
    "role": "USER",
    "status": "PENDING",
    "emailChangeUsed": "user@example.com",
    "createdAt": "2026-06-06T12:00:00Z"
  }
}
```

### GET /admin/banners/

**Auth:** Admin  
**Controller:** `AdminBannerController.java`  
**Handler:** `getBanners`  
**Success message:** `Admin banners fetched successfully`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Request body:** none

**Response body (`PageResponse<BannerResponse>`)**

```json
{
  "success": true,
  "message": "Admin banners fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
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
        "active": true,
        "priority": "sample",
        "startsAt": "2026-06-06T12:00:00Z",
        "endsAt": "2026-06-06T12:00:00Z",
        "createdAt": "2026-06-06T12:00:00Z",
        "updatedAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### POST /admin/banners/

**Auth:** Admin  
**Controller:** `AdminBannerController.java`  
**Handler:** `createBanner`  
**Success message:** `Banner created successfully`

**Request body (`BannerRequest`)**

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

**Response body (`BannerResponse`)**

```json
{
  "success": true,
  "message": "Banner created successfully",
  "data": {
    "id": 1,
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
    "active": true,
    "priority": "sample",
    "startsAt": "2026-06-06T12:00:00Z",
    "endsAt": "2026-06-06T12:00:00Z",
    "createdAt": "2026-06-06T12:00:00Z",
    "updatedAt": "2026-06-06T12:00:00Z"
  }
}
```

### DELETE /admin/banners/{id}

**Auth:** Admin  
**Controller:** `AdminBannerController.java`  
**Handler:** `deleteBanner`  
**Success message:** `Banner deleted successfully`

**Path variables**

| Name | Type   | Example |
| ---- | ------ | ------- |
| `id` | `Long` | `1`     |

**Request body:** none

**Response body (`Void`)**

```json
{
  "success": true,
  "message": "Banner deleted successfully",
  "data": null
}
```

### PUT /admin/banners/{id}

**Auth:** Admin  
**Controller:** `AdminBannerController.java`  
**Handler:** `updateBanner`  
**Success message:** `Banner updated successfully`

**Path variables**

| Name | Type   | Example |
| ---- | ------ | ------- |
| `id` | `Long` | `1`     |

**Request body (`BannerRequest`)**

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

**Response body (`BannerResponse`)**

```json
{
  "success": true,
  "message": "Banner updated successfully",
  "data": {
    "id": 1,
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
    "active": true,
    "priority": "sample",
    "startsAt": "2026-06-06T12:00:00Z",
    "endsAt": "2026-06-06T12:00:00Z",
    "createdAt": "2026-06-06T12:00:00Z",
    "updatedAt": "2026-06-06T12:00:00Z"
  }
}
```

### PATCH /admin/banners/{id}/status

**Auth:** Admin  
**Controller:** `AdminBannerController.java`  
**Handler:** `updateStatus`  
**Success message:** `Banner status updated successfully`

**Path variables**

| Name | Type   | Example |
| ---- | ------ | ------- |
| `id` | `Long` | `1`     |

**Request body (`BannerStatusRequest`)**

```json
{
  "enabled": true
}
```

**Response body (`BannerResponse`)**

```json
{
  "success": true,
  "message": "Banner status updated successfully",
  "data": {
    "id": 1,
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
    "active": true,
    "priority": "sample",
    "startsAt": "2026-06-06T12:00:00Z",
    "endsAt": "2026-06-06T12:00:00Z",
    "createdAt": "2026-06-06T12:00:00Z",
    "updatedAt": "2026-06-06T12:00:00Z"
  }
}
```

### GET /admin/dashboard

**Auth:** Admin  
**Controller:** `AdminController.java`  
**Handler:** `dashboard`  
**Success message:** `Admin dashboard fetched successfully`

**Request body:** none

**Response body (`AdminDashboardResponse`)**

```json
{
  "success": true,
  "message": "Admin dashboard fetched successfully",
  "data": {
    "totalUsers": 100.0,
    "totalCustomers": 100.0,
    "totalSellers": 100.0,
    "totalDrivers": 100.0,
    "totalRestaurants": 100.0,
    "totalOrders": 100.0,
    "deliveredOrders": 1,
    "totalRevenue": 100.0,
    "totalPlatformFee": 100.0,
    "codCollected": true,
    "onlinePaid": true,
    "driverCashPending": 100.0,
    "restaurantPayable": 100.0,
    "adminCommission": 100.0,
    "cashLimitBlockedDrivers": 100.0
  }
}
```

### GET /admin/drivers/cash

**Auth:** Admin  
**Controller:** `AdminController.java`  
**Handler:** `driverCash`  
**Success message:** `Driver cash records fetched successfully`

**Query parameters**

| Name      | Type     | Example  |
| --------- | -------- | -------- |
| `page`    | `int`    | `1`      |
| `perPage` | `int`    | `1`      |
| `search`  | `String` | `sample` |

**Request body:** none

**Response body (`PageResponse<AdminDriverCashResponse>`)**

```json
{
  "success": true,
  "message": "Driver cash records fetched successfully",
  "data": {
    "items": [
      {
        "profileId": 1,
        "driverId": 1,
        "driverName": "sample-name",
        "driverEmail": "user@example.com",
        "driverMobile": "9876543210",
        "online": true,
        "available": true,
        "verified": true,
        "blocked": true,
        "cashInHand": 100.0,
        "cashLimit": 100.0,
        "remainingLimit": 1,
        "cashLimitBlocked": 100.0,
        "totalCashCollected": 100.0,
        "totalCashDeposited": 100.0,
        "totalDeliveries": 100.0,
        "totalEarnings": 100.0,
        "rating": 5
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### POST /admin/drivers/{driverId}/cash-deposit/verify

**Auth:** Admin  
**Controller:** `AdminController.java`  
**Handler:** `verifyDriverCashDeposit`  
**Success message:** `Driver cash deposit verified successfully`

**Path variables**

| Name       | Type   | Example |
| ---------- | ------ | ------- |
| `driverId` | `Long` | `1`     |

**Request body (`AdminDriverCashDepositRequest`)**

```json
{
  "amount": 100.0,
  "paymentMethod": "sample",
  "paymentReference": "sample",
  "note": "Sample text"
}
```

**Response body (`AdminDriverCashResponse`)**

```json
{
  "success": true,
  "message": "Driver cash deposit verified successfully",
  "data": {
    "profileId": 1,
    "driverId": 1,
    "driverName": "sample-name",
    "driverEmail": "user@example.com",
    "driverMobile": "9876543210",
    "online": true,
    "available": true,
    "verified": true,
    "blocked": true,
    "cashInHand": 100.0,
    "cashLimit": 100.0,
    "remainingLimit": 1,
    "cashLimitBlocked": 100.0,
    "totalCashCollected": 100.0,
    "totalCashDeposited": 100.0,
    "totalDeliveries": 100.0,
    "totalEarnings": 100.0,
    "rating": 5
  }
}
```

### GET /admin/drivers/{driverId}/cash-transactions

**Auth:** Admin  
**Controller:** `AdminController.java`  
**Handler:** `driverCashTransactions`  
**Success message:** `Driver cash transactions fetched successfully`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Path variables**

| Name       | Type   | Example |
| ---------- | ------ | ------- |
| `driverId` | `Long` | `1`     |

**Request body:** none

**Response body (`PageResponse<DeliveryCashTransactionResponse>`)**

```json
{
  "success": true,
  "message": "Driver cash transactions fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "type": "DELIVERY",
        "amount": 100.0,
        "balanceAfter": 10.0,
        "orderNumber": "sample",
        "paymentMethod": "sample",
        "paymentReference": "sample",
        "note": "Sample text",
        "createdAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### GET /admin/mr-breado/dashboard

**Auth:** Admin  
**Controller:** `AdminMrBreadoController.java`  
**Handler:** `dashboard`  
**Success message:** `Mr Breado shop dashboard fetched successfully`

**Request body:** none

**Response body (`AdminMrBreadoDashboardResponse`)**

```json
{
  "success": true,
  "message": "Mr Breado shop dashboard fetched successfully",
  "data": {
    "restaurantId": 1,
    "restaurantName": "sample-name",
    "restaurantSlug": "sample-name",
    "open": true,
    "totalProducts": 100.0,
    "availableProducts": true,
    "totalOrders": 100.0,
    "pendingOrders": 1,
    "activeOrders": true,
    "grossSales": 10.0,
    "totalRevenue": 100.0,
    "adminCommission": 100.0,
    "restaurantPayable": 100.0
  }
}
```

### GET /admin/mr-breado/orders

**Auth:** Admin  
**Controller:** `AdminMrBreadoController.java`  
**Handler:** `orders`  
**Success message:** `Mr Breado orders fetched successfully`

**Query parameters**

| Name      | Type     | Example   |
| --------- | -------- | --------- |
| `page`    | `int`    | `1`       |
| `perPage` | `int`    | `1`       |
| `status`  | `String` | `PENDING` |

**Request body:** none

**Response body (`PageResponse<SellerOrderResponse>`)**

```json
{
  "success": true,
  "message": "Mr Breado orders fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "orderNumber": "sample",
        "slug": "sample-name",
        "customerName": "sample-name",
        "customerMobile": "9876543210",
        "customerEmail": "user@example.com",
        "status": "PENDING",
        "statusLabel": "PENDING",
        "paymentStatus": "PENDING",
        "paymentType": "DELIVERY",
        "subtotal": 100.0,
        "deliveryCharge": 100.0,
        "discount": 10.0,
        "tax": 10.0,
        "grandTotal": 100.0,
        "deliveryAddress": "Park Street, Kolkata, West Bengal",
        "deliveryInstruction": "Sample text",
        "sellerResponseDeadline": "2026-06-06T12:00:00Z",
        "sellerRespondedAt": "2026-06-06T12:00:00Z",
        "sellerAccepted": true,
        "sellerResponseRemainingSeconds": 1,
        "cancellationReason": "Item unavailable",
        "cancelledBy": "sample",
        "cancelledAt": "2026-06-06T12:00:00Z",
        "createdAt": "2026-06-06T12:00:00Z",
        "updatedAt": "2026-06-06T12:00:00Z",
        "orderType": "DELIVERY",
        "payableNow": 100.0,
        "payableLater": 100.0,
        "takeawayBookingFee": 100.0,
        "pickupSlot": "sample",
        "items": []
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### GET /admin/mr-breado/orders/{orderId}

**Auth:** Admin  
**Controller:** `AdminMrBreadoController.java`  
**Handler:** `orderDetails`  
**Success message:** `Mr Breado order details fetched successfully`

**Path variables**

| Name      | Type   | Example |
| --------- | ------ | ------- |
| `orderId` | `Long` | `1`     |

**Request body:** none

**Response body (`SellerOrderDetailResponse`)**

```json
{
  "success": true,
  "message": "Mr Breado order details fetched successfully",
  "data": {
    "id": 1,
    "orderNumber": "sample",
    "slug": "sample-name",
    "customerName": "sample-name",
    "customerMobile": "9876543210",
    "customerEmail": "user@example.com",
    "status": "PENDING",
    "statusLabel": "PENDING",
    "paymentStatus": "PENDING",
    "paymentType": "DELIVERY",
    "subtotal": 100.0,
    "restaurantCharges": 100.0,
    "deliveryCharge": 100.0,
    "platformFee": 100.0,
    "discount": 10.0,
    "tax": 10.0,
    "walletUsed": 10.0,
    "grandTotal": 100.0,
    "deliveryAddress": "Park Street, Kolkata, West Bengal",
    "deliveryInstruction": "Sample text",
    "cancellationReason": "Item unavailable",
    "estimatedDeliveryMinutes": 1,
    "createdAt": "2026-06-06T12:00:00Z",
    "updatedAt": "2026-06-06T12:00:00Z",
    "cancelledAt": "2026-06-06T12:00:00Z",
    "deliveredAt": "2026-06-06T12:00:00Z",
    "items": []
  }
}
```

### POST /admin/mr-breado/orders/{orderId}/accept

**Auth:** Admin  
**Controller:** `AdminMrBreadoController.java`  
**Handler:** `acceptOrder`  
**Success message:** `Order accepted successfully`

**Path variables**

| Name      | Type   | Example |
| --------- | ------ | ------- |
| `orderId` | `Long` | `1`     |

**Request body:** none

**Response body (`SellerOrderDetailResponse`)**

```json
{
  "success": true,
  "message": "Order accepted successfully",
  "data": {
    "id": 1,
    "orderNumber": "sample",
    "slug": "sample-name",
    "customerName": "sample-name",
    "customerMobile": "9876543210",
    "customerEmail": "user@example.com",
    "status": "PENDING",
    "statusLabel": "PENDING",
    "paymentStatus": "PENDING",
    "paymentType": "DELIVERY",
    "subtotal": 100.0,
    "restaurantCharges": 100.0,
    "deliveryCharge": 100.0,
    "platformFee": 100.0,
    "discount": 10.0,
    "tax": 10.0,
    "walletUsed": 10.0,
    "grandTotal": 100.0,
    "deliveryAddress": "Park Street, Kolkata, West Bengal",
    "deliveryInstruction": "Sample text",
    "cancellationReason": "Item unavailable",
    "estimatedDeliveryMinutes": 1,
    "createdAt": "2026-06-06T12:00:00Z",
    "updatedAt": "2026-06-06T12:00:00Z",
    "cancelledAt": "2026-06-06T12:00:00Z",
    "deliveredAt": "2026-06-06T12:00:00Z",
    "items": []
  }
}
```

### POST /admin/mr-breado/orders/{orderId}/preparing

**Auth:** Admin  
**Controller:** `AdminMrBreadoController.java`  
**Handler:** `markPreparing`  
**Success message:** `Order marked as preparing`

**Path variables**

| Name      | Type   | Example |
| --------- | ------ | ------- |
| `orderId` | `Long` | `1`     |

**Request body:** none

**Response body (`SellerOrderDetailResponse`)**

```json
{
  "success": true,
  "message": "Order marked as preparing",
  "data": {
    "id": 1,
    "orderNumber": "sample",
    "slug": "sample-name",
    "customerName": "sample-name",
    "customerMobile": "9876543210",
    "customerEmail": "user@example.com",
    "status": "PENDING",
    "statusLabel": "PENDING",
    "paymentStatus": "PENDING",
    "paymentType": "DELIVERY",
    "subtotal": 100.0,
    "restaurantCharges": 100.0,
    "deliveryCharge": 100.0,
    "platformFee": 100.0,
    "discount": 10.0,
    "tax": 10.0,
    "walletUsed": 10.0,
    "grandTotal": 100.0,
    "deliveryAddress": "Park Street, Kolkata, West Bengal",
    "deliveryInstruction": "Sample text",
    "cancellationReason": "Item unavailable",
    "estimatedDeliveryMinutes": 1,
    "createdAt": "2026-06-06T12:00:00Z",
    "updatedAt": "2026-06-06T12:00:00Z",
    "cancelledAt": "2026-06-06T12:00:00Z",
    "deliveredAt": "2026-06-06T12:00:00Z",
    "items": []
  }
}
```

### POST /admin/mr-breado/orders/{orderId}/ready

**Auth:** Admin  
**Controller:** `AdminMrBreadoController.java`  
**Handler:** `markReady`  
**Success message:** `Order marked as ready for pickup`

**Path variables**

| Name      | Type   | Example |
| --------- | ------ | ------- |
| `orderId` | `Long` | `1`     |

**Request body:** none

**Response body (`SellerOrderDetailResponse`)**

```json
{
  "success": true,
  "message": "Order marked as ready for pickup",
  "data": {
    "id": 1,
    "orderNumber": "sample",
    "slug": "sample-name",
    "customerName": "sample-name",
    "customerMobile": "9876543210",
    "customerEmail": "user@example.com",
    "status": "PENDING",
    "statusLabel": "PENDING",
    "paymentStatus": "PENDING",
    "paymentType": "DELIVERY",
    "subtotal": 100.0,
    "restaurantCharges": 100.0,
    "deliveryCharge": 100.0,
    "platformFee": 100.0,
    "discount": 10.0,
    "tax": 10.0,
    "walletUsed": 10.0,
    "grandTotal": 100.0,
    "deliveryAddress": "Park Street, Kolkata, West Bengal",
    "deliveryInstruction": "Sample text",
    "cancellationReason": "Item unavailable",
    "estimatedDeliveryMinutes": 1,
    "createdAt": "2026-06-06T12:00:00Z",
    "updatedAt": "2026-06-06T12:00:00Z",
    "cancelledAt": "2026-06-06T12:00:00Z",
    "deliveredAt": "2026-06-06T12:00:00Z",
    "items": []
  }
}
```

### POST /admin/mr-breado/orders/{orderId}/reject

**Auth:** Admin  
**Controller:** `AdminMrBreadoController.java`  
**Handler:** `rejectOrder`  
**Success message:** `Order rejected successfully`

**Path variables**

| Name      | Type   | Example |
| --------- | ------ | ------- |
| `orderId` | `Long` | `1`     |

**Request body (`SellerOrderRejectRequest`)**

```json
{
  "reason": "Item unavailable"
}
```

**Response body (`SellerOrderDetailResponse`)**

```json
{
  "success": true,
  "message": "Order rejected successfully",
  "data": {
    "id": 1,
    "orderNumber": "sample",
    "slug": "sample-name",
    "customerName": "sample-name",
    "customerMobile": "9876543210",
    "customerEmail": "user@example.com",
    "status": "PENDING",
    "statusLabel": "PENDING",
    "paymentStatus": "PENDING",
    "paymentType": "DELIVERY",
    "subtotal": 100.0,
    "restaurantCharges": 100.0,
    "deliveryCharge": 100.0,
    "platformFee": 100.0,
    "discount": 10.0,
    "tax": 10.0,
    "walletUsed": 10.0,
    "grandTotal": 100.0,
    "deliveryAddress": "Park Street, Kolkata, West Bengal",
    "deliveryInstruction": "Sample text",
    "cancellationReason": "Item unavailable",
    "estimatedDeliveryMinutes": 1,
    "createdAt": "2026-06-06T12:00:00Z",
    "updatedAt": "2026-06-06T12:00:00Z",
    "cancelledAt": "2026-06-06T12:00:00Z",
    "deliveredAt": "2026-06-06T12:00:00Z",
    "items": []
  }
}
```

### GET /admin/mr-breado/payments

**Auth:** Admin  
**Controller:** `AdminMrBreadoController.java`  
**Handler:** `payments`  
**Success message:** `Mr Breado payment summary fetched successfully`

**Request body:** none

**Response body (`AdminMrBreadoPaymentsResponse`)**

```json
{
  "success": true,
  "message": "Mr Breado payment summary fetched successfully",
  "data": {
    "codAmount": 100.0,
    "onlineAmount": 100.0,
    "failedAmount": 100.0,
    "refundedAmount": 100.0,
    "grossSales": 10.0,
    "adminCommission": 100.0,
    "restaurantPayable": 100.0,
    "totalTransactions": 100.0
  }
}
```

### GET /admin/mr-breado/products

**Auth:** Admin  
**Controller:** `AdminMrBreadoController.java`  
**Handler:** `products`  
**Success message:** `Mr Breado products fetched successfully`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Request body:** none

**Response body (`PageResponse<ProductResponse>`)**

```json
{
  "success": true,
  "message": "Mr Breado products fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "title": "sample-name",
        "slug": "sample-name",
        "subtitle": "sample-name",
        "description": "Sample text",
        "image": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "images": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "price": 100.0,
        "discountPrice": 100.0,
        "effectivePrice": 100.0,
        "currency": "sample",
        "isVeg": true,
        "isBestseller": true,
        "isAvailable": true,
        "isFeatured": true,
        "rating": 5,
        "totalReviews": 100.0,
        "preparationTime": "2026-06-06T12:00:00Z",
        "distanceKm": 10.0,
        "restaurant": "sample"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### POST /admin/mr-breado/products

**Auth:** Admin  
**Controller:** `AdminMrBreadoController.java`  
**Handler:** `createProduct`  
**Success message:** `Mr Breado product created successfully`

**Request body:** `multipart/form-data` (`AdminMrBreadoProductRequest`)

| Field                  | Type            | Example                |
| ---------------------- | --------------- | ---------------------- |
| `title`                | `String`        | `sample-name`          |
| `name`                 | `String`        | `sample-name`          |
| `subtitle`             | `String`        | `sample-name`          |
| `description`          | `String`        | `Sample text`          |
| `category`             | `String`        | `sample`               |
| `categoryName`         | `String`        | `sample-name`          |
| `foodType`             | `String`        | `DELIVERY`             |
| `price`                | `BigDecimal`    | `100.0`                |
| `discountPrice`        | `BigDecimal`    | `100.0`                |
| `currency`             | `String`        | `sample`               |
| `veg`                  | `Boolean`       | `True`                 |
| `available`            | `Boolean`       | `True`                 |
| `bestseller`           | `Boolean`       | `True`                 |
| `featured`             | `Boolean`       | `True`                 |
| `preparationTime`      | `Integer`       | `2026-06-06T12:00:00Z` |
| `stockQuantity`        | `Integer`       | `1`                    |
| `stockTrackingEnabled` | `Boolean`       | `1`                    |
| `spiceLevel`           | `String`        | `sample`               |
| `availabilityWindow`   | `String`        | `sample`               |
| `servingSize`          | `String`        | `sample`               |
| `calories`             | `Integer`       | `1`                    |
| `allergens`            | `String`        | `sample`               |
| `tags`                 | `String`        | `sample`               |
| `packagingCharge`      | `BigDecimal`    | `100.0`                |
| `taxIncluded`          | `Boolean`       | `True`                 |
| `smallSizePrice`       | `BigDecimal`    | `100.0`                |
| `mediumSizePrice`      | `BigDecimal`    | `100.0`                |
| `largeSizePrice`       | `BigDecimal`    | `100.0`                |
| `smallSizeExtra`       | `BigDecimal`    | `10.0`                 |
| `mediumSizeExtra`      | `BigDecimal`    | `10.0`                 |
| `largeSizeExtra`       | `BigDecimal`    | `10.0`                 |
| `cakeBaseWeightKg`     | `BigDecimal`    | `10.0`                 |
| `cakeBasePrice`        | `BigDecimal`    | `100.0`                |
| `cakeExtraHalfKgPrice` | `BigDecimal`    | `100.0`                |
| `cakeMinWeightKg`      | `BigDecimal`    | `10.0`                 |
| `cakeMaxWeightKg`      | `BigDecimal`    | `10.0`                 |
| `cake500gmExtra`       | `BigDecimal`    | `10.0`                 |
| `cake1kgExtra`         | `BigDecimal`    | `10.0`                 |
| `cake1_5kgExtra`       | `BigDecimal`    | `10.0`                 |
| `cake2kgExtra`         | `BigDecimal`    | `10.0`                 |
| `cakeMessageCharge`    | `BigDecimal`    | `100.0`                |
| `cakeMessageEnabled`   | `Boolean`       | `True`                 |
| `customWeightEnabled`  | `Boolean`       | `True`                 |
| `image`                | `MultipartFile` | `<file>`               |
| `file`                 | `MultipartFile` | `<file>`               |

**Response body (`ProductResponse`)**

```json
{
  "success": true,
  "message": "Mr Breado product created successfully",
  "data": {
    "id": 1,
    "title": "sample-name",
    "slug": "sample-name",
    "subtitle": "sample-name",
    "description": "Sample text",
    "image": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "images": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "price": 100.0,
    "discountPrice": 100.0,
    "effectivePrice": 100.0,
    "currency": "sample",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "isFeatured": true,
    "rating": 5,
    "totalReviews": 100.0,
    "preparationTime": "2026-06-06T12:00:00Z",
    "distanceKm": 10.0,
    "restaurant": "sample"
  }
}
```

### DELETE /admin/mr-breado/products/{productId}

**Auth:** Admin  
**Controller:** `AdminMrBreadoController.java`  
**Handler:** `deleteProduct`  
**Success message:** `Mr Breado product deleted successfully`

**Path variables**

| Name        | Type   | Example |
| ----------- | ------ | ------- |
| `productId` | `Long` | `1`     |

**Request body:** none

**Response body (`Void`)**

```json
{
  "success": true,
  "message": "Mr Breado product deleted successfully",
  "data": null
}
```

### PUT /admin/mr-breado/products/{productId}

**Auth:** Admin  
**Controller:** `AdminMrBreadoController.java`  
**Handler:** `updateProduct`  
**Success message:** `Mr Breado product updated successfully`

**Path variables**

| Name        | Type   | Example |
| ----------- | ------ | ------- |
| `productId` | `Long` | `1`     |

**Request body:** `multipart/form-data` (`AdminMrBreadoProductRequest`)

| Field                  | Type            | Example                |
| ---------------------- | --------------- | ---------------------- |
| `title`                | `String`        | `sample-name`          |
| `name`                 | `String`        | `sample-name`          |
| `subtitle`             | `String`        | `sample-name`          |
| `description`          | `String`        | `Sample text`          |
| `category`             | `String`        | `sample`               |
| `categoryName`         | `String`        | `sample-name`          |
| `foodType`             | `String`        | `DELIVERY`             |
| `price`                | `BigDecimal`    | `100.0`                |
| `discountPrice`        | `BigDecimal`    | `100.0`                |
| `currency`             | `String`        | `sample`               |
| `veg`                  | `Boolean`       | `True`                 |
| `available`            | `Boolean`       | `True`                 |
| `bestseller`           | `Boolean`       | `True`                 |
| `featured`             | `Boolean`       | `True`                 |
| `preparationTime`      | `Integer`       | `2026-06-06T12:00:00Z` |
| `stockQuantity`        | `Integer`       | `1`                    |
| `stockTrackingEnabled` | `Boolean`       | `1`                    |
| `spiceLevel`           | `String`        | `sample`               |
| `availabilityWindow`   | `String`        | `sample`               |
| `servingSize`          | `String`        | `sample`               |
| `calories`             | `Integer`       | `1`                    |
| `allergens`            | `String`        | `sample`               |
| `tags`                 | `String`        | `sample`               |
| `packagingCharge`      | `BigDecimal`    | `100.0`                |
| `taxIncluded`          | `Boolean`       | `True`                 |
| `smallSizePrice`       | `BigDecimal`    | `100.0`                |
| `mediumSizePrice`      | `BigDecimal`    | `100.0`                |
| `largeSizePrice`       | `BigDecimal`    | `100.0`                |
| `smallSizeExtra`       | `BigDecimal`    | `10.0`                 |
| `mediumSizeExtra`      | `BigDecimal`    | `10.0`                 |
| `largeSizeExtra`       | `BigDecimal`    | `10.0`                 |
| `cakeBaseWeightKg`     | `BigDecimal`    | `10.0`                 |
| `cakeBasePrice`        | `BigDecimal`    | `100.0`                |
| `cakeExtraHalfKgPrice` | `BigDecimal`    | `100.0`                |
| `cakeMinWeightKg`      | `BigDecimal`    | `10.0`                 |
| `cakeMaxWeightKg`      | `BigDecimal`    | `10.0`                 |
| `cake500gmExtra`       | `BigDecimal`    | `10.0`                 |
| `cake1kgExtra`         | `BigDecimal`    | `10.0`                 |
| `cake1_5kgExtra`       | `BigDecimal`    | `10.0`                 |
| `cake2kgExtra`         | `BigDecimal`    | `10.0`                 |
| `cakeMessageCharge`    | `BigDecimal`    | `100.0`                |
| `cakeMessageEnabled`   | `Boolean`       | `True`                 |
| `customWeightEnabled`  | `Boolean`       | `True`                 |
| `image`                | `MultipartFile` | `<file>`               |
| `file`                 | `MultipartFile` | `<file>`               |

**Response body (`ProductResponse`)**

```json
{
  "success": true,
  "message": "Mr Breado product updated successfully",
  "data": {
    "id": 1,
    "title": "sample-name",
    "slug": "sample-name",
    "subtitle": "sample-name",
    "description": "Sample text",
    "image": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "images": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "price": 100.0,
    "discountPrice": 100.0,
    "effectivePrice": 100.0,
    "currency": "sample",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "isFeatured": true,
    "rating": 5,
    "totalReviews": 100.0,
    "preparationTime": "2026-06-06T12:00:00Z",
    "distanceKm": 10.0,
    "restaurant": "sample"
  }
}
```

### PATCH /admin/mr-breado/products/{productId}/availability

**Auth:** Admin  
**Controller:** `AdminMrBreadoController.java`  
**Handler:** `updateProductAvailability`  
**Success message:** `Mr Breado product availability updated successfully`

**Path variables**

| Name        | Type   | Example |
| ----------- | ------ | ------- |
| `productId` | `Long` | `1`     |

**Request body (`AdminProductAvailabilityRequest`)**

```json
{
  "available": true
}
```

**Response body (`ProductResponse`)**

```json
{
  "success": true,
  "message": "Mr Breado product availability updated successfully",
  "data": {
    "id": 1,
    "title": "sample-name",
    "slug": "sample-name",
    "subtitle": "sample-name",
    "description": "Sample text",
    "image": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "images": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "price": 100.0,
    "discountPrice": 100.0,
    "effectivePrice": 100.0,
    "currency": "sample",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "isFeatured": true,
    "rating": 5,
    "totalReviews": 100.0,
    "preparationTime": "2026-06-06T12:00:00Z",
    "distanceKm": 10.0,
    "restaurant": "sample"
  }
}
```

### GET /admin/mr-breado/restaurant

**Auth:** Admin  
**Controller:** `AdminMrBreadoController.java`  
**Handler:** `restaurant`  
**Success message:** `Mr Breado restaurant fetched successfully`

**Request body:** none

**Response body (`AdminRestaurantResponse`)**

```json
{
  "success": true,
  "message": "Mr Breado restaurant fetched successfully",
  "data": {
    "id": 1,
    "name": "sample-name",
    "slug": "sample-name",
    "logo": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "banner": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "address": "Park Street, Kolkata, West Bengal",
    "city": "Kolkata",
    "status": "PENDING",
    "verificationStatus": "PENDING",
    "visibilityStatus": "PENDING",
    "rating": 5,
    "totalReviews": 100.0,
    "productCount": "sample",
    "open": true,
    "featured": true,
    "promoted": true,
    "grossSales": 10.0,
    "adminCommission": 100.0,
    "restaurantPayable": 100.0,
    "createdAt": "2026-06-06T12:00:00Z"
  }
}
```

### PATCH /admin/mr-breado/restaurant/status

**Auth:** Admin  
**Controller:** `AdminMrBreadoController.java`  
**Handler:** `updateRestaurantStatus`  
**Success message:** `Mr Breado restaurant status updated successfully`

**Request body (`AdminRestaurantStatusRequest`)**

```json
{
  "open": true
}
```

**Response body (`AdminRestaurantResponse`)**

```json
{
  "success": true,
  "message": "Mr Breado restaurant status updated successfully",
  "data": {
    "id": 1,
    "name": "sample-name",
    "slug": "sample-name",
    "logo": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "banner": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "address": "Park Street, Kolkata, West Bengal",
    "city": "Kolkata",
    "status": "PENDING",
    "verificationStatus": "PENDING",
    "visibilityStatus": "PENDING",
    "rating": 5,
    "totalReviews": 100.0,
    "productCount": "sample",
    "open": true,
    "featured": true,
    "promoted": true,
    "grossSales": 10.0,
    "adminCommission": 100.0,
    "restaurantPayable": 100.0,
    "createdAt": "2026-06-06T12:00:00Z"
  }
}
```

### GET /admin/payments/summary

**Auth:** Admin  
**Controller:** `AdminController.java`  
**Handler:** `paymentSummary`  
**Success message:** `Payment summary fetched successfully`

**Request body:** none

**Response body (`AdminPaymentSummaryResponse`)**

```json
{
  "success": true,
  "message": "Payment summary fetched successfully",
  "data": {
    "codCollected": true,
    "onlineSuccess": true,
    "failedAmount": 100.0,
    "refundedAmount": 100.0,
    "platformFee": 100.0,
    "restaurantPayable": 100.0,
    "adminCommission": 100.0,
    "totalCollected": 100.0,
    "totalTransactions": 100.0
  }
}
```

### GET /admin/profile

**Auth:** Admin  
**Controller:** `AdminController.java`  
**Handler:** `profile`  
**Success message:** `Admin profile fetched successfully`

**Request body:** none

**Response body (`AdminProfileResponse`)**

```json
{
  "success": true,
  "message": "Admin profile fetched successfully",
  "data": {
    "id": 1,
    "name": "sample-name",
    "email": "user@example.com",
    "phoneNumber": "9876543210",
    "role": "USER",
    "status": "PENDING",
    "emailChangeUsed": "user@example.com",
    "createdAt": "2026-06-06T12:00:00Z"
  }
}
```

### PUT /admin/profile

**Auth:** Admin  
**Controller:** `AdminController.java`  
**Handler:** `updateProfile`  
**Success message:** `Admin profile updated successfully`

**Request body (`AdminProfileUpdateRequest`)**

```json
{
  "name": "sample-name",
  "mobile": "9876543210",
  "profileImage": "https://res.cloudinary.com/demo/image/upload/sample.png",
  "upiId": 1,
  "bankAccount": "sample"
}
```

**Response body (`AdminProfileResponse`)**

```json
{
  "success": true,
  "message": "Admin profile updated successfully",
  "data": {
    "id": 1,
    "name": "sample-name",
    "email": "user@example.com",
    "phoneNumber": "9876543210",
    "role": "USER",
    "status": "PENDING",
    "emailChangeUsed": "user@example.com",
    "createdAt": "2026-06-06T12:00:00Z"
  }
}
```

### GET /admin/restaurant-settlements

**Auth:** Admin  
**Controller:** `AdminController.java`  
**Handler:** `restaurantSettlements`  
**Success message:** `Restaurant settlements fetched successfully`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Request body:** none

**Response body (`PageResponse<AdminRestaurantPayoutResponse>`)**

```json
{
  "success": true,
  "message": "Restaurant settlements fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "restaurantId": 1,
        "restaurantName": "sample-name",
        "grossAmount": 100.0,
        "commissionAmount": 100.0,
        "payableAmount": 100.0,
        "totalOrders": 100.0,
        "status": "PENDING",
        "periodStart": "2026-06-06T12:00:00Z",
        "periodEnd": "2026-06-06T12:00:00Z",
        "paidAt": true,
        "paymentMethod": "sample",
        "paymentReference": "sample",
        "message": "Sample text",
        "createdAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### POST /admin/restaurant-settlements/{restaurantId}/generate-weekly

**Auth:** Admin  
**Controller:** `AdminController.java`  
**Handler:** `generateWeeklyRestaurantSettlement`  
**Success message:** `Weekly restaurant settlement generated successfully`

**Path variables**

| Name           | Type   | Example |
| -------------- | ------ | ------- |
| `restaurantId` | `Long` | `1`     |

**Request body:** none

**Response body (`AdminRestaurantPayoutResponse`)**

```json
{
  "success": true,
  "message": "Weekly restaurant settlement generated successfully",
  "data": {
    "id": 1,
    "restaurantId": 1,
    "restaurantName": "sample-name",
    "grossAmount": 100.0,
    "commissionAmount": 100.0,
    "payableAmount": 100.0,
    "totalOrders": 100.0,
    "status": "PENDING",
    "periodStart": "2026-06-06T12:00:00Z",
    "periodEnd": "2026-06-06T12:00:00Z",
    "paidAt": true,
    "paymentMethod": "sample",
    "paymentReference": "sample",
    "message": "Sample text",
    "createdAt": "2026-06-06T12:00:00Z"
  }
}
```

### POST /admin/restaurant-settlements/{settlementId}/mark-paid

**Auth:** Admin  
**Controller:** `AdminController.java`  
**Handler:** `markRestaurantSettlementPaid`  
**Success message:** `Restaurant settlement marked as paid`

**Path variables**

| Name           | Type   | Example |
| -------------- | ------ | ------- |
| `settlementId` | `Long` | `1`     |

**Request body (`AdminRestaurantPayoutPaidRequest`)**

```json
{
  "paymentMethod": "sample",
  "paymentReference": "sample",
  "message": "Sample text"
}
```

**Response body (`AdminRestaurantPayoutResponse`)**

```json
{
  "success": true,
  "message": "Restaurant settlement marked as paid",
  "data": {
    "id": 1,
    "restaurantId": 1,
    "restaurantName": "sample-name",
    "grossAmount": 100.0,
    "commissionAmount": 100.0,
    "payableAmount": 100.0,
    "totalOrders": 100.0,
    "status": "PENDING",
    "periodStart": "2026-06-06T12:00:00Z",
    "periodEnd": "2026-06-06T12:00:00Z",
    "paidAt": true,
    "paymentMethod": "sample",
    "paymentReference": "sample",
    "message": "Sample text",
    "createdAt": "2026-06-06T12:00:00Z"
  }
}
```

### GET /admin/restaurants

**Auth:** Admin  
**Controller:** `AdminController.java`  
**Handler:** `restaurants`  
**Success message:** `Restaurants fetched successfully`

**Query parameters**

| Name                 | Type     | Example   |
| -------------------- | -------- | --------- |
| `page`               | `int`    | `1`       |
| `perPage`            | `int`    | `1`       |
| `search`             | `String` | `sample`  |
| `verificationStatus` | `String` | `PENDING` |

**Request body:** none

**Response body (`PageResponse<AdminRestaurantResponse>`)**

```json
{
  "success": true,
  "message": "Restaurants fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "sample-name",
        "slug": "sample-name",
        "logo": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "banner": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "address": "Park Street, Kolkata, West Bengal",
        "city": "Kolkata",
        "status": "PENDING",
        "verificationStatus": "PENDING",
        "visibilityStatus": "PENDING",
        "rating": 5,
        "totalReviews": 100.0,
        "productCount": "sample",
        "open": true,
        "featured": true,
        "promoted": true,
        "grossSales": 10.0,
        "adminCommission": 100.0,
        "restaurantPayable": 100.0,
        "createdAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### GET /admin/users

**Auth:** Admin  
**Controller:** `AdminController.java`  
**Handler:** `users`  
**Success message:** `Users fetched successfully`

**Query parameters**

| Name      | Type     | Example  |
| --------- | -------- | -------- |
| `page`    | `int`    | `1`      |
| `perPage` | `int`    | `1`      |
| `role`    | `String` | `USER`   |
| `search`  | `String` | `sample` |

**Request body:** none

**Response body (`PageResponse<AdminUserResponse>`)**

```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "sample-name",
        "email": "user@example.com",
        "mobile": "9876543210",
        "role": "USER",
        "profileImage": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "walletBalance": 10.0,
        "totalOrders": 100.0,
        "totalReviews": 100.0,
        "enabled": true,
        "blocked": true,
        "deleted": true,
        "createdAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### DELETE /cart/

**Auth:** User  
**Controller:** `CartController.java`  
**Handler:** `clearCart`  
**Success message:** `Cart cleared successfully`

**Request body:** none

**Response body (`Void`)**

```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "data": null
}
```

### GET /cart/

**Auth:** User  
**Controller:** `CartController.java`  
**Handler:** `getCart`  
**Success message:** `Cart fetched successfully`

**Request body:** none

**Response body (`CartResponse`)**

```json
{
  "success": true,
  "message": "Cart fetched successfully",
  "data": {
    "cartId": 1,
    "restaurant": "sample",
    "items": [],
    "pricing": "sample"
  }
}
```

### DELETE /cart/clear

**Auth:** User  
**Controller:** `CartController.java`  
**Handler:** `clearCartAlias`  
**Success message:** `Cart cleared successfully`

**Request body:** none

**Response body (`Void`)**

```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "data": null
}
```

### POST /cart/items

**Auth:** User  
**Controller:** `CartController.java`  
**Handler:** `addItem`  
**Success message:** `Item added to cart`

**Request body (`AddCartItemRequest`)**

```json
{
  "productId": 1,
  "quantity": 1,
  "size": "sample",
  "options": "sample",
  "customizationOptionIds": 1,
  "specialInstruction": "Sample text",
  "selectedSize": "sample",
  "selectedWeight": "sample",
  "customWeightKg": 10.0,
  "cakeMessage": "Sample text"
}
```

**Response body (`CartService.CartSummaryResponse`)**

```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "id": 1,
    "name": "Sample",
    "createdAt": "2026-06-06T12:00:00Z"
  }
}
```

### DELETE /cart/items/{cartItemId}

**Auth:** User  
**Controller:** `CartController.java`  
**Handler:** `removeItem`  
**Success message:** `Cart item removed successfully`

**Path variables**

| Name         | Type   | Example |
| ------------ | ------ | ------- |
| `cartItemId` | `Long` | `1`     |

**Request body:** none

**Response body (`CartService.CartSummaryResponse`)**

```json
{
  "success": true,
  "message": "Cart item removed successfully",
  "data": {
    "id": 1,
    "name": "Sample",
    "createdAt": "2026-06-06T12:00:00Z"
  }
}
```

### PUT /cart/items/{cartItemId}

**Auth:** User  
**Controller:** `CartController.java`  
**Handler:** `updateItem`  
**Success message:** `Cart item updated successfully`

**Path variables**

| Name         | Type   | Example |
| ------------ | ------ | ------- |
| `cartItemId` | `Long` | `1`     |

**Request body (`UpdateCartItemRequest`)**

```json
{
  "quantity": 1
}
```

**Response body (`CartService.CartSummaryResponse`)**

```json
{
  "success": true,
  "message": "Cart item updated successfully",
  "data": {
    "id": 1,
    "name": "Sample",
    "createdAt": "2026-06-06T12:00:00Z"
  }
}
```

### POST /delivery/cash/deposit

**Auth:** Driver  
**Controller:** `DeliveryController.java`  
**Handler:** `depositCash`  
**Success message:** `Cash settlement submitted successfully`

**Request body (`DeliveryCashDepositRequest`)**

```json
{
  "amount": 100.0,
  "paymentMethod": "sample",
  "paymentReference": "sample"
}
```

**Response body (`DeliveryDashboardResponse`)**

```json
{
  "success": true,
  "message": "Cash settlement submitted successfully",
  "data": {
    "online": true,
    "available": true,
    "totalDeliveries": 100.0,
    "totalEarnings": 100.0,
    "rating": 5,
    "cashInHand": 100.0,
    "cashLimit": 100.0,
    "remainingCashLimit": 100.0,
    "cashLimitBlocked": 100.0,
    "minimumCashDepositRequired": 100.0,
    "totalCashCollected": 100.0,
    "totalCashDeposited": 100.0,
    "cashWarningMessage": 100.0,
    "currentOrder": "sample"
  }
}
```

### GET /delivery/cash/summary

**Auth:** Driver  
**Controller:** `DeliveryController.java`  
**Handler:** `getCashSummary`  
**Success message:** `Driver cash summary fetched successfully`

**Request body:** none

**Response body (`DeliveryDashboardResponse`)**

```json
{
  "success": true,
  "message": "Driver cash summary fetched successfully",
  "data": {
    "online": true,
    "available": true,
    "totalDeliveries": 100.0,
    "totalEarnings": 100.0,
    "rating": 5,
    "cashInHand": 100.0,
    "cashLimit": 100.0,
    "remainingCashLimit": 100.0,
    "cashLimitBlocked": 100.0,
    "minimumCashDepositRequired": 100.0,
    "totalCashCollected": 100.0,
    "totalCashDeposited": 100.0,
    "cashWarningMessage": 100.0,
    "currentOrder": "sample"
  }
}
```

### GET /delivery/cash/transactions

**Auth:** Driver  
**Controller:** `DeliveryController.java`  
**Handler:** `getCashTransactions`  
**Success message:** `Driver cash transactions fetched successfully`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Request body:** none

**Response body (`PageResponse<DeliveryCashTransactionResponse>`)**

```json
{
  "success": true,
  "message": "Driver cash transactions fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "type": "DELIVERY",
        "amount": 100.0,
        "balanceAfter": 10.0,
        "orderNumber": "sample",
        "paymentMethod": "sample",
        "paymentReference": "sample",
        "note": "Sample text",
        "createdAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### GET /delivery/dashboard

**Auth:** Driver  
**Controller:** `DeliveryController.java`  
**Handler:** `getDashboard`  
**Success message:** `Delivery dashboard fetched successfully`

**Request body:** none

**Response body (`DeliveryDashboardResponse`)**

```json
{
  "success": true,
  "message": "Delivery dashboard fetched successfully",
  "data": {
    "online": true,
    "available": true,
    "totalDeliveries": 100.0,
    "totalEarnings": 100.0,
    "rating": 5,
    "cashInHand": 100.0,
    "cashLimit": 100.0,
    "remainingCashLimit": 100.0,
    "cashLimitBlocked": 100.0,
    "minimumCashDepositRequired": 100.0,
    "totalCashCollected": 100.0,
    "totalCashDeposited": 100.0,
    "cashWarningMessage": 100.0,
    "currentOrder": "sample"
  }
}
```

### POST /delivery/location

**Auth:** Driver  
**Controller:** `DeliveryController.java`  
**Handler:** `updateLocation`  
**Success message:** `Delivery location updated successfully`

**Request body (`DeliveryLocationRequest`)**

```json
{
  "latitude": 22.5743533,
  "longitude": 88.3628733
}
```

**Response body (`DeliveryDashboardResponse`)**

```json
{
  "success": true,
  "message": "Delivery location updated successfully",
  "data": {
    "online": true,
    "available": true,
    "totalDeliveries": 100.0,
    "totalEarnings": 100.0,
    "rating": 5,
    "cashInHand": 100.0,
    "cashLimit": 100.0,
    "remainingCashLimit": 100.0,
    "cashLimitBlocked": 100.0,
    "minimumCashDepositRequired": 100.0,
    "totalCashCollected": 100.0,
    "totalCashDeposited": 100.0,
    "cashWarningMessage": 100.0,
    "currentOrder": "sample"
  }
}
```

### GET /delivery/offers/active

**Auth:** Driver  
**Controller:** `DeliveryController.java`  
**Handler:** `getActiveOffers`  
**Success message:** `Active delivery offers fetched successfully`

**Request body:** none

**Response body (`List<DeliveryOfferResponse>`)**

```json
{
  "success": true,
  "message": "Active delivery offers fetched successfully",
  "data": [
    {
      "id": 1,
      "orderId": 1,
      "orderNumber": "sample",
      "status": "PENDING",
      "deliveryFee": 100.0,
      "orderAmount": 100.0,
      "amountToCollect": 100.0,
      "collectionAmount": 100.0,
      "isCod": true,
      "paymentType": "DELIVERY",
      "paymentStatus": "PENDING",
      "pickupDistanceKm": 10.0,
      "totalDistanceKm": 100.0,
      "estimatedMinutes": 1,
      "expiresAt": "2026-06-06T12:00:00Z",
      "pickup": "sample",
      "drop": "sample"
    }
  ]
}
```

### POST /delivery/offers/{offerId}/accept

**Auth:** Driver  
**Controller:** `DeliveryController.java`  
**Handler:** `acceptOffer`  
**Success message:** `Delivery offer accepted successfully`

**Path variables**

| Name      | Type   | Example |
| --------- | ------ | ------- |
| `offerId` | `Long` | `1`     |

**Request body:** none

**Response body (`DeliveryOrderResponse`)**

```json
{
  "success": true,
  "message": "Delivery offer accepted successfully",
  "data": {
    "assignmentId": 1,
    "orderId": 1,
    "orderNumber": "sample",
    "status": "PENDING",
    "orderStatus": "PENDING",
    "paymentType": "DELIVERY",
    "paymentStatus": "PENDING",
    "grandTotal": 100.0,
    "orderAmount": 100.0,
    "amountToCollect": 100.0,
    "collectionAmount": 100.0,
    "cashCollected": 100.0,
    "cashCollectedAmount": 100.0,
    "cashCollectedAt": 100.0,
    "isCod": true,
    "canCollectCash": 100.0,
    "canCompleteDelivery": true,
    "deliveryFee": 100.0,
    "totalDistanceKm": 100.0,
    "estimatedMinutes": 1,
    "acceptedAt": "2026-06-06T12:00:00Z",
    "pickedUpAt": "2026-06-06T12:00:00Z",
    "outForDeliveryAt": "2026-06-06T12:00:00Z",
    "reachedDropAt": "2026-06-06T12:00:00Z",
    "deliveredAt": "2026-06-06T12:00:00Z",
    "pickup": "sample",
    "drop": "sample"
  }
}
```

### POST /delivery/offers/{offerId}/reject

**Auth:** Driver  
**Controller:** `DeliveryController.java`  
**Handler:** `rejectOffer`  
**Success message:** `Delivery offer rejected successfully`

**Path variables**

| Name      | Type   | Example |
| --------- | ------ | ------- |
| `offerId` | `Long` | `1`     |

**Request body (`DeliveryRejectRequest`)**

```json
{
  "reason": "Item unavailable"
}
```

**Response body (`Void`)**

```json
{
  "success": true,
  "message": "Delivery offer rejected successfully",
  "data": null
}
```

### GET /delivery/orders/current

**Auth:** Driver  
**Controller:** `DeliveryController.java`  
**Handler:** `getCurrentOrder`  
**Success message:** `Current delivery order fetched successfully`

**Request body:** none

**Response body (`DeliveryOrderResponse`)**

```json
{
  "success": true,
  "message": "Current delivery order fetched successfully",
  "data": {
    "assignmentId": 1,
    "orderId": 1,
    "orderNumber": "sample",
    "status": "PENDING",
    "orderStatus": "PENDING",
    "paymentType": "DELIVERY",
    "paymentStatus": "PENDING",
    "grandTotal": 100.0,
    "orderAmount": 100.0,
    "amountToCollect": 100.0,
    "collectionAmount": 100.0,
    "cashCollected": 100.0,
    "cashCollectedAmount": 100.0,
    "cashCollectedAt": 100.0,
    "isCod": true,
    "canCollectCash": 100.0,
    "canCompleteDelivery": true,
    "deliveryFee": 100.0,
    "totalDistanceKm": 100.0,
    "estimatedMinutes": 1,
    "acceptedAt": "2026-06-06T12:00:00Z",
    "pickedUpAt": "2026-06-06T12:00:00Z",
    "outForDeliveryAt": "2026-06-06T12:00:00Z",
    "reachedDropAt": "2026-06-06T12:00:00Z",
    "deliveredAt": "2026-06-06T12:00:00Z",
    "pickup": "sample",
    "drop": "sample"
  }
}
```

### GET /delivery/orders/history

**Auth:** Driver  
**Controller:** `DeliveryController.java`  
**Handler:** `getHistory`  
**Success message:** `Delivery history fetched successfully`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Request body:** none

**Response body (`PageResponse<DeliveryOrderResponse>`)**

```json
{
  "success": true,
  "message": "Delivery history fetched successfully",
  "data": {
    "items": [
      {
        "assignmentId": 1,
        "orderId": 1,
        "orderNumber": "sample",
        "status": "PENDING",
        "orderStatus": "PENDING",
        "paymentType": "DELIVERY",
        "paymentStatus": "PENDING",
        "grandTotal": 100.0,
        "orderAmount": 100.0,
        "amountToCollect": 100.0,
        "collectionAmount": 100.0,
        "cashCollected": 100.0,
        "cashCollectedAmount": 100.0,
        "cashCollectedAt": 100.0,
        "isCod": true,
        "canCollectCash": 100.0,
        "canCompleteDelivery": true,
        "deliveryFee": 100.0,
        "totalDistanceKm": 100.0,
        "estimatedMinutes": 1,
        "acceptedAt": "2026-06-06T12:00:00Z",
        "pickedUpAt": "2026-06-06T12:00:00Z",
        "outForDeliveryAt": "2026-06-06T12:00:00Z",
        "reachedDropAt": "2026-06-06T12:00:00Z",
        "deliveredAt": "2026-06-06T12:00:00Z",
        "pickup": "sample",
        "drop": "sample"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### POST /delivery/orders/{orderId}/cash-collected

**Auth:** Driver  
**Controller:** `DeliveryController.java`  
**Handler:** `markCashCollected`  
**Success message:** `Cash collected successfully`

**Path variables**

| Name      | Type   | Example |
| --------- | ------ | ------- |
| `orderId` | `Long` | `1`     |

**Request body (`DeliveryCashCollectionRequest`)**

```json
{
  "amount": 100.0,
  "paymentType": "DELIVERY"
}
```

**Response body (`DeliveryOrderResponse`)**

```json
{
  "success": true,
  "message": "Cash collected successfully",
  "data": {
    "assignmentId": 1,
    "orderId": 1,
    "orderNumber": "sample",
    "status": "PENDING",
    "orderStatus": "PENDING",
    "paymentType": "DELIVERY",
    "paymentStatus": "PENDING",
    "grandTotal": 100.0,
    "orderAmount": 100.0,
    "amountToCollect": 100.0,
    "collectionAmount": 100.0,
    "cashCollected": 100.0,
    "cashCollectedAmount": 100.0,
    "cashCollectedAt": 100.0,
    "isCod": true,
    "canCollectCash": 100.0,
    "canCompleteDelivery": true,
    "deliveryFee": 100.0,
    "totalDistanceKm": 100.0,
    "estimatedMinutes": 1,
    "acceptedAt": "2026-06-06T12:00:00Z",
    "pickedUpAt": "2026-06-06T12:00:00Z",
    "outForDeliveryAt": "2026-06-06T12:00:00Z",
    "reachedDropAt": "2026-06-06T12:00:00Z",
    "deliveredAt": "2026-06-06T12:00:00Z",
    "pickup": "sample",
    "drop": "sample"
  }
}
```

### POST /delivery/orders/{orderId}/delivered

**Auth:** Driver  
**Controller:** `DeliveryController.java`  
**Handler:** `markDelivered`  
**Success message:** `Order delivered successfully`

**Path variables**

| Name      | Type   | Example |
| --------- | ------ | ------- |
| `orderId` | `Long` | `1`     |

**Request body:** none

**Response body (`DeliveryOrderResponse`)**

```json
{
  "success": true,
  "message": "Order delivered successfully",
  "data": {
    "assignmentId": 1,
    "orderId": 1,
    "orderNumber": "sample",
    "status": "PENDING",
    "orderStatus": "PENDING",
    "paymentType": "DELIVERY",
    "paymentStatus": "PENDING",
    "grandTotal": 100.0,
    "orderAmount": 100.0,
    "amountToCollect": 100.0,
    "collectionAmount": 100.0,
    "cashCollected": 100.0,
    "cashCollectedAmount": 100.0,
    "cashCollectedAt": 100.0,
    "isCod": true,
    "canCollectCash": 100.0,
    "canCompleteDelivery": true,
    "deliveryFee": 100.0,
    "totalDistanceKm": 100.0,
    "estimatedMinutes": 1,
    "acceptedAt": "2026-06-06T12:00:00Z",
    "pickedUpAt": "2026-06-06T12:00:00Z",
    "outForDeliveryAt": "2026-06-06T12:00:00Z",
    "reachedDropAt": "2026-06-06T12:00:00Z",
    "deliveredAt": "2026-06-06T12:00:00Z",
    "pickup": "sample",
    "drop": "sample"
  }
}
```

### POST /delivery/orders/{orderId}/out-for-delivery

**Auth:** Driver  
**Controller:** `DeliveryController.java`  
**Handler:** `markOutForDelivery`  
**Success message:** `Order marked as out for delivery`

**Path variables**

| Name      | Type   | Example |
| --------- | ------ | ------- |
| `orderId` | `Long` | `1`     |

**Request body:** none

**Response body (`DeliveryOrderResponse`)**

```json
{
  "success": true,
  "message": "Order marked as out for delivery",
  "data": {
    "assignmentId": 1,
    "orderId": 1,
    "orderNumber": "sample",
    "status": "PENDING",
    "orderStatus": "PENDING",
    "paymentType": "DELIVERY",
    "paymentStatus": "PENDING",
    "grandTotal": 100.0,
    "orderAmount": 100.0,
    "amountToCollect": 100.0,
    "collectionAmount": 100.0,
    "cashCollected": 100.0,
    "cashCollectedAmount": 100.0,
    "cashCollectedAt": 100.0,
    "isCod": true,
    "canCollectCash": 100.0,
    "canCompleteDelivery": true,
    "deliveryFee": 100.0,
    "totalDistanceKm": 100.0,
    "estimatedMinutes": 1,
    "acceptedAt": "2026-06-06T12:00:00Z",
    "pickedUpAt": "2026-06-06T12:00:00Z",
    "outForDeliveryAt": "2026-06-06T12:00:00Z",
    "reachedDropAt": "2026-06-06T12:00:00Z",
    "deliveredAt": "2026-06-06T12:00:00Z",
    "pickup": "sample",
    "drop": "sample"
  }
}
```

### POST /delivery/orders/{orderId}/picked-up

**Auth:** Driver  
**Controller:** `DeliveryController.java`  
**Handler:** `markPickedUp`  
**Success message:** `Order marked as picked up`

**Path variables**

| Name      | Type   | Example |
| --------- | ------ | ------- |
| `orderId` | `Long` | `1`     |

**Request body:** none

**Response body (`DeliveryOrderResponse`)**

```json
{
  "success": true,
  "message": "Order marked as picked up",
  "data": {
    "assignmentId": 1,
    "orderId": 1,
    "orderNumber": "sample",
    "status": "PENDING",
    "orderStatus": "PENDING",
    "paymentType": "DELIVERY",
    "paymentStatus": "PENDING",
    "grandTotal": 100.0,
    "orderAmount": 100.0,
    "amountToCollect": 100.0,
    "collectionAmount": 100.0,
    "cashCollected": 100.0,
    "cashCollectedAmount": 100.0,
    "cashCollectedAt": 100.0,
    "isCod": true,
    "canCollectCash": 100.0,
    "canCompleteDelivery": true,
    "deliveryFee": 100.0,
    "totalDistanceKm": 100.0,
    "estimatedMinutes": 1,
    "acceptedAt": "2026-06-06T12:00:00Z",
    "pickedUpAt": "2026-06-06T12:00:00Z",
    "outForDeliveryAt": "2026-06-06T12:00:00Z",
    "reachedDropAt": "2026-06-06T12:00:00Z",
    "deliveredAt": "2026-06-06T12:00:00Z",
    "pickup": "sample",
    "drop": "sample"
  }
}
```

### POST /delivery/orders/{orderId}/reached-drop

**Auth:** Driver  
**Controller:** `DeliveryController.java`  
**Handler:** `markReachedDrop`  
**Success message:** `Driver reached delivery location`

**Path variables**

| Name      | Type   | Example |
| --------- | ------ | ------- |
| `orderId` | `Long` | `1`     |

**Request body:** none

**Response body (`DeliveryOrderResponse`)**

```json
{
  "success": true,
  "message": "Driver reached delivery location",
  "data": {
    "assignmentId": 1,
    "orderId": 1,
    "orderNumber": "sample",
    "status": "PENDING",
    "orderStatus": "PENDING",
    "paymentType": "DELIVERY",
    "paymentStatus": "PENDING",
    "grandTotal": 100.0,
    "orderAmount": 100.0,
    "amountToCollect": 100.0,
    "collectionAmount": 100.0,
    "cashCollected": 100.0,
    "cashCollectedAmount": 100.0,
    "cashCollectedAt": 100.0,
    "isCod": true,
    "canCollectCash": 100.0,
    "canCompleteDelivery": true,
    "deliveryFee": 100.0,
    "totalDistanceKm": 100.0,
    "estimatedMinutes": 1,
    "acceptedAt": "2026-06-06T12:00:00Z",
    "pickedUpAt": "2026-06-06T12:00:00Z",
    "outForDeliveryAt": "2026-06-06T12:00:00Z",
    "reachedDropAt": "2026-06-06T12:00:00Z",
    "deliveredAt": "2026-06-06T12:00:00Z",
    "pickup": "sample",
    "drop": "sample"
  }
}
```

### GET /delivery/profile

**Auth:** Driver  
**Controller:** `DeliveryController.java`  
**Handler:** `getProfile`  
**Success message:** `Delivery profile fetched successfully`

**Request body:** none

**Response body (`DeliveryDashboardResponse`)**

```json
{
  "success": true,
  "message": "Delivery profile fetched successfully",
  "data": {
    "online": true,
    "available": true,
    "totalDeliveries": 100.0,
    "totalEarnings": 100.0,
    "rating": 5,
    "cashInHand": 100.0,
    "cashLimit": 100.0,
    "remainingCashLimit": 100.0,
    "cashLimitBlocked": 100.0,
    "minimumCashDepositRequired": 100.0,
    "totalCashCollected": 100.0,
    "totalCashDeposited": 100.0,
    "cashWarningMessage": 100.0,
    "currentOrder": "sample"
  }
}
```

### POST /delivery/profile/status

**Auth:** Driver  
**Controller:** `DeliveryController.java`  
**Handler:** `updateStatus`  
**Success message:** `Delivery status updated successfully`

**Request body (`DeliveryStatusRequest`)**

```json
{
  "online": true,
  "available": true
}
```

**Response body (`DeliveryDashboardResponse`)**

```json
{
  "success": true,
  "message": "Delivery status updated successfully",
  "data": {
    "online": true,
    "available": true,
    "totalDeliveries": 100.0,
    "totalEarnings": 100.0,
    "rating": 5,
    "cashInHand": 100.0,
    "cashLimit": 100.0,
    "remainingCashLimit": 100.0,
    "cashLimitBlocked": 100.0,
    "minimumCashDepositRequired": 100.0,
    "totalCashCollected": 100.0,
    "totalCashDeposited": 100.0,
    "cashWarningMessage": 100.0,
    "currentOrder": "sample"
  }
}
```

### GET /favorites/products

**Auth:** User  
**Controller:** `FavoriteController.java`  
**Handler:** `getFavoriteProducts`  
**Success message:** `Favorite products fetched successfully`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Request body:** none

**Response body (`PageResponse<FavoriteProductResponse>`)**

```json
{
  "success": true,
  "message": "Favorite products fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "productId": 1,
        "title": "sample-name",
        "slug": "sample-name",
        "image": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "price": 100.0,
        "discountPrice": 100.0,
        "restaurantName": "sample-name",
        "createdAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### DELETE /favorites/products/{productId}

**Auth:** User  
**Controller:** `FavoriteController.java`  
**Handler:** `removeProductFavorite`  
**Success message:** `Product removed from favorites`

**Path variables**

| Name        | Type   | Example |
| ----------- | ------ | ------- |
| `productId` | `Long` | `1`     |

**Request body:** none

**Response body (`Void`)**

```json
{
  "success": true,
  "message": "Product removed from favorites",
  "data": null
}
```

### POST /favorites/products/{productId}

**Auth:** User  
**Controller:** `FavoriteController.java`  
**Handler:** `addProductFavorite`  
**Success message:** `Product added to favorites`

**Path variables**

| Name        | Type   | Example |
| ----------- | ------ | ------- |
| `productId` | `Long` | `1`     |

**Request body:** none

**Response body (`Void`)**

```json
{
  "success": true,
  "message": "Product added to favorites",
  "data": null
}
```

### GET /favorites/restaurants

**Auth:** User  
**Controller:** `FavoriteController.java`  
**Handler:** `getFavoriteRestaurants`  
**Success message:** `Favorite restaurants fetched successfully`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Request body:** none

**Response body (`PageResponse<FavoriteRestaurantResponse>`)**

```json
{
  "success": true,
  "message": "Favorite restaurants fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "restaurantId": 1,
        "name": "sample-name",
        "slug": "sample-name",
        "logo": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "address": "Park Street, Kolkata, West Bengal",
        "rating": 5,
        "createdAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### DELETE /favorites/restaurants/{restaurantId}

**Auth:** User  
**Controller:** `FavoriteController.java`  
**Handler:** `removeRestaurantFavorite`  
**Success message:** `Restaurant removed from favorites`

**Path variables**

| Name           | Type   | Example |
| -------------- | ------ | ------- |
| `restaurantId` | `Long` | `1`     |

**Request body:** none

**Response body (`Void`)**

```json
{
  "success": true,
  "message": "Restaurant removed from favorites",
  "data": null
}
```

### POST /favorites/restaurants/{restaurantId}

**Auth:** User  
**Controller:** `FavoriteController.java`  
**Handler:** `addRestaurantFavorite`  
**Success message:** `Restaurant added to favorites`

**Path variables**

| Name           | Type   | Example |
| -------------- | ------ | ------- |
| `restaurantId` | `Long` | `1`     |

**Request body:** none

**Response body (`Void`)**

```json
{
  "success": true,
  "message": "Restaurant added to favorites",
  "data": null
}
```

### GET /products/{productId}/reviews

**Auth:** Public  
**Controller:** `ReviewController.java`  
**Handler:** `getProductReviews`  
**Success message:** `Product reviews fetched successfully`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Path variables**

| Name        | Type   | Example |
| ----------- | ------ | ------- |
| `productId` | `Long` | `1`     |

**Request body:** none

**Response body (`PageResponse<ReviewResponse>`)**

```json
{
  "success": true,
  "message": "Product reviews fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "type": "DELIVERY",
        "userId": 1,
        "userName": "sample-name",
        "productId": 1,
        "productName": "sample-name",
        "restaurantId": 1,
        "restaurantName": "sample-name",
        "rating": 5,
        "comment": "Sample text",
        "createdAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### GET /restaurants/{restaurantId}/reviews

**Auth:** Public  
**Controller:** `ReviewController.java`  
**Handler:** `getRestaurantReviews`  
**Success message:** `Restaurant reviews fetched successfully`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Path variables**

| Name           | Type   | Example |
| -------------- | ------ | ------- |
| `restaurantId` | `Long` | `1`     |

**Request body:** none

**Response body (`PageResponse<ReviewResponse>`)**

```json
{
  "success": true,
  "message": "Restaurant reviews fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "type": "DELIVERY",
        "userId": 1,
        "userName": "sample-name",
        "productId": 1,
        "productName": "sample-name",
        "restaurantId": 1,
        "restaurantName": "sample-name",
        "rating": 5,
        "comment": "Sample text",
        "createdAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### POST /reviews

**Auth:** User  
**Controller:** `ReviewController.java`  
**Handler:** `createReview`  
**Success message:** `Review submitted successfully`

**Request body (`CreateReviewRequest`)**

```json
{
  "type": "DELIVERY",
  "productId": 1,
  "restaurantId": 1,
  "orderId": 1,
  "rating": 5,
  "comment": "Sample text"
}
```

**Response body (`ReviewResponse`)**

```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "id": 1,
    "type": "DELIVERY",
    "userId": 1,
    "userName": "sample-name",
    "productId": 1,
    "productName": "sample-name",
    "restaurantId": 1,
    "restaurantName": "sample-name",
    "rating": 5,
    "comment": "Sample text",
    "createdAt": "2026-06-06T12:00:00Z"
  }
}
```

### DELETE /search-history/

**Auth:** User  
**Controller:** `SearchHistoryController.java`  
**Handler:** `clearMySearchHistory`  
**Success message:** `Search history cleared successfully`

**Request body:** none

**Response body (`Void`)**

```json
{
  "success": true,
  "message": "Search history cleared successfully",
  "data": null
}
```

### GET /search-history/

**Auth:** User  
**Controller:** `SearchHistoryController.java`  
**Handler:** `getMySearchHistory`  
**Success message:** `Search history fetched successfully`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Request body:** none

**Response body (`PageResponse<SearchHistoryResponse>`)**

```json
{
  "success": true,
  "message": "Search history fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "keyword": "sample",
        "type": "DELIVERY",
        "createdAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### POST /search-history/

**Auth:** User  
**Controller:** `SearchHistoryController.java`  
**Handler:** `saveSearch`  
**Success message:** `Search saved successfully`

**Request body (`SearchHistoryRequest`)**

```json
{
  "keyword": "sample",
  "type": "DELIVERY"
}
```

**Response body (`SearchHistoryResponse`)**

```json
{
  "success": true,
  "message": "Search saved successfully",
  "data": {
    "id": 1,
    "keyword": "sample",
    "type": "DELIVERY",
    "createdAt": "2026-06-06T12:00:00Z"
  }
}
```

### GET /user/reviews

**Auth:** User  
**Controller:** `ReviewController.java`  
**Handler:** `getMyReviews`  
**Success message:** `User reviews fetched successfully`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Request body:** none

**Response body (`PageResponse<ReviewResponse>`)**

```json
{
  "success": true,
  "message": "User reviews fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "type": "DELIVERY",
        "userId": 1,
        "userName": "sample-name",
        "productId": 1,
        "productName": "sample-name",
        "restaurantId": 1,
        "restaurantName": "sample-name",
        "rating": 5,
        "comment": "Sample text",
        "createdAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### GET /api/v1/brands

**Auth:** Public  
**Controller:** `BrandController.java`  
**Handler:** `getBrands`  
**Success message:** `Brands fetched successfully`

**Query parameters**

| Name        | Type     | Example      |
| ----------- | -------- | ------------ |
| `latitude`  | `Double` | `22.5743533` |
| `longitude` | `Double` | `88.3628733` |
| `category`  | `String` | `sample`     |

**Request body:** none

**Response body (`PageResponse<BrandResponse>`)**

```json
{
  "success": true,
  "message": "Brands fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "title": "sample-name",
        "slug": "sample-name",
        "logo": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "status": "PENDING",
        "description": "Sample text",
        "totalProducts": 100.0,
        "enabled": true
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### GET /banners

**Auth:** Public  
**Controller:** `BannerController.java`  
**Handler:** `getBanners`  
**Success message:** `Banners fetched successfully`

**Query parameters**

| Name        | Type     | Example      |
| ----------- | -------- | ------------ |
| `latitude`  | `Double` | `22.5743533` |
| `longitude` | `Double` | `88.3628733` |

**Request body:** none

**Response body (`Object`)**

```json
{
  "success": true,
  "message": "Banners fetched successfully",
  "data": {
    "id": 1,
    "name": "Sample"
  }
}
```

### GET /home

**Auth:** Public  
**Controller:** `HomeController.java`  
**Handler:** `getHome`  
**Success message:** `Home data fetched successfully`

**Query parameters**

| Name        | Type     | Example      |
| ----------- | -------- | ------------ |
| `latitude`  | `Double` | `22.5743533` |
| `longitude` | `Double` | `88.3628733` |
| `zoneId`    | `Long`   | `1`          |

**Request body:** none

**Response body (`HomeResponse`)**

```json
{
  "success": true,
  "message": "Home data fetched successfully",
  "data": {
    "delivery": "sample",
    "banners": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "categories": [],
    "brands": [],
    "popularRestaurants": [],
    "featuredFoods": true,
    "stories": []
  }
}
```

### GET /settings

**Auth:** Public  
**Controller:** `HomeController.java`  
**Handler:** `getSettings`  
**Success message:** `Settings fetched successfully`

**Request body:** none

**Response body (`Object`)**

```json
{
  "success": true,
  "message": "Settings fetched successfully",
  "data": {
    "id": 1,
    "name": "Sample"
  }
}
```

### GET /categories

**Auth:** Public  
**Controller:** `CategoryController.java`  
**Handler:** `getCategories`  
**Success message:** `Categories fetched successfully`

**Query parameters**

| Name        | Type      | Example      |
| ----------- | --------- | ------------ |
| `page`      | `int`     | `1`          |
| `perPage`   | `int`     | `1`          |
| `latitude`  | `Double`  | `22.5743533` |
| `longitude` | `Double`  | `88.3628733` |
| `home`      | `Boolean` | `True`       |

**Request body:** none

**Response body (`PageResponse<CategoryResponse>`)**

```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "title": "sample-name",
        "slug": "sample-name",
        "image": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "banner": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "icon": "sample",
        "activeIcon": true,
        "status": "PENDING",
        "productCount": "sample",
        "enabled": true
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### GET /categories/sub-categories

**Auth:** Public  
**Controller:** `CategoryController.java`  
**Handler:** `getSubCategories`  
**Success message:** `Subcategories fetched successfully`

**Query parameters**

| Name        | Type     | Example      |
| ----------- | -------- | ------------ |
| `page`      | `int`    | `1`          |
| `perPage`   | `int`    | `1`          |
| `latitude`  | `Double` | `22.5743533` |
| `longitude` | `Double` | `88.3628733` |
| `filter`    | `String` | `sample`     |

**Request body:** none

**Response body (`PageResponse<SubCategoryResponse>`)**

```json
{
  "success": true,
  "message": "Subcategories fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "title": "sample-name",
        "slug": "sample-name",
        "parentId": 1,
        "parentSlug": "sample-name",
        "image": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "productCount": "sample",
        "enabled": true
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### GET /food-categories

**Auth:** Public  
**Controller:** `CategoryController.java`  
**Handler:** `getCategories`  
**Success message:** `Categories fetched successfully`

**Query parameters**

| Name        | Type      | Example      |
| ----------- | --------- | ------------ |
| `page`      | `int`     | `1`          |
| `perPage`   | `int`     | `1`          |
| `latitude`  | `Double`  | `22.5743533` |
| `longitude` | `Double`  | `88.3628733` |
| `home`      | `Boolean` | `True`       |

**Request body:** none

**Response body (`PageResponse<CategoryResponse>`)**

```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "title": "sample-name",
        "slug": "sample-name",
        "image": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "banner": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "icon": "sample",
        "activeIcon": true,
        "status": "PENDING",
        "productCount": "sample",
        "enabled": true
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### GET /products/

**Auth:** Public  
**Controller:** `ProductController.java`  
**Handler:** `getProducts`  
**Success message:** `Food items fetched successfully`

**Query parameters**

| Name        | Type         | Example      |
| ----------- | ------------ | ------------ |
| `page`      | `int`        | `1`          |
| `perPage`   | `int`        | `1`          |
| `latitude`  | `Double`     | `22.5743533` |
| `longitude` | `Double`     | `88.3628733` |
| `category`  | `String`     | `sample`     |
| `store`     | `String`     | `sample`     |
| `search`    | `String`     | `sample`     |
| `sort`      | `String`     | `sample`     |
| `minPrice`  | `BigDecimal` | `100.0`      |
| `maxPrice`  | `BigDecimal` | `100.0`      |
| `isVeg`     | `Boolean`    | `True`       |

**Request body:** none

**Response body (`PageResponse<ProductResponse>`)**

```json
{
  "success": true,
  "message": "Food items fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "title": "sample-name",
        "slug": "sample-name",
        "subtitle": "sample-name",
        "description": "Sample text",
        "image": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "images": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "price": 100.0,
        "discountPrice": 100.0,
        "effectivePrice": 100.0,
        "currency": "sample",
        "isVeg": true,
        "isBestseller": true,
        "isAvailable": true,
        "isFeatured": true,
        "rating": 5,
        "totalReviews": 100.0,
        "preparationTime": "2026-06-06T12:00:00Z",
        "distanceKm": 10.0,
        "restaurant": "sample"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### GET /products/{slug}

**Auth:** Public  
**Controller:** `ProductController.java`  
**Handler:** `getProductDetails`  
**Success message:** `Food item details fetched successfully`

**Path variables**

| Name   | Type     | Example       |
| ------ | -------- | ------------- |
| `slug` | `String` | `sample-name` |

**Request body:** none

**Response body (`ProductDetailResponse`)**

```json
{
  "success": true,
  "message": "Food item details fetched successfully",
  "data": {
    "id": 1,
    "title": "sample-name",
    "slug": "sample-name",
    "description": "Sample text",
    "images": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "price": 100.0,
    "discountPrice": 100.0,
    "effectivePrice": 100.0,
    "currency": "sample",
    "isVeg": true,
    "isBestseller": true,
    "rating": 5,
    "totalReviews": 100.0,
    "preparationTime": "2026-06-06T12:00:00Z",
    "stockQuantity": 1,
    "stockTrackingEnabled": 1,
    "isAvailable": true,
    "restaurant": "sample",
    "customizations": [],
    "reviews": []
  }
}
```

### GET /restaurants/{slug}/menu

**Auth:** Public  
**Controller:** `MenuController.java`  
**Handler:** `getRestaurantMenu`  
**Success message:** `Menu fetched successfully`

**Query parameters**

| Name        | Type     | Example      |
| ----------- | -------- | ------------ |
| `latitude`  | `Double` | `22.5743533` |
| `longitude` | `Double` | `88.3628733` |
| `category`  | `String` | `sample`     |

**Path variables**

| Name   | Type     | Example       |
| ------ | -------- | ------------- |
| `slug` | `String` | `sample-name` |

**Request body:** none

**Response body (`RestaurantMenuResponse`)**

```json
{
  "success": true,
  "message": "Menu fetched successfully",
  "data": {
    "restaurant": "sample",
    "categories": [],
    "items": []
  }
}
```

### GET /stores/{slug}/menu

**Auth:** Public  
**Controller:** `MenuController.java`  
**Handler:** `getRestaurantMenu`  
**Success message:** `Menu fetched successfully`

**Query parameters**

| Name        | Type     | Example      |
| ----------- | -------- | ------------ |
| `latitude`  | `Double` | `22.5743533` |
| `longitude` | `Double` | `88.3628733` |
| `category`  | `String` | `sample`     |

**Path variables**

| Name   | Type     | Example       |
| ------ | -------- | ------------- |
| `slug` | `String` | `sample-name` |

**Request body:** none

**Response body (`RestaurantMenuResponse`)**

```json
{
  "success": true,
  "message": "Menu fetched successfully",
  "data": {
    "restaurant": "sample",
    "categories": [],
    "items": []
  }
}
```

### GET /admin/seller-messages

**Auth:** Admin  
**Controller:** `AdminSellerMessageController.java`  
**Handler:** `adminList`  
**Success message:** `Admin seller messages fetched successfully`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Request body:** none

**Response body (`PageResponse<AdminSellerMessageResponse>`)**

```json
{
  "success": true,
  "message": "Admin seller messages fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "sellerId": 1,
        "sellerName": "sample-name",
        "restaurantId": 1,
        "restaurantName": "sample-name",
        "title": "sample-name",
        "message": "Sample text",
        "targetType": "DELIVERY",
        "targetValue": 100.0,
        "readStatus": true,
        "readAt": "2026-06-06T12:00:00Z",
        "createdAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### POST /admin/seller-messages

**Auth:** Admin  
**Controller:** `AdminSellerMessageController.java`  
**Handler:** `send`  
**Success message:** `Message sent to seller successfully`

**Request body (`AdminSellerMessageRequest`)**

```json
{
  "sellerId": 1,
  "restaurantId": 1,
  "title": "sample-name",
  "message": "Sample text",
  "targetType": "DELIVERY",
  "targetValue": 100.0
}
```

**Response body (`AdminSellerMessageResponse`)**

```json
{
  "success": true,
  "message": "Message sent to seller successfully",
  "data": {
    "id": 1,
    "sellerId": 1,
    "sellerName": "sample-name",
    "restaurantId": 1,
    "restaurantName": "sample-name",
    "title": "sample-name",
    "message": "Sample text",
    "targetType": "DELIVERY",
    "targetValue": 100.0,
    "readStatus": true,
    "readAt": "2026-06-06T12:00:00Z",
    "createdAt": "2026-06-06T12:00:00Z"
  }
}
```

### GET /seller/messages

**Auth:** Seller  
**Controller:** `AdminSellerMessageController.java`  
**Handler:** `sellerInbox`  
**Success message:** `Seller messages fetched successfully`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Request body:** none

**Response body (`PageResponse<AdminSellerMessageResponse>`)**

```json
{
  "success": true,
  "message": "Seller messages fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "sellerId": 1,
        "sellerName": "sample-name",
        "restaurantId": 1,
        "restaurantName": "sample-name",
        "title": "sample-name",
        "message": "Sample text",
        "targetType": "DELIVERY",
        "targetValue": 100.0,
        "readStatus": true,
        "readAt": "2026-06-06T12:00:00Z",
        "createdAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### PATCH /seller/messages/{messageId}/read

**Auth:** Seller  
**Controller:** `AdminSellerMessageController.java`  
**Handler:** `read`  
**Success message:** `Seller message marked as read`

**Path variables**

| Name        | Type   | Example |
| ----------- | ------ | ------- |
| `messageId` | `Long` | `1`     |

**Request body:** none

**Response body (`AdminSellerMessageResponse`)**

```json
{
  "success": true,
  "message": "Seller message marked as read",
  "data": {
    "id": 1,
    "sellerId": 1,
    "sellerName": "sample-name",
    "restaurantId": 1,
    "restaurantName": "sample-name",
    "title": "sample-name",
    "message": "Sample text",
    "targetType": "DELIVERY",
    "targetValue": 100.0,
    "readStatus": true,
    "readAt": "2026-06-06T12:00:00Z",
    "createdAt": "2026-06-06T12:00:00Z"
  }
}
```

### GET /admin/offers/

**Auth:** Admin  
**Controller:** `AdminOfferController.java`  
**Handler:** `getOffers`  
**Success message:** `Success`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Request body:** none

**Response body (`Object`)**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Sample"
  }
}
```

### POST /admin/offers/

**Auth:** Admin  
**Controller:** `AdminOfferController.java`  
**Handler:** `createOffer`  
**Success message:** `Success`

**Request body (`OfferRequest`)**

```json
{
  "title": "sample-name",
  "name": "sample-name",
  "subtitle": "sample-name",
  "description": "Sample text",
  "message": "Sample text",
  "imageUrl": "https://res.cloudinary.com/demo/image/upload/sample.png",
  "image": "https://res.cloudinary.com/demo/image/upload/sample.png",
  "banner": "https://res.cloudinary.com/demo/image/upload/sample.png",
  "url": "https://res.cloudinary.com/demo/image/upload/sample.png",
  "badge": "sample",
  "label": "sample",
  "offerType": "DELIVERY",
  "type": "DELIVERY",
  "restaurantSlug": "sample-name",
  "mrBreadoOnly": true,
  "actionType": "DELIVERY",
  "target_type": "DELIVERY",
  "actionValue": 100.0,
  "target_value": 100.0,
  "couponCode": true,
  "code": true,
  "discountType": "DELIVERY",
  "discountValue": 100.0,
  "discount": 10.0,
  "minOrderAmount": 100.0,
  "maxDiscountAmount": 100.0,
  "usageLimit": 1,
  "active": true,
  "enabled": true,
  "isActive": true,
  "sortOrder": "sample",
  "startsAt": "2026-06-06T12:00:00Z",
  "startAt": "2026-06-06T12:00:00Z",
  "endsAt": "2026-06-06T12:00:00Z",
  "endAt": "2026-06-06T12:00:00Z"
}
```

**Response body (`Object`)**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Sample"
  }
}
```

### DELETE /admin/offers/{id}

**Auth:** Admin  
**Controller:** `AdminOfferController.java`  
**Handler:** `deleteOffer`  
**Success message:** `Success`

**Path variables**

| Name | Type   | Example |
| ---- | ------ | ------- |
| `id` | `Long` | `1`     |

**Request body:** none

**Response body (`Object`)**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Sample"
  }
}
```

### PUT /admin/offers/{id}

**Auth:** Admin  
**Controller:** `AdminOfferController.java`  
**Handler:** `updateOffer`  
**Success message:** `Success`

**Path variables**

| Name | Type   | Example |
| ---- | ------ | ------- |
| `id` | `Long` | `1`     |

**Request body (`OfferRequest`)**

```json
{
  "title": "sample-name",
  "name": "sample-name",
  "subtitle": "sample-name",
  "description": "Sample text",
  "message": "Sample text",
  "imageUrl": "https://res.cloudinary.com/demo/image/upload/sample.png",
  "image": "https://res.cloudinary.com/demo/image/upload/sample.png",
  "banner": "https://res.cloudinary.com/demo/image/upload/sample.png",
  "url": "https://res.cloudinary.com/demo/image/upload/sample.png",
  "badge": "sample",
  "label": "sample",
  "offerType": "DELIVERY",
  "type": "DELIVERY",
  "restaurantSlug": "sample-name",
  "mrBreadoOnly": true,
  "actionType": "DELIVERY",
  "target_type": "DELIVERY",
  "actionValue": 100.0,
  "target_value": 100.0,
  "couponCode": true,
  "code": true,
  "discountType": "DELIVERY",
  "discountValue": 100.0,
  "discount": 10.0,
  "minOrderAmount": 100.0,
  "maxDiscountAmount": 100.0,
  "usageLimit": 1,
  "active": true,
  "enabled": true,
  "isActive": true,
  "sortOrder": "sample",
  "startsAt": "2026-06-06T12:00:00Z",
  "startAt": "2026-06-06T12:00:00Z",
  "endsAt": "2026-06-06T12:00:00Z",
  "endAt": "2026-06-06T12:00:00Z"
}
```

**Response body (`Object`)**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Sample"
  }
}
```

### PATCH /admin/offers/{id}/status

**Auth:** Admin  
**Controller:** `AdminOfferController.java`  
**Handler:** `updateStatus`  
**Success message:** `Success`

**Path variables**

| Name | Type   | Example |
| ---- | ------ | ------- |
| `id` | `Long` | `1`     |

**Request body:** none

**Response body (`Object`)**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Sample"
  }
}
```

### GET /offers/

**Auth:** Public  
**Controller:** `PublicOfferController.java`  
**Handler:** `getPublicOffers`  
**Success message:** `Success`

**Query parameters**

| Name      | Type     | Example    |
| --------- | -------- | ---------- |
| `type`    | `String` | `DELIVERY` |
| `page`    | `int`    | `1`        |
| `perPage` | `int`    | `1`        |

**Request body:** none

**Response body (`Object`)**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Sample"
  }
}
```

### POST /offers/verify

**Auth:** Public  
**Controller:** `PublicOfferController.java`  
**Handler:** `verifyCoupon`  
**Success message:** `Success`

**Request body (`CouponValidationRequest`)**

```json
{
  "promoCode": true,
  "couponCode": true,
  "code": true
}
```

**Response body (`Object`)**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Sample"
  }
}
```

### POST /checkout/summary

**Auth:** Public  
**Controller:** `CheckoutController.java`  
**Handler:** `getCheckoutSummary`  
**Success message:** `Checkout summary fetched successfully`

**Request body (`CheckoutSummaryRequest`)**

```json
{
  "addressId": 1,
  "paymentType": "DELIVERY",
  "promoCode": true,
  "rushDelivery": true,
  "useWallet": true,
  "orderType": "DELIVERY",
  "userLatitude": 22.5743533,
  "userLongitude": 88.3628733
}
```

**Response body (`CheckoutSummaryResponse`)**

```json
{
  "success": true,
  "message": "Checkout summary fetched successfully",
  "data": {
    "cartId": 1,
    "restaurantSlug": "sample-name",
    "restaurantName": "sample-name",
    "orderType": "DELIVERY",
    "paymentType": "DELIVERY",
    "itemsTotal": 100.0,
    "restaurantCharges": 100.0,
    "deliveryFee": 100.0,
    "platformFee": 100.0,
    "tax": 10.0,
    "discount": 10.0,
    "walletUsed": 10.0,
    "grandTotal": 100.0,
    "payableNow": 100.0,
    "payableLater": 100.0,
    "takeawayBookingFee": 100.0,
    "takeawayBookingFeePercent": 100.0,
    "distanceKm": 10.0,
    "codEnabled": true,
    "onlinePaymentEnabled": true,
    "takeawayAvailable": true,
    "pricing": "sample",
    "items": [],
    "restaurant": "sample",
    "message": "Sample text"
  }
}
```

### GET /user/addresses/

**Auth:** User  
**Controller:** `AddressController.java`  
**Handler:** `getAddresses`  
**Success message:** `Addresses fetched successfully`

**Request body:** none

**Response body (`List<AddressResponse>`)**

```json
{
  "success": true,
  "message": "Addresses fetched successfully",
  "data": [
    {
      "id": 1,
      "type": "DELIVERY",
      "name": "sample-name",
      "mobile": "9876543210",
      "address": "Park Street, Kolkata, West Bengal",
      "landmark": "sample",
      "city": "Kolkata",
      "state": "West Bengal",
      "country": "India",
      "zipcode": true,
      "latitude": 22.5743533,
      "longitude": 88.3628733,
      "isDefault": true
    }
  ]
}
```

### POST /user/addresses/

**Auth:** User  
**Controller:** `AddressController.java`  
**Handler:** `createAddress`  
**Success message:** `Address added successfully`

**Request body (`AddressRequest`)**

```json
{
  "type": "DELIVERY",
  "name": "sample-name",
  "mobile": "9876543210",
  "address": "Park Street, Kolkata, West Bengal",
  "landmark": "sample",
  "city": "Kolkata",
  "state": "West Bengal",
  "country": "India",
  "zipcode": true,
  "latitude": 22.5743533,
  "longitude": 88.3628733,
  "isDefault": true
}
```

**Response body (`AddressResponse`)**

```json
{
  "success": true,
  "message": "Address added successfully",
  "data": {
    "id": 1,
    "type": "DELIVERY",
    "name": "sample-name",
    "mobile": "9876543210",
    "address": "Park Street, Kolkata, West Bengal",
    "landmark": "sample",
    "city": "Kolkata",
    "state": "West Bengal",
    "country": "India",
    "zipcode": true,
    "latitude": 22.5743533,
    "longitude": 88.3628733,
    "isDefault": true
  }
}
```

### DELETE /user/addresses/{addressId}

**Auth:** User  
**Controller:** `AddressController.java`  
**Handler:** `deleteAddress`  
**Success message:** `Address deleted successfully`

**Path variables**

| Name        | Type   | Example |
| ----------- | ------ | ------- |
| `addressId` | `Long` | `1`     |

**Request body:** none

**Response body (`Void`)**

```json
{
  "success": true,
  "message": "Address deleted successfully",
  "data": null
}
```

### PUT /user/addresses/{addressId}

**Auth:** User  
**Controller:** `AddressController.java`  
**Handler:** `updateAddress`  
**Success message:** `Address updated successfully`

**Path variables**

| Name        | Type   | Example |
| ----------- | ------ | ------- |
| `addressId` | `Long` | `1`     |

**Request body (`AddressRequest`)**

```json
{
  "type": "DELIVERY",
  "name": "sample-name",
  "mobile": "9876543210",
  "address": "Park Street, Kolkata, West Bengal",
  "landmark": "sample",
  "city": "Kolkata",
  "state": "West Bengal",
  "country": "India",
  "zipcode": true,
  "latitude": 22.5743533,
  "longitude": 88.3628733,
  "isDefault": true
}
```

**Response body (`AddressResponse`)**

```json
{
  "success": true,
  "message": "Address updated successfully",
  "data": {
    "id": 1,
    "type": "DELIVERY",
    "name": "sample-name",
    "mobile": "9876543210",
    "address": "Park Street, Kolkata, West Bengal",
    "landmark": "sample",
    "city": "Kolkata",
    "state": "West Bengal",
    "country": "India",
    "zipcode": true,
    "latitude": 22.5743533,
    "longitude": 88.3628733,
    "isDefault": true
  }
}
```

### POST /user/addresses/{addressId}/default

**Auth:** User  
**Controller:** `AddressController.java`  
**Handler:** `setDefaultAddress`  
**Success message:** `Default address updated successfully`

**Path variables**

| Name        | Type   | Example |
| ----------- | ------ | ------- |
| `addressId` | `Long` | `1`     |

**Request body:** none

**Response body (`Void`)**

```json
{
  "success": true,
  "message": "Default address updated successfully",
  "data": null
}
```

### GET /user/orders

**Auth:** User  
**Controller:** `OrderController.java`  
**Handler:** `getOrders`  
**Success message:** `Orders fetched successfully`

**Query parameters**

| Name      | Type     | Example   |
| --------- | -------- | --------- |
| `page`    | `int`    | `1`       |
| `perPage` | `int`    | `1`       |
| `status`  | `String` | `PENDING` |

**Request body:** none

**Response body (`PageResponse<OrderListResponse>`)**

```json
{
  "success": true,
  "message": "Orders fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "orderNumber": "sample",
        "slug": "sample-name",
        "title": "sample-name",
        "status": "PENDING",
        "statusLabel": "PENDING",
        "paymentStatus": "PENDING",
        "amount": 100.0,
        "amountText": 100.0,
        "date": "2026-06-06T12:00:00Z",
        "dateText": "2026-06-06T12:00:00Z",
        "itemsCount": "sample",
        "restaurant": "sample"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### POST /user/orders

**Auth:** User  
**Controller:** `OrderController.java`  
**Handler:** `placeOrder`  
**Success message:** `Order placed successfully`

**Request body (`PlaceOrderRequest`)**

```json
{
  "addressId": 1,
  "paymentType": "DELIVERY",
  "promoCode": true,
  "rushDelivery": true,
  "useWallet": true,
  "orderNote": "Sample text",
  "orderType": "DELIVERY",
  "userLatitude": 22.5743533,
  "userLongitude": 88.3628733,
  "pickupSlot": "sample",
  "razorpayPaymentId": 1,
  "razorpayOrderId": 1,
  "razorpaySignature": "sample"
}
```

**Response body (`OrderDetailResponse`)**

```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "id": 1,
    "orderNumber": "sample",
    "slug": "sample-name",
    "status": "PENDING",
    "statusLabel": "PENDING",
    "orderType": "DELIVERY",
    "paymentType": "DELIVERY",
    "paymentStatus": "PENDING",
    "amount": 100.0,
    "itemsTotal": 100.0,
    "deliveryFee": 100.0,
    "grandTotal": 100.0,
    "payableNow": 100.0,
    "payableLater": 100.0,
    "takeawayBookingFee": 100.0,
    "takeawayBookingFeePercent": 100.0,
    "pickupSlot": "sample",
    "distanceKm": 10.0
  }
}
```

### POST /user/orders/{orderId}/reorder

**Auth:** User  
**Controller:** `OrderController.java`  
**Handler:** `reorder`  
**Success message:** `Reorder created successfully`

**Path variables**

| Name      | Type   | Example |
| --------- | ------ | ------- |
| `orderId` | `Long` | `1`     |

**Request body:** none

**Response body (`OrderDetailResponse`)**

```json
{
  "success": true,
  "message": "Reorder created successfully",
  "data": {
    "id": 1,
    "orderNumber": "sample",
    "slug": "sample-name",
    "status": "PENDING",
    "statusLabel": "PENDING",
    "orderType": "DELIVERY",
    "paymentType": "DELIVERY",
    "paymentStatus": "PENDING",
    "amount": 100.0,
    "itemsTotal": 100.0,
    "deliveryFee": 100.0,
    "grandTotal": 100.0,
    "payableNow": 100.0,
    "payableLater": 100.0,
    "takeawayBookingFee": 100.0,
    "takeawayBookingFeePercent": 100.0,
    "pickupSlot": "sample",
    "distanceKm": 10.0
  }
}
```

### GET /user/orders/{slug}

**Auth:** User  
**Controller:** `OrderController.java`  
**Handler:** `getOrderDetails`  
**Success message:** `Order details fetched successfully`

**Path variables**

| Name   | Type     | Example       |
| ------ | -------- | ------------- |
| `slug` | `String` | `sample-name` |

**Request body:** none

**Response body (`OrderDetailResponse`)**

```json
{
  "success": true,
  "message": "Order details fetched successfully",
  "data": {
    "id": 1,
    "orderNumber": "sample",
    "slug": "sample-name",
    "status": "PENDING",
    "statusLabel": "PENDING",
    "orderType": "DELIVERY",
    "paymentType": "DELIVERY",
    "paymentStatus": "PENDING",
    "amount": 100.0,
    "itemsTotal": 100.0,
    "deliveryFee": 100.0,
    "grandTotal": 100.0,
    "payableNow": 100.0,
    "payableLater": 100.0,
    "takeawayBookingFee": 100.0,
    "takeawayBookingFeePercent": 100.0,
    "pickupSlot": "sample",
    "distanceKm": 10.0
  }
}
```

### POST /user/orders/{slug}/cancel

**Auth:** User  
**Controller:** `OrderController.java`  
**Handler:** `cancelOrder`  
**Success message:** `Order cancelled successfully`

**Path variables**

| Name   | Type     | Example       |
| ------ | -------- | ------------- |
| `slug` | `String` | `sample-name` |

**Request body (`CancelOrderRequest`)**

```json
{
  "reason": "Item unavailable"
}
```

**Response body (`OrderDetailResponse`)**

```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "id": 1,
    "orderNumber": "sample",
    "slug": "sample-name",
    "status": "PENDING",
    "statusLabel": "PENDING",
    "orderType": "DELIVERY",
    "paymentType": "DELIVERY",
    "paymentStatus": "PENDING",
    "amount": 100.0,
    "itemsTotal": 100.0,
    "deliveryFee": 100.0,
    "grandTotal": 100.0,
    "payableNow": 100.0,
    "payableLater": 100.0,
    "takeawayBookingFee": 100.0,
    "takeawayBookingFeePercent": 100.0,
    "pickupSlot": "sample",
    "distanceKm": 10.0
  }
}
```

### GET /admin/payment-ledger

**Auth:** Admin  
**Controller:** `PaymentLedgerController.java`  
**Handler:** `adminLedger`  
**Success message:** `Payment ledger fetched successfully`

**Query parameters**

| Name      | Type     | Example    |
| --------- | -------- | ---------- |
| `page`    | `int`    | `1`        |
| `perPage` | `int`    | `1`        |
| `type`    | `String` | `DELIVERY` |

**Request body:** none

**Response body (`PageResponse<PaymentLedgerEntryResponse>`)**

```json
{
  "success": true,
  "message": "Payment ledger fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "type": "DELIVERY",
        "orderId": 1,
        "orderNumber": "sample",
        "restaurantId": 1,
        "restaurantName": "sample-name",
        "userId": 1,
        "userName": "sample-name",
        "amount": 100.0,
        "currency": "sample",
        "reference": "sample",
        "note": "Sample text",
        "createdAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### GET /admin/payment-settings/

**Auth:** Admin  
**Controller:** `AdminPaymentSettingsController.java`  
**Handler:** `getSettings`  
**Success message:** `Admin payment settings fetched successfully`

**Request body:** none

**Response body (`AdminPaymentSettingsResponse`)**

```json
{
  "success": true,
  "message": "Admin payment settings fetched successfully",
  "data": {
    "id": 1,
    "codEnabled": true,
    "onlinePaymentEnabled": true,
    "razorpayMode": "TEST",
    "razorpayKeyId": 1,
    "razorpaySecretConfigured": true,
    "updatedAt": "2026-06-06T12:00:00Z"
  }
}
```

### PUT /admin/payment-settings/

**Auth:** Admin  
**Controller:** `AdminPaymentSettingsController.java`  
**Handler:** `updateSettings`  
**Success message:** `Payment settings updated successfully`

**Request body (`AdminPaymentSettingsRequest`)**

```json
{
  "codEnabled": true,
  "onlinePaymentEnabled": true,
  "razorpayMode": "TEST",
  "razorpayKeyId": 1,
  "razorpayKeySecret": "sample"
}
```

**Response body (`AdminPaymentSettingsResponse`)**

```json
{
  "success": true,
  "message": "Payment settings updated successfully",
  "data": {
    "id": 1,
    "codEnabled": true,
    "onlinePaymentEnabled": true,
    "razorpayMode": "TEST",
    "razorpayKeyId": 1,
    "razorpaySecretConfigured": true,
    "updatedAt": "2026-06-06T12:00:00Z"
  }
}
```

### GET /payment/options

**Auth:** Public  
**Controller:** `PaymentController.java`  
**Handler:** `getPaymentOptions`  
**Success message:** `Payment options fetched successfully`

**Request body:** none

**Response body (`PaymentOptionsResponse`)**

```json
{
  "success": true,
  "message": "Payment options fetched successfully",
  "data": {
    "codEnabled": true,
    "onlinePaymentEnabled": true,
    "razorpayConfigured": true,
    "takeawayEnabled": true,
    "takeawayOnlineRequired": true,
    "anyPaymentMethodAvailable": true,
    "razorpayKeyId": 1,
    "razorpayMode": "TEST",
    "message": "Sample text"
  }
}
```

### GET /payment/settings

**Auth:** Public  
**Controller:** `PaymentSettingsController.java`  
**Handler:** `getPublicPaymentSettings`  
**Success message:** `Payment settings fetched successfully`

**Request body:** none

**Response body (`PublicPlatformSettingsResponse`)**

```json
{
  "success": true,
  "message": "Payment settings fetched successfully",
  "data": {
    "codEnabled": true,
    "onlinePaymentEnabled": true,
    "razorpayConfigured": true,
    "razorpayKeyId": 1,
    "razorpayMode": "TEST",
    "message": "Sample text",
    "mrBreadoTakeawayEnabled": true,
    "takeawayBookingFeePercent": 100.0,
    "deliveryChargePerKm": 100.0,
    "minimumDeliveryCharge": 100.0,
    "maximumDeliveryCharge": 100.0,
    "supportEmail": "user@example.com",
    "supportPhone": "9876543210",
    "businessAddress": "Park Street, Kolkata, West Bengal",
    "businessLatitude": 22.5743533,
    "businessLongitude": 88.3628733
  }
}
```

### POST /payments/create-order

**Auth:** Public  
**Controller:** `PaymentController.java`  
**Handler:** `createPaymentOrder`  
**Success message:** `Payment order created successfully`

**Request body (`CreatePaymentOrderRequest`)**

```json
{
  "amount": 100.0,
  "currency": "sample",
  "orderSlug": "sample-name",
  "provider": "sample"
}
```

**Response body (`CreatePaymentOrderResponse`)**

```json
{
  "success": true,
  "message": "Payment order created successfully",
  "data": {
    "paymentTransactionId": 1,
    "provider": "sample",
    "razorpayOrderId": 1,
    "orderId": 1,
    "amount": 100.0,
    "currency": "sample",
    "amountInPaise": 100.0,
    "keyId": 1,
    "orderSlug": "sample-name",
    "status": "PENDING"
  }
}
```

### GET /payments/settings

**Auth:** Public  
**Controller:** `PaymentController.java`  
**Handler:** `getPublicPaymentSettings`  
**Success message:** `Payment settings fetched successfully`

**Request body:** none

**Response body (`PaymentSettingsResponse`)**

```json
{
  "success": true,
  "message": "Payment settings fetched successfully",
  "data": {
    "codEnabled": true,
    "onlinePaymentEnabled": true,
    "razorpayConfigured": true,
    "razorpayKeyId": 1,
    "razorpayMode": "TEST",
    "message": "Sample text"
  }
}
```

### POST /payments/verify

**Auth:** Public  
**Controller:** `PaymentController.java`  
**Handler:** `verifyPayment`  
**Success message:** `Payment verified successfully`

**Request body (`VerifyPaymentRequest`)**

```json
{
  "providerOrderId": 1,
  "providerPaymentId": 1,
  "providerSignature": "sample",
  "razorpayOrderId": 1,
  "razorpayPaymentId": 1,
  "razorpaySignature": "sample"
}
```

**Response body (`PaymentTransactionResponse`)**

```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "id": 1,
    "orderNumber": "sample",
    "orderSlug": "sample-name",
    "provider": "sample",
    "status": "PENDING",
    "amount": 100.0,
    "currency": "sample",
    "providerOrderId": 1,
    "providerPaymentId": 1,
    "createdAt": "2026-06-06T12:00:00Z",
    "paidAt": true
  }
}
```

### GET /seller/payment-ledger

**Auth:** Seller  
**Controller:** `PaymentLedgerController.java`  
**Handler:** `sellerLedger`  
**Success message:** `Seller payment ledger fetched successfully`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Request body:** none

**Response body (`PageResponse<PaymentLedgerEntryResponse>`)**

```json
{
  "success": true,
  "message": "Seller payment ledger fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "type": "DELIVERY",
        "orderId": 1,
        "orderNumber": "sample",
        "restaurantId": 1,
        "restaurantName": "sample-name",
        "userId": 1,
        "userName": "sample-name",
        "amount": 100.0,
        "currency": "sample",
        "reference": "sample",
        "note": "Sample text",
        "createdAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### GET /user/payments

**Auth:** User  
**Controller:** `PaymentController.java`  
**Handler:** `getMyPayments`  
**Success message:** `Payment history fetched successfully`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Request body:** none

**Response body (`PageResponse<PaymentTransactionResponse>`)**

```json
{
  "success": true,
  "message": "Payment history fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "orderNumber": "sample",
        "orderSlug": "sample-name",
        "provider": "sample",
        "status": "PENDING",
        "amount": 100.0,
        "currency": "sample",
        "providerOrderId": 1,
        "providerPaymentId": 1,
        "createdAt": "2026-06-06T12:00:00Z",
        "paidAt": true
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### GET /platform/admin/settings

**Auth:** Public  
**Controller:** `PlatformSettingsController.java`  
**Handler:** `getAdminSettings`  
**Success message:** `Admin platform settings fetched successfully`

**Request body:** none

**Response body (`AdminPlatformSettingsResponse`)**

```json
{
  "success": true,
  "message": "Admin platform settings fetched successfully",
  "data": {
    "id": 1,
    "codEnabled": true,
    "onlinePaymentEnabled": true,
    "razorpayMode": "TEST",
    "razorpayKeyId": 1,
    "razorpaySecretConfigured": true,
    "mrBreadoTakeawayEnabled": true,
    "takeawayBookingFeePercent": 100.0,
    "deliveryChargePerKm": 100.0,
    "minimumDeliveryCharge": 100.0,
    "maximumDeliveryCharge": 100.0,
    "supportEmail": "user@example.com",
    "supportPhone": "9876543210",
    "businessAddress": "Park Street, Kolkata, West Bengal",
    "businessLatitude": 22.5743533,
    "businessLongitude": 88.3628733,
    "updatedAt": "2026-06-06T12:00:00Z"
  }
}
```

### PUT /platform/admin/settings

**Auth:** Public  
**Controller:** `PlatformSettingsController.java`  
**Handler:** `updateAdminSettings`  
**Success message:** `Platform settings updated successfully`

**Request body (`AdminPlatformSettingsRequest`)**

```json
{
  "codEnabled": true,
  "onlinePaymentEnabled": true,
  "razorpayMode": "TEST",
  "razorpayKeyId": 1,
  "razorpayKeySecret": "sample",
  "mrBreadoTakeawayEnabled": true,
  "takeawayBookingFeePercent": 100.0,
  "deliveryChargePerKm": 100.0,
  "minimumDeliveryCharge": 100.0,
  "maximumDeliveryCharge": 100.0,
  "supportEmail": "user@example.com",
  "supportPhone": "9876543210",
  "businessAddress": "Park Street, Kolkata, West Bengal",
  "businessLatitude": 22.5743533,
  "businessLongitude": 88.3628733
}
```

**Response body (`AdminPlatformSettingsResponse`)**

```json
{
  "success": true,
  "message": "Platform settings updated successfully",
  "data": {
    "id": 1,
    "codEnabled": true,
    "onlinePaymentEnabled": true,
    "razorpayMode": "TEST",
    "razorpayKeyId": 1,
    "razorpaySecretConfigured": true,
    "mrBreadoTakeawayEnabled": true,
    "takeawayBookingFeePercent": 100.0,
    "deliveryChargePerKm": 100.0,
    "minimumDeliveryCharge": 100.0,
    "maximumDeliveryCharge": 100.0,
    "supportEmail": "user@example.com",
    "supportPhone": "9876543210",
    "businessAddress": "Park Street, Kolkata, West Bengal",
    "businessLatitude": 22.5743533,
    "businessLongitude": 88.3628733,
    "updatedAt": "2026-06-06T12:00:00Z"
  }
}
```

### GET /platform/settings

**Auth:** Public  
**Controller:** `PlatformSettingsController.java`  
**Handler:** `getPublicSettings`  
**Success message:** `Platform settings fetched successfully`

**Request body:** none

**Response body (`PublicPlatformSettingsResponse`)**

```json
{
  "success": true,
  "message": "Platform settings fetched successfully",
  "data": {
    "codEnabled": true,
    "onlinePaymentEnabled": true,
    "razorpayConfigured": true,
    "razorpayKeyId": 1,
    "razorpayMode": "TEST",
    "message": "Sample text",
    "mrBreadoTakeawayEnabled": true,
    "takeawayBookingFeePercent": 100.0,
    "deliveryChargePerKm": 100.0,
    "minimumDeliveryCharge": 100.0,
    "maximumDeliveryCharge": 100.0,
    "supportEmail": "user@example.com",
    "supportPhone": "9876543210",
    "businessAddress": "Park Street, Kolkata, West Bengal",
    "businessLatitude": 22.5743533,
    "businessLongitude": 88.3628733
  }
}
```

### GET /admin/coupons/

**Auth:** Admin  
**Controller:** `AdminCouponController.java`  
**Handler:** `getCoupons`  
**Success message:** `Coupons fetched successfully`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Request body:** none

**Response body (`PageResponse<Coupon>`)**

```json
{
  "success": true,
  "message": "Coupons fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "code": true,
        "title": "sample-name",
        "description": "Sample text",
        "type": "DELIVERY",
        "value": 100.0,
        "minOrderAmount": 100.0,
        "maxDiscountAmount": 100.0,
        "usageLimit": 1,
        "usedCount": "sample",
        "perUserLimit": 1,
        "startsAt": "2026-06-06T12:00:00Z",
        "expiresAt": "2026-06-06T12:00:00Z",
        "enabled": true,
        "deleted": true,
        "createdAt": "2026-06-06T12:00:00Z",
        "updatedAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### POST /admin/coupons/

**Auth:** Admin  
**Controller:** `AdminCouponController.java`  
**Handler:** `createCoupon`  
**Success message:** `Coupon created successfully`

**Request body (`AdminCouponRequest`)**

```json
{
  "code": true,
  "title": "sample-name",
  "description": "Sample text",
  "type": "DELIVERY",
  "value": 100.0,
  "minOrderAmount": 100.0,
  "maxDiscountAmount": 100.0,
  "usageLimit": 1,
  "perUserLimit": 1,
  "startsAt": "2026-06-06T12:00:00Z",
  "expiresAt": "2026-06-06T12:00:00Z",
  "enabled": true
}
```

**Response body (`Coupon`)**

```json
{
  "success": true,
  "message": "Coupon created successfully",
  "data": {
    "id": 1,
    "code": true,
    "title": "sample-name",
    "description": "Sample text",
    "type": "DELIVERY",
    "value": 100.0,
    "minOrderAmount": 100.0,
    "maxDiscountAmount": 100.0,
    "usageLimit": 1,
    "usedCount": "sample",
    "perUserLimit": 1,
    "startsAt": "2026-06-06T12:00:00Z",
    "expiresAt": "2026-06-06T12:00:00Z",
    "enabled": true,
    "deleted": true,
    "createdAt": "2026-06-06T12:00:00Z",
    "updatedAt": "2026-06-06T12:00:00Z"
  }
}
```

### DELETE /admin/coupons/{couponId}

**Auth:** Admin  
**Controller:** `AdminCouponController.java`  
**Handler:** `deleteCoupon`  
**Success message:** `Coupon deleted successfully`

**Path variables**

| Name       | Type   | Example |
| ---------- | ------ | ------- |
| `couponId` | `Long` | `1`     |

**Request body:** none

**Response body (`Void`)**

```json
{
  "success": true,
  "message": "Coupon deleted successfully",
  "data": null
}
```

### PUT /admin/coupons/{couponId}

**Auth:** Admin  
**Controller:** `AdminCouponController.java`  
**Handler:** `updateCoupon`  
**Success message:** `Coupon updated successfully`

**Path variables**

| Name       | Type   | Example |
| ---------- | ------ | ------- |
| `couponId` | `Long` | `1`     |

**Request body (`AdminCouponRequest`)**

```json
{
  "code": true,
  "title": "sample-name",
  "description": "Sample text",
  "type": "DELIVERY",
  "value": 100.0,
  "minOrderAmount": 100.0,
  "maxDiscountAmount": 100.0,
  "usageLimit": 1,
  "perUserLimit": 1,
  "startsAt": "2026-06-06T12:00:00Z",
  "expiresAt": "2026-06-06T12:00:00Z",
  "enabled": true
}
```

**Response body (`Coupon`)**

```json
{
  "success": true,
  "message": "Coupon updated successfully",
  "data": {
    "id": 1,
    "code": true,
    "title": "sample-name",
    "description": "Sample text",
    "type": "DELIVERY",
    "value": 100.0,
    "minOrderAmount": 100.0,
    "maxDiscountAmount": 100.0,
    "usageLimit": 1,
    "usedCount": "sample",
    "perUserLimit": 1,
    "startsAt": "2026-06-06T12:00:00Z",
    "expiresAt": "2026-06-06T12:00:00Z",
    "enabled": true,
    "deleted": true,
    "createdAt": "2026-06-06T12:00:00Z",
    "updatedAt": "2026-06-06T12:00:00Z"
  }
}
```

### PATCH /admin/coupons/{couponId}/status

**Auth:** Admin  
**Controller:** `AdminCouponController.java`  
**Handler:** `updateCouponStatus`  
**Success message:** `Coupon status updated successfully`

**Path variables**

| Name       | Type   | Example |
| ---------- | ------ | ------- |
| `couponId` | `Long` | `1`     |

**Request body (`AdminCouponStatusRequest`)**

```json
{
  "enabled": true
}
```

**Response body (`Coupon`)**

```json
{
  "success": true,
  "message": "Coupon status updated successfully",
  "data": {
    "id": 1,
    "code": true,
    "title": "sample-name",
    "description": "Sample text",
    "type": "DELIVERY",
    "value": 100.0,
    "minOrderAmount": 100.0,
    "maxDiscountAmount": 100.0,
    "usageLimit": 1,
    "usedCount": "sample",
    "perUserLimit": 1,
    "startsAt": "2026-06-06T12:00:00Z",
    "expiresAt": "2026-06-06T12:00:00Z",
    "enabled": true,
    "deleted": true,
    "createdAt": "2026-06-06T12:00:00Z",
    "updatedAt": "2026-06-06T12:00:00Z"
  }
}
```

### POST /coupons/validate

**Auth:** Public  
**Controller:** `CouponController.java`  
**Handler:** `validateCoupon`  
**Success message:** `Coupon validation completed`

**Request body (`ValidateCouponRequest`)**

```json
{
  "code": true,
  "orderAmount": 100.0
}
```

**Response body (`CouponValidationResponse`)**

```json
{
  "success": true,
  "message": "Coupon validation completed",
  "data": {
    "applied": true,
    "valid": true,
    "couponCode": true,
    "coupon_code": true,
    "code": true,
    "offerTitle": "sample-name",
    "offer_title": "sample-name",
    "restaurantSlug": "sample-name",
    "restaurant_slug": "sample-name",
    "itemsTotal": 100.0,
    "items_total": 100.0,
    "discountAmount": 100.0,
    "discount_amount": 100.0,
    "discount": 10.0,
    "payableAfterDiscount": 100.0,
    "payable_after_discount": 100.0,
    "message": "Sample text"
  }
}
```

### GET /notifications/

**Auth:** User  
**Controller:** `NotificationController.java`  
**Handler:** `getNotifications`  
**Success message:** `Notifications fetched successfully`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Request body:** none

**Response body (`PageResponse<NotificationResponse>`)**

```json
{
  "success": true,
  "message": "Notifications fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "type": "DELIVERY",
        "title": "sample-name",
        "message": "Sample text",
        "targetType": "DELIVERY",
        "targetValue": 100.0,
        "isRead": true,
        "readAt": "2026-06-06T12:00:00Z",
        "createdAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### PATCH /notifications/read-all

**Auth:** User  
**Controller:** `NotificationController.java`  
**Handler:** `markAllAsRead`  
**Success message:** `All notifications marked as read`

**Request body:** none

**Response body (`Void`)**

```json
{
  "success": true,
  "message": "All notifications marked as read",
  "data": null
}
```

### DELETE /notifications/{notificationId}

**Auth:** User  
**Controller:** `NotificationController.java`  
**Handler:** `deleteNotification`  
**Success message:** `Notification deleted successfully`

**Path variables**

| Name             | Type   | Example |
| ---------------- | ------ | ------- |
| `notificationId` | `Long` | `1`     |

**Request body:** none

**Response body (`Void`)**

```json
{
  "success": true,
  "message": "Notification deleted successfully",
  "data": null
}
```

### PATCH /notifications/{notificationId}/read

**Auth:** User  
**Controller:** `NotificationController.java`  
**Handler:** `markAsRead`  
**Success message:** `Notification marked as read`

**Path variables**

| Name             | Type   | Example |
| ---------------- | ------ | ------- |
| `notificationId` | `Long` | `1`     |

**Request body:** none

**Response body (`NotificationResponse`)**

```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "id": 1,
    "type": "DELIVERY",
    "title": "sample-name",
    "message": "Sample text",
    "targetType": "DELIVERY",
    "targetValue": 100.0,
    "isRead": true,
    "readAt": "2026-06-06T12:00:00Z",
    "createdAt": "2026-06-06T12:00:00Z"
  }
}
```

### GET /wallet/

**Auth:** User  
**Controller:** `WalletController.java`  
**Handler:** `getWallet`  
**Success message:** `Wallet fetched successfully`

**Request body:** none

**Response body (`WalletResponse`)**

```json
{
  "success": true,
  "message": "Wallet fetched successfully",
  "data": {
    "walletBalance": 10.0
  }
}
```

### GET /wallet/transactions

**Auth:** User  
**Controller:** `WalletController.java`  
**Handler:** `getTransactions`  
**Success message:** `Wallet transactions fetched successfully`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Request body:** none

**Response body (`PageResponse<WalletTransactionResponse>`)**

```json
{
  "success": true,
  "message": "Wallet transactions fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "type": "DELIVERY",
        "amount": 100.0,
        "closingBalance": 10.0,
        "description": "Sample text",
        "orderId": 1,
        "createdAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### GET /admin/restaurant-reports

**Auth:** Admin  
**Controller:** `RestaurantReportController.java`  
**Handler:** `adminReports`  
**Success message:** `Admin restaurant reports fetched successfully`

**Query parameters**

| Name      | Type     | Example   |
| --------- | -------- | --------- |
| `page`    | `int`    | `1`       |
| `perPage` | `int`    | `1`       |
| `status`  | `String` | `PENDING` |

**Request body:** none

**Response body (`PageResponse<RestaurantReportResponse>`)**

```json
{
  "success": true,
  "message": "Admin restaurant reports fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "orderId": 1,
        "orderNumber": "sample",
        "restaurantId": 1,
        "restaurantName": "sample-name",
        "customerId": 1,
        "customerName": "sample-name",
        "customerMobile": "9876543210",
        "reason": "Item unavailable",
        "description": "Sample text",
        "imageUrl": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "status": "PENDING",
        "adminNote": "Sample text",
        "createdAt": "2026-06-06T12:00:00Z",
        "resolvedAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### PATCH /admin/restaurant-reports/{reportId}/status

**Auth:** Admin  
**Controller:** `RestaurantReportController.java`  
**Handler:** `updateStatus`  
**Success message:** `Restaurant report status updated successfully`

**Path variables**

| Name       | Type   | Example |
| ---------- | ------ | ------- |
| `reportId` | `Long` | `1`     |

**Request body (`AdminReportStatusRequest`)**

```json
{
  "status": "PENDING",
  "adminNote": "Sample text"
}
```

**Response body (`RestaurantReportResponse`)**

```json
{
  "success": true,
  "message": "Restaurant report status updated successfully",
  "data": {
    "id": 1,
    "orderId": 1,
    "orderNumber": "sample",
    "restaurantId": 1,
    "restaurantName": "sample-name",
    "customerId": 1,
    "customerName": "sample-name",
    "customerMobile": "9876543210",
    "reason": "Item unavailable",
    "description": "Sample text",
    "imageUrl": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "status": "PENDING",
    "adminNote": "Sample text",
    "createdAt": "2026-06-06T12:00:00Z",
    "resolvedAt": "2026-06-06T12:00:00Z"
  }
}
```

### GET /seller/restaurant-reports

**Auth:** Seller  
**Controller:** `RestaurantReportController.java`  
**Handler:** `sellerReports`  
**Success message:** `Seller restaurant reports fetched successfully`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Request body:** none

**Response body (`PageResponse<RestaurantReportResponse>`)**

```json
{
  "success": true,
  "message": "Seller restaurant reports fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "orderId": 1,
        "orderNumber": "sample",
        "restaurantId": 1,
        "restaurantName": "sample-name",
        "customerId": 1,
        "customerName": "sample-name",
        "customerMobile": "9876543210",
        "reason": "Item unavailable",
        "description": "Sample text",
        "imageUrl": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "status": "PENDING",
        "adminNote": "Sample text",
        "createdAt": "2026-06-06T12:00:00Z",
        "resolvedAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### POST /user/orders/{orderId}/restaurant-report

**Auth:** User  
**Controller:** `RestaurantReportController.java`  
**Handler:** `create`  
**Success message:** `Restaurant report submitted successfully`

**Path variables**

| Name      | Type   | Example |
| --------- | ------ | ------- |
| `orderId` | `Long` | `1`     |

**Request body (`RestaurantReportRequest`)**

```json
{
  "reason": "Item unavailable",
  "description": "Sample text",
  "imageUrl": "https://res.cloudinary.com/demo/image/upload/sample.png"
}
```

**Response body (`RestaurantReportResponse`)**

```json
{
  "success": true,
  "message": "Restaurant report submitted successfully",
  "data": {
    "id": 1,
    "orderId": 1,
    "orderNumber": "sample",
    "restaurantId": 1,
    "restaurantName": "sample-name",
    "customerId": 1,
    "customerName": "sample-name",
    "customerMobile": "9876543210",
    "reason": "Item unavailable",
    "description": "Sample text",
    "imageUrl": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "status": "PENDING",
    "adminNote": "Sample text",
    "createdAt": "2026-06-06T12:00:00Z",
    "resolvedAt": "2026-06-06T12:00:00Z"
  }
}
```

### GET /user/restaurant-reports

**Auth:** User  
**Controller:** `RestaurantReportController.java`  
**Handler:** `myReports`  
**Success message:** `Restaurant reports fetched successfully`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Request body:** none

**Response body (`PageResponse<RestaurantReportResponse>`)**

```json
{
  "success": true,
  "message": "Restaurant reports fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "orderId": 1,
        "orderNumber": "sample",
        "restaurantId": 1,
        "restaurantName": "sample-name",
        "customerId": 1,
        "customerName": "sample-name",
        "customerMobile": "9876543210",
        "reason": "Item unavailable",
        "description": "Sample text",
        "imageUrl": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "status": "PENDING",
        "adminNote": "Sample text",
        "createdAt": "2026-06-06T12:00:00Z",
        "resolvedAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### GET /delivery-zone/stores

**Auth:** Driver  
**Controller:** `RestaurantController.java`  
**Handler:** `getNearbyRestaurants`  
**Success message:** `Restaurants fetched successfully`

**Query parameters**

| Name        | Type     | Example      |
| ----------- | -------- | ------------ |
| `page`      | `int`    | `1`          |
| `perPage`   | `int`    | `1`          |
| `latitude`  | `Double` | `22.5743533` |
| `longitude` | `Double` | `88.3628733` |
| `category`  | `String` | `sample`     |
| `search`    | `String` | `sample`     |
| `sort`      | `String` | `sample`     |
| `ratingMin` | `Double` | `5`          |

**Request body:** none

**Response body (`PageResponse<RestaurantResponse>`)**

```json
{
  "success": true,
  "message": "Restaurants fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "sample-name",
        "slug": "sample-name",
        "description": "Sample text",
        "logo": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "banner": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "image": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "rating": 5,
        "totalReviews": 100.0,
        "deliveryTime": "2026-06-06T12:00:00Z",
        "distance": 10.0,
        "priceForTwo": 100.0,
        "isOpen": true,
        "status": "PENDING",
        "city": "Kolkata",
        "address": "Park Street, Kolkata, West Bengal",
        "latitude": 22.5743533,
        "longitude": 88.3628733,
        "cuisines": [],
        "productCount": "sample",
        "verificationStatus": "PENDING",
        "visibilityStatus": "PENDING"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### GET /restaurants

**Auth:** Public  
**Controller:** `RestaurantController.java`  
**Handler:** `getNearbyRestaurants`  
**Success message:** `Restaurants fetched successfully`

**Query parameters**

| Name        | Type     | Example      |
| ----------- | -------- | ------------ |
| `page`      | `int`    | `1`          |
| `perPage`   | `int`    | `1`          |
| `latitude`  | `Double` | `22.5743533` |
| `longitude` | `Double` | `88.3628733` |
| `category`  | `String` | `sample`     |
| `search`    | `String` | `sample`     |
| `sort`      | `String` | `sample`     |
| `ratingMin` | `Double` | `5`          |

**Request body:** none

**Response body (`PageResponse<RestaurantResponse>`)**

```json
{
  "success": true,
  "message": "Restaurants fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "sample-name",
        "slug": "sample-name",
        "description": "Sample text",
        "logo": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "banner": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "image": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "rating": 5,
        "totalReviews": 100.0,
        "deliveryTime": "2026-06-06T12:00:00Z",
        "distance": 10.0,
        "priceForTwo": 100.0,
        "isOpen": true,
        "status": "PENDING",
        "city": "Kolkata",
        "address": "Park Street, Kolkata, West Bengal",
        "latitude": 22.5743533,
        "longitude": 88.3628733,
        "cuisines": [],
        "productCount": "sample",
        "verificationStatus": "PENDING",
        "visibilityStatus": "PENDING"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### GET /restaurants/nearby

**Auth:** Public  
**Controller:** `RestaurantController.java`  
**Handler:** `getNearbyRestaurants`  
**Success message:** `Restaurants fetched successfully`

**Query parameters**

| Name        | Type     | Example      |
| ----------- | -------- | ------------ |
| `page`      | `int`    | `1`          |
| `perPage`   | `int`    | `1`          |
| `latitude`  | `Double` | `22.5743533` |
| `longitude` | `Double` | `88.3628733` |
| `category`  | `String` | `sample`     |
| `search`    | `String` | `sample`     |
| `sort`      | `String` | `sample`     |
| `ratingMin` | `Double` | `5`          |

**Request body:** none

**Response body (`PageResponse<RestaurantResponse>`)**

```json
{
  "success": true,
  "message": "Restaurants fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "sample-name",
        "slug": "sample-name",
        "description": "Sample text",
        "logo": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "banner": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "image": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "rating": 5,
        "totalReviews": 100.0,
        "deliveryTime": "2026-06-06T12:00:00Z",
        "distance": 10.0,
        "priceForTwo": 100.0,
        "isOpen": true,
        "status": "PENDING",
        "city": "Kolkata",
        "address": "Park Street, Kolkata, West Bengal",
        "latitude": 22.5743533,
        "longitude": 88.3628733,
        "cuisines": [],
        "productCount": "sample",
        "verificationStatus": "PENDING",
        "visibilityStatus": "PENDING"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### GET /restaurants/{slug}

**Auth:** Public  
**Controller:** `RestaurantController.java`  
**Handler:** `getRestaurantDetails`  
**Success message:** `Restaurant details fetched successfully`

**Query parameters**

| Name        | Type     | Example      |
| ----------- | -------- | ------------ |
| `latitude`  | `Double` | `22.5743533` |
| `longitude` | `Double` | `88.3628733` |

**Path variables**

| Name   | Type     | Example       |
| ------ | -------- | ------------- |
| `slug` | `String` | `sample-name` |

**Request body:** none

**Response body (`RestaurantDetailResponse`)**

```json
{
  "success": true,
  "message": "Restaurant details fetched successfully",
  "data": {
    "id": 1,
    "name": "sample-name",
    "slug": "sample-name",
    "description": "Sample text",
    "logo": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "banner": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "rating": 5,
    "totalReviews": 100.0,
    "address": "Park Street, Kolkata, West Bengal",
    "city": "Kolkata",
    "state": "West Bengal",
    "country": "India",
    "zipcode": true,
    "distance": 10.0,
    "deliveryTime": "2026-06-06T12:00:00Z",
    "priceForTwo": 100.0,
    "isOpen": true,
    "status": "PENDING",
    "cuisines": [],
    "offers": [],
    "menuCategories": [],
    "latitude": 22.5743533,
    "longitude": 88.3628733
  }
}
```

### GET /stores

**Auth:** Public  
**Controller:** `RestaurantController.java`  
**Handler:** `getNearbyRestaurants`  
**Success message:** `Restaurants fetched successfully`

**Query parameters**

| Name        | Type     | Example      |
| ----------- | -------- | ------------ |
| `page`      | `int`    | `1`          |
| `perPage`   | `int`    | `1`          |
| `latitude`  | `Double` | `22.5743533` |
| `longitude` | `Double` | `88.3628733` |
| `category`  | `String` | `sample`     |
| `search`    | `String` | `sample`     |
| `sort`      | `String` | `sample`     |
| `ratingMin` | `Double` | `5`          |

**Request body:** none

**Response body (`PageResponse<RestaurantResponse>`)**

```json
{
  "success": true,
  "message": "Restaurants fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "sample-name",
        "slug": "sample-name",
        "description": "Sample text",
        "logo": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "banner": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "image": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "rating": 5,
        "totalReviews": 100.0,
        "deliveryTime": "2026-06-06T12:00:00Z",
        "distance": 10.0,
        "priceForTwo": 100.0,
        "isOpen": true,
        "status": "PENDING",
        "city": "Kolkata",
        "address": "Park Street, Kolkata, West Bengal",
        "latitude": 22.5743533,
        "longitude": 88.3628733,
        "cuisines": [],
        "productCount": "sample",
        "verificationStatus": "PENDING",
        "visibilityStatus": "PENDING"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### POST /stores/map

**Auth:** Public  
**Controller:** `RestaurantController.java`  
**Handler:** `getStoresMap`  
**Success message:** `Stores map fetched successfully`

**Request body (`StoreMapRequest`)**

```json
{
  "latitude": 22.5743533,
  "longitude": 88.3628733,
  "radius": 10.0
}
```

**Response body (`List<StoreMapResponse>`)**

```json
{
  "success": true,
  "message": "Stores map fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "sample-name",
      "slug": "sample-name",
      "latitude": 22.5743533,
      "longitude": 88.3628733,
      "logo": "https://res.cloudinary.com/demo/image/upload/sample.png",
      "isOpen": true,
      "status": "PENDING"
    }
  ]
}
```

### GET /stores/{slug}

**Auth:** Public  
**Controller:** `RestaurantController.java`  
**Handler:** `getRestaurantDetails`  
**Success message:** `Restaurant details fetched successfully`

**Query parameters**

| Name        | Type     | Example      |
| ----------- | -------- | ------------ |
| `latitude`  | `Double` | `22.5743533` |
| `longitude` | `Double` | `88.3628733` |

**Path variables**

| Name   | Type     | Example       |
| ------ | -------- | ------------- |
| `slug` | `String` | `sample-name` |

**Request body:** none

**Response body (`RestaurantDetailResponse`)**

```json
{
  "success": true,
  "message": "Restaurant details fetched successfully",
  "data": {
    "id": 1,
    "name": "sample-name",
    "slug": "sample-name",
    "description": "Sample text",
    "logo": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "banner": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "rating": 5,
    "totalReviews": 100.0,
    "address": "Park Street, Kolkata, West Bengal",
    "city": "Kolkata",
    "state": "West Bengal",
    "country": "India",
    "zipcode": true,
    "distance": 10.0,
    "deliveryTime": "2026-06-06T12:00:00Z",
    "priceForTwo": 100.0,
    "isOpen": true,
    "status": "PENDING",
    "cuisines": [],
    "offers": [],
    "menuCategories": [],
    "latitude": 22.5743533,
    "longitude": 88.3628733
  }
}
```

### GET /admin/reviews

**Auth:** Admin  
**Controller:** `ReviewListingController.java`  
**Handler:** `adminReviews`  
**Success message:** `Admin reviews fetched successfully`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Request body:** none

**Response body (`PageResponse<OrderReviewResponse>`)**

```json
{
  "success": true,
  "message": "Admin reviews fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "orderId": 1,
        "orderNumber": "sample",
        "restaurantRating": 5,
        "driverRating": 5,
        "restaurantComment": "Sample text",
        "driverComment": "Sample text",
        "createdAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### POST /reviews/order/{orderId}

**Auth:** User  
**Controller:** `OrderReviewController.java`  
**Handler:** `submitReview`  
**Success message:** `Review submitted successfully`

**Path variables**

| Name      | Type   | Example |
| --------- | ------ | ------- |
| `orderId` | `Long` | `1`     |

**Request body (`OrderReviewRequest`)**

```json
{
  "restaurantRating": 5,
  "driverRating": 5,
  "restaurantComment": "Sample text",
  "driverComment": "Sample text"
}
```

**Response body (`OrderReviewResponse`)**

```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "id": 1,
    "orderId": 1,
    "orderNumber": "sample",
    "restaurantRating": 5,
    "driverRating": 5,
    "restaurantComment": "Sample text",
    "driverComment": "Sample text",
    "createdAt": "2026-06-06T12:00:00Z"
  }
}
```

### GET /reviews/order/{orderId}/eligibility

**Auth:** User  
**Controller:** `OrderReviewController.java`  
**Handler:** `getEligibility`  
**Success message:** `Review eligibility fetched successfully`

**Path variables**

| Name      | Type   | Example |
| --------- | ------ | ------- |
| `orderId` | `Long` | `1`     |

**Request body:** none

**Response body (`OrderReviewEligibilityResponse`)**

```json
{
  "success": true,
  "message": "Review eligibility fetched successfully",
  "data": {
    "orderId": 1,
    "orderNumber": "sample",
    "canReview": true,
    "alreadyReviewed": true,
    "reason": "Item unavailable"
  }
}
```

### GET /seller/reviews

**Auth:** Seller  
**Controller:** `ReviewListingController.java`  
**Handler:** `sellerReviews`  
**Success message:** `Seller reviews fetched successfully`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Request body:** none

**Response body (`PageResponse<OrderReviewResponse>`)**

```json
{
  "success": true,
  "message": "Seller reviews fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "orderId": 1,
        "orderNumber": "sample",
        "restaurantRating": 5,
        "driverRating": 5,
        "restaurantComment": "Sample text",
        "driverComment": "Sample text",
        "createdAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### GET /admin/seller-payout-accounts

**Auth:** Admin  
**Controller:** `SellerPayoutAccountController.java`  
**Handler:** `adminList`  
**Success message:** `Seller payout accounts fetched successfully`

**Query parameters**

| Name       | Type      | Example |
| ---------- | --------- | ------- |
| `page`     | `int`     | `1`     |
| `perPage`  | `int`     | `1`     |
| `verified` | `Boolean` | `True`  |

**Request body:** none

**Response body (`PageResponse<SellerPayoutAccountResponse>`)**

```json
{
  "success": true,
  "message": "Seller payout accounts fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "sellerId": 1,
        "sellerName": "sample-name",
        "sellerEmail": "user@example.com",
        "restaurantId": 1,
        "restaurantName": "sample-name",
        "upiId": 1,
        "accountHolderName": "sample-name",
        "accountNumberLast4": "sample",
        "ifscCode": true,
        "bankName": "sample-name",
        "bankDetailsAdded": true,
        "upiAdded": true,
        "verified": true,
        "settlementReady": true,
        "forceSetupRequired": true,
        "adminNote": "Sample text",
        "verifiedAt": "2026-06-06T12:00:00Z",
        "updatedAt": "2026-06-06T12:00:00Z"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### PATCH /admin/seller-payout-accounts/{accountId}/verify

**Auth:** Admin  
**Controller:** `SellerPayoutAccountController.java`  
**Handler:** `verify`  
**Success message:** `Seller payout account verification updated successfully`

**Path variables**

| Name        | Type   | Example |
| ----------- | ------ | ------- |
| `accountId` | `Long` | `1`     |

**Request body (`AdminSellerPayoutVerifyRequest`)**

```json
{
  "verified": true,
  "adminNote": "Sample text"
}
```

**Response body (`SellerPayoutAccountResponse`)**

```json
{
  "success": true,
  "message": "Seller payout account verification updated successfully",
  "data": {
    "id": 1,
    "sellerId": 1,
    "sellerName": "sample-name",
    "sellerEmail": "user@example.com",
    "restaurantId": 1,
    "restaurantName": "sample-name",
    "upiId": 1,
    "accountHolderName": "sample-name",
    "accountNumberLast4": "sample",
    "ifscCode": true,
    "bankName": "sample-name",
    "bankDetailsAdded": true,
    "upiAdded": true,
    "verified": true,
    "settlementReady": true,
    "forceSetupRequired": true,
    "adminNote": "Sample text",
    "verifiedAt": "2026-06-06T12:00:00Z",
    "updatedAt": "2026-06-06T12:00:00Z"
  }
}
```

### GET /seller/orders/

**Auth:** Seller  
**Controller:** `SellerOrderController.java`  
**Handler:** `getOrders`  
**Success message:** `Seller orders fetched successfully`

**Query parameters**

| Name      | Type     | Example   |
| --------- | -------- | --------- |
| `page`    | `int`    | `1`       |
| `perPage` | `int`    | `1`       |
| `status`  | `String` | `PENDING` |

**Request body:** none

**Response body (`PageResponse<SellerOrderResponse>`)**

```json
{
  "success": true,
  "message": "Seller orders fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "orderNumber": "sample",
        "slug": "sample-name",
        "customerName": "sample-name",
        "customerMobile": "9876543210",
        "customerEmail": "user@example.com",
        "status": "PENDING",
        "statusLabel": "PENDING",
        "paymentStatus": "PENDING",
        "paymentType": "DELIVERY",
        "subtotal": 100.0,
        "deliveryCharge": 100.0,
        "discount": 10.0,
        "tax": 10.0,
        "grandTotal": 100.0,
        "deliveryAddress": "Park Street, Kolkata, West Bengal",
        "deliveryInstruction": "Sample text",
        "sellerResponseDeadline": "2026-06-06T12:00:00Z",
        "sellerRespondedAt": "2026-06-06T12:00:00Z",
        "sellerAccepted": true,
        "sellerResponseRemainingSeconds": 1,
        "cancellationReason": "Item unavailable",
        "cancelledBy": "sample",
        "cancelledAt": "2026-06-06T12:00:00Z",
        "createdAt": "2026-06-06T12:00:00Z",
        "updatedAt": "2026-06-06T12:00:00Z",
        "orderType": "DELIVERY",
        "payableNow": 100.0,
        "payableLater": 100.0,
        "takeawayBookingFee": 100.0,
        "pickupSlot": "sample",
        "items": []
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### GET /seller/orders/{orderId}

**Auth:** Seller  
**Controller:** `SellerOrderController.java`  
**Handler:** `getOrderDetails`  
**Success message:** `Seller order details fetched successfully`

**Path variables**

| Name      | Type   | Example |
| --------- | ------ | ------- |
| `orderId` | `Long` | `1`     |

**Request body:** none

**Response body (`SellerOrderDetailResponse`)**

```json
{
  "success": true,
  "message": "Seller order details fetched successfully",
  "data": {
    "id": 1,
    "orderNumber": "sample",
    "slug": "sample-name",
    "customerName": "sample-name",
    "customerMobile": "9876543210",
    "customerEmail": "user@example.com",
    "status": "PENDING",
    "statusLabel": "PENDING",
    "paymentStatus": "PENDING",
    "paymentType": "DELIVERY",
    "subtotal": 100.0,
    "restaurantCharges": 100.0,
    "deliveryCharge": 100.0,
    "platformFee": 100.0,
    "discount": 10.0,
    "tax": 10.0,
    "walletUsed": 10.0,
    "grandTotal": 100.0,
    "deliveryAddress": "Park Street, Kolkata, West Bengal",
    "deliveryInstruction": "Sample text",
    "cancellationReason": "Item unavailable",
    "estimatedDeliveryMinutes": 1,
    "createdAt": "2026-06-06T12:00:00Z",
    "updatedAt": "2026-06-06T12:00:00Z",
    "cancelledAt": "2026-06-06T12:00:00Z",
    "deliveredAt": "2026-06-06T12:00:00Z",
    "items": []
  }
}
```

### POST /seller/orders/{orderId}/accept

**Auth:** Seller  
**Controller:** `SellerOrderController.java`  
**Handler:** `acceptOrder`  
**Success message:** `Order accepted successfully`

**Path variables**

| Name      | Type   | Example |
| --------- | ------ | ------- |
| `orderId` | `Long` | `1`     |

**Request body:** none

**Response body (`SellerOrderDetailResponse`)**

```json
{
  "success": true,
  "message": "Order accepted successfully",
  "data": {
    "id": 1,
    "orderNumber": "sample",
    "slug": "sample-name",
    "customerName": "sample-name",
    "customerMobile": "9876543210",
    "customerEmail": "user@example.com",
    "status": "PENDING",
    "statusLabel": "PENDING",
    "paymentStatus": "PENDING",
    "paymentType": "DELIVERY",
    "subtotal": 100.0,
    "restaurantCharges": 100.0,
    "deliveryCharge": 100.0,
    "platformFee": 100.0,
    "discount": 10.0,
    "tax": 10.0,
    "walletUsed": 10.0,
    "grandTotal": 100.0,
    "deliveryAddress": "Park Street, Kolkata, West Bengal",
    "deliveryInstruction": "Sample text",
    "cancellationReason": "Item unavailable",
    "estimatedDeliveryMinutes": 1,
    "createdAt": "2026-06-06T12:00:00Z",
    "updatedAt": "2026-06-06T12:00:00Z",
    "cancelledAt": "2026-06-06T12:00:00Z",
    "deliveredAt": "2026-06-06T12:00:00Z",
    "items": []
  }
}
```

### POST /seller/orders/{orderId}/preparing

**Auth:** Seller  
**Controller:** `SellerOrderController.java`  
**Handler:** `markPreparing`  
**Success message:** `Order marked as preparing`

**Path variables**

| Name      | Type   | Example |
| --------- | ------ | ------- |
| `orderId` | `Long` | `1`     |

**Request body:** none

**Response body (`SellerOrderDetailResponse`)**

```json
{
  "success": true,
  "message": "Order marked as preparing",
  "data": {
    "id": 1,
    "orderNumber": "sample",
    "slug": "sample-name",
    "customerName": "sample-name",
    "customerMobile": "9876543210",
    "customerEmail": "user@example.com",
    "status": "PENDING",
    "statusLabel": "PENDING",
    "paymentStatus": "PENDING",
    "paymentType": "DELIVERY",
    "subtotal": 100.0,
    "restaurantCharges": 100.0,
    "deliveryCharge": 100.0,
    "platformFee": 100.0,
    "discount": 10.0,
    "tax": 10.0,
    "walletUsed": 10.0,
    "grandTotal": 100.0,
    "deliveryAddress": "Park Street, Kolkata, West Bengal",
    "deliveryInstruction": "Sample text",
    "cancellationReason": "Item unavailable",
    "estimatedDeliveryMinutes": 1,
    "createdAt": "2026-06-06T12:00:00Z",
    "updatedAt": "2026-06-06T12:00:00Z",
    "cancelledAt": "2026-06-06T12:00:00Z",
    "deliveredAt": "2026-06-06T12:00:00Z",
    "items": []
  }
}
```

### POST /seller/orders/{orderId}/ready

**Auth:** Seller  
**Controller:** `SellerOrderController.java`  
**Handler:** `markReady`  
**Success message:** `Order marked as ready for pickup`

**Path variables**

| Name      | Type   | Example |
| --------- | ------ | ------- |
| `orderId` | `Long` | `1`     |

**Request body:** none

**Response body (`SellerOrderDetailResponse`)**

```json
{
  "success": true,
  "message": "Order marked as ready for pickup",
  "data": {
    "id": 1,
    "orderNumber": "sample",
    "slug": "sample-name",
    "customerName": "sample-name",
    "customerMobile": "9876543210",
    "customerEmail": "user@example.com",
    "status": "PENDING",
    "statusLabel": "PENDING",
    "paymentStatus": "PENDING",
    "paymentType": "DELIVERY",
    "subtotal": 100.0,
    "restaurantCharges": 100.0,
    "deliveryCharge": 100.0,
    "platformFee": 100.0,
    "discount": 10.0,
    "tax": 10.0,
    "walletUsed": 10.0,
    "grandTotal": 100.0,
    "deliveryAddress": "Park Street, Kolkata, West Bengal",
    "deliveryInstruction": "Sample text",
    "cancellationReason": "Item unavailable",
    "estimatedDeliveryMinutes": 1,
    "createdAt": "2026-06-06T12:00:00Z",
    "updatedAt": "2026-06-06T12:00:00Z",
    "cancelledAt": "2026-06-06T12:00:00Z",
    "deliveredAt": "2026-06-06T12:00:00Z",
    "items": []
  }
}
```

### POST /seller/orders/{orderId}/reject

**Auth:** Seller  
**Controller:** `SellerOrderController.java`  
**Handler:** `rejectOrder`  
**Success message:** `Order rejected successfully`

**Path variables**

| Name      | Type   | Example |
| --------- | ------ | ------- |
| `orderId` | `Long` | `1`     |

**Request body (`SellerOrderRejectRequest`)**

```json
{
  "reason": "Item unavailable"
}
```

**Response body (`SellerOrderDetailResponse`)**

```json
{
  "success": true,
  "message": "Order rejected successfully",
  "data": {
    "id": 1,
    "orderNumber": "sample",
    "slug": "sample-name",
    "customerName": "sample-name",
    "customerMobile": "9876543210",
    "customerEmail": "user@example.com",
    "status": "PENDING",
    "statusLabel": "PENDING",
    "paymentStatus": "PENDING",
    "paymentType": "DELIVERY",
    "subtotal": 100.0,
    "restaurantCharges": 100.0,
    "deliveryCharge": 100.0,
    "platformFee": 100.0,
    "discount": 10.0,
    "tax": 10.0,
    "walletUsed": 10.0,
    "grandTotal": 100.0,
    "deliveryAddress": "Park Street, Kolkata, West Bengal",
    "deliveryInstruction": "Sample text",
    "cancellationReason": "Item unavailable",
    "estimatedDeliveryMinutes": 1,
    "createdAt": "2026-06-06T12:00:00Z",
    "updatedAt": "2026-06-06T12:00:00Z",
    "cancelledAt": "2026-06-06T12:00:00Z",
    "deliveredAt": "2026-06-06T12:00:00Z",
    "items": []
  }
}
```

### GET /seller/payout-account

**Auth:** Seller  
**Controller:** `SellerPayoutAccountController.java`  
**Handler:** `myAccount`  
**Success message:** `Seller payout account fetched successfully`

**Request body:** none

**Response body (`SellerPayoutAccountResponse`)**

```json
{
  "success": true,
  "message": "Seller payout account fetched successfully",
  "data": {
    "id": 1,
    "sellerId": 1,
    "sellerName": "sample-name",
    "sellerEmail": "user@example.com",
    "restaurantId": 1,
    "restaurantName": "sample-name",
    "upiId": 1,
    "accountHolderName": "sample-name",
    "accountNumberLast4": "sample",
    "ifscCode": true,
    "bankName": "sample-name",
    "bankDetailsAdded": true,
    "upiAdded": true,
    "verified": true,
    "settlementReady": true,
    "forceSetupRequired": true,
    "adminNote": "Sample text",
    "verifiedAt": "2026-06-06T12:00:00Z",
    "updatedAt": "2026-06-06T12:00:00Z"
  }
}
```

### PUT /seller/payout-account

**Auth:** Seller  
**Controller:** `SellerPayoutAccountController.java`  
**Handler:** `upsert`  
**Success message:** `Seller payout account saved successfully`

**Request body (`SellerPayoutAccountRequest`)**

```json
{
  "upiId": 1,
  "accountHolderName": "sample-name",
  "accountNumber": "sample",
  "ifscCode": true,
  "bankName": "sample-name"
}
```

**Response body (`SellerPayoutAccountResponse`)**

```json
{
  "success": true,
  "message": "Seller payout account saved successfully",
  "data": {
    "id": 1,
    "sellerId": 1,
    "sellerName": "sample-name",
    "sellerEmail": "user@example.com",
    "restaurantId": 1,
    "restaurantName": "sample-name",
    "upiId": 1,
    "accountHolderName": "sample-name",
    "accountNumberLast4": "sample",
    "ifscCode": true,
    "bankName": "sample-name",
    "bankDetailsAdded": true,
    "upiAdded": true,
    "verified": true,
    "settlementReady": true,
    "forceSetupRequired": true,
    "adminNote": "Sample text",
    "verifiedAt": "2026-06-06T12:00:00Z",
    "updatedAt": "2026-06-06T12:00:00Z"
  }
}
```

### GET /seller/products/

**Auth:** Seller  
**Controller:** `SellerProductController.java`  
**Handler:** `getProducts`  
**Success message:** `Seller products fetched successfully`

**Query parameters**

| Name      | Type  | Example |
| --------- | ----- | ------- |
| `page`    | `int` | `1`     |
| `perPage` | `int` | `1`     |

**Request body:** none

**Response body (`PageResponse<SellerProductResponse>`)**

```json
{
  "success": true,
  "message": "Seller products fetched successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "title": "sample-name",
        "slug": "sample-name",
        "subtitle": "sample-name",
        "description": "Sample text",
        "image": "https://res.cloudinary.com/demo/image/upload/sample.png",
        "price": 100.0,
        "discountPrice": 100.0,
        "currency": "sample",
        "isVeg": true,
        "isBestseller": true,
        "isAvailable": true,
        "isFeatured": true,
        "rating": 5,
        "totalReviews": 100.0,
        "preparationTime": "2026-06-06T12:00:00Z",
        "stockQuantity": 1,
        "stockTrackingEnabled": 1,
        "foodCategory": "sample",
        "menuCategory": "sample"
      }
    ],
    "page": 1,
    "per_page": 20,
    "total": 1,
    "total_pages": 1,
    "last": true
  }
}
```

### POST /seller/products/

**Auth:** Seller  
**Controller:** `SellerProductController.java`  
**Handler:** `createProduct`  
**Success message:** `Product created successfully`

**Request body:** `multipart/form-data` (`SellerProductRequest`)

| Field                      | Type         | Example                |
| -------------------------- | ------------ | ---------------------- |
| `title`                    | `String`     | `sample-name`          |
| `name`                     | `String`     | `sample-name`          |
| `subtitle`                 | `String`     | `sample-name`          |
| `description`              | `String`     | `Sample text`          |
| `foodCategoryId`           | `Long`       | `1`                    |
| `food_category_id`         | `Long`       | `1`                    |
| `menuCategoryId`           | `Long`       | `1`                    |
| `menu_category_id`         | `Long`       | `1`                    |
| `category`                 | `String`     | `sample`               |
| `categoryName`             | `String`     | `sample-name`          |
| `category_name`            | `String`     | `sample-name`          |
| `foodType`                 | `String`     | `DELIVERY`             |
| `food_type`                | `String`     | `DELIVERY`             |
| `price`                    | `BigDecimal` | `100.0`                |
| `discountPrice`            | `BigDecimal` | `100.0`                |
| `discount_price`           | `BigDecimal` | `100.0`                |
| `currency`                 | `String`     | `sample`               |
| `isVeg`                    | `Boolean`    | `True`                 |
| `is_veg`                   | `Boolean`    | `True`                 |
| `veg`                      | `Boolean`    | `True`                 |
| `isAvailable`              | `Boolean`    | `True`                 |
| `is_available`             | `Boolean`    | `True`                 |
| `available`                | `Boolean`    | `True`                 |
| `isBestseller`             | `Boolean`    | `True`                 |
| `is_bestseller`            | `Boolean`    | `True`                 |
| `bestseller`               | `Boolean`    | `True`                 |
| `isFeatured`               | `Boolean`    | `True`                 |
| `is_featured`              | `Boolean`    | `True`                 |
| `featured`                 | `Boolean`    | `True`                 |
| `stockTrackingEnabled`     | `Boolean`    | `1`                    |
| `stock_tracking_enabled`   | `Boolean`    | `1`                    |
| `stockQuantity`            | `Integer`    | `1`                    |
| `stock_quantity`           | `Integer`    | `1`                    |
| `preparationTime`          | `Integer`    | `2026-06-06T12:00:00Z` |
| `preparation_time`         | `Integer`    | `2026-06-06T12:00:00Z` |
| `preparationTimeMinutes`   | `Integer`    | `1`                    |
| `preparation_time_minutes` | `Integer`    | `1`                    |
| `spiceLevel`               | `String`     | `sample`               |
| `spice_level`              | `String`     | `sample`               |
| `availabilityWindow`       | `String`     | `sample`               |
| `availability_window`      | `String`     | `sample`               |
| `servingSize`              | `String`     | `sample`               |
| `serving_size`             | `String`     | `sample`               |
| `calories`                 | `Integer`    | `1`                    |
| `allergens`                | `String`     | `sample`               |
| `tags`                     | `String`     | `sample`               |
| `packagingCharge`          | `BigDecimal` | `100.0`                |
| `packaging_charge`         | `BigDecimal` | `100.0`                |
| `taxIncluded`              | `Boolean`    | `True`                 |
| `tax_included`             | `Boolean`    | `True`                 |

**Response body (`SellerProductResponse`)**

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 1,
    "title": "sample-name",
    "slug": "sample-name",
    "subtitle": "sample-name",
    "description": "Sample text",
    "image": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "price": 100.0,
    "discountPrice": 100.0,
    "currency": "sample",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "isFeatured": true,
    "rating": 5,
    "totalReviews": 100.0,
    "preparationTime": "2026-06-06T12:00:00Z",
    "stockQuantity": 1,
    "stockTrackingEnabled": 1,
    "foodCategory": "sample",
    "menuCategory": "sample"
  }
}
```

### PUT /seller/products/{productId}

**Auth:** Seller  
**Controller:** `SellerProductController.java`  
**Handler:** `updateProduct`  
**Success message:** `Product updated successfully`

**Path variables**

| Name        | Type   | Example |
| ----------- | ------ | ------- |
| `productId` | `Long` | `1`     |

**Request body:** `multipart/form-data` (`SellerProductRequest`)

| Field                      | Type         | Example                |
| -------------------------- | ------------ | ---------------------- |
| `title`                    | `String`     | `sample-name`          |
| `name`                     | `String`     | `sample-name`          |
| `subtitle`                 | `String`     | `sample-name`          |
| `description`              | `String`     | `Sample text`          |
| `foodCategoryId`           | `Long`       | `1`                    |
| `food_category_id`         | `Long`       | `1`                    |
| `menuCategoryId`           | `Long`       | `1`                    |
| `menu_category_id`         | `Long`       | `1`                    |
| `category`                 | `String`     | `sample`               |
| `categoryName`             | `String`     | `sample-name`          |
| `category_name`            | `String`     | `sample-name`          |
| `foodType`                 | `String`     | `DELIVERY`             |
| `food_type`                | `String`     | `DELIVERY`             |
| `price`                    | `BigDecimal` | `100.0`                |
| `discountPrice`            | `BigDecimal` | `100.0`                |
| `discount_price`           | `BigDecimal` | `100.0`                |
| `currency`                 | `String`     | `sample`               |
| `isVeg`                    | `Boolean`    | `True`                 |
| `is_veg`                   | `Boolean`    | `True`                 |
| `veg`                      | `Boolean`    | `True`                 |
| `isAvailable`              | `Boolean`    | `True`                 |
| `is_available`             | `Boolean`    | `True`                 |
| `available`                | `Boolean`    | `True`                 |
| `isBestseller`             | `Boolean`    | `True`                 |
| `is_bestseller`            | `Boolean`    | `True`                 |
| `bestseller`               | `Boolean`    | `True`                 |
| `isFeatured`               | `Boolean`    | `True`                 |
| `is_featured`              | `Boolean`    | `True`                 |
| `featured`                 | `Boolean`    | `True`                 |
| `stockTrackingEnabled`     | `Boolean`    | `1`                    |
| `stock_tracking_enabled`   | `Boolean`    | `1`                    |
| `stockQuantity`            | `Integer`    | `1`                    |
| `stock_quantity`           | `Integer`    | `1`                    |
| `preparationTime`          | `Integer`    | `2026-06-06T12:00:00Z` |
| `preparation_time`         | `Integer`    | `2026-06-06T12:00:00Z` |
| `preparationTimeMinutes`   | `Integer`    | `1`                    |
| `preparation_time_minutes` | `Integer`    | `1`                    |
| `spiceLevel`               | `String`     | `sample`               |
| `spice_level`              | `String`     | `sample`               |
| `availabilityWindow`       | `String`     | `sample`               |
| `availability_window`      | `String`     | `sample`               |
| `servingSize`              | `String`     | `sample`               |
| `serving_size`             | `String`     | `sample`               |
| `calories`                 | `Integer`    | `1`                    |
| `allergens`                | `String`     | `sample`               |
| `tags`                     | `String`     | `sample`               |
| `packagingCharge`          | `BigDecimal` | `100.0`                |
| `packaging_charge`         | `BigDecimal` | `100.0`                |
| `taxIncluded`              | `Boolean`    | `True`                 |
| `tax_included`             | `Boolean`    | `True`                 |

**Response body (`SellerProductResponse`)**

```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": 1,
    "title": "sample-name",
    "slug": "sample-name",
    "subtitle": "sample-name",
    "description": "Sample text",
    "image": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "price": 100.0,
    "discountPrice": 100.0,
    "currency": "sample",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "isFeatured": true,
    "rating": 5,
    "totalReviews": 100.0,
    "preparationTime": "2026-06-06T12:00:00Z",
    "stockQuantity": 1,
    "stockTrackingEnabled": 1,
    "foodCategory": "sample",
    "menuCategory": "sample"
  }
}
```

### PATCH /seller/products/{productId}/availability

**Auth:** Seller  
**Controller:** `SellerProductController.java`  
**Handler:** `updateAvailability`  
**Success message:** `Product availability updated successfully`

**Path variables**

| Name        | Type   | Example |
| ----------- | ------ | ------- |
| `productId` | `Long` | `1`     |

**Request body (`SellerProductAvailabilityRequest`)**

```json
{
  "isAvailable": true
}
```

**Response body (`SellerProductResponse`)**

```json
{
  "success": true,
  "message": "Product availability updated successfully",
  "data": {
    "id": 1,
    "title": "sample-name",
    "slug": "sample-name",
    "subtitle": "sample-name",
    "description": "Sample text",
    "image": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "price": 100.0,
    "discountPrice": 100.0,
    "currency": "sample",
    "isVeg": true,
    "isBestseller": true,
    "isAvailable": true,
    "isFeatured": true,
    "rating": 5,
    "totalReviews": 100.0,
    "preparationTime": "2026-06-06T12:00:00Z",
    "stockQuantity": 1,
    "stockTrackingEnabled": 1,
    "foodCategory": "sample",
    "menuCategory": "sample"
  }
}
```

### GET /seller/restaurant/

**Auth:** Seller  
**Controller:** `SellerRestaurantController.java`  
**Handler:** `getRestaurant`  
**Success message:** `Seller restaurant fetched successfully`

**Request body:** none

**Response body (`SellerRestaurantResponse`)**

```json
{
  "success": true,
  "message": "Seller restaurant fetched successfully",
  "data": {
    "id": 1,
    "name": "sample-name",
    "slug": "sample-name",
    "description": "Sample text",
    "contactNumber": "9876543210",
    "contactEmail": "user@example.com",
    "logo": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "banner": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "address": "Park Street, Kolkata, West Bengal",
    "city": "Kolkata",
    "state": "West Bengal",
    "country": "India",
    "zipcode": true,
    "latitude": 22.5743533,
    "longitude": 88.3628733,
    "rating": 5,
    "totalReviews": 100.0,
    "productCount": "sample",
    "priceForTwo": 100.0,
    "orderPreparationTime": "2026-06-06T12:00:00Z",
    "minDeliveryTime": "2026-06-06T12:00:00Z",
    "maxDeliveryTime": "2026-06-06T12:00:00Z",
    "cuisines": "sample",
    "status": "PENDING",
    "open": true,
    "verificationStatus": "PENDING",
    "visibilityStatus": "PENDING",
    "featured": true,
    "promoted": true,
    "createdAt": "2026-06-06T12:00:00Z",
    "updatedAt": "2026-06-06T12:00:00Z"
  }
}
```

### PUT /seller/restaurant/

**Auth:** Seller  
**Controller:** `SellerRestaurantController.java`  
**Handler:** `updateRestaurantJson`  
**Success message:** `Restaurant updated successfully`

**Request body:** `multipart/form-data` (`SellerRestaurantRequest`)

| Field                  | Type            | Example                             |
| ---------------------- | --------------- | ----------------------------------- |
| `name`                 | `String`        | `sample-name`                       |
| `description`          | `String`        | `Sample text`                       |
| `contactNumber`        | `String`        | `9876543210`                        |
| `contactEmail`         | `String`        | `user@example.com`                  |
| `address`              | `String`        | `Park Street, Kolkata, West Bengal` |
| `city`                 | `String`        | `Kolkata`                           |
| `state`                | `String`        | `West Bengal`                       |
| `country`              | `String`        | `India`                             |
| `zipcode`              | `String`        | `True`                              |
| `latitude`             | `BigDecimal`    | `22.5743533`                        |
| `longitude`            | `BigDecimal`    | `88.3628733`                        |
| `priceForTwo`          | `Integer`       | `100.0`                             |
| `orderPreparationTime` | `Integer`       | `2026-06-06T12:00:00Z`              |
| `minDeliveryTime`      | `Integer`       | `2026-06-06T12:00:00Z`              |
| `maxDeliveryTime`      | `Integer`       | `2026-06-06T12:00:00Z`              |
| `cuisines`             | `String`        | `sample`                            |
| `open`                 | `Boolean`       | `True`                              |
| `logo`                 | `MultipartFile` | `<file>`                            |
| `banner`               | `MultipartFile` | `<file>`                            |

**Response body (`SellerRestaurantResponse`)**

```json
{
  "success": true,
  "message": "Restaurant updated successfully",
  "data": {
    "id": 1,
    "name": "sample-name",
    "slug": "sample-name",
    "description": "Sample text",
    "contactNumber": "9876543210",
    "contactEmail": "user@example.com",
    "logo": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "banner": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "address": "Park Street, Kolkata, West Bengal",
    "city": "Kolkata",
    "state": "West Bengal",
    "country": "India",
    "zipcode": true,
    "latitude": 22.5743533,
    "longitude": 88.3628733,
    "rating": 5,
    "totalReviews": 100.0,
    "productCount": "sample",
    "priceForTwo": 100.0,
    "orderPreparationTime": "2026-06-06T12:00:00Z",
    "minDeliveryTime": "2026-06-06T12:00:00Z",
    "maxDeliveryTime": "2026-06-06T12:00:00Z",
    "cuisines": "sample",
    "status": "PENDING",
    "open": true,
    "verificationStatus": "PENDING",
    "visibilityStatus": "PENDING",
    "featured": true,
    "promoted": true,
    "createdAt": "2026-06-06T12:00:00Z",
    "updatedAt": "2026-06-06T12:00:00Z"
  }
}
```

### PUT /seller/restaurant/

**Auth:** Seller  
**Controller:** `SellerRestaurantController.java`  
**Handler:** `updateRestaurantMultipart`  
**Success message:** `Restaurant updated successfully`

**Request body:** `multipart/form-data` (`SellerRestaurantRequest`)

| Field                  | Type            | Example                             |
| ---------------------- | --------------- | ----------------------------------- |
| `name`                 | `String`        | `sample-name`                       |
| `description`          | `String`        | `Sample text`                       |
| `contactNumber`        | `String`        | `9876543210`                        |
| `contactEmail`         | `String`        | `user@example.com`                  |
| `address`              | `String`        | `Park Street, Kolkata, West Bengal` |
| `city`                 | `String`        | `Kolkata`                           |
| `state`                | `String`        | `West Bengal`                       |
| `country`              | `String`        | `India`                             |
| `zipcode`              | `String`        | `True`                              |
| `latitude`             | `BigDecimal`    | `22.5743533`                        |
| `longitude`            | `BigDecimal`    | `88.3628733`                        |
| `priceForTwo`          | `Integer`       | `100.0`                             |
| `orderPreparationTime` | `Integer`       | `2026-06-06T12:00:00Z`              |
| `minDeliveryTime`      | `Integer`       | `2026-06-06T12:00:00Z`              |
| `maxDeliveryTime`      | `Integer`       | `2026-06-06T12:00:00Z`              |
| `cuisines`             | `String`        | `sample`                            |
| `open`                 | `Boolean`       | `True`                              |
| `logo`                 | `MultipartFile` | `<file>`                            |
| `banner`               | `MultipartFile` | `<file>`                            |

**Response body (`SellerRestaurantResponse`)**

```json
{
  "success": true,
  "message": "Restaurant updated successfully",
  "data": {
    "id": 1,
    "name": "sample-name",
    "slug": "sample-name",
    "description": "Sample text",
    "contactNumber": "9876543210",
    "contactEmail": "user@example.com",
    "logo": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "banner": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "address": "Park Street, Kolkata, West Bengal",
    "city": "Kolkata",
    "state": "West Bengal",
    "country": "India",
    "zipcode": true,
    "latitude": 22.5743533,
    "longitude": 88.3628733,
    "rating": 5,
    "totalReviews": 100.0,
    "productCount": "sample",
    "priceForTwo": 100.0,
    "orderPreparationTime": "2026-06-06T12:00:00Z",
    "minDeliveryTime": "2026-06-06T12:00:00Z",
    "maxDeliveryTime": "2026-06-06T12:00:00Z",
    "cuisines": "sample",
    "status": "PENDING",
    "open": true,
    "verificationStatus": "PENDING",
    "visibilityStatus": "PENDING",
    "featured": true,
    "promoted": true,
    "createdAt": "2026-06-06T12:00:00Z",
    "updatedAt": "2026-06-06T12:00:00Z"
  }
}
```

### PATCH /seller/restaurant/status

**Auth:** Seller  
**Controller:** `SellerRestaurantController.java`  
**Handler:** `updateStatus`  
**Success message:** `Restaurant status updated successfully`

**Request body:** `multipart/form-data` (`SellerRestaurantRequest`)

| Field                  | Type            | Example                             |
| ---------------------- | --------------- | ----------------------------------- |
| `name`                 | `String`        | `sample-name`                       |
| `description`          | `String`        | `Sample text`                       |
| `contactNumber`        | `String`        | `9876543210`                        |
| `contactEmail`         | `String`        | `user@example.com`                  |
| `address`              | `String`        | `Park Street, Kolkata, West Bengal` |
| `city`                 | `String`        | `Kolkata`                           |
| `state`                | `String`        | `West Bengal`                       |
| `country`              | `String`        | `India`                             |
| `zipcode`              | `String`        | `True`                              |
| `latitude`             | `BigDecimal`    | `22.5743533`                        |
| `longitude`            | `BigDecimal`    | `88.3628733`                        |
| `priceForTwo`          | `Integer`       | `100.0`                             |
| `orderPreparationTime` | `Integer`       | `2026-06-06T12:00:00Z`              |
| `minDeliveryTime`      | `Integer`       | `2026-06-06T12:00:00Z`              |
| `maxDeliveryTime`      | `Integer`       | `2026-06-06T12:00:00Z`              |
| `cuisines`             | `String`        | `sample`                            |
| `open`                 | `Boolean`       | `True`                              |
| `logo`                 | `MultipartFile` | `<file>`                            |
| `banner`               | `MultipartFile` | `<file>`                            |

**Response body (`SellerRestaurantResponse`)**

```json
{
  "success": true,
  "message": "Restaurant status updated successfully",
  "data": {
    "id": 1,
    "name": "sample-name",
    "slug": "sample-name",
    "description": "Sample text",
    "contactNumber": "9876543210",
    "contactEmail": "user@example.com",
    "logo": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "banner": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "address": "Park Street, Kolkata, West Bengal",
    "city": "Kolkata",
    "state": "West Bengal",
    "country": "India",
    "zipcode": true,
    "latitude": 22.5743533,
    "longitude": 88.3628733,
    "rating": 5,
    "totalReviews": 100.0,
    "productCount": "sample",
    "priceForTwo": 100.0,
    "orderPreparationTime": "2026-06-06T12:00:00Z",
    "minDeliveryTime": "2026-06-06T12:00:00Z",
    "maxDeliveryTime": "2026-06-06T12:00:00Z",
    "cuisines": "sample",
    "status": "PENDING",
    "open": true,
    "verificationStatus": "PENDING",
    "visibilityStatus": "PENDING",
    "featured": true,
    "promoted": true,
    "createdAt": "2026-06-06T12:00:00Z",
    "updatedAt": "2026-06-06T12:00:00Z"
  }
}
```

### POST /admin/uploads/offer-image

**Auth:** Admin  
**Controller:** `UploadController.java`  
**Handler:** `uploadOfferImage`  
**Success message:** `Success`

**Request body:** none

**Response body (`Object`)**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Sample"
  }
}
```

### POST /delivery/orders/{orderId}/location

**Auth:** Driver  
**Controller:** `DeliveryTrackingController.java`  
**Handler:** `updateDriverLocation`  
**Success message:** `Live delivery location updated successfully`

**Path variables**

| Name      | Type   | Example |
| --------- | ------ | ------- |
| `orderId` | `Long` | `1`     |

**Request body (`DeliveryLocationUpdateRequest`)**

```json
{
  "latitude": 22.5743533,
  "longitude": 88.3628733,
  "accuracyMeters": 10.0,
  "speedMetersPerSecond": 10.0,
  "headingDegrees": 10.0
}
```

**Response body (`DeliveryTrackingResponse`)**

```json
{
  "success": true,
  "message": "Live delivery location updated successfully",
  "data": {
    "orderId": 1,
    "orderNumber": "sample",
    "status": "PENDING",
    "driverId": 1,
    "driverName": "sample-name",
    "driverMobile": "9876543210",
    "latitude": 22.5743533,
    "longitude": 88.3628733,
    "accuracyMeters": 10.0,
    "speedMetersPerSecond": 10.0,
    "headingDegrees": 10.0,
    "updatedAt": "2026-06-06T12:00:00Z",
    "live": true
  }
}
```

### GET /user/orders/{orderId}/tracking

**Auth:** User  
**Controller:** `DeliveryTrackingController.java`  
**Handler:** `getCustomerTracking`  
**Success message:** `Live delivery tracking fetched successfully`

**Path variables**

| Name      | Type   | Example |
| --------- | ------ | ------- |
| `orderId` | `Long` | `1`     |

**Request body:** none

**Response body (`DeliveryTrackingResponse`)**

```json
{
  "success": true,
  "message": "Live delivery tracking fetched successfully",
  "data": {
    "orderId": 1,
    "orderNumber": "sample",
    "status": "PENDING",
    "driverId": 1,
    "driverName": "sample-name",
    "driverMobile": "9876543210",
    "latitude": 22.5743533,
    "longitude": 88.3628733,
    "accuracyMeters": 10.0,
    "speedMetersPerSecond": 10.0,
    "headingDegrees": 10.0,
    "updatedAt": "2026-06-06T12:00:00Z",
    "live": true
  }
}
```

### POST /auth/login

**Auth:** Public  
**Controller:** `AuthController.java`  
**Handler:** `login`  
**Success message:** `Login successful`

**Request body (`LoginRequest`)**

```json
{
  "email": "user@example.com",
  "mobile": "9876543210",
  "password": "Password@123",
  "fcmToken": "sample",
  "deviceType": "DELIVERY"
}
```

**Response body (`AuthResponse`)**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "sample",
    "tokenType": "DELIVERY",
    "data": "sample"
  }
}
```

### POST /auth/logout

**Auth:** Public  
**Controller:** `AuthController.java`  
**Handler:** `logout`  
**Success message:** `Logged out successfully`

**Request body:** none

**Response body (`Void`)**

```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```

### POST /auth/register

**Auth:** Public  
**Controller:** `AuthController.java`  
**Handler:** `register`  
**Success message:** `Registration successful`

**Request body (`RegisterRequest`)**

```json
{
  "name": "sample-name",
  "email": "user@example.com",
  "mobile": "9876543210",
  "password": "Password@123",
  "passwordConfirmation": "Password@123",
  "country": "India",
  "iso2": true,
  "role": "USER",
  "restaurantName": "sample-name",
  "restaurantAddress": "Park Street, Kolkata, West Bengal",
  "fcmToken": "sample",
  "deviceType": "DELIVERY"
}
```

**Response body (`AuthResponse`)**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "accessToken": "sample",
    "tokenType": "DELIVERY",
    "data": "sample"
  }
}
```

### DELETE /user/account

**Auth:** User  
**Controller:** `ProfileController.java`  
**Handler:** `deleteAccount`  
**Success message:** `Account deleted successfully.`

**Request body:** none

**Response body (`Void`)**

```json
{
  "success": true,
  "message": "Account deleted successfully.",
  "data": null
}
```

### PUT /user/change-password

**Auth:** User  
**Controller:** `ProfileController.java`  
**Handler:** `changePassword`  
**Success message:** `Password changed successfully.`

**Request body (`ChangePasswordRequest`)**

```json
{
  "currentPassword": "Password@123",
  "password": "Password@123",
  "passwordConfirmation": "Password@123"
}
```

**Response body (`Void`)**

```json
{
  "success": true,
  "message": "Password changed successfully.",
  "data": null
}
```

### GET /user/profile

**Auth:** User  
**Controller:** `ProfileController.java`  
**Handler:** `getProfile`  
**Success message:** `Profile fetched successfully`

**Request body:** none

**Response body (`UserResponse`)**

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "id": 1,
    "name": "sample-name",
    "email": "user@example.com",
    "mobile": "9876543210",
    "profileImage": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "walletBalance": 10.0,
    "totalOrders": 100.0,
    "totalReviews": 100.0,
    "loyaltyPoints": "sample",
    "role": "USER",
    "createdAt": "2026-06-06T12:00:00Z"
  }
}
```

### POST /user/profile

**Auth:** User  
**Controller:** `ProfileController.java`  
**Handler:** `updateProfileUsingPost`  
**Success message:** `Profile updated successfully`

**Request body (`ProfileUpdateRequest`)**

```json
{
  "name": "sample-name",
  "email": "user@example.com",
  "mobile": "9876543210",
  "profileImage": "https://res.cloudinary.com/demo/image/upload/sample.png"
}
```

**Response body (`UserResponse`)**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "name": "sample-name",
    "email": "user@example.com",
    "mobile": "9876543210",
    "profileImage": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "walletBalance": 10.0,
    "totalOrders": 100.0,
    "totalReviews": 100.0,
    "loyaltyPoints": "sample",
    "role": "USER",
    "createdAt": "2026-06-06T12:00:00Z"
  }
}
```

### PUT /user/profile

**Auth:** User  
**Controller:** `ProfileController.java`  
**Handler:** `updateProfileUsingPut`  
**Success message:** `Profile updated successfully`

**Request body (`ProfileUpdateRequest`)**

```json
{
  "name": "sample-name",
  "email": "user@example.com",
  "mobile": "9876543210",
  "profileImage": "https://res.cloudinary.com/demo/image/upload/sample.png"
}
```

**Response body (`UserResponse`)**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "name": "sample-name",
    "email": "user@example.com",
    "mobile": "9876543210",
    "profileImage": "https://res.cloudinary.com/demo/image/upload/sample.png",
    "walletBalance": 10.0,
    "totalOrders": 100.0,
    "totalReviews": 100.0,
    "loyaltyPoints": "sample",
    "role": "USER",
    "createdAt": "2026-06-06T12:00:00Z"
  }
}
```
