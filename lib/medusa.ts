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
  const { products, count } = await medusa.store.product.list({
    limit: params?.limit || 12,
    offset: params?.offset || 0,
    ...(params?.category_id ? { category_id: params.category_id } : {}),
  });
  return { products, count };
}

/** Helper: Lấy chi tiết 1 sản phẩm */
export async function getProduct(id: string) {
  const { product } = await medusa.store.product.retrieve(id);
  return product;
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
