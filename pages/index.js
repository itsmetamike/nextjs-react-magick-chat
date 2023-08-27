import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_ENDPOINT = 'https://api.magickml.com/api';
const AGENT_ID = '9acc0d41-e867-4ae2-8ead-2f60cf003ae4';
const API_KEY = '3ad7bec48d6b8df5b1b3b1085cba7ec2';
const POLL_INTERVAL = 5000;
const chatTitle = "Matrix Chat"; // Editable chat title

export default function Home() {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    // Add the user's message to the chat immediately
    setChat(prevChat => [...prevChat, { user: 'You', message }]);
    
    try {
      const response = await axios.post(API_ENDPOINT, {
        content: message,
        agentId: AGENT_ID
      }, {
        headers: {
          'Authorization': API_KEY,
          'Content-Type': 'application/json'
        }
      });
      // Add the bot's response to the chat
      setChat(prevChat => [...prevChat, { user: 'Bot', message: response.data.result.Output }]);
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
        if (response.data && Array.isArray(response.data)) {
          // Only append new messages if there are any
          const newMessagesCount = response.data.length - chat.length;
          if (newMessagesCount > 0) {
            const newMessages = response.data.slice(-newMessagesCount);
            setChat(prevChat => [...prevChat, ...newMessages]);
          }
        } else {
          console.error("Invalid data format received:", response.data);
        }
      } catch (error) {
        console.error("Error polling for messages:", error);
      }
    };
  
    // Start polling
    const intervalId = setInterval(pollMessages, POLL_INTERVAL);
  
    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [chat]);  // Add chat as a dependency to the useEffect

  

  return (
    <div style={{ height: '100vh', backgroundColor: 'black', padding: '50px', fontFamily: 'Courier New, Courier, monospace' }}>
      <h1 style={{ color: '#00FF00' }}>{chatTitle}</h1>
      <img src="https://framerusercontent.com/images/OONMMucdnpD4xGWMoRzpdMibGJ4.png?scale-down-to=512" alt="Matrix Icon" />
      <div style={{ color: '#00FF00', fontSize: '12px', marginBottom: '20px' }}>
        Welcome to Matrix Chat - A sleek y2k style chat interface.
      </div>
      <div style={{ backgroundColor: '#1A1A1A', padding: '20px', borderRadius: '10px' }}>
        {chat.map((msg, index) => (
          <div key={index}>
            <strong style={{ color: msg.user === 'You' ? '#00FF00' : '#FF4500' }}>{msg.user}:</strong> {msg.message}
          </div>
        ))}
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          style={{ width: '80%', padding: '10px', margin: '10px 0', backgroundColor: '#333', color: '#00FF00', border: '1px solid #00FF00' }}
        />
        <button style={{ backgroundColor: '#00FF00', color: 'black', border: 'none', padding: '5px 10px', borderRadius: '5px' }} onClick={sendMessage}>Send</button>
      </div>
    </div>
  );

}