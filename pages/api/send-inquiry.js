import { google } from "googleapis";



export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body;


  // Load the service account credentials
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

  try {
    // Authorize using service account
    const auth = new google.auth.GoogleAuth({
      SERVICE_ACCOUNT_CREDENTIALS,
      scopes: ["https://www.googleapis.com/auth/gmail.send", "https://www.googleapis.com/auth/gmail.compose"],
    });

    const gmail = google.gmail({ version: "v1", auth });

    // Create the email
    const rawMessage = [
      "Content-Type: text/plain; charset=UTF-8",
      "MIME-Version: 1.0",
      "Content-Transfer-Encoding: 7bit",
      `From: ${SERVICE_ACCOUNT_CREDENTIALS.client_email}`,
      `To: hmsa@hinduyuva.org`,
      `Reply-To: ${email}`,
      `Subject: Inquiry from ${name}`,
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Message: ${message}`,
    ].join("\n");

    // Send email using Gmail API
    await gmail.users.messages.send({
      userId: "me", // "me" refers to the authenticated user
      requestBody: {
        raw: Buffer.from(rawMessage).toString("base64").replace(/\+/g, "-").replace(/\//g, "_"), // Encode in base64url format
      },
    });

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
}
