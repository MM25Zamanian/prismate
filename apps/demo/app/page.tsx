"use client";

import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data } = useQuery({
    queryKey: ["demo"],
    queryFn: async () => [{ id: "1", name: "Demo User", email: "demo@example.com" }],
  });

  return (
    <section className="p-4">
      <h1 className="text-xl font-semibold">PWA + Serwist</h1>
      <p className="opacity-80 mb-2">Try installing the app and testing offline.</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </section>
  );
}