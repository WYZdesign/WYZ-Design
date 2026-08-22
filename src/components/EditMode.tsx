"use client";

import { useState, useEffect, useRef, createContext, useContext } from "react";
import { FiEdit3, FiX, FiSearch, FiUpload, FiImage } from "react-icons/fi";

interface GDriveFile { name: string; path: string; ext: string; size_mb: number; folder: string; }

type EditContextType = {
 editMode: boolean;
 toggleEdit: () => void;
 assignments: Record<string, string>;
 setImage: (slotId: string, path: string) => void;
};

export const EditContext = createContext<EditContextType>({
 editMode: false, toggleEdit: () => {}, assignments: {}, setImage: () => {}
});

const SECTION_FILTERS: Record<string, string[]> = {
 "photography": ["Pictures", "Models"],
 "models": ["Pictures", "Models"],
 "designs": ["Graphics", "Design"],
 "events": ["Pictures", "Events"],
 "merch": ["Graphics", "WYZ"],
 "hero": ["Pictures"],
 "services": ["Pictures", "Graphics"],
 "branding": ["Graphics"],
 "logo": ["Graphics"],
 "default": ["Pictures", "Graphics"],
};

export function EditProvider({ children }: { children: React.ReactNode }) {
 const [editMode, setEditMode] = useState(false);
 const [assignments, setAssignments] = useState<Record<string, string>>({});
 
 useEffect(() => {
 try { setAssignments(JSON.parse(localStorage.getItem("wyz_editor_inline") || "{}")); } catch {}
 }, []);

 const setImage = (slotId: string, path: string) => {
 const next = { ...assignments, [slotId]: path };
 setAssignments(next);
 localStorage.setItem("wyz_editor_inline", JSON.stringify(next));
 };

 return (
 <EditContext.Provider value={{ editMode, toggleEdit: () => setEditMode(e => !e), assignments, setImage }}>
 {children}
 {editMode && <EditToolbar />}
 </EditContext.Provider>
 );
}

function EditToolbar() {
 const { toggleEdit, assignments } = useContext(EditContext);
 return (
 <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#DF3131] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-4 text-xs font-semibold">
 <span>✏️ Edit Mode</span>
 <span className="opacity-70">{Object.keys(assignments).length} placed</span>
 <button onClick={() => {
 const blob = new Blob([JSON.stringify(assignments, null, 2)], {type: "application/json"});
 const a = document.createElement("a");
 a.href = URL.createObjectURL(blob);
 a.download = "wyz_assignments.json";
 a.click();
 }} className="px-2 py-0.5 bg-white/20 rounded hover:bg-white/30">Export</button>
 <button onClick={toggleEdit} className="px-2 py-0.5 bg-white/20 rounded hover:bg-white/30">Done</button>
 </div>
 );
}

// Hook for editable images
export function useEditableImage(slotId: string, defaultSrc?: string) {
 const { editMode, assignments, setImage } = useContext(EditContext);
 const [pickerOpen, setPickerOpen] = useState(false);
 const [gdrive, setGdrive] = useState<GDriveFile[]>([]);
 const [search, setSearch] = useState("");
 const [page, setPage] = useState(0);
 const [showUpload, setShowUpload] = useState(false);
 const fileRef = useRef<HTMLInputElement>(null);
 const PER = 18;

 const assignedPath = assignments[slotId];
 const src = assignedPath
   ? (assignedPath.startsWith("http://") || assignedPath.startsWith("https://") || assignedPath.startsWith("/"))
     ? assignedPath
     : `/api/media/${assignedPath.replace("G:\\My Drive\\", "").replace(/\\/g, "/")}`
   : defaultSrc;

 // Determine section filter from slot ID
 const sectionKey = Object.entries(SECTION_FILTERS).find(([key]) =>
 slotId.includes(key)
 )?.[0] || "default";
 const folderFilters = SECTION_FILTERS[sectionKey];

 useEffect(() => {
 if (pickerOpen && gdrive.length === 0) {
 fetch("/api/gdrive-index")
 .then(r => r.json())
 .then(f => setGdrive(f))
 .catch(() => {});
 }
 }, [pickerOpen]);

 const filtered = gdrive.filter(f => {
 if (search) return f.name.toLowerCase().includes(search.toLowerCase()) || f.folder.toLowerCase().includes(search.toLowerCase());
 return folderFilters.some(ff => f.path.includes(ff) || f.folder.includes(ff));
 });
 const displayed = filtered.slice(page * PER, (page + 1) * PER);

 const pick = (path: string) => {
 setImage(slotId, path);
 setPickerOpen(false);
 };

 const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const f = e.target.files?.[0];
 if (!f) return;
 const fd = new FormData(); fd.append("file", f);
 const res = await fetch("/api/upload", { method: "POST", body: fd });
 const data = await res.json();
 if (data.url) { setImage(slotId, data.url); }
 setPickerOpen(false);
 e.target.value = "";
 };

 return { src, editMode, pickerOpen, setPickerOpen, showUpload, setShowUpload, fileRef, search, setSearch, page, setPage, filtered, displayed, pick, handleUpload, PER, sectionKey, assignedPath };
}

