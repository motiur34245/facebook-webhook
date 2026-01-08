export default async function handler(req, res) {
  // VERIFY
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send("Forbidden");
  }

  // MESSAGE
  if (req.method === "POST") {
    const entry = req.body.entry?.[0];
    const event = entry?.messaging?.[0];

    if (!event?.sender?.id || !event?.message?.text) {
      return res.status(200).send("OK");
    }

    const senderId = event.sender.id;
    const text = event.message.text;

    await fetch(
      https://graph.facebook.com/v18.0/me/messages?access_token=${process.env.PAGE_TOKEN},
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: senderId },
          message: { text: "আপনি লিখেছেন: " + text },
        }),
      }
    );

    return res.status(200).send("OK");
  }

  res.status(405).end();
}
