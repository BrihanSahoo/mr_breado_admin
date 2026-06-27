export type SafeApiError = Error & {
  status?: number;
  code?: string;
  safeMessage?: string;
  backendMessage?: string;
};

const CODE_MESSAGES: Record<string, string> = {
  INVALID_CUISINE: "Select an active cuisine.",
  INVALID_CATEGORY: "Select an active Admin-created category.",
  CATEGORY_NAME_REQUIRED: "Enter a category name.",
  CATEGORY_SLUG_INVALID: "Enter a valid category name and slug.",
  CATEGORY_ALREADY_EXISTS: "A category with this name or slug already exists.",
  CATEGORY_IN_USE:
    "This category is assigned to foods. Deactivate it instead of deleting it.",
  CATEGORY_NOT_FOUND: "The selected category no longer exists.",
  INVALID_BRAND: "Select an active Admin-created brand.",
  PRODUCT_NAME_REQUIRED: "Enter the food title.",
  PRODUCT_NAME_TOO_LONG: "Food title must be 140 characters or fewer.",
  PRODUCT_IMAGE_REQUIRED: "Select a food image from your device.",
  INVALID_PRODUCT_PRICE: "Enter a valid food price greater than zero.",
  INVALID_OFFER_PRICE: "Offer price must be lower than the base price.",
  CUISINE_ALREADY_EXISTS: "A cuisine with this name already exists.",
  DUPLICATE_RECORD: "A cuisine with this name already exists.",
  CUISINE_IN_USE:
    "This cuisine is assigned to foods. Deactivate it instead of deleting it.",
  CUISINE_NAME_REQUIRED: "Enter a cuisine name.",
  CUISINE_NAME_TOO_LONG: "Cuisine name must be 80 characters or fewer.",
  CUISINE_SLUG_INVALID: "Enter a valid cuisine name.",
  IMAGE_TOO_LARGE:
    "The selected image is too large. Choose an image smaller than 8 MB.",
  UNSUPPORTED_IMAGE_TYPE:
    "Choose a JPG, PNG, WebP, GIF, AVIF, HEIC, or HEIF image.",
  CLOUDINARY_NOT_CONFIGURED: "Image storage is not configured on the backend.",
  CLOUDINARY_CONFIG_INVALID: "The Cloudinary configuration is invalid.",
  CLOUDINARY_AUTH_FAILED:
    "Cloudinary authentication failed. Check the deployed credentials.",
  IMAGE_UPLOAD_FAILED: "The image could not be uploaded. Please try again.",
  CORS_ORIGIN_BLOCKED:
    "This admin website is not allowed to access the backend.",
  BANNER_TITLE_REQUIRED: "Enter a banner title.",
  BANNER_TITLE_TOO_LONG: "Banner title must be 120 characters or fewer.",
  BANNER_IMAGE_REQUIRED:
    "Upload a banner image or enter a valid HTTPS image URL.",
  INVALID_IMAGE_URL: "Enter a valid HTTPS image URL.",
  OUTLET_SCOPE_REQUIRED: "Select at least one outlet or enable every outlet.",
  INVALID_OUTLET_SCOPE: "One or more selected outlets are no longer available.",
  COUPON_NOT_FOUND: "The selected coupon no longer exists.",
  COUPON_INACTIVE: "The selected coupon is inactive.",
  COUPON_EXPIRED: "The selected coupon has expired.",
  COUPON_OUTLET_MISMATCH:
    "The selected coupon is not eligible for every selected outlet.",
  INVALID_DATE_RANGE: "The end date must be later than the start date.",
  CURRENT_PASSWORD_INVALID: "The current password is incorrect.",
  PASSWORD_TOO_SHORT: "Use at least 8 characters for the new password.",
  PASSWORD_TOO_WEAK: "Use at least one letter and one number in the password.",
  PASSWORD_MISMATCH: "The password confirmation does not match.",
  PASSWORD_UNCHANGED:
    "The new password must be different from the current password.",
  PASSWORD_RESET_INVALID:
    "The reset code or recovery key is invalid or expired.",
  PASSWORD_EMAIL_NOT_CONFIGURED:
    "Password recovery email is not configured on the backend.",
  EMAIL_ALREADY_USED: "This email address is already in use.",
  PHONE_ALREADY_USED: "This phone number is already in use.",
  INVALID_GSTIN: "Enter a valid 15-character GSTIN.",
};

export function apiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) {
  const value = error as SafeApiError | undefined;
  const code = String(value?.code ?? "").trim();
  if (code && CODE_MESSAGES[code]) return CODE_MESSAGES[code];

  const status = Number(value?.status ?? 0);
  if (
    status === 0 &&
    typeof navigator !== "undefined" &&
    navigator.onLine === false
  ) {
    return "You are offline. Check your internet connection and try again.";
  }
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403)
    return "You do not have permission to perform this action.";
  if (status === 404) return "The requested record was not found.";
  if (status === 409)
    return "This record already exists or is currently in use.";
  if (status === 413)
    return "The selected image is too large. Choose an image smaller than 8 MB.";
  if (status === 415) return "The selected image format is not supported.";
  if (status === 422) return "Review the form fields and try again.";
  if (status === 429) return "Too many requests. Wait a moment and try again.";
  if (status >= 500)
    return "The server could not complete this action. Please try again shortly.";

  return value?.safeMessage || fallback;
}
