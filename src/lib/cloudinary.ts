import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

export async function uploadToCloudinary(file: Buffer, folder: string, publicId: string): Promise<string | null> {
  try {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, public_id: publicId, resource_type: "image", quality: "auto", fetch_format: "auto" },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error || !result) reject(error ?? new Error("Upload failed"));
          else resolve(result);
        }
      );
      stream.end(file);
    });
    return result.secure_url;
  } catch {
    return null;
  }
}

export function cloudinaryUrl(publicId: string, transforms?: Record<string, string | number | boolean>): string {
  return cloudinary.url(publicId, {
    secure: true,
    quality: "auto",
    fetch_format: "auto",
    ...transforms,
  });
}

export { cloudinary };
