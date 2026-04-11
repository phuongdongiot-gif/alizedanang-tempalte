export const GRAPHQL_API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://api-estate.vercel.app/graphql';

/**
 * Hàm gọi API GraphQL chung (Dành cho Server Component hoặc thư mục ServerActions)
 * Sử dụng native `fetch` của Next.js với tham số cấu hình caching
 */
export async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, any> = {},
  options?: RequestInit
): Promise<T> {
  console.log(`[GraphQL Fetch] Đang gửi yêu cầu tới: ${GRAPHQL_API_URL}`);
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      // Theo chuẩn Next.js 14/15, có thể định nghĩa option "next: { revalidate: xxx }"
      ...options,
    });

    if (!response.ok) {
      throw new Error(`GraphQL Fetch Error: ${response.statusText}`);
    }

    const { data, errors } = await response.json();
    if (errors && errors.length > 0) {
      console.error('GraphQL Errors:', errors);
      throw new Error(errors[0].message);
    }

    return data as T;
  } catch (error) {
    console.error('Lỗi khi call hệ thống GraphQL:', error);
    throw error;
  }
}

// ============== CÁC CÂU LỆNH TRUY VẤN MẪU (QUERIES) ============== //

export const GET_PROPERTIES_QUERY = `
  query GetProperties {
    properties {
      id
      transaction_type
      property_category
      is_new
      name
      price
      price_num
      location
      beds
      baths
      area
      area_num
      img_url
    }
  }
`;

export const GET_BLOGS_QUERY = `
  query GetBlogs {
    blogs {
      id
      slug
      title
      date
      description
      img_url
    }
  }
`;
