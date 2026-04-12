import { Client, Databases } from 'node-appwrite';

const ENDPOINT = "https://fra.cloud.appwrite.io/v1";
const PROJECT_ID = "6916944a000bec17a2b4"; 
const API_KEY = "standard_d1879916ed2dc932de872cbd3d0cf7e1796e8564fa6f87d1f23150ec9dee5180b8116545154b771b7026a8431590cabdc22aa7022800519e8be691986734b699211b1870b0fa4d3ea36fd42edd1a4319dd4fad44c606cb1c97c6e9cd133919b0bc407a8fbdaac40f78014c53553e1cf5626790d324565911a249932c862a76bd";

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

const setupCrmDesc = async () => {
    try {
        console.log("1. Create crm_leads Collection");
        let crmColIds = null;
        try {
            await databases.createCollection("chat_db", "crm_leads", "CRM Leads");
            console.log("Collection created.");
        } catch(e) {
            console.log("Collection might already exist or error: " + e.message);
        }

        console.log("2. Create Attributes");
        try { await databases.createStringAttribute("chat_db", "crm_leads", "userId", 100, true); } catch(e){}
        try { await databases.createStringAttribute("chat_db", "crm_leads", "name", 200, true); } catch(e){}
        try { await databases.createStringAttribute("chat_db", "crm_leads", "phone", 20, true); } catch(e){}
        try { await databases.createStringAttribute("chat_db", "crm_leads", "status", 50, false, "NEW"); } catch(e){}
        try { await databases.createStringAttribute("chat_db", "crm_leads", "notes", 5000, false); } catch(e){}
        
        console.log("Setup Done. Pls wait 5 seconds for attributes to be active before writing to it.");
    } catch(err) {
        console.error(err);
    }
};

setupCrmDesc();
