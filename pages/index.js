import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_ENDPOINT = 'https://api.magickml.com/api';
const AGENT_ID = '9acc0d41-e867-4ae2-8ead-2f60cf003ae4';
const API_KEY = '3ad7bec48d6b8df5b1b3b1085cba7ec2';
const POLL_INTERVAL = 5000;

export default function Home() {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [chatTitle, setChatTitle] = useState('Your Chat Title Here');

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
    <div style={{ height: '100vh', background: 'linear-gradient(to right, #ff6a00, #ee0979)', padding: '50px', fontFamily: 'Comic Sans MS' }}>
      <input 
        value={chatTitle} 
        onChange={(e) => setChatTitle(e.target.value)} 
        placeholder="Set your chat title..."
        style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '2px solid white' }}
      />
      <h1 style={{ color: 'white', textAlign: 'center' }}>{chatTitle}</h1>
      <img src="https://framerusercontent.com/images/OONMMucdnpD4xGWMoRzpdMibGJ4.png?scale-down-to=512" alt="Y2K style image" style={{ width: '100%', marginBottom: '20px' }} />
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)' }}>
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
          style={{ width: '80%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '2px solid #ff6a00' }}
        />
        <button 
          onClick={sendMessage} 
          style={{ background: 'linear-gradient(to right, #ff6a00, #ee0979)', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)' }}
        >
          Send
        </button>
      </div>
      <p style={{ marginTop: '20px', color: 'white', fontSize: '14px' }}>
        Welcome to Y2K Chat! This app lets you chat with our advanced AI bot. Just type your message and hit send.
      </p>
    </div>
  );

}