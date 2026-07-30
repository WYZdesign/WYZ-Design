import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Photo Retouching | WYZ Design" };

export default function BookRetouching() {
  redirect("/booking");
}
