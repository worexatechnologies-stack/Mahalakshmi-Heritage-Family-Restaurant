/**
 * Meta Pixel (Facebook Pixel) helper utilities
 * Reads NEXT_PUBLIC_META_PIXEL_ID from environment configuration.
 */

export const META_PIXEL_ID = (
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "908556468946085"
).trim();

export function trackPageView() {
  if (!META_PIXEL_ID || typeof window === "undefined") return;
  if (typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
}

export function trackMetaEvent(eventName, params = {}) {
  if (!META_PIXEL_ID || typeof window === "undefined") return;
  if (typeof window.fbq === "function") {
    window.fbq("track", eventName, params);
  }
}
