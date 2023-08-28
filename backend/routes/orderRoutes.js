import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import {
  isAuth,
  isAdminOrStaff,
  mailgun,
  payOrderEmailTemplate,
  deliveringNotificationEmailTemplate,
  deliveredNotificationEmailTemplate,
} from '../utils.js';

const orderRouter = express.Router();
const PAGE_SIZE = 20;
orderRouter.get(
  '/',
  isAuth,
  isAdminOrStaff,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'name');
    res.send(orders);
  })
);

orderRouter.get(
  '/admin',
  isAuth,
  isAdminOrStaff,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = parseInt(query.page) || 1; // Chuyển query param 'page' sang số nguyên
    const pageSize = parseInt(query.pageSize) || PAGE_SIZE;

    const skip = pageSize * (page - 1);

    const orders = await Order.find().skip(skip).limit(pageSize);
    const countOrders = await Order.countDocuments();
    res.send({
      orders,
      countOrders,
      page,
      pages: Math.ceil(countOrders / pageSize),
    });
  })
);

orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.user.isAdmin || req.user.isStaff) {
      res.status(403).send({
        message: 'Admin and staff members are not allowed to place orders.',
      });
    } else {
      const newOrder = new Order({
        orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        discount: req.body.discount,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
      });

      const order = await newOrder.save();
      res.status(201).send({ message: 'New Order Created', order });
    }
  })
);

// Create Dashboard Screen
orderRouter.get(
  '/summary',
  isAuth,
  isAdminOrStaff,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
  })
);

// Order History
const Max_Page_Size = 9;
orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = parseInt(query.page) || 1; // Chuyển query param 'page' sang số nguyên
    const pageSize = parseInt(query.pageSize) || Max_Page_Size;
    const skip = pageSize * (page - 1);
    const orders = await Order.find({ user: req.user._id })
      .skip(skip)
      .limit(pageSize);
    const countOrders = await Order.countDocuments();
    res.send({
      orders,
      countOrders,
      page,
      pages: Math.ceil(countOrders / pageSize),
    });
  })
);

// Create order screen
orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

//Create Delivering order for admin
orderRouter.put(
  '/:id/delivering',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'email name'
    );
    if (order) {
      order.isDelivering = true;
      order.deliveringAt = Date.now();
      await order.save();

      mailgun()
        .messages()
        .send(
          {
            from: 'Savoré Café Shop <savorecafeshop@xuandat.id.vn>',
            to: `${order.user.name} <${order.user.email}>`,
            subject: `Your Order ${order._id} Is On Its Way`,
            html: deliveringNotificationEmailTemplate(order),
          },
          (error, body) => {
            if (error) {
              console.log(error);
            } else {
              console.log(body);
            }
          }
        );
      res.send({ message: 'Order Delivering' });
    } else {
      return res.status(404).send({ message: 'Order Not Found' });
    }
  })
);
//Create Deliver order for admin
orderRouter.put(
  '/:id/deliver',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'email name'
    );
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      await order.save();

      mailgun()
        .messages()
        .send(
          {
            from: 'Savoré Café Shop <savorecafeshop@xuandat.id.vn>',
            to: `${order.user.name} <${order.user.email}>`,
            subject: `Order ${order._id} Delivery Confirmation and Pickup Invitation`,
            html: deliveredNotificationEmailTemplate(order),
          },
          (error, body) => {
            if (error) {
              console.log(error);
            } else {
              console.log(body);
            }
          }
        );
      res.send({ message: 'Order Delivered' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

// Create send receipt Pay-Pal Order
orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'email name'
    );
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();

      mailgun()
        .messages()
        .send(
          {
            from: 'Savoré Café Shop <savorecafeshop@xuandat.id.vn>',
            to: `${order.user.name} <${order.user.email}>`,
            subject: `New order ${order._id}`,
            html: payOrderEmailTemplate(order),
          },
          (error, body) => {
            if (error) {
              console.log(error);
            } else {
              console.log(body);
            }
          }
        );
      res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.delete(
  '/:id',
  isAuth,
  isAdminOrStaff,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.deleteOne();
      res.send({ message: 'Order Deleted' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

export default orderRouter;
