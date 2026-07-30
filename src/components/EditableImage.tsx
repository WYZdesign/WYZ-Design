"use client";

import { useState, useContext } from "react";
import { EditContext, ImagePicker } from "@/components/EditMode";

interface Props {
 slotId: string;
 defaultSrc?: string;
 className?: string;
 style?: React.CSSProperties;
 alt?: string;
 children?: React.ReactNode;
}

export default function EditableImage({ slotId, defaultSrc, className, style, alt, children }: Props) {
 const { editMode, assignments } = useContext(EditContext);
 const [pickerOpen, setPickerOpen] = useState(false);

 const assignedPath = assignments[slotId];
 const src = assignedPath
 ? assignedPath.startsWith("__upload__")
 ? assignedPath.replace("__upload__", "")
 : `/api/media/${assignedPath.replace("G:\\My Drive\\", "").replace(/\\/g, "/")}`
 : defaultSrc;

 return (
 <>
 <div className={`relative group ${editMode ? "cursor-pointer" : ""} ${className || ""}`}
 style={style}
 onClick={() => editMode && setPickerOpen(true)}>
 {src ? (
 <img src={src} alt={alt || "Image"} width={400} height={300} className="w-full h-full object-cover"
 onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
 ) : (
 children
 )}
 {editMode && (
 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
 <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 bg-black/50 px-3 py-1.5 rounded-full transition-opacity">
 {src ? "Change Image" : "Add Image"}
 </span>
 </div>
 )}
 </div>
 {pickerOpen && <ImagePicker slotId={slotId} onClose={() => setPickerOpen(false)} />}
 </>
 );
}
