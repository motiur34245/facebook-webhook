export default async function handler(req, res) {
  // VERIFY
  if (req.method === "GET") {
    const VERIFY_TOKEN = "motiur";
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.sendStatus(403);
  }

  // RECEIVE MESSAGE
  if (req.method === "POST") {
    const entry = req.body.entry?.[0];
    const messaging = entry?.messaging?.[0];

    if (messaging?.message?.text) {
      const senderId = messaging.sender.id;
      const text = messaging.message.text;

      // SEND REPLY
      await fetch(
        `https://graph.facebook.com/v18.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipient: { id: senderId },
            message: { text: "Reply from bot: " + text },
          }),
        }
      );
    }

    return res.status(200).send("EVENT_RECEIVED");
  }

  res.sendStatus(404);
      }
