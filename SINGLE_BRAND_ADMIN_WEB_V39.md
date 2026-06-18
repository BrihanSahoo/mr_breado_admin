# Admin Web v39 — Mr Breado Head Office

Business model: single Mr Breado brand, multiple outlets.

Use the existing UI theme. The pages should point to these backend APIs:

- Head Office Dashboard: GET /api/admin/head-office/dashboard
- Outlet List: GET /api/admin/outlets
- Create Outlet: POST /api/admin/outlets
- Edit Outlet: PUT /api/admin/outlets/:id
- Outlet Menu: GET /api/admin/outlets/:id/menu
- Outlet Stock: POST /api/admin/outlets/:id/stock
- Delivery Boys: GET /api/admin/delivery-boys
- Assign Delivery Boy: POST /api/admin/outlets/:outletId/delivery-boys/:userId
- Outlet Sales Report: GET /api/admin/reports/outlet-sales
- CSV Export: GET /api/admin/reports/outlet-sales.csv

Hide or remove from navigation:
- Seller onboarding
- Restaurant payout requests
- Restaurant verification for marketplace sellers
- Franchise marketplace workflow unless used as simple lead/enquiry.

Keep:
- Orders
- Payments/Razorpay transactions
- Premium invoices/receipts
- Bite stories
- Categories
- Mr Breado master menu
- Customers
- Delivery boys
- Support
- Notifications
