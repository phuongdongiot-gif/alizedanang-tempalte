import { Client, Databases, Storage, Permission, Role } from 'node-appwrite';

const ENDPOINT = "https://fra.cloud.appwrite.io/v1";
const PROJECT_ID = "6916944a000bec17a2b4"; 
const API_KEY = "standard_d1879916ed2dc932de872cbd3d0cf7e1796e8564fa6f87d1f23150ec9dee5180b8116545154b771b7026a8431590cabdc22aa7022800519e8be691986734b699211b1870b0fa4d3ea36fd42edd1a4319dd4fad44c606cb1c97c6e9cd133919b0bc407a8fbdaac40f78014c53553e1cf5626790d324565911a249932c862a76bd";

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

const setupStorage = async () => {
    try {
        console.log("1. Update Messages Collection with attachmentUrl");
        try {
            await databases.createStringAttribute("chat_db", "messages", "attachmentUrl", 1000, false);
            console.log("Added attachmentUrl attribute.");
        } catch (e) {
            console.log("Attribute already exists or error:", e.message);
        }

        console.log("2. Create Storage Bucket for Chat Media");
        try {
            await storage.createBucket("chat_media", "Chat Uploads", [
                Permission.create(Role.any()),
                Permission.read(Role.any()),
                Permission.update(Role.any()),
                Permission.delete(Role.any())
            ], false, false, undefined, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf']);
            console.log("Added new Storage Bucket.");
        } catch(e) {
            console.log("Storage Bucket already exists or error:", e.message);
        }

    } catch(err) {
        console.error(err);
    }
};

setupStorage();
