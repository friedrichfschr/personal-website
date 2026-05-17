import type { NowEntryDefinition } from "../nowEntries";

function normalizeApiBaseUrl(value: string | undefined) {
  return String(value || "").trim().replace(/\/$/, "");
}

export const blogApiBaseUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

export async function fetchBlogPosts(signal?: AbortSignal): Promise<NowEntryDefinition[]> {
  if (!blogApiBaseUrl) {
    return [];
  }

  const response = await fetch(`${blogApiBaseUrl}/api/blog-posts`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Blog API request failed with status ${response.status}`);
  }

  const payload = await response.json();
  return Array.isArray(payload?.posts) ? payload.posts : [];
}
