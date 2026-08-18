"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  isFolder: boolean;
  size: number | null;
  webViewLink: string;
  downloadLink: string;
  createdTime: string;
  fileExtension: string | null;
  iconLink: string | null;
  thumbnailLink: string | null;
}

type ViewMode = "grid" | "list";
type SortMode = "name" | "date" | "size";

const FILE_ICONS: Record<string, string> = {
  mp4: "🎬", mov: "🎬", webm: "🎬", avi: "🎬",
  jpg: "📸", jpeg: "📸", png: "📸", webp: "📸", gif: "📸", tiff: "📸", raw: "📸", cr2: "📸", nef: "📸", dng: "📸",
  mp3: "🎵", wav: "🎵", flac: "🎵", m4a: "🎵",
  pdf: "📄", doc: "📝", docx: "📝", xls: "📊", xlsx: "📊", ppt: "📽️", pptx: "📽️",
  zip: "📦", rar: "📦", "7z": "📦", tar: "📦", gz: "📦",
  txt: "📄", csv: "📊", json: "📋", xml: "📋", html: "🌐", css: "🎨", js: "⚡",
  aep: "🎞️", psd: "🎨", ai: "🎨", lrtemplate: "🌈", xmp: "🌈",
};

const MIME_ICONS: Record<string, string> = {
  "video": "🎬",
  "image": "📸",
  "audio": "🎵",
  "pdf": "📄",
  "text": "📄",
};

function getIcon(file: DriveFile): string {
  if (file.isFolder) return "📁";
  const ext = file.fileExtension?.toLowerCase();
  if (ext && FILE_ICONS[ext]) return FILE_ICONS[ext];
  const mime = file.mimeType.split("/")[0];
  if (MIME_ICONS[mime]) return MIME_ICONS[mime];
  return "📄";
}

