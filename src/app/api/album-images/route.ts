import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

const MINIO_PUBLIC = process.env.MINIO_URL || "";

function cloudinaryUrl(publicId: string, w?: number, h?: number): string {
  return cloudinary.url(publicId, {
    secure: true, quality: "auto", fetch_format: "auto",
    ...(w ? { width: w, height: h || w, crop: "fill" } : {}),
  });
}

// ── S3-compatible HTTP listing via Cloudflare Tunnel ──
async function listMinioS3(prefix: string, max = 30): Promise<string[]> {
  try {
    const url = `${MINIO_PUBLIC}?prefix=${encodeURIComponent(prefix)}&max-keys=${max}`;
    const res = await fetch(url, { next: { revalidate: 60 } } as any);
    if (!res.ok) return [];
    const xml = await res.text();
    const keys: string[] = [];
    const keyRegex = /<Key>([^<]+)<\/Key>/g;
    let match;
    while ((match = keyRegex.exec(xml)) !== null) {
      const key = match[1];
      if (key.endsWith("/")) continue;
      keys.push(`${MINIO_PUBLIC}/${key}`);
    }
    return keys;
  } catch { return []; }
}

// ── Display name → MinIO folder (complete map) ──
const MINIO_FOLDER: Record<string, string> = {
  "ADRIENNE": "ADRIENNE",
  "AECH DOT": "AECH_DOT",
  "AJA": "AJA",
  "ALEXANDRIA": "ALEXANDRIA",
  "ANGEL": "ANGEL",
  "ANGELICA": "ANGELICA",
  "ANTHONIA": "ANTHONIA",
  "ARCANA": "ARCANA",
  "ASH": "ASH",
  "ASHONDIA": "ASHONDI",
  "AUDREY": "AUDREY",
  "BRIAN": "BRIAN",
  "BRIYANNA": "BRIYANNA",
  "BROCK": "BROCK",
  "BROOK": "BROOK",
  "BROOKE": "BROOKE",
  "BRYSON": "BRYSON",
  "CAMILLE": "CAMILLE",
  "CHER": "CHER",
  "CHAVI": "CHHAVI",
  "CITLALI": "CITLALI",
  "CLAIRE": "CLAIRE",
  "CLAUDIA": "CLAUDIA",
  "CORI": "CORI",
  "CRISTINA": "CRISTINA",
  "CRYSTAL": "CRYSTAL",
  "DANIELLE": "DANIELLE",
  "DARRYL": "DARRYL",
  "DEKETRA": "DEKETRA",
  "DOT": "DOT",
  "DRAKE": "DRAKE",
  "EBONIE": "EBONIE",
  "EBONY": "EBONY",
  "EDEN": "EDEN",
  "FARREN": "FARREN",
  "FLUFFY": "FLUFFY",
  "GREYSON": "GREYSON",
  "HANNAH": "HANNAH",
  "HEADY": "HEADY",
  "IVY": "IVY",
  "J. RED": "J.RED",
  "JANELLE": "JANELLE",
  "JATOHN": "JATOHN",
  "JEREMY": "JEREMY",
  "JERMAINE": "JERMAINE",
  "JIMMY": "JIMMY",
  "JORDAN": "JORDAN",
  "KATARA": "KATARA",
  "KATHRYN": "KATHRYN",
  "KAYLEN": "KAYLEN",
  "KIDLYN": "KIDLYN",
  "LAUREN": "LAUREN",
  "LAUSHERN": "JAKALA",
  "LORIE": "LORIE",
  "MALIKA": "MALIKA",
  "MAKAYLA": "MAKAYLA",
  "MARISSA": "MARISSA",
  "MARSHAWNA": "MARSHAWNA",
  "MAYA": "MAYA",
  "MITRI": "MITRI",
  "MONICA": "MONICA",
  "NAKIA": "NAKIA",
  "NIK": "NIK",
  "NIYAH": "NIYAH",
  "ODUPE": "PEYTON",
  "PAYTON": "PEYTON",
  "PRADIA": "PRADIA",
  "QUANISHA": "QUANISHA",
  "RANISHA": "RANISHA",
  "REBECCA": "REBECCA",
  "ROBERT": "ROBERT",
  "ROY": "ROY",
  "SIMONE": "SIMONE",
  "STAR": "STAR",
  "SYDNEY": "SYDNEY",
  "SYE": "SYETA",
  "TATE": "TATE",
  "TEJUAN": "TEJUAN",
  "TED + SYLVIA": "TED_+_SYLVIA",
  "TEREZA": "TEREZA",
  "TONI": "TONI",
  "TOREE": "TORREE",
  "TOSHI": "TOSH",
  "TYLIN": "TYLIN",
  "VAHN": "VAHN",
  "VERONICA": "VERONICA",
  "WESLEY": "WESLEY",
  "WOLF": "WOLF",
  "XOCHI": "XOCHI",
};

