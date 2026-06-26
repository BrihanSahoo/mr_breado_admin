export type SafeApiError = Error & {
  status?: number;
  code?: string;
  safeMessage?: string;
  backendMessage?: string;
};

const CODE_MESSAGES: Record<string, string> = {
  CUISINE_ALREADY_EXISTS: "A cuisine with this name already exists.",
  DUPLICATE_RECORD: "A cuisine with this name already exists.",
  CUISINE_IN_USE: "This cuisine is assigned to foods. Deactivate it instead of deleting it.",
  CUISINE_NAME_REQUIRED: "Enter a cuisine name.",
  CUISINE_NAME_TOO_LONG: "Cuisine name must be 80 characters or fewer.",
  CUISINE_SLUG_INVALID: "Enter a valid cuisine name.",
  IMAGE_TOO_LARGE: "The selected image is too large. Choose an image smaller than 8 MB.",
  UNSUPPORTED_IMAGE_TYPE: "Choose a JPG, PNG, WebP, GIF, AVIF, HEIC, or HEIF image.",
  CLOUDINARY_NOT_CONFIGURED: "Image storage is not configured on the backend.",
  CLOUDINARY_CONFIG_INVALID: "The Cloudinary configuration is invalid.",
  CLOUDINARY_AUTH_FAILED: "Cloudinary authentication failed. Check the deployed credentials.",
  IMAGE_UPLOAD_FAILED: "The image could not be uploaded. Please try again.",
  CORS_ORIGIN_BLOCKED: "This admin website is not allowed to access the backend.",
};

export function apiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  const value = error as SafeApiError | undefined;
  const code = String(value?.code ?? "").trim();
  if (code && CODE_MESSAGES[code]) return CODE_MESSAGES[code];

  const status = Number(value?.status ?? 0);
  if (status === 0 && typeof navigator !== "undefined" && navigator.onLine === false) {
    return "You are offline. Check your internet connection and try again.";
  }
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403) return "You do not have permission to perform this action.";
  if (status === 404) return "The requested record was not found.";
  if (status === 409) return "This record already exists or is currently in use.";
  if (status === 413) return "The selected image is too large. Choose an image smaller than 8 MB.";
  if (status === 415) return "The selected image format is not supported.";
  if (status === 422) return "Review the form fields and try again.";
  if (status === 429) return "Too many requests. Wait a moment and try again.";
  if (status >= 500) return "The server could not complete this action. Please try again shortly.";

  return value?.safeMessage || fallback;
}
