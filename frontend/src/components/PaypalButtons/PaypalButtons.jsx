import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../../hooks/useCart';
import { useLoading } from '../../hooks/useLoading';
import { pay } from '../../services/orderService';

export default function DummyPayment({ order }) {
  const { clearCart } = useCart();
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  const handleDummyPayment = async () => {
    try {
      showLoading();
      
      // Simulate a successful payment (e.g., you can add a delay if needed)
      const paymentId = 'dummy_payment_' + Date.now(); // Generate a fake payment ID

      // Simulate payment response
      const paymentDetails = {
        paymentId,
        orderId: order._id,
        amount: order.totalPrice,
        paymentMethod: 'Dummy Payment',
        status: 'Success',
        date: new Date(),
      };

      // Call the backend to save payment details in the DB
      const savedOrderId = await pay(paymentDetails);

      // Clear cart after successful payment
      clearCart();

      // Display success message and redirect
      toast.success('Payment Successful', 'Success');
      navigate('/track/' + savedOrderId);
    } catch (error) {
      toast.error('Payment Failed', 'Error');
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="dummy-payment">
      <h2>Complete Payment</h2>
      <p>Amount: 	₹{order.totalPrice}</p>
      <button onClick={handleDummyPayment} className="btn btn-success">
        Pay Now
      </button>
    </div>
  );
}
