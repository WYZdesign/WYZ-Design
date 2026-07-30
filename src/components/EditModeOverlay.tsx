"use client";

import { useEffect, useState, useRef } from "react";
import { FiUpload, FiFolder } from "react-icons/fi";

const STORAGE_KEY = "wyz_site_images";

export default function EditModeOverlay() {
  const [editMode, setEditMode] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<"image" | "folder">("image");
  const [folderPath, setFolderPath] = useState("");
  const [activeImgSrc, setActiveImgSrc] = useState("");
  const [activeImgEl, setActiveImgEl] = useState<HTMLImageElement | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Apply saved images on page load
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      Object.entries(saved).forEach(([slotId, value]: [string, any]) => {
        const el = document.querySelector(`[data-slot="${slotId}"]`) as HTMLElement;
        if (!el) return;
        if (value.type === "image") {
          const img = el.querySelector("img") || el;
          if (img instanceof HTMLImageElement) img.src = value.src;
          else { el.style.backgroundImage = `url(${value.src})`; el.style.backgroundSize = "cover"; el.style.backgroundPosition = "center"; }
        }
      });
    } catch (e) { console.warn("[edit-mode-overlay] Failed to restore saved images", e); }
  }, []);

  // Set up edit mode click interception
  useEffect(() => {
    if (!editMode) return;

    const handleClick = (e: MouseEvent) => {
      const img = (e.target as HTMLElement).closest("img");
      if (!img || !img.src) return;
      if (img.closest("[data-no-edit]")) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      setActiveImgSrc(img.src);
      setActiveImgEl(img);
      setPickerOpen(true);
      setPickerMode("image");
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [editMode]);

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const url = URL.createObjectURL(f);
    if (activeImgEl) {
      activeImgEl.src = url;
      const slotId = `img-${btoa(activeImgSrc).substring(0, 16)}`;
      activeImgEl.parentElement?.setAttribute("data-slot", slotId);
    }
    saveToStorage({ type: "image", src: url, originalSrc: activeImgSrc });
    setPickerOpen(false);
  };

  const setFolder = () => {
    if (!folderPath.trim()) return;
    if (activeImgEl) {
      activeImgEl.setAttribute("data-folder", folderPath.trim());
      const slotId = `img-${btoa(activeImgSrc).substring(0, 16)}`;
      activeImgEl.parentElement?.setAttribute("data-slot", slotId);
    }
    saveToStorage({ type: "folder", path: folderPath.trim(), originalSrc: activeImgSrc });
    setPickerOpen(false);
    setFolderPath("");
  };

  const saveToStorage = (value: any) => {
    try {
      const slotId = `img-${btoa(activeImgSrc).substring(0, 16)}`;
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      saved[slotId] = value;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch (e) { console.warn("[edit-mode-overlay] Failed to save to localStorage", e); }
  };

  return (
    <>
      <button onClick={() => setEditMode(!editMode)}
        className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full text-base font-semibold shadow-xl transition-all ${
          editMode ? "bg-[#DF3131] text-white" : "bg-white border-2 border-[#DF3131] text-[#DF3131] hover:bg-red-50"}`}>
        {editMode ? "✓ Done" : "✏️ Edit Images"}
      </button>

      {editMode && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 bg-[#DF3131] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg animate-pulse pointer-events-none">
          Click any image on the page to replace it
        </div>
      )}

      {/* Picker modal */}
      {pickerOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={() => setPickerOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading font-bold text-xl">Replace Image</h3>
              <button onClick={() => setPickerOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <button onClick={() => setPickerMode("image")}
                className={`p-4 rounded-xl border-2 text-center transition-all ${pickerMode === "image" ? "border-[#DF3131] bg-red-50" : "border-[#E2E2E2] hover:border-gray-400"}`}>
                <FiUpload className={`w-6 h-6 mx-auto mb-2 ${pickerMode === "image" ? "text-[#DF3131]" : "text-gray-400"}`} />
                <p className="text-sm font-semibold">Upload Image</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP</p>
              </button>
              <button onClick={() => setPickerMode("folder")}
                className={`p-4 rounded-xl border-2 text-center transition-all ${pickerMode === "folder" ? "border-[#DF3131] bg-red-50" : "border-[#E2E2E2] hover:border-gray-400"}`}>
                <FiFolder className={`w-6 h-6 mx-auto mb-2 ${pickerMode === "folder" ? "text-[#DF3131]" : "text-gray-400"}`} />
                <p className="text-sm font-semibold">Folder Path</p>
                <p className="text-xs text-gray-400 mt-1">Album/Gallery</p>
              </button>
            </div>

            {pickerMode === "image" ? (
              <div>
                <div onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-[#DF3131] rounded-xl p-12 text-center cursor-pointer hover:bg-red-50 transition-colors">
                  <FiUpload className="w-10 h-10 text-[#DF3131] mx-auto mb-2" />
                  <p className="font-semibold text-[#DF3131]">Click to browse files</p>
                  <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={uploadImage} className="hidden" />
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-3">Paste the folder path for this album or gallery:</p>
                <input value={folderPath} onChange={e => setFolderPath(e.target.value)}
                  placeholder="Pictures/Models (All)/ADRIENNE"
                  className="w-full px-4 py-3 border border-[#E2E2E2] rounded-lg text-base focus:border-[#DF3131] outline-none mb-2" />
                <p className="text-xs text-gray-400 mb-4">Example: Pictures/Events/BONFIRE</p>
                <button onClick={setFolder} disabled={!folderPath.trim()}
                  className="w-full py-3 bg-[#DF3131] text-white font-semibold rounded-lg hover:bg-[#B82020] disabled:opacity-40 transition-colors text-base">
                  <FiFolder className="inline mr-2" />Set Folder
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
