import { PortalProperty } from "../types";

export interface DBProperty {
  id: string;
  transactionType: "sale" | "rent";
  propertyCategory: string;
  isNew: boolean;
  projectId: string;
  priceNum: number;
  areaNum: number;
  beds: number;
  baths: number;
  img: string;
  gallery: string[];
  coordinates: { lat: number; lng: number };

  // Localized Fields
  name: { vi: string; en: string };
  type: { vi: string; en: string };
  desc: { vi: string; en: string };
  location: { vi: string; en: string };
  projectName: { vi: string; en: string };
  priceStr: { vi: string; en: string };
}

export const mockDatabase: DBProperty[] = [
  {
    id: "alize-signature-2pn",
    transactionType: "sale",
    propertyCategory: "apartments",
    isNew: false,
    projectId: "alize",
    priceNum: 8500000000,
    areaNum: 91.5,
    beds: 2,
    baths: 2,
    img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070",
    gallery: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000",
      "/images/thiet-ke-can-ho-2pn-alize-da-nang.webp"
    ],
    coordinates: { lat: 16.0357, lng: 108.2435 },
    name: { vi: "Signature (2PN) góc view biển Mỹ Khê", en: "Signature (2BR) My Khe Beach View" },
    type: { vi: "Căn Hộ Hạng Sang", en: "Luxury Apartment" },
    desc: {
      vi: "Tuyệt tác căn hộ với thiết kế ban công panorama ôm trọn thiên nhiên. Một sản phẩm đẳng cấp tới từ siêu dự án Alize.",
      en: "A true masterpiece with a panoramic balcony embracing nature. A top-tier product from the ultra-luxury ALIZE project."
    },
    location: { vi: "Tháp A, Tầng 18, ALIZE Residence", en: "Tower A, 18th Floor, ALIZE Residence" },
    projectName: { vi: "ALIZE Residence", en: "ALIZE Residence" },
    priceStr: { vi: "8.5 Tỷ VND", en: "8.5 Billion VND" }
  },
  {
    id: "alize-sky-villa",
    transactionType: "sale",
    propertyCategory: "apartments",
    isNew: false,
    projectId: "alize",
    priceNum: 45000000000,
    areaNum: 345,
    beds: 4,
    baths: 5,
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070",
      "/images/sky-pool-alize-da-nang.webp",
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000"
    ],
    coordinates: { lat: 16.0358, lng: 108.2435 },
    name: { vi: "Sky Villa Edition - Căn hộ trên những tầng mây", en: "Sky Villa Edition - Apartment in the Clouds" },
    type: { vi: "Penthouse", en: "Penthouse" },
    desc: {
      vi: "Kiệt tác trên những tầng mây với tiện nghi đỉnh cao: hồ bơi cá nhân ngoạn mục, sân vườn treo trong nhà và công nghệ nhà thông minh tối tân.",
      en: "A masterpiece on the clouds with ultimate amenities: a spectacular private pool, indoor hanging garden, and state-of-the-art smart home tech."
    },
    location: { vi: "Tầng 39, ALIZE Residence", en: "39th Floor, ALIZE Residence" },
    projectName: { vi: "ALIZE Residence", en: "ALIZE Residence" },
    priceStr: { vi: "45 Tỷ VND", en: "45 Billion VND" }
  },
  {
    id: "ocean-villa-da-nang",
    transactionType: "sale",
    propertyCategory: "villas",
    isNew: true,
    projectId: "ocean-villas",
    priceNum: 35000000000,
    areaNum: 550,
    beds: 5,
    baths: 6,
    img: "https://images.unsplash.com/photo-1613490908592-fd5e64efebcc?q=80&w=2000",
    gallery: [
      "https://images.unsplash.com/photo-1613490908592-fd5e64efebcc?q=80&w=2000",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070"
    ],
    coordinates: { lat: 15.968, lng: 108.283 },
    name: { vi: "Biệt thự biển Ocean Villas Đà Nẵng", en: "Ocean Villas Da Nang Beach Villa" },
    type: { vi: "Biệt Thự Biển", en: "Beach Villa" },
    desc: {
      vi: "Biệt thự view biển trực diện với thiết kế mở tràn ngập ánh sáng tự nhiên. Pháp lý siêu rõ ràng, đặc quyền vương giả nghỉ dưỡng.",
      en: "Direct beach view villa with an open design flooded with natural light. Extremely clear legal status, regal resort privileges."
    },
    location: { vi: "Khu B, The Ocean Villas, Ngũ Hành Sơn", en: "Zone B, The Ocean Villas, Ngu Hanh Son" },
    projectName: { vi: "The Ocean Villas", en: "The Ocean Villas" },
    priceStr: { vi: "35 Tỷ VND", en: "35 Billion VND" }
  },
  {
    id: "shophouse-empire-hcm",
    transactionType: "rent",
    propertyCategory: "shophouses",
    isNew: false,
    projectId: "empire-city",
    priceNum: 150000000,
    areaNum: 125,
    beds: 0,
    baths: 2,
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000"
    ],
    coordinates: { lat: 10.768, lng: 106.722 },
    name: { vi: "Shophouse Mặt tiền Empire City Thủ Thiêm", en: "Empire City Thu Thiem Frontage Shophouse" },
    type: { vi: "Nhà phố thương mại", en: "Commercial Townhouse" },
    desc: {
      vi: "Vị trí kim cương trung tâm quảng trường sầm uất. Phù hợp kinh doanh nhà hàng cao cấp, flagship store hoặc văn phòng đại diện.",
      en: "Diamond location right in the center of the bustling square. Perfect for a luxury restaurant, flagship store, or representative office."
    },
    location: { vi: "Khu Tilia, Empire City, Thủ Thiêm", en: "Tilia Zone, Empire City, Thu Thiem" },
    projectName: { vi: "Empire City", en: "Empire City" },
    priceStr: { vi: "150 Triệu / Tháng", en: "150 Million / Month" }
  }
];

