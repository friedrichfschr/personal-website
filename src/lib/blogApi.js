function normalizeApiBaseUrl(value) {
  return String(value || '').trim().replace(/\/$/, '');
}

export const blogApiBaseUrl = normalizeApiBaseUrl(
  import.meta.env.VITE_API_BASE_URL || 'https://api.friedrich-fischer.de',
);

export async function fetchBlogPosts(signal) {
  if (!blogApiBaseUrl) {
    return [];
  }

  const response = await fetch(`${blogApiBaseUrl}/api/blog-posts`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Blog API request failed with status ${response.status}`);
  }

  const payload = await response.json();
  return Array.isArray(payload?.posts) ? payload.posts : [];
}
