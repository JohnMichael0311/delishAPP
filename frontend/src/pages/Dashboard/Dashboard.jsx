import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import classes from './dashboard.module.css';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className={classes.container}>
      <div className={classes.menu}>
        {allItems
          .filter(item => {
            // Admin can see everything
            if (user.type === "admin") return true;
            // Restaurant user can see everything except for admin-specific items
            if (user.type === "restaurant") return !item.forAdmin;
            // Regular user can only see non-admin and non-restaurant specific items
            return !item.forAdmin && !item.forRestaurant;
          })
          .map(item => (
            <Link
              key={item.title}
              to={item.url}
              style={{
                backgroundColor: item.bgColor,
                color: item.color,
              }}
            >
              <img src={item.imageUrl} alt={item.title} />
              <h2>{item.title}</h2>
            </Link>
          ))}
      </div>
    </div>
  );
}

const allItems = [
  {
    title: 'Orders',
    imageUrl: '/icons/orders.svg',
    url: '/orders',
    bgColor: '#f5c20c',
    color: 'white',
  },
  {
    title: 'Profile',
    imageUrl: '/icons/profile.svg',
    url: '/profile',
    bgColor: '#f5c20c',
    color: 'white',
  },
  {
    title: 'Users',
    imageUrl: '/icons/users.svg',
    url: '/admin/users',
    forAdmin: true, // Only visible to admins
    bgColor: '#f5c20c',
    color: 'white',
  },
  {
    title: 'Foods',
    imageUrl: '/icons/foods.svg',
    url: '/admin/foods',
    forRestaurant: true, // Visible to both admin and restaurant
    bgColor: '#f5c20c',
    color: 'white',
  },
];
