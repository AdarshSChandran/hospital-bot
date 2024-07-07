import React, { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';
import ChatInputBox from '../chatInputBox/chatInputBox';
import { io, Socket } from 'socket.io-client';
import { User, Bot } from 'lucide-react';

type ChatMessage = {
  user: string;
  text: string;
};

const Chat = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io('https://hospital-bot.azurewebsites.net');
    socketRef.current = socket;

    const handleBotMessage = (response: string) => {
      setChat((prevChat) => [...prevChat, { user: 'bot', text: response }]);
    };

    socket.on('botmes', handleBotMessage);

    return () => {
      socket.off('botmes', handleBotMessage);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && socketRef.current) {
      socketRef.current.emit('human', message); // Emit the 'human' event with the message
      setChat((prevChat) => [...prevChat, { user: 'user', text: message }]);
      setMessage('');
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatViewArea}>
        {chat.map((message, index) => (
          <div
            key={index}
            className={message.user === 'bot' ? styles.bot : styles.user}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {message.user === 'bot' && (
                <Bot style={{ color: 'black' }} />
              )}
              <p>{message.text}</p>
              {message.user === 'user' && <User style={{ color: 'black' }} />}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className={styles.chatBox}>
        <ChatInputBox
          sendMessage={sendMessage}
          message={message}
          setMessage={setMessage}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
};

export default Chat;
