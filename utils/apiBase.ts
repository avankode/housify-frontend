const isProduction = process.env.NODE_ENV === "production";

export const API_BASE = isProduction
  ? "/api" // ✅ Use the proxy in production (rewrites handle it)
  : process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"; // ✅ Use local backend in dev
