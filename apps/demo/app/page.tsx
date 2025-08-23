"use client";

import { x } from "@/lib/prismate";

export default async function Home() {
  return (
    <section>
      <pre>{JSON.stringify(x.getAvailableModels(), null, 2)}</pre>;

      <hr />
      <h1>Users</h1>
      <pre>{JSON.stringify(await x.getModels("user"), null, 2)}</pre>;
    </section>
  );
}
