"use client";

import { useEffect, useState, useRef } from "react";
import { sanitizeHtml } from "@/lib/dompurify";

interface GdriveFile {
  name: string;
  path: string;
  folder: string;
}

export default function PageRenderer() {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSlot, setPickerSlot] = useState("");
  const [gdrive, setGdrive] = useState<GdriveFile[]>([]);
  const [gdriveFilter, setGdriveFilter] = useState("Pictures");
  const [gdriveSearch, setGdriveSearch] = useState("");
  const [gdrivePage, setGdrivePage] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const PER = 18;

  useEffect(() => {
  const p = window.location.pathname.replace("/", "") || "home";
  document.title = getTitle(p);
 fetch(`/api/pages?page=${p}`).then(r => r.json()).then(d => {
 if (d.exists) { setHtml(d.html); setLoading(false); }
 else if (d.html) {
 fetch("/api/pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ page: p, html: d.html }) });
 setHtml(d.html); setLoading(false);
 } else { setLoading(false); }
 }).catch(() => setLoading(false));
 }, []);

 // Click handler for edit mode
 useEffect(() => {
 if (!editMode || !contentRef.current) return;
 const imgNodes = contentRef.current.querySelectorAll("img");
 imgNodes.forEach(img => {
 img.style.cursor = "pointer";
 img.style.position = "relative";
 img.onclick = (e) => {
 e.preventDefault();
 const src = img.getAttribute("src") || "";
 setPickerSlot(src);
 setPickerOpen(true);
 loadGdrive();
 };
 });
 }, [editMode, html]);

 const loadGdrive = () => {
 if (gdrive.length > 0) return;
 fetch(`/api/gdrive-index?folder=${gdriveFilter}&limit=200`)
 .then(r => r.json()).then(d => setGdrive(d.files || d)).catch(() => {});
 };

 const filtered = gdrive.filter((f: GdriveFile) => {
 if (!gdriveSearch) return true;
 const q = gdriveSearch.toLowerCase();
 return f.name.toLowerCase().includes(q) || f.folder.toLowerCase().includes(q);
 });
 const displayed = filtered.slice(gdrivePage * PER, (gdrivePage + 1) * PER);

 const replaceImage = (gdrivePath: string) => {
 if (!contentRef.current) return;
 const imgNodes = contentRef.current.querySelectorAll("img");
 imgNodes.forEach(img => {
 if (img.getAttribute("src") === pickerSlot) {
 const rel = gdrivePath.replace("G:\\My Drive\\", "").replace(/\\/g, "/");
 img.setAttribute("src", `/api/media/${rel}`);
 img.setAttribute("data-gdrive", gdrivePath);
 }
 });
 setPickerOpen(false);
 };

 const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
 const f = e.target.files?.[0];
 if (!f) return;
 const url = URL.createObjectURL(f);
 if (!contentRef.current) return;
 const imgNodes = contentRef.current.querySelectorAll("img");
 imgNodes.forEach(img => {
 if (img.getAttribute("src") === pickerSlot) {
 img.setAttribute("src", url);
 img.setAttribute("data-upload", "true");
 }
 });
 setPickerOpen(false);
 setShowUpload(false);
 };

 if (loading) return <div className="text-center py-20 text-[#666] text-lg">Loading...</div>;

 return (
 <div>
 {/* Edit toggle */}
 <div className="fixed top-20 right-4 z-40 flex gap-2">
 <button onClick={() => setEditMode(!editMode)} className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg transition-colors ${editMode ? "bg-[#DF3131] text-white" : "bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] text-gray-600 dark:text-white/70 hover:border-[#DF3131]"}`}>
 {editMode ? "Done Editing" : "✏️ Edit Images"}
 </button>
 </div>

 {/* Page content */}
 <div ref={contentRef} dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />

 {/* Edit mode indicator */}
 {editMode && (
 <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#DF3131] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg">
 Click any image to replace it
 </div>
 )}

 {/* Image picker overlay */}
 {pickerOpen && (
 <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => { setPickerOpen(false); setShowUpload(false); }}>
 <div className="bg-white dark:bg-[#252528] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
 <div className="flex items-center justify-between px-4 py-3 border-b dark:border-[#444]">
 <div>
 <h3 className="font-heading font-bold text-sm">Replace Image</h3>
 <div className="flex gap-1 mt-1">
 {["Pictures", "Graphics", "Video"].map(f => (
 <button key={f} onClick={() => { setGdriveFilter(f); setGdrivePage(0); setGdrive([]); loadGdrive(); }}
  className={`text-[13px] px-2 py-0.5 rounded ${gdriveFilter===f?"bg-[#DF3131] text-white":"bg-gray-100 dark:bg-[#1C1C1E]"}`}>{f}</button>
 ))}
 </div>
 </div>
 <div className="flex gap-2">
 <button onClick={() => setShowUpload(!showUpload)} className="px-3 py-1.5 border dark:border-[#444] rounded-lg text-xs hover:bg-gray-50 dark:hover:bg-[#1C1C1E]">Upload</button>
 <button onClick={() => { setPickerOpen(false); setShowUpload(false); }} className="hover:text-gray-600 dark:hover:text-white/70" aria-label="Close">✕</button>
 </div>
 </div>

 {showUpload ? (
 <div className="p-8 text-center">
 <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-[#DF3131] rounded-xl p-12 cursor-pointer hover:bg-red-50">
 <span className="text-4xl block mb-3">📁</span>
 <p className="font-semibold text-[#DF3131]">Click to Upload</p>
 <p className="text-xs text-[#666] dark:text-white/70 mt-1">JPG, PNG, WebP, GIF</p>
 </div>
 <button onClick={() => setShowUpload(false)} className="mt-4 text-sm text-[#666] dark:text-white/70">← Back to GDrive</button>
 <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
 </div>
 ) : (
 <>
 <div className="px-4 py-2 border-b dark:border-[#444]">
 <input value={gdriveSearch} onChange={e => { setGdriveSearch(e.target.value); setGdrivePage(0); }}
   placeholder="Search your GDrive..." aria-label="Search" className="w-full px-3 py-2 border dark:border-[#444] rounded-lg text-sm focus:border-[#DF3131] outline-none" />
 </div>
 <div className="flex-1 overflow-y-auto p-4">
 <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
  {displayed.map((f: GdriveFile, i: number) => {
 const rel = f.path.replace("G:\\My Drive\\", "").replace(/\\/g, "/");
 return (
 <button key={i} onClick={() => replaceImage(f.path)}
  className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-[#444] hover:border-[#DF3131] hover:shadow-md transition-all">
 <img src={`/api/media/${rel}`} alt="Page content image" width={400} height={300} className="w-full h-full object-cover" loading="lazy"
 onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
 </button>
 );
 })}
 </div>
 </div>
 <div className="flex items-center justify-between px-4 py-2 border-t dark:border-[#444] text-xs">
 <span className="text-[#666] dark:text-white/70">{filtered.length} files</span>
 <div className="flex gap-1">
 <button onClick={() => setGdrivePage(p => Math.max(0, p-1))} disabled={gdrivePage===0} className="px-2 py-0.5 border dark:border-[#444] rounded disabled:opacity-30">←</button>
 <span className="px-1 text-[#666] dark:text-white/70">{gdrivePage+1}/{Math.max(1,Math.ceil(filtered.length/PER))}</span>
 <button onClick={() => setGdrivePage(p => p+1)} disabled={(gdrivePage+1)*PER>=filtered.length} className="px-2 py-0.5 border dark:border-[#444] rounded disabled:opacity-30">→</button>
 </div>
 </div>
 </>
 )}
 </div>
 </div>
 )}
 </div>
 );
}

function getTitle(p: string): string {
 const t: Record<string, string> = {
 home: "Creative Agency | WYZ Design™ | Your One Stop Shop",
 photography: "P H O T O G R A P H Y | WYZ Design™",
 designs: "D E S I G N S | WYZ Design™",
 events: "E V E N T S | WYZ Design™",
 services: "S E R V I C E S | WYZ Design™",
 plans: "P L A N S + P R I C I N G | WYZ Design™",
 };
 return t[p] || `${p.toUpperCase()} | WYZ Design™`;
}
