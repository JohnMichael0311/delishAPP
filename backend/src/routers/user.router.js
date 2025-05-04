// import { Router } from 'express';
// import jwt from 'jsonwebtoken';
// const router = Router();
// import { BAD_REQUEST } from '../constants/httpStatus.js';
// import handler from 'express-async-handler';
// import { UserModel } from '../models/user.model.js';
// import bcrypt from 'bcryptjs';
// import auth from '../middleware/auth.mid.js';
// import admin from '../middleware/admin.mid.js';
// import { cache, CACHE_TTL } from '../utils/simpleCache.js';
// const PASSWORD_HASH_SALT_ROUNDS = 10;

// router.post(
//   '/login',
//   handler(async (req, res) => {
//     const { email, password } = req.body;
//     const user = await UserModel.findOne({ email });

//     if (user && (await bcrypt.compare(password, user.password))) {
//       // Only delete cache after successful login
//       await cache.delete(`user:${user._id}`);
//       res.send(generateTokenResponse(user));
//       return;
//     }

//     res.status(BAD_REQUEST).send('Username or password is invalid');
//   })
// );

// router.post(
//   '/register',
//   handler(async (req, res) => {
//     const { name, email, password, address } = req.body;

//     const user = await UserModel.findOne({ email });

//     if (user) {
//       res.status(BAD_REQUEST).send('User already exists, please login!');
//       return;
//     }

//     const hashedPassword = await bcrypt.hash(
//       password,
//       PASSWORD_HASH_SALT_ROUNDS
//     );

//     const newUser = {
//       name,
//       email: email.toLowerCase(),
//       password: hashedPassword,
//       address,
//     };

//     const result = await UserModel.create(newUser);
//     await cache.set(`user:${result._id}`, result, CACHE_TTL.USER);
//     res.send(generateTokenResponse(result));
//   })
// );

// router.put(
//   '/updateProfile',
//   auth,
//   handler(async (req, res) => {
//     const { name, address } = req.body;
//     const user = await UserModel.findByIdAndUpdate(
//       req.user.id,
//       { name, address },
//       { new: true }
//     );

//     // Invalidate cache after profile update
//     await cache.delete(`user:${req.user.id}`);
    
//     res.send(generateTokenResponse(user));
//   })
// );

// router.put(
//   '/changePassword',
//   auth,
//   handler(async (req, res) => {
//     const { currentPassword, newPassword } = req.body;
//     const user = await UserModel.findById(req.user.id);

//     if (!user) {
//       res.status(BAD_REQUEST).send('Change Password Failed!');
//       return;
//     }

//     const equal = await bcrypt.compare(currentPassword, user.password);

//     if (!equal) {
//       res.status(BAD_REQUEST).send('Current Password Is Not Correct!');
//       return;
//     }

//     user.password = await bcrypt.hash(newPassword, PASSWORD_HASH_SALT_ROUNDS);
//     await user.save();
//     await cache.delete(`user:${req.user.id}`);



//     res.send();
//   })
// );

// router.get(
//   '/getall/:searchTerm?',
//   admin,
//   handler(async (req, res) => {
//     const { searchTerm } = req.params;
//     const cacheKey = `users:search:${searchTerm || 'all'}`;
//     const cachedUsers = await cache.get(cacheKey);
    
//     if (cachedUsers) {
//       return res.json(cachedUsers);
//     }

//     const filter = searchTerm
//       ? { name: { $regex: new RegExp(searchTerm, 'i') } }
//       : {};
//     const users = await UserModel.find(filter, { password: 0 });
//     await cache.set(cacheKey, users, CACHE_TTL.USER);
//     res.json(users);
//   })
// );

// router.put(
//   '/toggleBlock/:userId',
//   admin,
//   handler(async (req, res) => {
//     const { userId } = req.params;

//     if (userId === req.user.id) {
//       res.status(BAD_REQUEST).send("Can't block yourself!");
//       return;
//     }

//     const user = await UserModel.findById(userId);
//     user.isBlocked = !user.isBlocked;
//     await user.save();
//     await cache.delete(`user:${userId}`);
//     await cache.delete(`users:search:${user.name}`);
//     res.send(user.isBlocked);
//   })
// );

// router.get(
//   '/getById/:userId',
//   admin,
//   handler(async (req, res) => {
//     const { userId } = req.params;
//     const cacheKey = `user:${userId}`;
//     const cachedUsers = await cache.get(cacheKey);
    
