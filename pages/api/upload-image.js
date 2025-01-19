import { google } from "googleapis";
import fs from "fs";
import multiparty from "multiparty";

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
  ["https://www.googleapis.com/auth/drive.file"]
);

// Initialize Google Drive API
const drive = google.drive({ version: "v3", auth });

export const config = {
  api: {
    bodyParser: false, // Disable default body parser for file handling
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Wrap form.parse in a Promise
      const parseForm = (req) =>
        new Promise((resolve, reject) => {
          const form = new multiparty.Form();
          form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
          });
        });

      // Parse the form data
      const { files } = await parseForm(req);

      const file = files.file[0]; // Assuming the file field is named 'file'
      const filePath = file.path; // Path to the uploaded file

      // File metadata for Google Drive
      const fileMetadata = {
        name: file.originalFilename,
        mimeType: file.headers["content-type"],
        parents: [process.env.PARENT_FOLDER], // Replace with your folder ID
      };

      // Media object to send to Google Drive
      const media = {
        mimeType: file.headers["content-type"],
        body: fs.createReadStream(filePath),
      };

      // Upload the file to Google Drive
      const driveResponse = await drive.files.create({
        resource: fileMetadata,
        media,
        fields: "id", // Only fetch the file ID
      });



      
      res.status(200).json({
        fileId: driveResponse.data.id,
      });
    } catch (error) {
      console.error("Error handling file upload:", error);
      res.status(500).json({ error: "Failed to upload to Google Drive" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
