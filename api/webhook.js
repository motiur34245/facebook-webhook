export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  const VERIFY_TOKEN = "motiurkhan";

  // Webhook verify
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send("Invalid verify token");
  }

  // Receive message
  if (req.method === "POST") {
    const entry = req.body.entry?.[0];
    const messaging = entry?.messaging?.[0];

    if (messaging && messaging.sender && messaging.message?.text) {
      const senderId = messaging.sender.id;

      const replyText =
        "হ্যালো 👋\nআমাদের পেজে যোগাযোগ করার জন্য ধন্যবাদ।\nদাম, ডেলিভারি বা অর্ডার জানতে লিখুন 😊";

      const PAGE_TOKEN = process.env.PAGE_TOKEN;

      await fetch(
        `https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_TOKEN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipient: { id: senderId },
            message: { text: replyText },
          }),
        }
      );
    }

    return res.status(200).send("EVENT_RECEIVED");
  }

  res.status(404).send("Not found");
          }
