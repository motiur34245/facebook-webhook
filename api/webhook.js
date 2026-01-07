export default async function handler(req, res) {
  // 1️⃣ Verify (আগের মতোই)
  if (req.method === "GET") {
    const VERIFY_TOKEN = "motiurkhan";
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send("Invalid verify token");
  }

  // 2️⃣ Message receive
  if (req.method === "POST") {
    const entry = req.body.entry?.[0];
    const event = entry?.messaging?.[0];

    if (!event?.message?.text) {
      return res.status(200).send("EVENT_RECEIVED");
    }

    const senderId = event.sender.id;
    const userMessage = event.message.text;

    // 3️⃣ Fixed auto reply (এখন simple রাখি)
    const replyText = "ধন্যবাদ! আমরা শিগগিরই আপনাকে রিপ্লাই দেব।";

    // 4️⃣ Send reply to Facebook
    await fetch(
      `https://graph.facebook.com/v18.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: senderId },
          message: { text: replyText },
        }),
      }
    );

    return res.status(200).send("EVENT_RECEIVED");
  }
}