function formatSize(bytes: number | null): string {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; }
  return `${size.toFixed(1)} ${units[i]}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

function getFileTypeLabel(mimeType: string): string {
  if (mimeType === "application/vnd.google-apps.folder") return "Folder";
  const type = mimeType.split("/")[0];
  const labels: Record<string, string> = { video: "Video", image: "Image", audio: "Audio", text: "Document", application: "File" };
  return labels[type] || "File";
}

export default function FDDriveBrowser() {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<{ id: string; name: string }[]>([{ id: "1x4Ya8VMdtt8wfG8jil-V_TxRuaEWht0T", name: "FD Events" }]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortMode, setSortMode] = useState<SortMode>("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchFolder = useCallback(async (folderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/fd/drive?folder=${folderId}`);
      const data = await r.json();
      if (data.error) { setError(data.error); if (data.hint) setError(`${data.error} - ${data.hint}`); }
      else { setFiles(data.files || []); }
    } catch {
      setError("Failed to load files. API may be offline.");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchFolder(currentFolder || "1x4Ya8VMdtt8wfG8jil-V_TxRuaEWht0T"); }, [currentFolder, fetchFolder]);

  const navigateTo = (file: DriveFile) => {
    if (!file.isFolder) return;
    setCurrentFolder(file.id);
    setFolderPath(prev => [...prev, { id: file.id, name: file.name }]);
  };

  const navigateUp = () => {
    if (folderPath.length <= 1) return;
    const newPath = folderPath.slice(0, -1);
    setFolderPath(newPath);
    setCurrentFolder(newPath[newPath.length - 1].id);
  };

  const sortedFiles = [...files]
    .filter(f => {
      if (!searchQuery) return true;
      return f.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;
      const dir = sortMode === "date" ? -1 : 1;
      switch (sortMode) {
        case "name": return dir * a.name.localeCompare(b.name);
        case "date": return dir * (new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime());
        case "size": return dir * ((a.size || 0) - (b.size || 0));
        default: return 0;
      }
    });

  const videoFiles = sortedFiles.filter(f => !f.isFolder && f.mimeType.startsWith("video/"));
  const imageFiles = sortedFiles.filter(f => !f.isFolder && f.mimeType.startsWith("image/"));
  const otherFiles = sortedFiles.filter(f => !f.isFolder && !f.mimeType.startsWith("video/") && !f.mimeType.startsWith("image/"));
  const folders = sortedFiles.filter(f => f.isFolder);

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
        <div className="flex items-center gap-2">
          <button onClick={navigateUp} disabled={folderPath.length <= 1}
            className="px-3 py-1.5 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-zinc-700 transition-all">
            ← Back
          </button>
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            {folderPath.map((p, i) => (
              <span key={p.id} className="flex items-center gap-1">
                {i > 0 && <span className="text-zinc-700">/</span>}
                <button onClick={() => { setCurrentFolder(p.id); setFolderPath(folderPath.slice(0, i + 1)); }}
                  className="hover:text-white transition-colors">{p.name}</button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="bg-black border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-400 placeholder-zinc-700 focus:outline-none focus:border-zinc-600 w-40" />
          <select value={sortMode} onChange={e => setSortMode(e.target.value as SortMode)}
            className="bg-black border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-400 focus:outline-none focus:border-zinc-600">
            <option value="name">Name</option>
            <option value="date">Date</option>
            <option value="size">Size</option>
          </select>
          <div className="flex border border-zinc-800 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode("grid")}
              className={`px-2.5 py-1.5 text-xs transition-all ${viewMode === "grid" ? "bg-zinc-800 text-white" : "bg-black text-zinc-500 hover:text-zinc-300"}`}>Grid</button>
            <button onClick={() => setViewMode("list")}
              className={`px-2.5 py-1.5 text-xs transition-all ${viewMode === "list" ? "bg-zinc-800 text-white" : "bg-black text-zinc-500 hover:text-zinc-300"}`}>List</button>
          </div>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex gap-1.5">
            {[0, 150, 300].map(d => <span key={d} className="w-2.5 h-2.5 bg-[#DF3131] rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
          </div>
        </div>
      )}

      {error && (
        <div className="py-16 text-center">
          <div className="text-4xl mb-4">📁</div>
          <p className="text-zinc-500 text-sm">{error}</p>
          {error.includes("GOOGLE_DRIVE_API_KEY") && (
            <div className="mt-4 max-w-lg mx-auto">
              <p className="text-zinc-600 text-xs mb-3">The file browser needs a Google API key. If you have access to the server:</p>
              <ol className="text-left text-xs text-zinc-600 space-y-1 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                <li>1. Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google Cloud Console</a></li>
                <li>2. Create or select a project</li>
                <li>3. Enable the Google Drive API</li>
                <li>4. Create an API key (restrict to Drive API)</li>
                <li>5. Add to <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">.env.local</code>: <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">GOOGLE_DRIVE_API_KEY=your_key</code></li>
                <li>6. Redeploy to Vercel</li>
              </ol>
            </div>
          )}
        </div>
      )}

      {/* ── Folders ── */}
      {!loading && !error && folders.length > 0 && (
        <div className="mb-8">
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Folders</h4>
          <div className={viewMode === "grid"
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
            : "space-y-1"}>
            {folders.map(f => (
              <button key={f.id} onClick={() => navigateTo(f)}
                className={viewMode === "grid"
                  ? "group p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/60 transition-all text-left"
                  : "group flex items-center gap-3 p-2.5 rounded-lg hover:bg-zinc-900/60 transition-all text-left w-full border border-transparent hover:border-zinc-800"
                }>
                {viewMode === "grid" ? (
                  <>
                    <div className="text-3xl mb-2">📁</div>
                    <p className="text-sm text-zinc-300 group-hover:text-white truncate transition-colors">{f.name}</p>
                  </>
                ) : (
                  <>
                    <span className="text-lg shrink-0">📁</span>
                    <span className="text-sm text-zinc-300 group-hover:text-white truncate transition-colors">{f.name}</span>
                    <span className="text-xs text-zinc-600 ml-auto">{formatDate(f.createdTime)}</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Clips / Video ── */}
      {!loading && !error && videoFiles.length > 0 && (
        <div className="mb-8">
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
            <span className="mr-2">🎬</span>Clips &amp; Videos ({videoFiles.length})
          </h4>
          <div className={viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
            : "space-y-1"}>
            {videoFiles.map(f => (
              <a key={f.id} href={f.webViewLink} target="_blank" rel="noopener noreferrer"
                className={viewMode === "grid"
                  ? "group relative block rounded-xl overflow-hidden bg-zinc-900/60 border border-zinc-800 hover:border-zinc-600 transition-all"
                  : "group flex items-center gap-3 p-2.5 rounded-lg hover:bg-zinc-900/60 transition-all border border-transparent hover:border-zinc-800"
                }>
                {viewMode === "grid" ? (
                  <>
                    <div className="aspect-video bg-zinc-800 flex items-center justify-center">
                      {f.thumbnailLink
                        ? <Image src={f.thumbnailLink} alt={f.name} fill className="w-full h-full object-cover" priority />
                        : <span className="text-3xl">🎬</span>
                      }
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                        <div className="w-12 h-12 rounded-full bg-[#DF3131]/90 flex items-center justify-center">▶</div>
                      </div>
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs text-zinc-300 group-hover:text-white truncate">{f.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-zinc-600">{formatSize(f.size)}</span>
                        <span className="text-xs text-zinc-600">{formatDate(f.createdTime)}</span>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <a href={f.downloadLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                        className="px-2 py-1 text-xs rounded bg-black/70 text-white hover:bg-[#DF3131] transition-all"
                        title="Download">⬇</a>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-lg shrink-0">🎬</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-300 group-hover:text-white truncate">{f.name}</p>
                      <p className="text-xs text-zinc-600">{getFileTypeLabel(f.mimeType)}</p>
                    </div>
                    <span className="text-xs text-zinc-600">{formatSize(f.size)}</span>
                    <span className="text-xs text-zinc-600 w-20 text-right">{formatDate(f.createdTime)}</span>
                    <a href={f.downloadLink} target="_blank" rel="noopener noreferrer"
                      className="px-2.5 py-1 text-xs rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all ml-2">⬇</a>
                    <a href={f.webViewLink} target="_blank" rel="noopener noreferrer"
                      className="px-2.5 py-1 text-xs rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all">View</a>
                  </>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── Pics / Images ── */}
      {!loading && !error && imageFiles.length > 0 && (
        <div className="mb-8">
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
            <span className="mr-2">📸</span>Photos &amp; Images ({imageFiles.length})
          </h4>
          <div className={viewMode === "grid"
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
            : "space-y-1"}>
            {imageFiles.map(f => (
              <button key={f.id} onClick={() => { setSelectedFile(f); setImagePreview(f.webViewLink); }}
                className={viewMode === "grid"
                  ? "group relative block rounded-xl overflow-hidden bg-zinc-900/60 border border-zinc-800 hover:border-zinc-600 transition-all text-left"
                  : "group flex items-center gap-3 p-2.5 rounded-lg hover:bg-zinc-900/60 transition-all border border-transparent hover:border-zinc-800 text-left w-full"
                }>
                {viewMode === "grid" ? (
                  <>
                    <div className="aspect-square bg-zinc-800 overflow-hidden">
                      {f.thumbnailLink
                        ? <Image src={f.thumbnailLink} alt={f.name} fill className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" priority />
                        : <div className="w-full h-full flex items-center justify-center text-3xl">📸</div>
                      }
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs text-zinc-300 group-hover:text-white truncate">{f.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-zinc-600">{formatSize(f.size)}</span>
                        <span className="text-xs text-zinc-600">{formatDate(f.createdTime)}</span>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <a href={f.downloadLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                        className="px-2 py-1 text-xs rounded bg-black/70 text-white hover:bg-[#DF3131] transition-all">⬇</a>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-lg shrink-0">📸</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-300 group-hover:text-white truncate">{f.name}</p>
                      <p className="text-xs text-zinc-600">{getFileTypeLabel(f.mimeType)}</p>
                    </div>
                    <span className="text-xs text-zinc-600">{formatSize(f.size)}</span>
                    <span className="text-xs text-zinc-600 w-20 text-right">{formatDate(f.createdTime)}</span>
                    <div className="flex gap-1 ml-2">
                      <button onClick={() => { setSelectedFile(f); setImagePreview(f.webViewLink); }}
                        className="px-2.5 py-1 text-xs rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all">View</button>
                      <a href={f.downloadLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                        className="px-2.5 py-1 text-xs rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all">⬇</a>
                    </div>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Other Files ── */}
      {!loading && !error && otherFiles.length > 0 && (
        <div className="mb-8">
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
            <span className="mr-2">📄</span>Documents &amp; Other ({otherFiles.length})
          </h4>
          <div className={viewMode === "grid"
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
            : "space-y-1"}>
            {otherFiles.map(f => (
              <a key={f.id} href={f.webViewLink} target="_blank" rel="noopener noreferrer"
                className={viewMode === "grid"
                  ? "group p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/60 transition-all block"
                  : "group flex items-center gap-3 p-2.5 rounded-lg hover:bg-zinc-900/60 transition-all border border-transparent hover:border-zinc-800"
                }>
                {viewMode === "grid" ? (
                  <>
                    <div className="text-3xl mb-2">{getIcon(f)}</div>
                    <p className="text-sm text-zinc-300 group-hover:text-white truncate">{f.name}</p>
                    <p className="text-xs text-zinc-600 mt-1">{formatSize(f.size)}</p>
                  </>
                ) : (
                  <>
                    <span className="text-lg shrink-0">{getIcon(f)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-300 group-hover:text-white truncate">{f.name}</p>
                      <p className="text-xs text-zinc-600">{getFileTypeLabel(f.mimeType)}</p>
                    </div>
                    <span className="text-xs text-zinc-600">{formatSize(f.size)}</span>
                    <span className="text-xs text-zinc-600 w-20 text-right">{formatDate(f.createdTime)}</span>
                    <a href={f.downloadLink} target="_blank" rel="noopener noreferrer"
                      className="px-2.5 py-1 text-xs rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all ml-2">⬇</a>
                  </>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && files.length === 0 && (
        <div className="py-16 text-center">
          <div className="text-4xl mb-4">📂</div>
          <p className="text-zinc-500">This folder is empty</p>
        </div>
      )}

      {/* Image lightbox */}
      <AnimatePresence>
        {imagePreview && selectedFile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setImagePreview(null)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-5xl max-h-[90vh] w-full">
              <img src={imagePreview} alt={selectedFile.name} className="w-full h-full object-contain rounded-lg"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                <p className="text-white text-sm font-medium truncate">{selectedFile.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-zinc-400">{formatSize(selectedFile.size)}</span>
                  <span className="text-xs text-zinc-400">{formatDateTime(selectedFile.createdTime)}</span>
                </div>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <a href={selectedFile.downloadLink} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="px-3 py-1.5 text-xs rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all">Download</a>
                <button onClick={() => setImagePreview(null)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
