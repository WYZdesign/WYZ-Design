"use client";
import { useState, useCallback } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
interface ImageLightboxProps {
 src: string;
 alt?: string;
 className?: string;
}

export function ImageLightbox({ src, alt = "Image", className = "" }: ImageLightboxProps) {
 const [open, setOpen] = useState(false);
 return (
 <>
 <img src={src} alt={alt} width={400} height={300} className={`cursor-pointer object-cover ${className}`} onClick={() => setOpen(true)} loading="lazy" />
 <Lightbox open={open} close={() => setOpen(false)} slides={[{ src }]} />
 </>
 );
}

interface GalleryLightboxProps {
 images: { src: string; alt?: string }[];
 children: React.ReactNode;
 className?: string;
}

export function GalleryLightbox({ images, children, className = "" }: GalleryLightboxProps) {
 const [index, setIndex] = useState(-1);
 const close = useCallback(() => setIndex(-1), []);

 return (
 <>
 <div className={className} onClick={(e) => {
 const img = (e.target as HTMLElement).closest("img") as HTMLImageElement | null;
 if (img) {
 const idx = images.findIndex(i => i.src === img.src);
 if (idx >= 0) setIndex(idx);
 }
 }}>
 {children}
 </div>
 <Lightbox
 open={index >= 0}
 close={close}
 index={index}
 slides={images.map(i => ({ src: i.src, alt: i.alt }))}
 on={{ view: ({ index: i }) => setIndex(i) }}
 />
 </>
 );
}
