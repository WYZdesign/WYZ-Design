import { useMemo } from "react";

function FisherYatesShuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useShuffle<T>(items: T[]): T[] {
  return useMemo(() => FisherYatesShuffle(items), []);
}
