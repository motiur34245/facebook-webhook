export default async function handler(req, res) {
  const VERIFY_TOKEN = "motiur";
  const PAGE_TOKEN = process.env.PAGE_TOKEN;
  const GEMINI_KEY = process.env.GEMINI_KEY;

  // 🔹 Verify webhook
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send("Forbidden");
  }

  // 🔹 Handle messages
  if (req.method === "POST") {
    const entry = req.body.entry?.[0];
    const event = entry?.messaging?.[0];
    const senderId = event?.sender?.id;
    const userText = event?.message?.text;

    if (!userText) return res.sendStatus(200);

    // 🔹 Call Gemini AI
    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userText }] }],
        }),
      }
    );

    const aiData = await aiRes.json();
    const reply =
      aiData.candidates?.[0]?.content?.parts?.[0]?.text ||
      "দুঃখিত, একটু পরে আবার লিখুন 🙂";

    // 🔹 Send reply to Facebook
    await fetch(
      `https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: senderId },
          message: { text: reply },
        }),
      }
    );

    return res.sendStatus(200);
  }
}
