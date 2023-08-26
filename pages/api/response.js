// response.js
import axios from 'axios';
import { messages } from './getMessages';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const userMessage = req.body.content;

    // Add the user's message to the in-memory store
    messages.push({ user: 'You', message: userMessage });

    try {
      const apiResponse = await axios.post(API_ENDPOINT, {
        content: userMessage,
        agentId: AGENT_ID
      }, {
        headers: {
          'Authorization': API_KEY,
          'Content-Type': 'application/json'
        }
      });

      const botReply = apiResponse.data.reply;

      // Add the bot's reply to the in-memory store
      messages.push({ user: 'Bot', message: botReply });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error fetching bot's reply:", error);
      res.status(500).json({ error: 'Failed to get reply from the API' });
    }

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
