export default async function handler(req, res) {
  const VERIFY_TOKEN = "motiur"; // Meta dashboard এ যেটা দিয়েছো

  // ===============================
  // 1️⃣ Webhook Verification (GET)
  // ===============================
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send("Invalid verify token");
  }

  // ===============================
  // 2️⃣ Message Receive (POST)
  // ===============================
  if (req.method === "POST") {
    const entry = req.body.entry?.[0];
    const event = entry?.messaging?.[0];

    // ❌ যদি message না থাকে
    if (!event || !event.message) {
      return res.status(200).send("No message");
    }

    // ❌ Page নিজে যে message পাঠায় (echo) → ignore
    if (event.message.is_echo) {
      return res.status(200).send("Echo ignored");
    }

    const senderId = event.sender.id;
    const userText = event.message.text || "";

    // ===============================
    // 3️⃣ SIMPLE AUTO REPLY (test)
    // ===============================
    let replyText = "হ্যালো 👋\nআমাদের পেজে যোগাযোগ করার জন্য ধন্যবাদ।\nদাম বা অর্ডার জানতে লিখুন 😊";

    if (userText.includes("দাম")) {
      replyText = "📚 বইটির দাম ৩৫০ টাকা।\nঅর্ডার করতে চাইলে নাম ও ঠিকানা পাঠান।";
    }

    if (userText.includes("অর্ডার")) {
      replyText = "✅ অর্ডার করতে আপনার নাম, ঠিকানা ও ফোন নাম্বার লিখুন।";
    }

    // ===============================
    // 4️⃣ Send Message to Facebook
    // ===============================
    await fetch(
      `https://graph.facebook.com/v18.0/me/messages?access_token=${process.env.PAGE_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: senderId },
          message: { text: replyText },
        }),
      }
    );

    return res.status(200).send("Message sent");
  }

  return res.status(405).send("Method not allowed");
}
