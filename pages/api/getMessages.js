// Import the shared in-memory store from response.js
import { messages } from './response';

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(messages);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
