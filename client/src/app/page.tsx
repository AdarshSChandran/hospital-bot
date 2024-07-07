'use client';

import Chat from '@/components/chat/Chat';
import Header from '@/components/header/Header';
import Intro from '@/components/intro/Intro';
import React, { useState } from 'react';

const Home = () => {
  const [showChatBox, setShowChatBox] = useState(false);

  const handleChat = () => {
    setShowChatBox(!showChatBox);
  };

  return (
    <div className="Home">
      <div className="Header">
        <Header handleChat={handleChat} showChatBox={showChatBox} />
      </div>
      {!showChatBox && (
        <div className="intro">
          <Intro handleChat={handleChat} />
        </div>
      )}
      {showChatBox && <Chat />}
    </div>
  );
};

export default Home;
