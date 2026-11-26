// Local image paths that contain a literal "+" (e.g. "JUSTY Logo (bird+crown).png",
// "NICO + DRACO/...") 404 on production when served as-is: the static handler reads
// "+" as a space. next/image with `unoptimized` passes the src straight through, so
// those need the "+" percent-encoded. The optimizer path already encodes it, and
// SafeImage has its own encoder; this is for the unoptimized <Image> call sites.
export function staticSrc(src: string): string {
  if (!src || !src.startsWith("/") || !src.includes("+")) return src;
  return src.replace(/\+/g, "%2B");
}
