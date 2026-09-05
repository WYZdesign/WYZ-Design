import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Photo Retouching" };

export default function BookRetouching() {
  redirect("/booking");
}
