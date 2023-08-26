// This is a simple in-memory store for our messages.
// In a production scenario, consider using a database.
let messages = [];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;
    messages.push({ user: 'Bot', message });
    res.status(200).json({ status: 'success' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default function handler(req, res) {
    if (req.method === 'POST') {
      // Extract the message from the request payload
      const { message } = req.body;
  
      // TODO: Handle the message, for example, store it in some database or in-memory storage
      // For this example, we'll just log it
      console.log("Received message from magick:", message);
  
      res.status(200).json({ status: 'success' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }
  