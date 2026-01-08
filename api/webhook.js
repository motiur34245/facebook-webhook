export default async function handler(req, res) {
  try {
    // ===== VERIFY =====
    if (req.method === "GET") {
      const VERIFY_TOKEN = "motiur";

      const mode = req.query["hub.mode"];
      const token = req.query["hub.verify_token"];
      const challenge = req.query["hub.challenge"];

      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        return res.status(200).send(challenge);
      } else {
        return res.sendStatus(403);
      }
    }

    // ===== RECEIVE MESSAGE =====
    if (req.method === "POST") {
      const body = req.body;

      if (!body || !body.entry) {
        return res.status(200).send("NO_EVENT");
      }

      const entry = body.entry[0];
      const messaging = entry.messaging && entry.messaging[0];

      if (messaging && messaging.message && messaging.message.text) {
        const senderId = messaging.sender.id;
        const messageText = messaging.message.text;

        const pageToken = process.env.PAGE_ACCESS_TOKEN;

        if (!pageToken) {
          console.error("PAGE_ACCESS_TOKEN missing");
          return res.status(500).send("TOKEN_MISSING");
        }

        await fetch(
          `https://graph.facebook.com/v18.0/me/messages?access_token=${pageToken}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              recipient: { id: senderId },
              message: { text: "BOT OK: " + messageText },
            }),
          }
        );
      }

      return res.status(200).send("EVENT_RECEIVED");
    }

    return res.sendStatus(404);
  } catch (error) {
    console.error("WEBHOOK ERROR:", error);
    return res.status(500).send("ERROR");
  }
            }
