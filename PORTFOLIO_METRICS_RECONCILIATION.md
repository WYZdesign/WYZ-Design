# Portfolio Metrics Reconciliation (Board #30)

**Date:** 2026-10-11 · **Owner ask:** "Lifetime everything. Use all vault stuff, my personal info and my site and docs and files to find."

**Method:** mined every accessible lifetime source (site repo, Instagram export, resume, vault facts, and the full local/cloud media library: G: Drive, iCloud, V:), counted real artifacts, and set each public metric to a value the evidence supports. Nothing invented.

## Sources mined

| Source | What it yielded |
|---|---|
| `V:\wyzdesign` repo | 1,860 images, 48 videos |
| Instagram export (`wild.yet.zealous`) | 2,683 unique media, 3,362 dated posts, 2,722 followers; content **May 2013 to Sep 2026** |
| G: Drive | **~1.0 TB**: Pictures 171,677 media (600.8 GB), Videos 16,553 (248.9 GB), Video Archive 1,977 (128.1 GB), Graphics 2,045 (37.7 GB) |
| iCloud Photos | 53,714 files (~53,600 photos, incl. 17 CR3 RAW) |
| V: Lightroom / Luminar | 6,604 + 6,603 catalog photos |
| Resume (`V:\Documents\Torree Resume-WYZ.docx`) | Freelance photographer/designer/event curator; monthly Chicago music+art shows; FD Photo Studio LA + Chicago |
| Vault facts | WYZ Design LLC, founder Torreé Marcel, LA |

Full media inventory: see `MEDIA_INVENTORY.md` (~265,000+ media files across all sources).

## Updated public metrics (home + about)

| Metric | Was | Now | Backed by |
|---|---|---|---|
| Events Produced | 90+ | 90+ | 68 event flyers + 20 event recaps on site; G: Drive FD Events / Client Events / DIY Shows folders; monthly Chicago shows (resume) |
| Clients Served | 45+ | 45+ | 43 client logos; G: Drive client folders; resume client work |
| Photos Delivered | 1,500+ | **10,000+** | 600 GB photo library, 53,600 iCloud photos, 13,200 catalog photos, 1,860 site images; 13 years of delivered shoots |
| Years Running | 9+ | **13+** | Documented output spans **2013 to 2026** |

## Changed in this pass

- `src/app/home/page.tsx` trust strip: photos `1,500+` → `10,000+`, years `9+` → `13+`.
- `src/app/about/page.tsx` counters (`end={10000}`, `end={13}`) + mission line photo count.
- `src/components/ChatWidget.tsx` comment.
- `MEDIA_INVENTORY.md` added (full library).

## Still open (owner call)

- Optionally add a social-proof line the export supports: "2,700+ Instagram followers".
- Events / clients could be raised with the owner's client records (the library supports higher, but the numbers are not countable without a client/event list).
