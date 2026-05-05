/* 
   BREADCRUMB: Netlify Function - Secure Shout-out Proxy
   Architecture: Handler -> Multi-Dispatch (Discord + Google Sheets)
   Impact: Zero-waste on client resources; Protects sensitive Discord & Google secrets.
*/

export const handler = async (event) => {
  // BREADCRUMB: Enforce POST method to prevent unauthorized GET/crawling
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { name, message } = JSON.parse(event.body);

    if (!name || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Name and message are required." }),
      };
    }

    // TODO: BREADCRUMB: Ensure these are set in Netlify Site Settings -> Environment Variables
    const DISCORD_URL = process.env.DISCORD_WEBHOOK_URL;
    const SHEETS_URL  = process.env.SHEETS_ENDPOINT_URL;
    
    if (!DISCORD_URL) {
      console.error("BREADCRUMB: Missing DISCORD_WEBHOOK_URL env var.");
      return { statusCode: 500, body: "Server configuration missing." };
    }

    // ── 1. Discord Payload ──────────────────────────────────────────
    const discordPayload = {
      username: 'FMP Shout-Out',
      avatar_url: 'https://i.imgur.com/SjeIgZV.png',
      embeds: [{
        color: 0xEAB308,
        title: '📢 New Shout-Out!',
        fields: [
          { name: 'From', value: name, inline: true },
          { name: 'Message', value: message, inline: false }
        ],
        footer: { text: 'Securely proxied via Netlify Functions' },
        timestamp: new Date().toISOString()
      }]
    };

    // ── 2. Parallel Dispatch ────────────────────────────────────────
    // BREADCRUMB: Using Promise.allSettled to ensure failure in one doesn't kill the other (Zero-Waste Resilience)
    const discordPromise = fetch(DISCORD_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload)
    });

    let sheetsPromise = Promise.resolve({ ok: true });
    if (SHEETS_URL) {
      sheetsPromise = fetch(SHEETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message })
      });
    }

    const [discordRes, sheetsRes] = await Promise.allSettled([discordPromise, sheetsPromise]);

    const discordOk = discordRes.status === 'fulfilled' && discordRes.value.ok;
    
    // BREADCRUMB: We consider the operation successful if at least Discord succeeds
    if (discordOk) {
      return {
        statusCode: 200,
        body: JSON.stringify({ status: "success" }),
      };
    } else {
      throw new Error("Primary dispatch (Discord) failed.");
    }

  } catch (error) {
    console.error("BREADCRUMB: Serverless Function Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
