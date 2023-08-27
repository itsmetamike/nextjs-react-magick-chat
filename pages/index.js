import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const API_ENDPOINT = 'https://api.magickml.com/api';
const AGENT_ID = '9acc0d41-e867-4ae2-8ead-2f60cf003ae4';
const API_KEY = '3ad7bec48d6b8df5b1b3b1085cba7ec2';
const POLL_INTERVAL = 5000;
const chatTitle = "Matrix Chat"; // Editable chat title
const Container = styled(motion.div)`
  height: 100vh;
  padding: 50px;
  background: black;
  font-family: 'Courier New', monospace;
  color: limegreen;
`;

const Message = styled(motion.div)`
  &:hover {
    opacity: 0.7;
  }
`;

const Input = styled.input`
  width: 80%;
  padding: 10px;
  margin: 10px 0;
  background-color: black;
  color: limegreen;
  border: 1px solid limegreen;
  &:focus {
    outline: none;
    border: 1px solid white;
  }
`;

const Button = styled.button`
  background-color: limegreen;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  transition: opacity 0.3s;
  &:hover {
    opacity: 0.8;
  }
`;

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
    <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.h1 initial={{ y: -50 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>{chatTitle}</motion.h1>
      <motion.img src="https://framerusercontent.com/images/OONMMucdnpD4xGWMoRzpdMibGJ4.png?scale-down-to=512" alt="Image" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }} />
      <motion.p initial={{ y: 50 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>Welcome to the chat interface.</motion.p>
      <div style={{ padding: '20px', border: '2px solid limegreen', borderRadius: '10px' }}>
        <AnimatePresence>
          {chat.map((msg, index) => (
            <Message key={index} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
              <strong>{msg.user}:</strong> {msg.message}
            </Message>
          ))}
        </AnimatePresence>
        <Input value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your message..." />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </Container>
  );


}