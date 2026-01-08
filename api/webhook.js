export default function handler(req, res) {
  try {
    // VERIFY
    if (req.method === "GET") {
      const VERIFY_TOKEN = "motiur";
      const mode = req.query["hub.mode"];
      const token = req.query["hub.verify_token"];
      const challenge = req.query["hub.challenge"];

      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        return res.status(200).send(challenge);
      }
      return res.sendStatus(403);
    }

    // RECEIVE MESSAGE
    if (req.method === "POST") {
      console.log("FB EVENT RECEIVED:", JSON.stringify(req.body));
      return res.status(200).send("EVENT_RECEIVED");
    }

    return res.sendStatus(404);
  } catch (e) {
    console.error("ERROR:", e);
    return res.status(500).send("ERROR");
  }
}
