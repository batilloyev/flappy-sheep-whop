import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const WHOP_API_ORIGIN = "https://api.whop.com";

export function loadLocalEnv(filePath = ".env") {
  const resolvedPath = resolve(process.cwd(), filePath);

  try {
    const contents = readFileSync(resolvedPath, "utf8");

    for (const line of contents.split(/\r?\n/)) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
        continue;
      }

      const [key, ...valueParts] = trimmed.split("=");
      const value = valueParts.join("=").replace(/^["']|["']$/g, "");

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

export function createWhopClient(apiKey = process.env.WHOP_API_KEY) {
  if (!apiKey) {
    throw new Error("Missing WHOP_API_KEY. Add it to .env first.");
  }

  return {
    async fetch(path, init = {}) {
      const url = new URL(path, WHOP_API_ORIGIN);
      const response = await fetch(url, {
        ...init,
        headers: {
          Accept: "application/json",
          ...init.headers,
          Authorization: `Bearer ${apiKey}`,
        },
      });

      const body = await response.text();
      const data = body ? JSON.parse(body) : null;

      if (!response.ok) {
        const message = data?.error?.message ?? data?.message ?? response.statusText;
        throw new Error(`Whop request failed (${response.status}): ${message}`);
      }

      return data;
    },
  };
}
