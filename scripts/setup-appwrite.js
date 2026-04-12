import { Client, Databases, Permission, Role } from 'node-appwrite';

/**
 * CẤU HÌNH THÔNG SỐ (PHẢI THAY THẾ PROJECT ID VÀO ĐÂY)
 */
const ENDPOINT = "https://fra.cloud.appwrite.io/v1";
// ĐIỀN PROJECT ID VÀO ĐÂY TRƯỚC KHI CHẠY (Nằm trong Settings của Appwrite Project)
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "6916944a000bec17a2b4"; 
const API_KEY = "standard_d1879916ed2dc932de872cbd3d0cf7e1796e8564fa6f87d1f23150ec9dee5180b8116545154b771b7026a8431590cabdc22aa7022800519e8be691986734b699211b1870b0fa4d3ea36fd42edd1a4319dd4fad44c606cb1c97c6e9cd133919b0bc407a8fbdaac40f78014c53553e1cf5626790d324565911a249932c862a76bd";

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function setup() {
  console.log("🚀 Đang chạy lệnh thiết lập Database Chat Realtime cho Appwrite...");
  
  if (PROJECT_ID === "REPLACE_WITH_YOUR_PROJECT_ID") {
    console.error("❌ LỖI: Bạn chưa điền PROJECT_ID vào file scripts/setup-appwrite.js.");
    console.error("💡 Hướng dẫn: Mở Appwrite -> Settings -> Bắt copy Project ID (VD: 64a... ) và dán vào file này.");
    return;
  }

  const DATABASE_ID = "chat_db";
  const COLLECTION_ID = "messages";

  try {
    // 1. Tạo Database
    console.log(`[1] Đang kiểm tra/tạo Database: ${DATABASE_ID}...`);
    try {
      await databases.get(DATABASE_ID);
      console.log(`✅ Database ${DATABASE_ID} đã tồn tại.`);
    } catch (e) {
      await databases.create(DATABASE_ID, "Chat Database");
      console.log(`✅ Đã tạo mới Database ${DATABASE_ID}.`);
    }

    // 2. Tạo Collection
    console.log(`[2] Đang kiểm tra/tạo Collection: ${COLLECTION_ID}...`);
    try {
      await databases.getCollection(DATABASE_ID, COLLECTION_ID);
      console.log(`✅ Collection ${COLLECTION_ID} đã tồn tại.`);
    } catch (e) {
      await databases.createCollection(
        DATABASE_ID, 
        COLLECTION_ID, 
        "Messages Collection",
        [
          Permission.create(Role.any()),
          Permission.read(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any())
        ]
      );
      console.log(`✅ Đã tạo mới Collection ${COLLECTION_ID}.`);
      
      // Tạo các thuộc tính (Attributes) cho Collection
      console.log("[3] Đang thêm các thuộc tính (Attributes)...");
      await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'content', 5000, true);
      await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'senderId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'senderType', 50, false, "user"); // "user" hoặc "agent"
      
      console.log("⏳ Vui lòng đợi 3 giây để Appwrite cập nhật các thuộc tính...");
      await new Promise(res => setTimeout(res, 3000));
    }

    console.log("🎉 Xong! Toàn bộ Database Chat đã được thiết lập. Hãy truy cập trang web để bắt đầu Chat ngay!");
  } catch (error) {
    console.error("❌ LỖI KHÔNG MONG MUỐN:", error);
  }
}

setup();
