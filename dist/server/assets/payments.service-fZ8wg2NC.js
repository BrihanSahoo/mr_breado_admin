import { r as request, e as endpoints } from "./router-1xz68c6T.js";
const paymentsService = {
  summary: () => request({
    url: endpoints.admin.paymentsSummary,
    method: "GET"
  }),
  mrBreado: () => request({
    url: endpoints.admin.mrBreadoPayments,
    method: "GET"
  })
};
export {
  paymentsService as p
};
