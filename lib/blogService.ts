export interface BlogHomeData {
  categories: any[];
  heroPosts: any[];
  trendingPosts: any[];
  wpPosts: any[];
  totalPages: number;
}

export async function getBlogHomeData(currentPage: number): Promise<BlogHomeData> {
  const WP_API = process.env.NEXT_PUBLIC_WP_API_URL || 'https://atservice.vn/wp-json/wp/v2';
  
  // Create promises for parallel fetching
  const catPromise = fetch(`${WP_API}/categories?hide_empty=true`, { next: { revalidate: 3600 } }).then(res => res.ok ? res.json() : []);
  
  const postsPromise = fetch(`${WP_API}/posts?_embed=1&per_page=10&page=${currentPage}`, { next: { revalidate: 3600 } }).then(async res => {
    if (!res.ok) return { posts: [], totalPages: 1 };
    return {
      posts: await res.json(),
      totalPages: parseInt(res.headers.get('X-WP-TotalPages') || '1', 10)
    };
  });

  const globalPromise = currentPage === 1 
    ? fetch(`${WP_API}/posts?_embed=1&per_page=9`, { next: { revalidate: 3600 } }).then(res => res.ok ? res.json() : [])
    : Promise.resolve([]);

  // Fetch all at once
  const [categories, postsData, globalPosts] = await Promise.all([
    catPromise,
    postsPromise,
    globalPromise
  ]);

  let heroPosts: any[] = [];
  let trendingPosts: any[] = [];

  if (Array.isArray(globalPosts) && globalPosts.length > 0) {
    heroPosts = globalPosts.slice(0, 5); // 1 main + 4 small
    trendingPosts = globalPosts.slice(5, 9); // 4 posts for trending
  }

  return {
    categories: Array.isArray(categories) ? categories : [],
    heroPosts,
    trendingPosts,
    wpPosts: postsData.posts || [],
    totalPages: postsData.totalPages || 1
  };
}

export async function getBlogCategoryData(slug: string, currentPage: number) {
  const WP_API = process.env.NEXT_PUBLIC_WP_API_URL || 'https://atservice.vn/wp-json/wp/v2';

  // We need to fetch the category ID first, so we await it
  const catRes = await fetch(`${WP_API}/categories?hide_empty=true`, { next: { revalidate: 3600 } });
  let categories = [];
  let currentCategory = null;

  if (catRes.ok) {
    categories = await catRes.json();
    currentCategory = categories.find((c: any) => c.slug === slug);
  }

  if (!currentCategory) {
    return { categories, currentCategory: null, posts: [], totalPages: 1 };
  }

  const postsRes = await fetch(`${WP_API}/posts?_embed=1&per_page=10&page=${currentPage}&categories=${currentCategory.id}`, {
    next: { revalidate: 3600 }
  });

  let posts = [];
  let totalPages = 1;

  if (postsRes.ok) {
    posts = await postsRes.json();
    totalPages = parseInt(postsRes.headers.get('X-WP-TotalPages') || '1', 10);
  }

  return { categories, currentCategory, posts, totalPages };
}
