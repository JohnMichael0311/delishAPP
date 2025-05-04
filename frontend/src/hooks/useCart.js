import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const EMPTY_CART = {
  items: [],
  totalPrice: 0,
  totalCount: 0,
};

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchCartFromServer = async () => {
      try {
        const response = await fetch('/api/cart'); // Replace with your actual API endpoint
        const data = await response.json();
        
        setCartItems(data.items || []);
        setTotalPrice(data.totalPrice || 0);
        setTotalCount(data.totalCount || 0);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    fetchCartFromServer();
  }, []);

  useEffect(() => {
    const totalPrice = sum(cartItems.map(item => item.price));
    const totalCount = sum(cartItems.map(item => item.quantity));
    setTotalPrice(totalPrice);
    setTotalCount(totalCount);
  }, [cartItems]);

  const sum = items => items.reduce((prev, cur) => prev + cur, 0);

  const addToCart = async food => {
    const cartItem = cartItems.find(item => item.food.id === food.id);
    if (cartItem) {
      changeQuantity(cartItem, cartItem.quantity + 1);
    } else {
      const newCartItem = { food, quantity: 1, price: food.price };
      setCartItems([...cartItems, newCartItem]);

      try {
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ foodId: food.id, quantity: 1 }),
        });
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  };

  const changeQuantity = async (cartItem, newQuantity) => {
    const { food } = cartItem;
    const updatedCartItem = {
      ...cartItem,
      quantity: newQuantity,
      price: food.price * newQuantity,
    };

    setCartItems(
      cartItems.map(item => (item.food.id === food.id ? updatedCartItem : item))
    );

    try {
      await fetch(`/api/cart/${food.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  const removeFromCart = async foodId => {
    const updatedCartItems = cartItems.filter(item => item.food.id !== foodId);
    setCartItems(updatedCartItems);

    try {
      await fetch(`/api/cart/${foodId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    setCartItems(EMPTY_CART.items);
    setTotalPrice(EMPTY_CART.totalPrice);
    setTotalCount(EMPTY_CART.totalCount);
  
    try {
      await fetch('/api/cart', { method: 'DELETE' });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };
  

  return (
    <CartContext.Provider
      value={{
        cart: { items: cartItems, totalPrice, totalCount },
        removeFromCart,
        changeQuantity,
        addToCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
