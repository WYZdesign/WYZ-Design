import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Event Photography" };

export default function BookEvents() {
  redirect("/booking");
}
