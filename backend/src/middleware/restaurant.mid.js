import { UNAUTHORIZED } from '../constants/httpStatus.js';
import authMid from './auth.mid.js';
import { UserType } from '../constants/userTypes.js';

const restaurantMid = (req, res, next) => {
  if (req.user.type !== UserType.RESTAURANT) {
    res.status(UNAUTHORIZED).send('Access denied: Restaurant access required');
    return;
  }
  next();
};

export default [authMid, adminMid];
