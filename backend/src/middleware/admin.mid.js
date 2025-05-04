import { UNAUTHORIZED } from '../constants/httpStatus.js';
import authMid from './auth.mid.js';


const adminMid = (req, res, next) => {
  // Allow both admin and restaurant to access
  if (req.user.type === 'admin' || req.user.type === 'restaurant') {
    return next();
  }

  // If not admin or restaurant, return unauthorized
  res.status(UNAUTHORIZED).send('You cannot access this page');
};

export default [authMid, adminMid];
