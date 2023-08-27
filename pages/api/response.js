import axios from 'axios';

const API_ENDPOINT = 'https://api.magickml.com/api';
const AGENT_ID = '0fdcf186-0a5a-4919-9bef-1bc543909b81';
const API_KEY = '6d41694cc0e084bca0ce5dda74b670da';

// Use a shared in-memory store
export const messages = [];

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

      const botReply = apiResponse.data.result.Output;
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
