# V35 admin web patch

- Restaurant payout page now reads the real backend money ledger endpoint `/admin/money/restaurant-payouts`.
- Settlement data is normalized from v35 ledger fields: gross_food_amount, commission_amount, net_payable, settlement_status.
- Food form keeps pizza fields visible only for Pizza category and cake fields visible only for Cake category.
- Admin product submission still sends multipart FormData compatible with backend v35.
