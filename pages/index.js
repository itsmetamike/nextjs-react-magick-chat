import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_ENDPOINT = 'https://api.magickml.com/api';
const AGENT_ID = '0fdcf186-0a5a-4919-9bef-1bc543909b81';
const API_KEY = '6d41694cc0e084bca0ce5dda74b670da';
const POLL_INTERVAL = 5000;

export default function Home() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    try {
      await axios.post('/api/response', {
        content: message,
        agentId: AGENT_ID
      }, {
        headers: {
          'Authorization': API_KEY,
          'Content-Type': 'application/json'
        }
      });
      setMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  

  const handleKeyPress = (event) => {
    if (event.ctrlKey && event.key === 'Enter') {
      sendMessage();
    }
  };

  useEffect(() => {
    const pollMessages = async () => {
      try {
        const response = await axios.get('/api/getMessages');
        setChat(response.data);
      } catch (error) {
        console.error("Error polling for messages:", error);
      }
    };

    // Start polling
    const intervalId = setInterval(pollMessages, POLL_INTERVAL);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ height: '100vh', background: 'linear-gradient(to right, #ff6a00, #ee0979)', padding: '50px' }}>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
        {chat.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          style={{ width: '80%', padding: '10px', margin: '10px 0' }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}