import { fetchGraphQL, GET_PROPERTIES_QUERY } from "./graphql";

export async function getProperties(locale: string): Promise<PortalProperty[]> {
  console.log(`\n📡 [Frontend] Gọi Hàm getProperties(${locale}) - Chuẩn bị Fetch GraphQL...`);
  try {
    const res: any = await fetchGraphQL(GET_PROPERTIES_QUERY, {}, { cache: 'no-store' });
    console.log(`✅ [Frontend] Nhận Data từ Backend:`, res ? `Có ${res.properties?.length || 0} bản ghi` : 'null');

    if (res && res.properties && res.properties.length > 0) {
      return res.properties.map((item: any) => {
        let tType = item.transaction_type || 'sale';
        if (tType.toLowerCase() === 'mua bán') tType = 'sale';
        if (tType.toLowerCase() === 'cho thuê') tType = 'rent';

        return {
        id: item.id,
        transactionType: tType,
        propertyCategory: item.property_category || 'apartments',
        isNew: item.is_new || false,
        name: item.name,
        projectId: item.project_id || 'alize',
        projectName: item.project_name || 'Được tải từ GraphQL API',
        price: item.price || 'Liên hệ',
        priceNum: item.price_num || 0,
        location: item.location || 'Đang cập nhật',
        type: item.property_category || 'Bất động sản',
        specs: {
          area: item.area || '... m²',
          areaNum: item.area_num || 0,
          beds: item.beds || 0,
          baths: item.baths || 0
        },
        desc: item.description || 'Truy xuất trực tiếp từ cổng Backend GraphQL.',
        img: item.img_url || '',
        gallery: item.gallery || [],
        coordinates: { lat: item.lat || 16.0544, lng: item.lng || 108.2022 }, // Fallback to Da Nang center
        features: {
          legal_status: item.legal_status,
          furniture: item.furniture,
          house_direction: item.house_direction,
          balcony_direction: item.balcony_direction,
          floors: item.floors,
          frontage: item.frontage,
          entrance_width: item.entrance_width,
        },
        agent: {
          name: item.agent_name,
          phone: item.agent_phone,
          zalo: item.agent_zalo,
          avatar: item.agent_avatar,
        },
        media: {
          video_url: item.video_url,
          tour_3d_url: item.tour_3d_url,
        }
      };
      });
    } else {
      console.log("GraphQL chạy thành công nhưng trả về null/empty:", res);
    }
  } catch (error) {
    // Nếu API sập hoặc Build time không gọi được, im lặng fallback sang mock database
    console.log("ℹ️ [Frontend] Hệ thống GraphQL chưa online. Kích hoạt Mock Data...");
  }

  // Cũ: Trả về nếu graphql sập
  return mockDatabase.map((item) => ({
    id: item.id,
    transactionType: item.transactionType,
    propertyCategory: item.propertyCategory,
    isNew: item.isNew,
    name: item.name[locale as keyof typeof item.name] || item.name.en,
    projectId: item.projectId,
    projectName: item.projectName[locale as keyof typeof item.projectName] || item.projectName.en,
    price: item.priceStr[locale as keyof typeof item.priceStr] || item.priceStr.en,
    priceNum: item.priceNum,
    location: item.location[locale as keyof typeof item.location] || item.location.en,
    type: item.type[locale as keyof typeof item.type] || item.type.en,
    specs: {
      area: `${item.areaNum} m²`,
      areaNum: item.areaNum,
      beds: item.beds,
      baths: item.baths
    },
    desc: item.desc[locale as keyof typeof item.desc] || item.desc.en,
    img: item.img,
    gallery: item.gallery,
    coordinates: item.coordinates
  }));
}

export async function getPropertyById(id: string, locale: string): Promise<PortalProperty | undefined> {
  const items = await getProperties(locale);
  return items.find(i => i.id === id);
}
