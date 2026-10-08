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
    const orientationApi = getOrientationPermissionApi();
    if (!orientationApi) {
      setStatus("unavailable");
      return;
    }
    if (typeof orientationApi.requestPermission !== "function") requestPerm();
  }, [requestPerm]);

  return { status, requestPermission: requestPerm };
}
