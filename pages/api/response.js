import axios from 'axios';
import messages from './store';
import { API_ENDPOINT, AGENT_ID, API_KEY } from './config';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userMessage = req.body.content;
  messages.push({ user: 'You', message: userMessage });

  try {
    const { data } = await axios.post(API_ENDPOINT, {
      content: userMessage,
      agentId: AGENT_ID
    }, {
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (data && data.reply) {
      messages.push({ user: 'Bot', message: data.reply });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error fetching bot's reply:", error);
    res.status(500).json({ error: 'Failed to get reply from the API' });
  }
}
