export default async function handler(req, res) {
  const VERIFY_TOKEN = "motiur";

  // ✅ Verification (Meta)
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send("Forbidden");
  }

  // ✅ Message receive
  if (req.method === "POST") {
    try {
      const entry = req.body.entry?.[0];
      const messaging = entry?.messaging?.[0];
      const senderId = messaging?.sender?.id;
      const messageText = messaging?.message?.text;

      // যদি টেক্সট না থাকে
      if (!senderId || !messageText) {
        return res.status(200).send("OK");
      }

      // 🧠 Gemini API call
      const geminiRes = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBJ0HnXdXH4U1yAsNNMu2TR-Oof0QJuoQI",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `তুমি একজন Facebook Page Sales Assistant।
সংক্ষেপে, ভদ্রভাবে উত্তর দাও।
প্রশ্ন: ${messageText}`
                  }
                ]
              }
            ]
          })
        }
      );

      const geminiData = await geminiRes.json();
      const reply =
        geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
        "দয়া করে আবার লিখুন 🙂";

      // 📤 Facebook reply
      await fetch(
        `https://graph.facebook.com/v19.0/me/messages?access_token=YOUR_PAGE_TOKEN`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipient: { id: senderId },
            message: { text: reply }
          })
        }
      );

      return res.status(200).send("EVENT_RECEIVED");
    } catch (e) {
      console.error(e);
      return res.status(200).send("ERROR");
    }
  }

  return res.status(405).send("Method Not Allowed");
}
