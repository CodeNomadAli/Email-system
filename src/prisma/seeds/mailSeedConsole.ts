import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import dotenv from "dotenv";

dotenv.config();
process.env.NODE_OPTIONS = "--dns-result-order=ipv4first";

// Factory function to create new IMAP client
function createClient() {
  return new ImapFlow({
    host: process.env.IMAP_HOST,
    port: Number(process.env.IMAP_PORT),
    secure: true,
    auth: {
      user: process.env.IMAP_USER,
      pass: process.env.IMAP_PASS,
    },
    logger: false,
  });
}

// Retry connection helper (creates a new client each attempt)
async function connectWithRetry(retries = 5, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const client = createClient();

    try {
      console.log(`Connecting to IMAP (attempt ${attempt}/${retries})...`);
      await client.connect();
      console.log("Connected successfully!");
      
return client; // Return the connected client
    } catch (err) {
      console.warn(`IMAP connect failed (attempt ${attempt}): ${err.message}`);
      await client.logout().catch(() => {});

      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs));
      } else {
        throw new Error("IMAP connection failed after retries");
      }
    }
  }
}

export default async function fetchEmails() {
  let client;

  try {
    client = await connectWithRetry();

    const lock = await client.getMailboxLock("INBOX");

    try {
      for await (const message of client.fetch("1:*", { source: true})) {
        const parsed = await simpleParser(message.source);

        const fromEmail = parsed.from?.value?.[0]?.address || "";
  const toEmail = parsed.to?.value?.[0]?.address || "";
  const subject = parsed.subject || "";
  const body = parsed.text || ""; // plain text
  const htmlBody = parsed.html || ""; // HTML version

  // Filter only cloud.io / Hide My Email
  if (toEmail.endsWith("@icloud.com") || toEmail.includes("putter-calypso") || toEmail.includes("2-cellist-opulent")) {
    console.log("FROM:", fromEmail);
    console.log("TO:", toEmail);
    console.log("SUBJECT:", subject);
    console.log("BODY:", body);
    console.log("------------------------");
  }
      }
    } finally {
      lock.release();
    }
  } catch (err) {
    console.error("Error in fetchEmails:", err);
    process.exit(1);
  } finally {
    if (client) await client.logout().catch(() => {});
  }
}

// Run directly from CLI
if (require.main === module) {
  fetchEmails();
}
