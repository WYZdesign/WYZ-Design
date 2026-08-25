"use client";

import { useState, useRef } from "react";
import { FiUpload, FiFolder, FiX } from "react-icons/fi";

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
  const fileRef = useRef<HTMLInputElement>(null);

  if (typeof window !== "undefined") {
    window.addEventListener("wyz-picker-open", () => {
      setOpen(true); setAlbumMode(_albumMode); setAlbumPath("");
    });
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const fd = new FormData(); fd.append("file", f);
   const res = await fetch("/api/upload", { method: "POST", body: fd });
   if (!res.ok) return;
   const data = await res.json();
   if (_callback && data.url) _callback(data.url);
    _open = false; setOpen(false);
  };

  const setAlbum = () => {
    if (_callback && albumPath.trim()) {
      _callback(albumPath.trim());
      _open = false; setOpen(false);
    }
  };

  const close = () => { setOpen(false); _open = false; };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={close}>
      <div className="bg-white dark:bg-[#252528] rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
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
              className="border-2 border-dashed border-[#DF3131] rounded-xl p-16 text-center cursor-pointer hover:bg-red-50 transition-colors">
              <FiUpload className="w-12 h-12 text-[#DF3131] mx-auto mb-3" />
              <p className="font-semibold text-[#DF3131] text-lg">Click to Upload</p>
              <p className="text-sm text-[#666] dark:text-white/70 mt-1">JPG, PNG, WebP, GIF</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
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
