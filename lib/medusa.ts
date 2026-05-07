import Medusa from "@medusajs/js-sdk";

export const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000";

export const medusa = new Medusa({
  baseUrl: MEDUSA_URL,
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
  debug: process.env.NODE_ENV === "development",
});

/** Helper: Đăng ký tài khoản mới */
export async function registerCustomer(data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}) {
  // Tạo auth credentials
  const token = await medusa.auth.register("customer", "emailpass", {
    email: data.email,
    password: data.password,
  });

  // Tạo customer profile
  await medusa.store.customer.create(
    { email: data.email, first_name: data.first_name, last_name: data.last_name, phone: data.phone },
    {},
    { Authorization: `Bearer ${token}` }
  );

  return token;
}

/** Helper: Đăng nhập */
export async function loginCustomer(email: string, password: string) {
  const token = await medusa.auth.login("customer", "emailpass", { email, password });
  return token;
}

export async function getCurrentCustomer(token: string) {
  const { customer } = await medusa.store.customer.retrieve(undefined, { Authorization: `Bearer ${token}` });
  return customer;
}

/** Helper: Lấy danh sách sản phẩm */
export async function getProducts(params?: { limit?: number; offset?: number; category_id?: string[] }) {
  const url = new URL(`${MEDUSA_URL}/store/products`);
  url.searchParams.append("limit", (params?.limit || 12).toString());
  url.searchParams.append("offset", (params?.offset || 0).toString());
  if (params?.category_id) {
    params.category_id.forEach(id => url.searchParams.append("category_id[]", id));
  }
  
  const res = await fetch(url.toString(), {
    headers: { "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "" }
  });
  
  if (!res.ok) {
    return { products: [], count: 0 };
  }
  return res.json();
}

/** Helper: Lấy danh sách danh mục sản phẩm */
export async function getProductCategories() {
  const res = await fetch(`${MEDUSA_URL}/store/product-categories`, {
    headers: { "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "" },
    cache: 'no-store'
  });
  if (!res.ok) return { product_categories: [] };
  return res.json();
}

/** Helper: Lấy chi tiết 1 sản phẩm theo ID */
export async function getProduct(id: string) {
  const res = await fetch(`${MEDUSA_URL}/store/products/${id}`, {
    headers: { "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "" }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.product;
}

/** Helper: Lấy chi tiết 1 sản phẩm theo Handle */
export async function getProductByHandle(handle: string) {
  const res = await fetch(`${MEDUSA_URL}/store/products?handle=${handle}`, {
    headers: { "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "" }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.products?.[0] || null;
}

/** Helper: Tạo đặt lịch dịch vụ */
export async function createBooking(data: {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  service_type: "viewing" | "consulting" | "repair" | "deco" | "rental" | "furniture";
  property_id?: string;
  property_name?: string;
  scheduled_date?: string;
  scheduled_time?: string;
  notes?: string;
  address?: string;
  budget?: number;
}) {
  const res = await fetch(`${MEDUSA_URL}/store/bookings`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Lỗi đặt lịch");
  }
  return res.json();
}

/** Helper: Lấy danh sách đơn hàng của khách hàng (Cần Token) */
export async function getCustomerOrders(token: string) {
  const res = await fetch(`${MEDUSA_URL}/store/customers/me/orders`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
    }
  });
  if (!res.ok) return { orders: [] };
  return res.json();
}

/** Helper: Lấy danh sách lịch hẹn của khách hàng (Cần Token) */
export async function getCustomerBookings(token: string) {
  const res = await fetch(`${MEDUSA_URL}/store/bookings`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return { bookings: [] };
  return res.json();
}

/** Helper: Cập nhật metadata khách hàng (ví dụ: lưu Wishlist) */
export async function updateCustomerMetadata(token: string, metadata: any) {
  const res = await fetch(`${MEDUSA_URL}/store/customers/me`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ metadata })
  });
  if (!res.ok) throw new Error("Cập nhật thông tin thất bại");
  return res.json();
}
