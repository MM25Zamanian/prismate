"use client";

import { orpc } from "@/lib/prismate";
import { useParams } from "next/navigation";
import { AdminUI } from "prismate";

export default function Page() {
  const { slug } = useParams<{ slug: string[] }>();

  return <AdminUI orpc={orpc} model={slug?.[0]} />;
}
