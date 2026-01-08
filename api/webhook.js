export default async function handler(req, res) {

  // ======================
  // 1️⃣ Facebook VERIFY (GET)
  // ======================
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send("Forbidden");
    }
  }

  // ======================
  // 2️⃣ Facebook MESSAGE (POST)
  // ======================
  if (req.method === "POST") {

    const entry = req.body.entry?.[0];
    const event = entry?.messaging?.[0];

    if (!event) return res.sendStatus(200);

    // 🔴 IMPORTANT: Bot নিজের পাঠানো মেসেজ ignore
    if (event.message?.is_echo) {
      return res.sendStatus(200);
    }

    const senderId = event.sender?.id;
    const userText = event.message?.text;

    if (!senderId || !userText) {
      return res.sendStatus(200);
    }

    // ======================
    // 3️⃣ Gemini AI Call
    // ======================
    const aiReply = await getGeminiReply(userText);

    // ======================
    // 4️⃣ Send Reply to Facebook
    // ======================
    await sendMessage(senderId, aiReply);

    return res.sendStatus(200);
  }

  return res.sendStatus(405);
}

// ======================
// Gemini AI Function
// ======================
async function getGeminiReply(userText) {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    "তুমি একজন Facebook Page Sales Assistant। সংক্ষেপে, ভদ্রভাবে উত্তর দাও।\n\nUser: " +
                    userText,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "দুঃখিত, একটু পরে আবার লিখুন 🙂"
    );
  } catch (error) {
    return "দুঃখিত, কিছু সমস্যা হচ্ছে 🙂";
  }
}

// ======================
// Send Message Function
// ======================
async function sendMessage(senderId, text) {
  await fetch(
    "https://graph.facebook.com/v19.0/me/messages?access_token=" +
      process.env.PAGE_ACCESS_TOKEN,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: senderId },
        message: { text },
      }),
    }
  );
}
