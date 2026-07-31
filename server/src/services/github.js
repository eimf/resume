import { pool } from '../db/pool.js';

const GITHUB_API = 'https://api.github.com';
const GITHUB_USER = 'eimf';

export async function syncGitHubRepos() {
  const token = process.env.GITHUB_TOKEN;
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'resume-portfolio',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Fetch all repos (paginated)
  let allRepos = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(
      `${GITHUB_API}/users/${GITHUB_USER}/repos?per_page=100&page=${page}&sort=updated`,
      { headers }
    );

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }

    const repos = await res.json();
    allRepos = allRepos.concat(repos);
    hasMore = repos.length === 100;
    page++;
  }

  // Also fetch private repos if token has access
  if (token) {
    let privatePage = 1;
    let morePrivate = true;

    while (morePrivate) {
      const res = await fetch(
        `${GITHUB_API}/user/repos?per_page=100&page=${privatePage}&sort=updated&affiliation=owner&visibility=private`,
        { headers }
      );

      if (res.ok) {
        const privateRepos = await res.json();
        // Avoid duplicates
        const existingIds = new Set(allRepos.map((r) => r.id));
        const newPrivate = privateRepos.filter((r) => !existingIds.has(r.id));
        allRepos = allRepos.concat(newPrivate);
        morePrivate = privateRepos.length === 100;
      } else {
        morePrivate = false;
      }
      privatePage++;
    }
  }

  // Filter out forks unless they have stars
  const filtered = allRepos.filter((r) => !r.fork || r.stargazers_count > 0);

  // Upsert into database
  for (const repo of filtered) {
    await pool.query(`
      INSERT INTO projects (github_id, name, description, language, stars, url, is_private, last_updated, synced_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      ON CONFLICT (github_id) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        language = EXCLUDED.language,
        stars = EXCLUDED.stars,
        url = EXCLUDED.url,
        is_private = EXCLUDED.is_private,
        last_updated = EXCLUDED.last_updated,
        synced_at = NOW()
    `, [
      repo.id,
      repo.name,
      repo.description,
      repo.language,
      repo.stargazers_count,
      repo.html_url,
      repo.private,
      repo.updated_at,
    ]);
  }

  // Update last sync timestamp
  await pool.query(`
    INSERT INTO settings (key, value) VALUES ('last_github_sync', NOW()::text)
    ON CONFLICT (key) DO UPDATE SET value = NOW()::text, updated_at = NOW()
  `);

  return { synced: filtered.length, total: allRepos.length };
}
