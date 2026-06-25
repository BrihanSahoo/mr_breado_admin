/** Best-effort tactile feedback for supported mobile browsers and PWAs. */
export function haptic(pattern: number | number[] = 24) {
  try {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(pattern);
    }
  } catch {
    // Vibration is optional and must never block an admin action.
  }
}