//     if (cachedUsers) {
//       return res.json(cachedUsers);
//     }

//     const user = await UserModel.findById(userId, { password: 0 });
//     await cache.set(cacheKey, user, CACHE_TTL.USER);
//     res.send(user);
//   })
// );

// router.put(
//   '/update',
//   admin,
//   handler(async (req, res) => {
//     const { id, name, email, address, type } = req.body;
//     await UserModel.findByIdAndUpdate(id, {
//       name,
//       email,
//       address,
//       type
//     });

//     // Invalidate cache
//     await cache.delete(`user:${id}`);
//     await cache.delete(`users:search:${name}`);

//     res.send();
//   })
// );

// const generateTokenResponse = user => {
//   const token = jwt.sign(
//     {
//       id: user.id,
//       email: user.email,
//       type: user.type,
//     },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: '30d',
//     }
//   );

//   return {
//     id: user.id,
//     email: user.email,
//     name: user.name,
//     address: user.address,
//     type: user.type,
//     token,
//   };
// };

// export default router;

// import { Router } from 'express';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
// import handler from 'express-async-handler';

// import { UserModel } from '../models/user.model.js';
// import auth from '../middleware/auth.mid.js';
// import admin from '../middleware/admin.mid.js';
// import { cache, CACHE_TTL } from '../utils/simpleCache.js';
// import { BAD_REQUEST } from '../constants/httpStatus.js';

// const router = Router();
// const PASSWORD_HASH_SALT_ROUNDS = 10;

// /**
//  * @swagger
//  * tags:
//  *   name: Users
//  *   description: User management and authentication
//  */

// /**
//  * @swagger
//  * /api/users/login:
//  *   post:
//  *     summary: Login user and return token
//  *     tags: [Users]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - email
//  *               - password
//  *             properties:
//  *               email:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Authenticated user
//  *       400:
//  *         description: Invalid credentials
//  */
// router.post('/login', handler(async (req, res) => {
//   const { email, password } = req.body;
//   const user = await UserModel.findOne({ email });

//   if (user && await bcrypt.compare(password, user.password)) {
//     await cache.delete(`user:${user._id}`);
//     return res.send(generateTokenResponse(user));
//   }

//   res.status(BAD_REQUEST).send('Username or password is invalid');
// }));

// /**
//  * @swagger
//  * /api/users/register:
//  *   post:
//  *     summary: Register a new user
//  *     tags: [Users]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - name
//  *               - email
//  *               - password
//  *             properties:
//  *               name:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *               address:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: User registered
//  *       400:
//  *         description: User already exists
//  */
// router.post('/register', handler(async (req, res) => {
//   const { name, email, password, address } = req.body;

//   const existing = await UserModel.findOne({ email });
//   if (existing) return res.status(BAD_REQUEST).send('User already exists, please login!');

//   const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH_SALT_ROUNDS);
//   const newUser = await UserModel.create({
//     name,
//     email: email.toLowerCase(),
//     password: hashedPassword,
//     address
//   });

//   await cache.set(`user:${newUser._id}`, newUser, CACHE_TTL.USER);
//   res.send(generateTokenResponse(newUser));
// }));

// /**
//  * @swagger
//  * /api/users/updateProfile:
//  *   put:
//  *     summary: Update logged-in user's profile
//  *     tags: [Users]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *               address:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Updated user info
//  *       400:
//  *         description: Invalid request
//  */
// router.put('/updateProfile', auth, handler(async (req, res) => {
//   const { name, address } = req.body;

//   const updated = await UserModel.findByIdAndUpdate(
//     req.user.id,
//     { name, address },
//     { new: true }
//   );

//   await cache.delete(`user:${req.user.id}`);
//   res.send(generateTokenResponse(updated));
// }));

// /**
//  * @swagger
//  * /api/users/changePassword:
//  *   put:
//  *     summary: Change user password
//  *     tags: [Users]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - currentPassword
//  *               - newPassword
//  *             properties:
//  *               currentPassword:
//  *                 type: string
//  *               newPassword:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Password changed
//  *       400:
//  *         description: Invalid current password
//  */
// router.put('/changePassword', auth, handler(async (req, res) => {
//   const { currentPassword, newPassword } = req.body;
//   const user = await UserModel.findById(req.user.id);

//   if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
//     return res.status(BAD_REQUEST).send('Current Password Is Not Correct!');
//   }

