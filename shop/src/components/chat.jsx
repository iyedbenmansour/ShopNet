import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function Chat() {
  const { sellerId } = useParams(); // ID from the URL
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      const decoded = jwtDecode(token);
      const currentUserId = decoded.id; // ID from the token
      setUserId(currentUserId);

      const newSocket = io('http://localhost:3000', {
        query: { token },
      });
      setSocket(newSocket);

      (async () => {
        try {
          const messagesResponse = await axios.get(
            `http://localhost:5000/api/messages/${currentUserId}/${sellerId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setMessages(messagesResponse.data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      })();

      newSocket.on('receiveMessage', (msg) => {
        if (
          (msg.senderId === sellerId && msg.receiverId === currentUserId) ||
          (msg.senderId === currentUserId && msg.receiverId === sellerId)
        ) {
          setMessages((prevMessages) => [...prevMessages, msg]);
        }
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [sellerId]);

  const sendMessage = () => {
    const token = sessionStorage.getItem('authToken');
    if (message.trim() && token && socket) {
      socket.emit('sendMessage', {
        message,
        senderId: userId,
        receiverId: sellerId,
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { senderId: userId, receiverId: sellerId, message },
      ]);
      setMessage('');
    }
  };

  return (
    <div style={{ width: '100%', padding: '10px' }}>
      <div style={{ marginBottom: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.senderId === userId ? 'You' : 'Seller'}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        style={{ width: '80%', marginRight: '10px' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}