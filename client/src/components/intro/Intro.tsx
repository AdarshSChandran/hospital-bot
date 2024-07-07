import React from 'react';

import styles from './page.module.css';

const Intro = ({ handleChat }: { handleChat: () => void }) => {
  return (
    <div className={styles.introComponent} onClick={handleChat}>
      <p className={styles.introText}>
        Welcome to the Munich City Hospital Appointment Booking site. Click here
        to start booking your appointment.
      </p>
    </div>
  );
};

export default Intro;