// ── Model headshots → Cloudinary public IDs ──
const HEADSHOTS: Record<string, string> = {
  ADRIENNE: "wyzdesign/model-headshots/ADRIENNE",
  ALEXANDRIA: "wyzdesign/model-headshots/ALEXANDRIA",
  ANGEL: "wyzdesign/model-headshots/ANGEL",
  ANGELICA: "wyzdesign/model-headshots/ANGELICA",
  ANTHONIA: "wyzdesign/model-headshots/ANTHONIA",
  ARCANA: "wyzdesign/model-headshots/ARCANA",
  ASH: "wyzdesign/model-headshots/ASH",
  ASHONDIA: "wyzdesign/model-headshots/ASHONDIA",
  AUDREY: "wyzdesign/model-headshots/AUDREY",
  BRIAN: "wyzdesign/model-headshots/BRIAN",
  BRIYANNA: "wyzdesign/model-headshots/BRIYANNA",
  BROCK: "wyzdesign/model-headshots/BROCK",
  BROOK: "wyzdesign/model-headshots/BROOK",
  BRYSON: "wyzdesign/model-headshots/BRYSON",
  CAMILLE: "wyzdesign/model-headshots/CAMILLE",
  CHER: "wyzdesign/model-headshots/CHER",
  CLAIRE: "wyzdesign/model-headshots/CLAIRE",
  CLAUDIA: "wyzdesign/model-headshots/CLAUDIA",
  CORI: "wyzdesign/model-headshots/CORI",
  CRISTINA: "wyzdesign/model-headshots/CRISTINA",
  CRYSTAL: "wyzdesign/model-headshots/CRYSTAL",
  DANIELLE: "wyzdesign/model-headshots/DANIELLE",
  DARRYL: "wyzdesign/model-headshots/DARRYL",
  DEKETRA: "wyzdesign/model-headshots/DEKETRA",
  DOT: "wyzdesign/model-headshots/DOT",
  DRAKE: "wyzdesign/model-headshots/DRAKE",
  EBONIE: "wyzdesign/model-headshots/EBONIE",
  EBONY: "wyzdesign/model-headshots/EBONY",
  EDEN: "wyzdesign/model-headshots/EDEN",
  FARREN: "wyzdesign/model-headshots/FARREN",
  FLUFFY: "wyzdesign/model-headshots/FLUFFY",
  GREYSON: "wyzdesign/model-headshots/GREYSON",
  HANNAH: "wyzdesign/model-headshots/HANNAH",
  HEADY: "wyzdesign/model-headshots/HEADY",
  IVY: "wyzdesign/model-headshots/IVY",
  "J. RED": "wyzdesign/model-headshots/JRED",
  JANELLE: "wyzdesign/model-headshots/JANELLE",
  JATOHN: "wyzdesign/model-headshots/JATOHN",
  JEREMY: "wyzdesign/model-headshots/JEREMY",
  JERMAINE: "wyzdesign/model-headshots/JERMAINE",
  JIMMY: "wyzdesign/model-headshots/JIMMY",
  JORDAN: "wyzdesign/model-headshots/JORDAN",
  KATARA: "wyzdesign/model-headshots/KATARA",
  KATHRYN: "wyzdesign/model-headshots/KATHRYN",
  KAYLEN: "wyzdesign/model-headshots/KAYLEN",
  KIDLYN: "wyzdesign/model-headshots/KIDLYN",
  LAUREN: "wyzdesign/model-headshots/LAUREN",
  LORIE: "wyzdesign/model-headshots/LORIE",
  MALIKA: "wyzdesign/model-headshots/MALIKA",
  MAKAYLA: "wyzdesign/model-headshots/MAKAYLA",
  MARISSA: "wyzdesign/model-headshots/MARISSA",
  MARSHAWNA: "wyzdesign/model-headshots/MARSHAWNA",
  MAYA: "wyzdesign/model-headshots/MAYA",
  MITRI: "wyzdesign/model-headshots/MITRI",
  MONICA: "wyzdesign/model-headshots/MONICA",
  NAKIA: "wyzdesign/model-headshots/NAKIA",
  NIK: "wyzdesign/model-headshots/NIK",
  NIYAH: "wyzdesign/model-headshots/NIYAH",
  PAYTON: "wyzdesign/model-headshots/PAYTON",
  PRADIA: "wyzdesign/model-headshots/PRADIA",
  QUANISHA: "wyzdesign/model-headshots/QUANISHA",
  RANISHA: "wyzdesign/model-headshots/RANISHA",
  REBECCA: "wyzdesign/model-headshots/REBECCA",
  ROBERT: "wyzdesign/model-headshots/ROBERT",
  ROY: "wyzdesign/model-headshots/ROY",
  SIMONE: "wyzdesign/model-headshots/SIMONE",
  STAR: "wyzdesign/model-headshots/STAR",
  SYDNEY: "wyzdesign/model-headshots/SYDNEY",
  TATE: "wyzdesign/model-headshots/TATE",
  TEJUAN: "wyzdesign/model-headshots/TEJUAN",
  "TED + SYLVIA": "wyzdesign/model-headshots/TEDSYLVIA",
  TEREZA: "wyzdesign/model-headshots/TEREZA",
  TONI: "wyzdesign/model-headshots/TONI",
  TOREE: "wyzdesign/model-headshots/TORREE",
  TOSHI: "wyzdesign/model-headshots/TOSHI",
  TYLIN: "wyzdesign/model-headshots/TYLIN",
  VAHN: "wyzdesign/model-headshots/VAHN",
  VERONICA: "wyzdesign/model-headshots/VERONICA",
  WESLEY: "wyzdesign/model-headshots/WESLEY",
  WOLF: "wyzdesign/model-headshots/WOLF",
  XOCHI: "wyzdesign/model-headshots/XOCHI",
};

