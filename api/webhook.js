export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  const VERIFY_TOKEN = "motiur";

  // ✅ 1. Facebook Webhook Verify
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send("Invalid verify token");
    }
  }

  // ✅ 2. Receive Message
  if (req.method === "POST") {
    const entry = req.body?.entry?.[0];
    const messaging = entry?.messaging?.[0];

    if (!messaging?.message?.text) {
      return res.status(200).send("EVENT_RECEIVED");
    }

    const userText = messaging.message.text;
    const senderId = messaging.sender.id;

    // ✅ 3. Gemini AI Call
    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
তুমি একজন বাংলা Facebook Page sales assistant।
তুমি বই বিক্রি করো।
সব উত্তর বাংলায় দেবে।
দাম, ডেলিভারি, অর্ডার সম্পর্কে পরিষ্কার বলবে।
শেষে ভদ্রভাবে অর্ডারের দিকে নিয়ে যাবে।

User message: ${userText}
                  `,
                },
              ],
            },
          ],
        }),
      }
    );

    const aiData = await aiResponse.json();
    const replyText =
      aiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "দুঃখিত, একটু পরে আবার লিখুন 🙂";

    // ✅ 4. Send Reply to Facebook
    await fetch(
      `https://graph.facebook.com/v19.0/me/messages?access_token=${process.env.PAGE_TOKEN}`,
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

  return res.status(404).send("Not Found");
}
