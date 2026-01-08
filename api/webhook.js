export default async function handler(req, res) {
  const VERIFY_TOKEN = "motiur";
  const PAGE_TOKEN = process.env.PAGE_TOKEN;

  // 🔹 Verification
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.sendStatus(403);
  }

  // 🔹 Message receive
  if (req.method === "POST") {
    const entry = req.body.entry?.[0];
    const event = entry?.messaging?.[0];

    if (!event) return res.sendStatus(200);

    // ❌ নিজের পাঠানো মেসেজ ignore
    if (event.message?.is_echo) {
      return res.sendStatus(200);
    }

    const senderId = event.sender.id;
    const userText = event.message?.text;

    if (!userText) return res.sendStatus(200);

    // ✅ simple reply (test)
    await fetch(
      `https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: senderId },
          message: {
            text: "হ্যালো 👋 আপনার মেসেজ পেয়েছি। অর্ডার বা দাম জানতে লিখুন 😊",
          },
        }),
      }
    );

    return res.sendStatus(200);
  }

  res.sendStatus(404);
}
