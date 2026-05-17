export async function getFinanceCategoryData(slug: string) {
  const WP_API = process.env.NEXT_PUBLIC_FINANCE_WP_API_URL || 'https://atservice.com.vn/wp-json/wp/v2';

  let wpPosts: any[] = [];
  let categories: any[] = [];
  let currentCategory = null;

  try {
    const catsRes = await fetch(`${WP_API}/categories?hide_empty=true&per_page=100`, { next: { revalidate: 3600 } });
    if (catsRes.ok) {
      categories = await catsRes.json();
      currentCategory = categories.find((c: any) => c.slug === slug);
    }

    if (currentCategory) {
      const postsRes = await fetch(`${WP_API}/posts?_embed=1&per_page=6&categories=${currentCategory.id}`, { next: { revalidate: 3600 } });
      if (postsRes.ok) {
        wpPosts = await postsRes.json();
      }
    }
  } catch (error) {
    console.error("Lỗi kéo tin tức Danh mục Tài Chính WordPress:", error);
  }

  return { wpPosts, categories, currentCategory };
}
