import axios from 'axios';

const API_ENDPOINT = 'https://api.magickml.com/api';
const AGENT_ID = '0fdcf186-0a5a-4919-9bef-1bc543909b81';
const API_KEY = '6d41694cc0e084bca0ce5dda74b670da';

// Initialize messages as an array
const messages = [];
export { messages };

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

      console.log("API Response:", apiResponse.data);

      const botReply = apiResponse.data.reply;
      console.log("Current Messages:", messages);

      if (botReply) {
        messages.push({ user: 'Bot', message: botReply });
      } else {
        console.warn("Bot reply was empty or undefined.");
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error fetching bot's reply:", error);
      res.status(500).json({ error: 'Failed to get reply from the API' });
    }

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
