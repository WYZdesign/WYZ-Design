"use client";
import { useEffect, useCallback, useState } from "react";

type GyroStatus = "pending" | "granted" | "denied" | "unavailable";
type OrientationPermissionRequest = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

function getOrientationPermissionApi(): OrientationPermissionRequest | null {
  if (typeof DeviceOrientationEvent === "undefined") return null;
  return DeviceOrientationEvent as OrientationPermissionRequest;
}

let grantedOnce = false;

/**
 * True when the platform gates device-orientation behind a user gesture (iOS
 * 13+) and it has not been granted yet. Callers that own the first tap (for
 * example the splash, where tapping anywhere also enters the site) can use
 * this to spend that first tap on the permission prompt instead of navigating.
 */
export function gyroNeedsGesture(): boolean {
  const api = getOrientationPermissionApi() as OrientationPermissionRequest | null;
  return !!api && typeof api.requestPermission === "function" && !grantedOnce;
}

/**
 * Single hook for DeviceOrientation permission flow.
 * Replaces duplicated code across CardTilt, MouseGlow,
 * ImmersiveHero, and SplashVariants.
 */
export function useGyroPermission(
  onGranted: (done: (cleanup: () => void) => void) => void
): { status: GyroStatus; requestPermission: () => Promise<void> } {
  const [status, setStatus] = useState<GyroStatus>("pending");

  const requestPerm = useCallback(async () => {
    try {
      const orientationApi = getOrientationPermissionApi();
      if (!orientationApi) {
        setStatus("unavailable");
        return;
      }
      if (typeof orientationApi.requestPermission !== "function") {
        setStatus("granted");
        return;
      }
      const perm = await orientationApi.requestPermission();
      setStatus(perm === "granted" ? "granted" : "denied");
    } catch {
      setStatus("denied");
    }
  }, []);

  useEffect(() => {
    if (status !== "granted") return;
    let cleanup: (() => void) | null = null;
    onGranted((fn) => { cleanup = fn; });
    return () => { cleanup?.(); };
  }, [status, onGranted]);

  useEffect(() => {
    if (status === "granted") grantedOnce = true;
  }, [status]);

  useEffect(() => {
    const orientationApi = getOrientationPermissionApi();
    if (!orientationApi) {
      setStatus("unavailable");
      return;
    }
    if (typeof orientationApi.requestPermission !== "function") {
      // Non-iOS: permission is implicit, grant immediately.
      requestPerm();
      return;
    }
    // iOS 13+ gates this behind a user gesture. Nothing used to call
    // requestPermission at all, so tilt silently never activated on iPhone
    // (which is why the splash tilt "worked on maybe one" device). Bind the
    // first pointer/touch/click as that gesture.
    const handler = () => {
      requestPerm();
      remove();
    };
    const remove = () => {
      window.removeEventListener("pointerdown", handler);
      window.removeEventListener("touchstart", handler);
      window.removeEventListener("click", handler);
    };
    window.addEventListener("pointerdown", handler, { passive: true });
    window.addEventListener("touchstart", handler, { passive: true });
    window.addEventListener("click", handler);
    return remove;
  }, [requestPerm]);

  return { status, requestPermission: requestPerm };
}
