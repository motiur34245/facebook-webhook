export default async function handler(req, res) {
  // 👉 VERIFY TOKEN (Meta verification)
  if (req.method === "GET") {
    const VERIFY_TOKEN = "motiur";

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verified");
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send("Verification failed");
    }
  }

  // 👉 Incoming messages
  if (req.method === "POST") {
    console.log("Webhook Event:", JSON.stringify(req.body, null, 2));
    return res.status(200).send("EVENT_RECEIVED");
  }

  res.status(405).send("Method Not Allowed");
}
