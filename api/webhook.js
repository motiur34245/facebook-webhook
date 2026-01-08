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
      }
      return res.sendStatus(403);
    }

    // ===== MESSAGE =====
    if (req.method === "POST") {
      const body = req.body;

      if (body.object === "page") {
        body.entry.forEach(async (entry) => {
          const webhookEvent = entry.messaging[0];
          const senderId = webhookEvent.sender.id;

          if (webhookEvent.message && webhookEvent.message.text) {
            const reply = {
              recipient: { id: senderId },
              message: { text: "BOT REPLY: hi 👋" },
            };

            await fetch(
              `https://graph.facebook.com/v18.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reply),
              }
            );
          }
        });

        return res.status(200).send("EVENT_RECEIVED");
      }
    }

    return res.sendStatus(404);
  } catch (e) {
    console.error(e);
    return res.status(500).send("ERROR");
  }
}
