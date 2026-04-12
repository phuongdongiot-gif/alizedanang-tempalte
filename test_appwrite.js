import { Client, Databases } from 'node-appwrite';

const ENDPOINT = "https://fra.cloud.appwrite.io/v1";
const API_KEY = "standard_d1879916ed2dc932de872cbd3d0cf7e1796e8564fa6f87d1f23150ec9dee5180b8116545154b771b7026a8431590cabdc22aa7022800519e8be691986734b699211b1870b0fa4d3ea36fd42edd1a4319dd4fad44c606cb1c97c6e9cd133919b0bc407a8fbdaac40f78014c53553e1cf5626790d324565911a249932c862a76bd";

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setKey(API_KEY);
    // deliberately skip setProject()

const databases = new Databases(client);

async function test() {
  try {
    const list = await databases.list();
    console.log("Success!", list);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
test();
