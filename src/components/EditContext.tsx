"use client";

import { createContext, useState, useEffect, useContext } from "react";

export type EditContextType = {
  editMode: boolean;
  toggleEdit: () => void;
  assignments: Record<string, string>;
  setImage: (slotId: string, path: string) => void;
};

export const EditContext = createContext<EditContextType>({
  editMode: false, toggleEdit: () => {}, assignments: {}, setImage: () => {},
});

let _pickerOpen = false;
let _pickerSlot = "";
let _pickerRefresh: (() => void) | null = null;
export function triggerPicker(imgSrc: string) {
  _pickerSlot = `img-${btoa(imgSrc).substring(0, 20)}`;
  _pickerOpen = true;
  if (_pickerRefresh) _pickerRefresh();
}
export function getPickerState() { return _pickerOpen ? _pickerSlot : null; }
export function clearPicker() { _pickerOpen = false; }
export function setPickerCallback(fn: (() => void) | null) { _pickerRefresh = fn; }

export function EditProvider({ children }: { children: React.ReactNode }) {
  const [editMode, setEditMode] = useState(false);
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  useEffect(() => { try { setAssignments(JSON.parse(localStorage.getItem("wyz_editor_inline")||"{}")); } catch {} }, []);

  const setImage = (slotId: string, path: string) => {
    const next = { ...assignments, [slotId]: path };
    setAssignments(next);
    localStorage.setItem("wyz_editor_inline", JSON.stringify(next));
  };

  useEffect(() => {
    if (!editMode) return;
    const h = (e: MouseEvent) => {
      const img = (e.target as HTMLElement).closest("img");
      if (!img?.src || img.closest("[data-editable]")) return;
      e.preventDefault(); e.stopPropagation();
      triggerPicker(img.src);
    };
    document.addEventListener("click", h, true);
    return () => document.removeEventListener("click", h, true);
  }, [editMode]);

  return (
    <EditContext.Provider value={{ editMode, toggleEdit: () => setEditMode(e => !e), assignments, setImage }}>
      {children}
    </EditContext.Provider>
  );
}

export function useEdit() { return useContext(EditContext); }
