import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const API_ENDPOINT = 'https://api.magickml.com/api';
const AGENT_ID = '9acc0d41-e867-4ae2-8ead-2f60cf003ae4';
const API_KEY = '3ad7bec48d6b8df5b1b3b1085cba7ec2';
const POLL_INTERVAL = 5000;
const chatTitle = "Magick Chat"; // Editable chat title
const chatDescription = "This is a Magick agent that you can chat with!"
const chatOtherInfo = "Help spread the word about Magick!"

const Container = styled(motion.div)`
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(45deg, #f3a5a7, #fdc3db);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
`;

const ChatContainer = styled(motion.div)`
    width: 90%;
    max-width: 500px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const ChatDisplay = styled(motion.div)`
    height: 300px;
    overflow-y: auto;
    padding: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const ChatInput = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 20px;
    background: #fdc3db;
`;

const TextArea = styled.textarea`
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 20px;
    outline: none;
    resize: none;
    margin-right: 10px;
`;

const SendButton = styled(motion.button)`
    padding: 10px 20px;
    border: none;
    border-radius: 20px;
    background: #f3a5a7;
    color: #fff;
    cursor: pointer;
    transition: background 0.3s;
    &:hover {
        background: #f37a83;
    }
`;

const ChatTitle = styled.div`
    background: #fdc3db;
    padding: 15px;
    text-align: center;
    font-size: 1.5em;
    font-weight: bold;
`;

const ChatDescription = styled.div`
    padding: 10px;
    text-align: center;
    background: rgba(253, 195, 219, 0.7);
`;

const ChatOtherInfo = styled.div`
    padding: 10px;
    text-align: center;
    font-size: 0.9em;
    margin-top: 20px;
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
        <ChatContainer initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
            <ChatTitle>{chatTitle}</ChatTitle>
            <ChatDescription>{chatDescription}</ChatDescription>
            <ChatDisplay>
                <AnimatePresence>
                    {chat.map((msg, index) => (
                        <motion.div key={index} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                            <strong>{msg.user}:</strong> {msg.message}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </ChatDisplay>
            <ChatInput>
                <TextArea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." />
                <SendButton onClick={sendMessage} whileHover={{ scale: 1.1 }}>Send</SendButton>
            </ChatInput>
        </ChatContainer>
        <ChatOtherInfo>{chatOtherInfo}</ChatOtherInfo>
    </Container>
);



}