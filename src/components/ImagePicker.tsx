"use client";

import { useState, useRef, useEffect } from "react";
import { FiUpload, FiFolder, FiX } from "react-icons/fi";
import { useModalA11y } from "@/hooks/useModalA11y";

let _open = false; let _slotId = ""; let _albumMode = false;
let _callback: ((v: string) => void) | null = null;

export function openImagePicker(slotId: string, onPick: (v: string) => void) {
  _slotId = slotId; _open = true; _albumMode = false; _callback = onPick;
  window.dispatchEvent(new Event("wyz-picker-open"));
}
export function openAlbumPicker(slotId: string, onPick: (v: string) => void) {
  _slotId = slotId; _open = true; _albumMode = true; _callback = onPick;
  window.dispatchEvent(new Event("wyz-picker-open"));
}

export function GlobalImagePicker() {
  const [open, setOpen] = useState(false);
  const [albumMode, setAlbumMode] = useState(false);
  const [albumPath, setAlbumPath] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOpen = () => {
      setOpen(true); setAlbumMode(_albumMode); setAlbumPath(""); setError("");
    };
    window.addEventListener("wyz-picker-open", handleOpen);
    return () => window.removeEventListener("wyz-picker-open", handleOpen);
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setError("");
    const fd = new FormData(); fd.append("file", f);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        e.target.value = "";
        setError(`Upload failed (${res.status}${res.statusText ? ` ${res.statusText}` : ""})`);
        return;
      }
      const data = await res.json();
      if (data.url) {
        if (_callback) _callback(data.url);
        _open = false; setOpen(false);
      } else {
        e.target.value = "";
        setError("Upload failed — server returned no URL");
      }
    } catch (err) {
      e.target.value = "";
      setError("Upload failed — network error");
      console.error("ImagePicker upload error", err);
    }
  };

  const setAlbum = () => {
    if (_callback && albumPath.trim()) {
      _callback(albumPath.trim());
      _open = false; setOpen(false);
    }
  };

  const close = () => { setOpen(false); _open = false; setError(""); };

  useModalA11y(close, { lockScroll: true, active: open });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={close} style={{ animation: "wzFadeIn 0.2s ease-out both" }} role="dialog" aria-modal="true" aria-label="Image picker">
      <div className="bg-white dark:bg-[#252528] rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()} style={{ animation: "wzScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-lg">{albumMode ? "Set Album Folder" : "Upload Image"}</h3>
          <button onClick={close} className="text-[#666] dark:text-white/70 hover:text-gray-600" aria-label="Close"><FiX className="w-5 h-5" /></button>
        </div>

        {albumMode ? (
          <div>
            <p className="text-sm text-[#666] dark:text-white/70 mb-4">Paste the folder path for this album:</p>
            <input value={albumPath} onChange={e => setAlbumPath(e.target.value)}
              placeholder="e.g. Pictures/Models (All)/ADRIENNE"
              className="w-full px-4 py-3 border border-[#E2E2E2] dark:border-[#444] rounded-lg text-sm focus:border-[#DF3131] outline-none mb-3" />
            <p className="text-xs text-[#666] dark:text-white/70 mb-4">Example paths:<br/>Pictures/Models (All)/ADRIENNE<br/>Pictures/Events/BONFIRE<br/>Graphics/Random Projects/WYZ Design</p>
            <button onClick={setAlbum} disabled={!albumPath.trim()}
              className="w-full py-3 bg-[#DF3131] text-white font-semibold rounded-lg hover:bg-[#B82020] disabled:opacity-40 transition-colors">
              <FiFolder className="inline mr-2" />Set Folder
            </button>
          </div>
        ) : (
          <div>
            <div onClick={() => fileRef.current?.click()}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileRef.current?.click(); } }}
              role="button"
              tabIndex={0}
              aria-label="Upload image file"
              className="border-2 border-dashed border-[#DF3131] rounded-xl p-16 text-center cursor-pointer hover:bg-red-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DF3131]">
              <FiUpload className="w-12 h-12 text-[#DF3131] mx-auto mb-3" />
              <p className="font-semibold text-[#DF3131] text-lg">Click to Upload</p>
              <p className="text-sm text-[#666] dark:text-white/70 mt-1">JPG, PNG, WebP, GIF</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            {error && <p className="mt-3 text-sm text-[#DF3131]" role="alert">{error}</p>}
          </div>
        )}

        {/* Album mode toggle */}
        <button onClick={() => { setAlbumMode(!albumMode); setAlbumPath(""); }}
          className="mt-4 w-full py-2 text-sm text-[#666] dark:text-white/70 hover:text-[#DF3131] transition-colors">
          <FiFolder className="inline mr-1" />
          {albumMode ? "Upload image instead" : "Set folder path instead"}
        </button>
      </div>
    </div>
  );
}
