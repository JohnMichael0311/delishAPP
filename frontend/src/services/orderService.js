import axios from 'axios';

// Create a new order
export const createOrder = async (order) => {
  try {
    const { data } = await axios.post('/api/orders/create', order);
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
};

// Dummy payment function to simulate saving payment
export const pay = async (paymentDetails) => {
  try {
    // Here we're sending dummy payment details to the backend
    const { data } = await axios.post('/api/payment', paymentDetails);
    return data;  // This would contain the saved payment info or related response
  } catch (error) {
    console.error('Error processing payment:', error);
    throw new Error('Failed to save payment');
  }
};

// Get new order for the current user
export const getNewOrderForCurrentUser = async () => {
  try {
    const { data } = await axios.get('/api/orders/newOrderForCurrentUser');
    return data;
  } catch (error) {
    console.error('Error fetching new order for current user:', error);
    throw new Error('Failed to fetch order');
  }
};

// Track an order by its ID
export const trackOrderById = async (orderId) => {
  try {
    const { data } = await axios.get('/api/orders/track/' + orderId);
    return data;
  } catch (error) {
    console.error('Error tracking order:', error);
    throw new Error('Failed to track order');
  }
};

// Get all orders with optional state filter
export const getAll = async (state) => {
  try {
    const { data } = await axios.get(`/api/orders/${state ?? ''}`);
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
};

// Get the status of all orders
export const getAllStatus = async () => {
  try {
    const { data } = await axios.get('/api/orders/allstatus');
    return data;
  } catch (error) {
    console.error('Error fetching order statuses:', error);
    throw new Error('Failed to fetch order statuses');
  }
};