// Picker modal component
export function ImagePicker({ slotId, onClose }: { slotId: string; onClose: () => void }) {
 const { setImage } = useContext(EditContext);
 const [gdrive, setGdrive] = useState<GDriveFile[]>([]);
 const [search, setSearch] = useState("");
 const [page, setPage] = useState(0);
 const [showUpload, setShowUpload] = useState(false);
 const fileRef = useRef<HTMLInputElement>(null);
 const PER = 18;

 const sectionKey = Object.entries(SECTION_FILTERS).find(([key]) => slotId.includes(key))?.[0] || "default";
 const folderFilters = SECTION_FILTERS[sectionKey];

 useEffect(() => {
 fetch("/api/gdrive-index").then(r => r.json()).then(f => setGdrive(f)).catch(() => {});
 }, []);

 const filtered = gdrive.filter(f => {
 if (search) return f.name.toLowerCase().includes(search.toLowerCase()) || f.folder.toLowerCase().includes(search.toLowerCase());
 return folderFilters.some(ff => f.path.includes(ff) || f.folder.includes(ff));
 });
 const displayed = filtered.slice(page * PER, (page + 1) * PER);

 const pick = (path: string) => { setImage(slotId, path); onClose(); };
 const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const f = e.target.files?.[0];
 if (!f) return;
 const fd = new FormData(); fd.append("file", f);
 const res = await fetch("/api/upload", { method: "POST", body: fd });
 const data = await res.json();
 if (data.url) { setImage(slotId, data.url); }
 onClose();
 };

 return (
 <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
 <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
 <div className="flex items-center justify-between px-4 py-3 border-b">
 <div>
 <h3 className="font-heading font-bold text-sm">Pick Image</h3>
 <p className="text-[13px] text-gray-500">Filtered: {folderFilters.join(", ")}</p>
 </div>
 <div className="flex gap-2">
 <button onClick={() => setShowUpload(!showUpload)} className="px-3 py-1.5 border rounded-lg text-xs hover:bg-gray-50 flex items-center gap-1"><FiUpload className="w-3 h-3" /> Upload</button>
 <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FiX /></button>
 </div>
 </div>

 {showUpload ? (
 <div className="p-8 text-center">
 <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-[#DF3131] rounded-xl p-12 cursor-pointer hover:bg-red-50">
 <FiUpload className="w-10 h-10 text-[#DF3131] mx-auto mb-3" />
 <p className="font-semibold text-[#DF3131]">Click to upload</p>
 <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP, GIF</p>
 </div>
 <button onClick={() => setShowUpload(false)} className="mt-4 text-sm text-gray-500">← Back to browse</button>
 <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
 </div>
 ) : (
 <>
 <div className="px-4 py-2 border-b">
 <div className="relative">
 <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
 <input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
 placeholder="Search..." className="w-full pl-8 pr-3 py-2 border rounded-lg text-sm focus:border-[#DF3131] outline-none" />
 </div>
 </div>
 <div className="flex-1 overflow-y-auto p-4">
 <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
 {displayed.map((f, i) => {
 const rel = f.path.replace("G:\\My Drive\\", "").replace(/\\/g, "/");
 return (
 <button key={i} onClick={() => pick(f.path)} className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#DF3131] hover:shadow-md transition-all">
 <img src={`/api/media/${rel}`} alt="" width={400} height={300} className="w-full h-full object-cover" loading="lazy"
 onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
 </button>
 );
 })}
 </div>
 </div>
 <div className="flex items-center justify-between px-4 py-2 border-t text-xs">
 <span className="text-gray-500">{filtered.length} files</span>
 <div className="flex gap-1">
 <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page===0} className="px-2 py-0.5 border rounded disabled:opacity-30">←</button>
 <span className="px-1 text-gray-500">{page+1}/{Math.max(1,Math.ceil(filtered.length/PER))}</span>
 <button onClick={() => setPage(p => p+1)} disabled={(page+1)*PER>=filtered.length} className="px-2 py-0.5 border rounded disabled:opacity-30">→</button>
 </div>
 </div>
 </>
 )}
 </div>
 </div>
 );
}
