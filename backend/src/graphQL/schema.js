// import {
//     GraphQLObjectType,
//     GraphQLString,
//     GraphQLFloat,
//     GraphQLBoolean,
//     GraphQLList,
//     GraphQLSchema,
//     GraphQLID,
//     GraphQLNonNull,
//     GraphQLInt,
//   } from 'graphql';
//   import { FoodModel } from '../models/food.model.js';
  
//   // Define Food GraphQL Type
//   const FoodType = new GraphQLObjectType({
//     name: 'Food',
//     fields: () => ({
//       id: { type: GraphQLID },
//       name: { type: GraphQLString },
//       price: { type: GraphQLFloat },
//       tags: { type: new GraphQLList(GraphQLString) },
//       favorite: { type: GraphQLBoolean },
//       stars: { type: GraphQLInt },
//       imageUrl: { type: GraphQLString },
//       origins: { type: new GraphQLList(GraphQLString) },
//       cookTime: { type: GraphQLString },
//       category: { type: GraphQLString },       // ✅ Add this line
//       description: { type: GraphQLString },    // ✅ Add this line
//       createdAt: { type: GraphQLString },
//       updatedAt: { type: GraphQLString },
//     }),
//   });
  
  
//   // Root Query
//   const RootQuery = new GraphQLObjectType({
//     name: 'RootQueryType',
//     fields: {
//       foods: {
//         type: new GraphQLList(FoodType),
//         resolve() {
//           return FoodModel.find();
//         },
//       },
//       food: {
//         type: FoodType,
//         args: { id: { type: GraphQLID } },
//         resolve(_, args) {
//           return FoodModel.findById(args.id);
//         },
//       },
//     },
//   });
  
//   // Mutations
//   const Mutation = new GraphQLObjectType({
//     name: 'Mutation',
//     fields: {
//       addFood: {
//         type: FoodType,
//         args: {
//           name: { type: new GraphQLNonNull(GraphQLString) },
//           price: { type: new GraphQLNonNull(GraphQLFloat) },
//           tags: { type: new GraphQLList(GraphQLString) },
//           favorite: { type: GraphQLBoolean },
//           stars: { type: GraphQLInt },
//           imageUrl: { type: new GraphQLNonNull(GraphQLString) },
//           origins: { type: new GraphQLList(GraphQLString) },
//           cookTime: { type: new GraphQLNonNull(GraphQLString) },
          
//         },
//         resolve(_, args) {
//           const food = new FoodModel({
//             ...args,
//           });
//           return food.save();
//         },
//       },
//     },
//   });
  
//   export const schema = new GraphQLSchema({
//     query: RootQuery,
//     mutation: Mutation,
//   });
  

// schema.js
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
  GraphQLID,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLInputObjectType,
} from 'graphql';

import { FoodModel } from '../models/food.model.js';
import { UserModel } from '../models/user.model.js';
import { OrderModel } from '../models/order.model.js';
import { PaymentModel } from '../models/payment.model.js';

// --- GraphQL Types ---
const FoodType = new GraphQLObjectType({
  name: 'Food',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    price: { type: GraphQLFloat },
    tags: { type: new GraphQLList(GraphQLString) },
    favorite: { type: GraphQLBoolean },
    stars: { type: GraphQLInt },
    imageUrl: { type: GraphQLString },
    origins: { type: new GraphQLList(GraphQLString) },
    cookTime: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    address: { type: GraphQLString },
    type: { type: GraphQLString },
    isBlocked: { type: GraphQLBoolean },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

const OrderItemType = new GraphQLObjectType({
  name: 'OrderItem',
  fields: () => ({
    food: { type: FoodType },
    price: { type: GraphQLFloat },
    quantity: { type: GraphQLInt },
  }),
});

// LatLng GraphQL Type
const LatLngType = new GraphQLObjectType({
  name: 'LatLng',
  fields: () => ({
    lat: { type: new GraphQLNonNull(GraphQLString) },
    lng: { type: new GraphQLNonNull(GraphQLString) },
  }),
});


const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    address: { type: GraphQLString },
    addressLatLng: { type: LatLngType }, 
    paymentId: { type: GraphQLString },
    totalPrice: { type: GraphQLFloat },
    items: { type: new GraphQLList(OrderItemType) },
    status: { type: GraphQLString },
    user: { type: UserType },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

const PaymentType = new GraphQLObjectType({
  name: 'Payment',
  fields: () => ({
    id: { type: GraphQLID },
    paymentId: { type: GraphQLString },
    orderId: { type: GraphQLID },
    amount: { type: GraphQLFloat },
    paymentMethod: { type: GraphQLString },
    status: { type: GraphQLString },
    date: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

// --- Root Query ---
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    foods: {
      type: new GraphQLList(FoodType),
      resolve() {
        return FoodModel.find();
      },
    },
    food: {
      type: FoodType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return FoodModel.findById(args.id);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: () => UserModel.find(),
    },
    orders: {
      type: new GraphQLList(OrderType),
      resolve: () => OrderModel.find().populate('user'),
    },
    payments: {
      type: new GraphQLList(PaymentType),
      resolve: () => PaymentModel.find(),
    },
  },
});

// --- Mutations ---
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addFood: {
      type: FoodType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLFloat) },
        tags: { type: new GraphQLList(GraphQLString) },
        favorite: { type: GraphQLBoolean },
        stars: { type: GraphQLInt },
        imageUrl: { type: new GraphQLNonNull(GraphQLString) },
        origins: { type: new GraphQLList(GraphQLString) },
        cookTime: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(_, args) {
        const food = new FoodModel(args);
        return food.save();
      },
    },

    addUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: new GraphQLNonNull(GraphQLString) },
        type: { type: GraphQLString },
      },
      resolve(_, args) {
        return new UserModel({ ...args, type: args.type || 'user' }).save();
      },
    },

    addOrder: {
      type: OrderType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: new GraphQLNonNull(GraphQLString) },
        addressLat: { type: new GraphQLNonNull(GraphQLString) },
        addressLng: { type: new GraphQLNonNull(GraphQLString) },
        totalPrice: { type: new GraphQLNonNull(GraphQLFloat) },
        items: {
          type: new GraphQLList(new GraphQLInputObjectType({
            name: 'OrderItemInput',
            fields: {
              foodId: { type: new GraphQLNonNull(GraphQLID) },
              quantity: { type: new GraphQLNonNull(GraphQLInt) },
            },
          })),
        },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(_, { name, address, addressLat, addressLng, totalPrice, items, userId }) {
        const populatedItems = await Promise.all(
          items.map(async ({ foodId, quantity }) => {
            const food = await FoodModel.findById(foodId);
            if (!food) throw new Error(`Food with ID ${foodId} not found`);
            return {
              food,
              quantity,
              price: food.price * quantity,
            };
          })
        );

        const order = new OrderModel({
          name,
          address,
          addressLatLng: { lat: addressLat, lng: addressLng },
          totalPrice,
          items: populatedItems,
          user: userId,
        });

        return await order.save();
      },
    },

    addPayment: {
      type: PaymentType,
      args: {
        paymentId: { type: new GraphQLNonNull(GraphQLString) },
        orderId: { type: new GraphQLNonNull(GraphQLID) },
        amount: { type: new GraphQLNonNull(GraphQLFloat) },
        paymentMethod: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: GraphQLString },
      },
      resolve(_, args) {
        return new PaymentModel({ ...args, status: args.status || 'Completed' }).save();
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});