//   user.password = await bcrypt.hash(newPassword, PASSWORD_HASH_SALT_ROUNDS);
//   await user.save();
//   await cache.delete(`user:${req.user.id}`);

//   res.send();
// }));

// /**
//  * @swagger
//  * /api/users/getall/{searchTerm}:
//  *   get:
//  *     summary: Get all users or search users by name
//  *     tags: [Users]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: searchTerm
//  *         schema:
//  *           type: string
//  *         required: false
//  *         description: Name to search
//  *     responses:
//  *       200:
//  *         description: List of users
//  */
// router.get('/getall/:searchTerm?', admin, handler(async (req, res) => {
//   const { searchTerm } = req.params;
//   const cacheKey = `users:search:${searchTerm || 'all'}`;

//   const cached = await cache.get(cacheKey);
//   if (cached) return res.json(cached);

//   const filter = searchTerm ? { name: { $regex: new RegExp(searchTerm, 'i') } } : {};
//   const users = await UserModel.find(filter, { password: 0 });

//   await cache.set(cacheKey, users, CACHE_TTL.USER);
//   res.json(users);
// }));

// /**
//  * @swagger
//  * /api/users/toggleBlock/{userId}:
//  *   put:
//  *     summary: Toggle block/unblock status of a user
//  *     tags: [Users]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: userId
//  *         schema:
//  *           type: string
//  *         required: true
//  *     responses:
//  *       200:
//  *         description: Block status toggled
//  *       400:
//  *         description: Cannot block self
//  */
// router.put('/toggleBlock/:userId', admin, handler(async (req, res) => {
//   const { userId } = req.params;

//   if (userId === req.user.id) return res.status(BAD_REQUEST).send("Can't block yourself!");

//   const user = await UserModel.findById(userId);
//   user.isBlocked = !user.isBlocked;
//   await user.save();

//   await cache.delete(`user:${userId}`);
//   await cache.delete(`users:search:${user.name}`);

//   res.send(user.isBlocked);
// }));

// /**
//  * @swagger
//  * /api/users/getById/{userId}:
//  *   get:
//  *     summary: Get user by ID
//  *     tags: [Users]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: userId
//  *         schema:
//  *           type: string
//  *         required: true
//  *     responses:
//  *       200:
//  *         description: User info
//  */
// router.get('/getById/:userId', admin, handler(async (req, res) => {
//   const { userId } = req.params;
//   const cacheKey = `user:${userId}`;

//   const cached = await cache.get(cacheKey);
//   if (cached) return res.json(cached);

//   const user = await UserModel.findById(userId, { password: 0 });
//   await cache.set(cacheKey, user, CACHE_TTL.USER);

//   res.send(user);
// }));

// /**
//  * @swagger
//  * /api/users/update:
//  *   put:
//  *     summary: Admin update user info
//  *     tags: [Users]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required: [id]
//  *             properties:
//  *               id:
//  *                 type: string
//  *               name:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *               address:
//  *                 type: string
//  *               type:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: User updated
//  */
// router.put('/update', admin, handler(async (req, res) => {
//   const { id, name, email, address, type } = req.body;

//   await UserModel.findByIdAndUpdate(id, { name, email, address, type });

//   await cache.delete(`user:${id}`);
//   await cache.delete(`users:search:${name}`);

//   res.send();
// }));

// // Token Generator
// const generateTokenResponse = user => {
//   const token = jwt.sign(
//     { id: user.id, email: user.email, type: user.type },
//     process.env.JWT_SECRET,
//     { expiresIn: '30d' }
//   );

//   return {
//     id: user.id,
//     email: user.email,
//     name: user.name,
//     address: user.address,
//     type: user.type,
//     token
//   };
// };

// export default router;


/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Authentication and User Management Operations
 */


import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import handler from 'express-async-handler';

import { UserModel } from '../models/user.model.js';
import auth from '../middleware/auth.mid.js';
import admin from '../middleware/admin.mid.js';
import { cache, CACHE_TTL } from '../utils/simpleCache.js';
import { BAD_REQUEST } from '../constants/httpStatus.js';

const router = Router();
const PASSWORD_HASH_SALT_ROUNDS = 10;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user and return token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authenticated user
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', handler(async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (user && await bcrypt.compare(password, user.password)) {
    await cache.delete(`user:${user._id}`);
    return res.send(generateTokenResponse(user));
  }

  res.status(BAD_REQUEST).send('Username or password is invalid');
}));

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered
 *       400:
 *         description: User already exists
 */