// ── Photography category covers ──
const PHOTO_COVERS: Record<string, string> = {
  Events: "wyzdesign/photography/Events",
  Outdoors: "wyzdesign/photography/Outdoors",
  Studio: "wyzdesign/photography/Studio",
  Boudoir: "wyzdesign/photography/Boudoir",
  Bodypaint: "wyzdesign/photography/Bodypaint",
  Urbex: "wyzdesign/photography/URBEX",
  Products: "wyzdesign/photography/Products",
   Conceptual: "wyzdesign/photography/Conceptual",
};

/**
 * Returns image URLs for a model album or photography category.
 * @method GET
 * @request Query params: `album` (required), `mode` ("full"|"cover"), `limit` (max 200)
 * @response JSON with album name, image URLs array, and count
 * @auth None
 */
export async function GET(req: NextRequest) {
  const album = (req.nextUrl.searchParams.get("album") || "").trim();
  const mode = req.nextUrl.searchParams.get("mode") || "full";
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") || "30"), 200);

  if (!album) {
    return NextResponse.json({ error: "Album name required" }, { status: 400 });
  }

  const images: string[] = [];

  // 1. Check if it's a model album
  const headshotId = HEADSHOTS[album];
  const minioFolder = MINIO_FOLDER[album];

  if (headshotId || minioFolder) {
    if (headshotId) {
      images.push(cloudinaryUrl(headshotId, 400, 500));
    }
    if (mode !== "cover" && minioFolder) {
      const minioFiles = await listMinioS3(`models/${minioFolder}/`, limit);
      images.push(...minioFiles);
    }
    return NextResponse.json({ album, images, count: images.length, isModel: true });
  }

  // 2. Check if it's a photography category
  const catCover = PHOTO_COVERS[album];
  if (catCover) {
    images.push(cloudinaryUrl(catCover, 800, 600));
    if (mode !== "cover") {
      const catFiles = await listMinioS3(`events/${album.toLowerCase()}/`, limit);
      images.push(...catFiles);
    }
    return NextResponse.json({ album, images, count: images.length });
  }

  // 3. Fallback
  return NextResponse.json({ album, images: [], count: 0 });
}
