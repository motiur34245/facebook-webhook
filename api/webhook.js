export default function handler(req, res) {
  const VERIFY_TOKEN = "motiur";

  // Facebook verification
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send("Forbidden");
  }

  // Facebook message receive
  if (req.method === "POST") {
    console.log("Webhook received:", JSON.stringify(req.body, null, 2));
    return res.status(200).send("EVENT_RECEIVED");
  }

  res.status(404).send("Not Found");
}
