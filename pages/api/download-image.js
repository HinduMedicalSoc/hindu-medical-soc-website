import { google } from "googleapis";
import compression from "compression";
import cache from "memory-cache";

const CACHE_DURATION = 3600000; // 1 hour in milliseconds
const CACHE_PREFIX = "drive_file_";

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

// Helper function to apply compression to response
const compressResponse = (req, res, next) => {
  return compression()(req, res, next);
};

export default async function handler(req, res) {
  // Apply compression
  await new Promise((resolve) => compressResponse(req, res, resolve));

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { fileId } = req.query;
  if (!fileId) {
    return res.status(400).json({ error: "File ID is required" });
  }

  // Check cache first
  const cachedFile = cache.get(CACHE_PREFIX + fileId);
  if (cachedFile) {
    res.setHeader('Content-Type', cachedFile.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${cachedFile.name}"`);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.send(cachedFile.data);
  }

  try {
    const fileMetadata = await drive.files.get({
      fileId: fileId,
      fields: 'id, name, mimeType, size'
    });

    // Handle range requests
    const range = req.headers.range;
    let start, end;
    
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      start = parseInt(parts[0], 10);
      end = parts[1] ? parseInt(parts[1], 10) : fileMetadata.data.size - 1;
      
      res.status(206);
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Range', `bytes ${start}-${end}/${fileMetadata.data.size}`);
      res.setHeader('Content-Length', end - start + 1);
    }

    const response = await drive.files.get(
      {
        fileId: fileId,
        alt: 'media',
        ...(range && { headers: { Range: `bytes=${start}-${end}` } })
      },
      {
        responseType: 'stream'
      }
    );

    // Set performance-optimized headers
    res.setHeader('Content-Type', fileMetadata.data.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${fileMetadata.data.name}"`);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Stream the response
    response.data.pipe(res);

    // Cache the file for subsequent requests
    if (!range && fileMetadata.data.size < 5000000) { // Only cache files < 5MB
      const chunks = [];
      response.data.on('data', chunk => chunks.push(chunk));
      response.data.on('end', () => {
        const fileData = Buffer.concat(chunks);
        cache.put(CACHE_PREFIX + fileId, {
          data: fileData,
          mimeType: fileMetadata.data.mimeType,
          name: fileMetadata.data.name
        }, CACHE_DURATION);
      });
    }

  } catch (error) {
    console.error("Error downloading file:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      details: error.response?.data,
      fileId: fileId
    });

    if (error.code === 404) return res.status(404).json({ error: "File not found" });
    if (error.code === 403) return res.status(403).json({ error: "Access denied to file" });

    return res.status(500).json({ 
      error: "Failed to download file",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// export default async function handler(req, res) {
//   // Only allow GET requests
//   if (req.method !== "GET") {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }

//   const { fileId } = req.query;

//   // Validate fileId
//   if (!fileId) {
//     return res.status(400).json({ error: "File ID is required" });
//   }

//   try {
//     // First get the file metadata to check existence and get MIME type
//     const fileMetadata = await drive.files.get({
//       fileId: fileId,
//       fields: 'id, name, mimeType, size'
//     });

//     // Get the file content as arraybuffer
//     const response = await drive.files.get(
//       {
//         fileId: fileId,
//         alt: 'media'
//       },
//       {
//         responseType: 'arraybuffer'
//       },
//     );

//     // Set appropriate response headers
//     res.setHeader('Content-Type', fileMetadata.data.mimeType);
//     res.setHeader('Content-Disposition', `inline; filename="${fileMetadata.data.name}"`);
    
//     if (fileMetadata.data.size) {
//       res.setHeader('Content-Length', fileMetadata.data.size);
//     }

//     // Send the file data
//     return res.send(Buffer.from(response.data));

//   } catch (error) {
//     // Detailed error logging
//     console.error("Error downloading file:", {
//       message: error.message,
//       stack: error.stack,
//       code: error.code,
//       details: error.response?.data,
//       fileId: fileId
//     });

//     // Handle specific error cases
//     if (error.code === 404) {
//       return res.status(404).json({ error: "File not found" });
//     }

//     if (error.code === 403) {
//       return res.status(403).json({ error: "Access denied to file" });
//     }

//     // Generic error response
//     return res.status(500).json({ 
//       error: "Failed to download file",
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// }