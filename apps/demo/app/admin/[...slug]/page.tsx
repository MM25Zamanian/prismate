"use client";

import { orpc } from "@/lib/prismate";
import { useParams } from "next/navigation";
// Temporarily disable AdminUI import since it's not exported from 'prismate'
// import { AdminUI } from "prismate";

export default function Page() {
  const { slug } = useParams<{ slug: string[] }>();

  // Persian: کامپوننت مدیریت در دسترس نیست.
  return (
    <div className="p-4">
      <p>ماژول مدیریت در دسترس نیست.</p>
      <p className="opacity-80">model: {slug?.[0] ?? "—"}</p>
    </div>
  );
}
