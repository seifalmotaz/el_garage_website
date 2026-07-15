/**
 * Thin wrappers around the public `/articles` endpoints exposed by the
 * backend.
 *
 * Each function delegates to the typed `fetcher` in `./client` and pins the
 * response shape with a zod schema so the front-end gets runtime
 * validation and a single inferred TypeScript type per response.
 *
 *   - `getArticles` → `GET /api/v1/articles`  (public list, paginated)
 *   - `getArticleById` → `GET /api/v1/articles/:id` (public detail)
 *
 * The list endpoint returns a paginated envelope:
 *   `{ data: Article[]; total; page; limit; totalPages }`
 * which mirrors `backend/src/articles/dto/article-response.dto.ts`. The
 * `image` field is a backend-relative or absolute path — we rewrite it
 * through `absolutizeUrl` so the consumer can drop the result straight
 * into `<img src>` without knowing the API origin.
 *
 * Schemas are co-located here (rather than `./types`) because articles
 * are a one-off concern — keeping the DTOs next to the functions that
 * use them avoids polluting the shared `types.ts`.
 */
import { z } from "zod";
import { fetcher } from "./client";
import { absolutizeUrl } from "./media";

/** Accept full ISO datetimes or looser date strings from the API. */
const flexibleDateTime = z.union([
  z.string().datetime({ offset: true }),
  z.string().min(1),
]);

/** Public article shape returned by `GET /articles` and `/articles/:id`. */
export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  content: z.string(),
  image: z.string().nullable(),
  category: z.string(),
  status: z.string(),
  viewCount: z.number().int(),
  createdAt: flexibleDateTime,
  updatedAt: flexibleDateTime,
  publishedAt: flexibleDateTime.nullable(),
});

export type Article = z.infer<typeof ArticleSchema>;

/** Paginated list response from `GET /articles`. */
export const ArticlesListResponseSchema = z.object({
  data: z.array(ArticleSchema),
  total: z.number(),
  page: z.number().int(),
  limit: z.number().int(),
  totalPages: z.number().int(),
});

export type ArticlesListResponse = z.infer<typeof ArticlesListResponseSchema>;

/** Optional filters for `GET /articles`. */
export type GetArticlesParams = {
  /** 1-indexed page number. */
  page?: number;
  /** Items per page (max enforced by the backend). */
  limit?: number;
  /** Category filter (e.g. "صيانة"). */
  category?: string;
  /** Free-text search across title / description / content. */
  search?: string;
};

/**
 * Build the `?...` query string for `getArticles`. We iterate explicitly
 * so `undefined` fields are skipped (rather than serialised as the literal
 * string `"undefined"`).
 */
function buildQueryString(params: GetArticlesParams): string {
  const search = new URLSearchParams();
  if (params.page !== undefined) search.set("page", String(params.page));
  if (params.limit !== undefined) search.set("limit", String(params.limit));
  if (params.category !== undefined) search.set("category", params.category);
  if (params.search !== undefined) search.set("search", params.search);
  return search.toString();
}

/**
 * Rewrite the article's `image` (when present) to an absolute URL the
 * browser can load. Delegates to `absolutizeUrl` from `./media` so the
 * rule lives in one place; returns `null` for missing images so callers
 * can skip rendering rather than emit a broken `<img src>`.
 */
function absolutizeArticleImage(article: Article): Article {
  return {
    ...article,
    image: absolutizeUrl(article.image),
  };
}

/**
 * Fetch a paginated list of published articles.
 *
 * Issues `GET /api/v1/articles` with optional filters and validates the
 * response against `ArticlesListResponseSchema`. The `image` field is
 * rewritten to an absolute URL so the consumer does not need to know the
 * API origin.
 */
export async function getArticles(
  params: GetArticlesParams = {},
): Promise<ArticlesListResponse> {
  const query = buildQueryString(params);
  const path = query ? `/articles?${query}` : "/articles";

  const response = await fetcher<ArticlesListResponse>(
    path,
    { method: "GET", public: true },
    ArticlesListResponseSchema,
  );

  return {
    ...response,
    data: response.data.map(absolutizeArticleImage),
  };
}

/**
 * Fetch a single published article by id.
 *
 * Issues `GET /api/v1/articles/:id` and validates the response against
 * `ArticleSchema`. The `image` field is rewritten to an absolute URL.
 * Does **not** increment viewCount — use `trackArticleView` once per session.
 */
export async function getArticleById(id: string): Promise<Article> {
  const article = await fetcher<Article>(
    `/articles/${encodeURIComponent(id)}`,
    { method: "GET", public: true },
    ArticleSchema,
  );
  return absolutizeArticleImage(article);
}

/**
 * Record one view for an article. Safe to call multiple times from the
 * client; callers should gate with sessionStorage so SWR revalidates
 * do not inflate counts.
 */
export async function trackArticleView(id: string): Promise<void> {
  if (typeof window !== "undefined") {
    const key = `article_viewed_${id}`;
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, "1");
  }

  try {
    await fetcher(`/articles/${encodeURIComponent(id)}/view`, {
      method: "POST",
      public: true,
    });
  } catch {
    // Best-effort analytics; clear session flag so a later visit can retry
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(`article_viewed_${id}`);
    }
  }
}
