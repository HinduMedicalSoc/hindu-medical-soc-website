import { google } from "googleapis";

// Convert private key string to handle newlines correctly
const PRIVATE_KEY = process.env.PRIVATE_KEY?.replace(/\\n/g, '\n');

// Service account credentials configuration
const SERVICE_ACCOUNT_CREDENTIALS = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN
};

// Create JWT auth client with proper scope
const auth = new google.auth.JWT({
  email: SERVICE_ACCOUNT_CREDENTIALS.client_email,
  key: SERVICE_ACCOUNT_CREDENTIALS.private_key,
  scopes: ['https://www.googleapis.com/auth/drive.readonly']
});

// Initialize Google Drive API client
const drive = google.drive({ version: "v3", auth });

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { fileId } = req.query;

  // Validate fileId
  if (!fileId) {
    return res.status(400).json({ error: "File ID is required" });
  }

  try {
    // First get the file metadata to check existence and get MIME type
    const fileMetadata = await drive.files.get({
      fileId: fileId,
      fields: 'id, name, mimeType, size'
    });

    // Get the file content as arraybuffer
    const response = await drive.files.get(
      {
        fileId: fileId,
        alt: 'media'
      },
      {
        responseType: 'arraybuffer'
      },
    );

    // Set appropriate response headers
    res.setHeader('Content-Type', fileMetadata.data.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${fileMetadata.data.name}"`);
    
    if (fileMetadata.data.size) {
      res.setHeader('Content-Length', fileMetadata.data.size);
    }

    // Send the file data
    return res.send(Buffer.from(response.data));

  } catch (error) {
    // Detailed error logging
    console.error("Error downloading file:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      details: error.response?.data,
      fileId: fileId
    });

    // Handle specific error cases
    if (error.code === 404) {
      return res.status(404).json({ error: "File not found" });
    }

    if (error.code === 403) {
      return res.status(403).json({ error: "Access denied to file" });
    }

    // Generic error response
    return res.status(500).json({ 
      error: "Failed to download file",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}