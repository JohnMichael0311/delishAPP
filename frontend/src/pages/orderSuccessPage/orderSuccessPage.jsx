import React from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './orderSuccessPage.module.css';
import Button from '../../components/Button/Button';

export default function OrderSuccessPage() {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <h1>🎉 Payment Successful!</h1>
        <p>Your order has been placed successfully.</p>
        <p>Thank you for ordering with us!</p>
        <Button
          text="Back to Home"
          onClick={handleBackToHome}
          width="200px"
          height="3rem"
        />
      </div>
    </div>
  );
}
