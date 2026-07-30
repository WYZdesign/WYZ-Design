"use client";
import { useEffect, useRef, useCallback, useState } from "react";

type GyroStatus = "pending" | "granted" | "denied" | "unavailable";

/**
 * Single hook for DeviceOrientation permission flow.
 * Replaces duplicated code across CardTilt, MouseGlow,
 * ImmersiveHero, and SplashVariants.
 */
export function useGyroPermission(
  onGranted: (done: (cleanup: () => void) => void) => void
): GyroStatus {
  const [status, setStatus] = useState<GyroStatus>("pending");

  const requestPerm = useCallback(async () => {
    try {
      if (typeof DeviceOrientationEvent === "undefined") {
        setStatus("unavailable");
        return;
      }
      const DOE = DeviceOrientationEvent as any;
      if (typeof DOE.requestPermission !== "function") {
        setStatus("granted");
        return;
      }
      const perm = await DOE.requestPermission();
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

  // iOS: bind to first user gesture
  useEffect(() => {
    const onTouch = () => {
      document.removeEventListener("touchend", onTouch);
      document.removeEventListener("click", onTouch);
      if (status === "pending") requestPerm();
    };
    document.addEventListener("touchend", onTouch, { once: true });
    document.addEventListener("click", onTouch, { once: true });
    return () => {
      document.removeEventListener("touchend", onTouch);
      document.removeEventListener("click", onTouch);
    };
  }, [requestPerm, status]);

  return status;
}