router.post('/register', handler(async (req, res) => {
  const { name, email, password, address } = req.body;

  const existing = await UserModel.findOne({ email });
  if (existing) return res.status(BAD_REQUEST).send('User already exists, please login!');

  const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH_SALT_ROUNDS);
  const newUser = await UserModel.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    address
  });

  await cache.set(`user:${newUser._id}`, newUser, CACHE_TTL.USER);
  res.send(generateTokenResponse(newUser));
}));

/**
 * @swagger
 * /api/users/updateProfile:
 *   put:
 *     summary: Update logged-in user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user info
 *       400:
 *         description: Invalid request
 */
router.put('/updateProfile', auth, handler(async (req, res) => {
  const { name, address } = req.body;

  const updated = await UserModel.findByIdAndUpdate(
    req.user.id,
    { name, address },
    { new: true }
  );

  await cache.delete(`user:${req.user.id}`);
  res.send(generateTokenResponse(updated));
}));

/**
 * @swagger
 * /api/users/changePassword:
 *   put:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed
 *       400:
 *         description: Invalid current password
 */
router.put('/changePassword', auth, handler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await UserModel.findById(req.user.id);

  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    return res.status(BAD_REQUEST).send('Current Password Is Not Correct!');
  }

  user.password = await bcrypt.hash(newPassword, PASSWORD_HASH_SALT_ROUNDS);
  await user.save();
  await cache.delete(`user:${req.user.id}`);

  res.send();
}));

/**
 * @swagger
 * /api/users/getall/{searchTerm}:
 *   get:
 *     summary: Get all users or search users by name
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: searchTerm
 *         schema:
 *           type: string
 *         required: false
 *         description: Name to search
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/getall/:searchTerm?', admin, handler(async (req, res) => {
  const { searchTerm } = req.params;
  const cacheKey = `users:search:${searchTerm || 'all'}`;

  const cached = await cache.get(cacheKey);
  if (cached) {
    console.log(`Cache hit: ${cacheKey}`);
    return res.json(cached);
  } else {
    console.log(`Cache miss: ${cacheKey}`);
  }

  const filter = searchTerm ? { name: { $regex: new RegExp(searchTerm, 'i') } } : {};
  const users = await UserModel.find(filter, { password: 0 });

  await cache.set(cacheKey, users, CACHE_TTL.USER);
  console.log(`Cache stored: ${cacheKey}`);
  res.json(users);
}));

/**
 * @swagger
 * /api/users/toggleBlock/{userId}:
 *   put:
 *     summary: Toggle block/unblock status of a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Block status toggled
 *       400:
 *         description: Cannot block self
 */
router.put('/toggleBlock/:userId', admin, handler(async (req, res) => {
  const { userId } = req.params;

  if (userId === req.user.id) return res.status(BAD_REQUEST).send("Can't block yourself!");

  const user = await UserModel.findById(userId);
  user.isBlocked = !user.isBlocked;
  await user.save();

  await cache.delete(`user:${userId}`);
  await cache.delete(`users:search:${user.name}`);

  res.send(user.isBlocked);
}));

/**
 * @swagger
 * /api/users/getById/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: User info
 */
router.get('/getById/:userId', admin, handler(async (req, res) => {
  const { userId } = req.params;
  const cacheKey = `user:${userId}`;

  const cached = await cache.get(cacheKey);
  if (cached) {
    console.log(`Cache hit: ${cacheKey}`);
    return res.json(cached);
  } else {
    console.log(`Cache miss: ${cacheKey}`);
  }

  const user = await UserModel.findById(userId, { password: 0 });
  await cache.set(cacheKey, user, CACHE_TTL.USER);
  console.log(`Cache stored: ${cacheKey}`);
  res.send(user);
}));

/**
 * @swagger
 * /api/users/update:
 *   put:
 *     summary: Admin update user info
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 */
router.put('/update', admin, handler(async (req, res) => {
  const { id, name, email, address, type } = req.body;

  await UserModel.findByIdAndUpdate(id, { name, email, address, type });

  await cache.delete(`user:${id}`);
  await cache.delete(`users:search:${name}`);

  res.send();
}));

// Token Generator
const generateTokenResponse = user => {
  const token = jwt.sign(
    { id: user.id, email: user.email, type: user.type },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    address: user.address,
    type: user.type,
    token
  };
};

export default router;
