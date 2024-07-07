import React from 'react';
import styles from './page.module.css';
import { ArrowLeft } from 'lucide-react';

const Header = ({ handleChat, showChatBox }: any) => {
  return (
    <div className={styles.headerSection}>
      <h2 className={styles.headerTitle}>
        Hospital <span style={{ color: '#DE2E7D' }}>Appointment Booking</span>
      </h2>
      {showChatBox && (
        <h4 onClick={handleChat} className={styles.backButton}>
          <ArrowLeft />
          Back
        </h4>
      )}
    </div>
  );
};

export default Header;
