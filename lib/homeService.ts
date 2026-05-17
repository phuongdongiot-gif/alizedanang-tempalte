import { getProperties } from "./propertyService";
import { fetchGraphQL } from "./graphql";

export interface HomeData {
  featuredProperties: any[];
  featuredApartments: any[];
  shopProducts: any[];
  shopCategories: any[];
  dynamicProjects: any[];
  wpPosts: any[];
}

export async function getHomeData(locale: string): Promise<HomeData> {
  let featuredProperties: any[] = [];
  let featuredApartments: any[] = [];
  let shopProducts: any[] = [];
  let shopCategories: any[] = [];
  let dynamicProjects: any[] = [];
  let wpPosts: any[] = [];

  const WP_API = process.env.NEXT_PUBLIC_WP_API_URL || 'https://atservice.vn/wp-json/wp/v2';

  // Chạy TẤT CẢ các truy vấn một cách song song để tiết kiệm thời gian (Parallel Fetching)
  const [
    recentPropertiesRes,
    medusaProductsRes,
    medusaCategoriesRes,
    graphqlProjectsRes,
    wpRes
  ] = await Promise.allSettled([
    getProperties(locale),
    import('./medusa').then(m => m.getProducts({ limit: 20 })),
    import('./medusa').then(m => m.getProductCategories()),
    fetchGraphQL(`
      query {
        projects {
          id
          name
          slug
          hero_data
          location {
            name
          }
        }
      }
    `, {}, { next: { revalidate: 60 } }),
    fetch(`${WP_API}/posts?per_page=8&_embed`, { next: { revalidate: 3600 } })
  ]);

  // --- Xử lý kết quả Properties ---
  if (recentPropertiesRes.status === 'fulfilled') {
    const allProps = recentPropertiesRes.value;
    featuredProperties = allProps.slice(0, 8);
    featuredApartments = allProps.filter((p: any) => p.propertyCategory === 'apartments').slice(0, 8);
  }

  // --- Xử lý kết quả Medusa ---
  if (medusaProductsRes.status === 'fulfilled' && medusaProductsRes.value?.products) {
    shopProducts = medusaProductsRes.value.products;
  } else if (medusaProductsRes.status === 'rejected') {
    console.warn("Lỗi kéo dữ liệu Shop Products:", medusaProductsRes.reason);
  }

  if (medusaCategoriesRes.status === 'fulfilled' && medusaCategoriesRes.value?.product_categories) {
    shopCategories = medusaCategoriesRes.value.product_categories;
  } else if (medusaCategoriesRes.status === 'rejected') {
    console.warn("Lỗi kéo dữ liệu Shop Categories:", medusaCategoriesRes.reason);
  }

  // Ghi chú: Nhờ việc thêm expand=categories vào getProducts trong medusa.ts,
  // Dữ liệu shopProducts lúc này ĐÃ BAO GỒM cả thông tin danh mục của từng sản phẩm.
  // Không cần vòng lặp Promise.all(shopCategories.map(...)) gây N+1 Query nữa.

  // --- Xử lý kết quả GraphQL Projects ---
  if (graphqlProjectsRes.status === 'fulfilled') {
    const data: any = graphqlProjectsRes.value;
    if (data?.projects) dynamicProjects = data.projects;
  } else {
    console.warn("Lỗi kéo dữ liệu Project:", graphqlProjectsRes.reason);
  }

  // --- Xử lý kết quả WordPress News ---
  if (wpRes.status === 'fulfilled') {
    const wpResponse = wpRes.value;
    if (wpResponse.ok) {
      try {
        wpPosts = await wpResponse.json();
      } catch (e) {
        console.warn("Lỗi parse JSON WP News:", e);
      }
    }
  } else {
    console.warn("Lỗi fetch WP News:", wpRes.reason);
  }

  return {
    featuredProperties,
    featuredApartments,
    shopProducts,
    shopCategories,
    dynamicProjects,
    wpPosts
  };
}
