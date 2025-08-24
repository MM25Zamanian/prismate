import { Hono } from "hono";
import { handle } from "hono/vercel";
import { modelsApp } from "@/lib/prismate";

// Wrap with Hono
const app = new Hono().route("/api/prismate", modelsApp);

// Next.js API export
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
