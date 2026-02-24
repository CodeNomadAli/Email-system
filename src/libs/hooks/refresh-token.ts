import readline from 'readline';

import { google } from 'googleapis';

// Your credentials
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env


const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

async function main() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // important for refresh token
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this url:\n', authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('\nEnter the code from that page here: ', async (code) => {
    rl.close();
    const { tokens } = await oauth2Client.getToken(code);

    console.log('\n✅ Refresh Token:\n', tokens.refresh_token);
  });
}

main().catch(console.error);
