"use client";

import { orpc } from "@/lib/prismate";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data } = useQuery(
    orpc.findMany.queryOptions({
      input: {
        model: "user",
      },
    })
  );

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
