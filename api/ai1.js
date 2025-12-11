// Serverless function for Vercel
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text, target } = req.body || {};
    if (!text || !target) {
      return res.status(400).json({ error: "Missing 'text' or 'target'." });
    }

    const apiKey = process.env.GOOGLE_TRANSLATE_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing API key" });
    }

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: text, target })
      }
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      return res
        .status(response.status || 500)
        .json({ error: data.error?.message || "Translation API error" });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Unexpected server error" });
  }
}
