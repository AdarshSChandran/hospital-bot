'use client';

import React, { useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import styles from './page.module.css';

const ChatInputBox = ({ sendMessage, message, setMessage, inputRef  }: any) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <form onSubmit={sendMessage} className={styles.chatInputBox}>
      <div className={styles.textareaContainer}>
        <textarea
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          placeholder="Message Bot"
          className={styles.inputBox}
        />
        <button type="submit" className={styles.sendButton}>
          <SendHorizontal color="#de2e7d" />
        </button>
      </div>
    </form>
  );
};

export default ChatInputBox;
