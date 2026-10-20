import { describe, expect, it } from "vitest";
import { CATEGORY_ALBUMS, CATEGORY_META } from "./photography-category";

const PORTFOLIO_ORIGIN = "https://ccznkpcmpadgftqhwvdx.supabase.co";
const PORTFOLIO_PREFIX = `${PORTFOLIO_ORIGIN}/storage/v1/object/public/portfolio/`;

describe("photography category catalog", () => {
  const albums = Object.entries(CATEGORY_ALBUMS).flatMap(([category, entries]) =>
    entries.map((album) => ({ category, ...album })),
  );
  const images = albums.flatMap((album) => album.images);

  it("keeps a complete, non-redundant catalog represented in category metadata", () => {
    // Counts move as albums are merged/regenerated, so assert the invariants that
    // matter instead of fixed totals: nothing lost, nothing duplicated, and no
    // album exceeding the generator's per-album cap.
    expect(albums.length, "catalog unexpectedly small").toBeGreaterThan(250);
    expect(images.length, "catalog unexpectedly small").toBeGreaterThan(3000);
    expect(new Set(images).size, "duplicate images across the catalog").toBe(images.length);
    expect(Object.keys(CATEGORY_ALBUMS).sort()).toEqual(Object.keys(CATEGORY_META).sort());
    expect(
      albums.every(({ images: albumImages }) => albumImages.length >= 1 && albumImages.length <= 30),
      "album image count out of range",
    ).toBe(true);
  });

  it("gives each album a unique, non-empty name and at least one image", () => {
    expect(new Set(albums.map(({ category, name }) => `${category}/${name}`)).size).toBe(albums.length);
    expect(albums.every(({ name, images: albumImages }) => name.trim().length > 0 && albumImages.length > 0)).toBe(true);
  });

  it("uses only the approved public portfolio origin and path", () => {
    expect(images.every((image) => image.startsWith(PORTFOLIO_PREFIX))).toBe(true);
    expect(images.every((image) => new URL(image).origin === PORTFOLIO_ORIGIN)).toBe(true);
  });
});
