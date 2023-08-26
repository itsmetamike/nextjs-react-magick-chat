import { messages } from './response';

export default function handler(req, res) {
  if (req.method === 'GET') {
    console.log("Sending messages:", messages);  // Log the messages being sent
    res.status(200).json(messages);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
