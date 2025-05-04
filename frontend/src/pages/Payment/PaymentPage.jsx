
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './paymentPage.module.css';
import { getNewOrderForCurrentUser } from '../../services/orderService';
import Title from '../../components/Title/Title';
import OrderItemsList from '../../components/OrderItemsList/OrderItemsList';
import Map from '../../components/Map/Map';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import Button from '../../components/Button/Button';
import axios from 'axios';

export default function PaymentPage() {
  const [order, setOrder] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  useEffect(() => {
    getNewOrderForCurrentUser()
      .then(data => setOrder(data))
      .catch(() => toast.error('Failed to load order data'));
  }, []);

  if (!order) return <div>Loading...</div>;

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError('');

    try {
      // Create payment intent via backend
      const res = await axios.post('http://localhost:5000/api/payment/create-payment-intent', {
        amount: order.totalPrice * 100, // Stripe expects cents
      });

      const clientSecret = res.data.clientSecret;

      // Confirm card payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        setIsProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        toast.success('Payment successful!');
        navigate('/order-success');
      }
    } catch (error) {
      setError(error.message || 'Payment failed');
      setIsProcessing(false);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Title title="Order Form" fontSize="1.6rem" />
        <div className={classes.summary}>
          <div>
            <h3>Name:</h3>
            <span>{order.name}</span>
          </div>
          <div>
            <h3>Address:</h3>
            <span>{order.address}</span>
          </div>
        </div>
        <OrderItemsList order={order} />
      </div>

      <div className={classes.map}>
        <Title title="Your Location" fontSize="1.6rem" />
        <Map readonly={true} location={order.addressLatLng} />
      </div>

      <div className={classes.card_element}>
        <Title title="Enter Payment Details" fontSize="1.6rem" />
        <CardElement />
        {error && <p className={classes.error}>{error}</p>}
      </div>

      <div className={classes.buttons_container}>
        <div className={classes.buttons}>
          <Button
            text={isProcessing ? 'Processing...' : 'Pay Now'}
            onClick={handlePayment}
            disabled={isProcessing || !stripe || !elements}
            width="100%"
            height="3rem"
          />
        </div>
      </div>
    </div>
  );
}
