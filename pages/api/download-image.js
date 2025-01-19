import { google } from "googleapis";

// Service account credentials (replace with your actual credentials)
const SERVICE_ACCOUNT_CREDENTIALS = {
 
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN
    
  };
  
  // Create an auth client using the service account credentials
  const auth = new google.auth.JWT(
    SERVICE_ACCOUNT_CREDENTIALS.client_email,
    null,
    SERVICE_ACCOUNT_CREDENTIALS.private_key,
    ['https://www.googleapis.com/auth/drive.readonly']
  );
  
  // Initialize Google Drive API
  const drive = google.drive({ version: "v3", auth });

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { fileId } = req.query; // Assuming the fileId is passed as a query parameter
   

    try {
      const response = await drive.files.get(
        { fileId: fileId, alt: 'media' }
      
      );
     

      return res.status(200).send(response);

    
     
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ error: "Failed to download file" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
