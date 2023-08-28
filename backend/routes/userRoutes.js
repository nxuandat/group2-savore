import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { OAuth2Client } from 'google-auth-library';

import {
  isAuth,
  isAdminOrStaff,
  generateToken,
  baseUrl,
  mailgun,
} from '../utils.js';

const userRouter = express.Router();
const PAGE_SIZE = 9;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

userRouter.post('/google-login', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email } = ticket.getPayload();

    // Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu hay chưa
    let user = await User.findOne({ email });

    if (!user) {
      // Nếu người dùng chưa tồn tại, tạo một người dùng mới
      user = new User({
        name,
        email,
        isAdmin: false,
        isStaff: false,
      });

      // Lưu người dùng mới vào cơ sở dữ liệu
      await user.save();
    }

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
});

userRouter.get(
  '/',
  isAuth,
  isAdminOrStaff,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.get(
  '/admin',
  isAuth,
  isAdminOrStaff,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = parseInt(query.page) || 1; // Chuyển query param 'page' sang số nguyên
    const pageSize = parseInt(query.pageSize) || PAGE_SIZE;

    const skip = pageSize * (page - 1);

    const users = await User.find().skip(skip).limit(pageSize);
    const countUsers = await User.countDocuments();
    res.send({
      users,
      countUsers,
      page,
      pages: Math.ceil(countUsers / pageSize),
    });
  })
);

userRouter.get(
  '/:id',
  isAuth,
  isAdminOrStaff,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isStaff: updatedUser.isStaff,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

userRouter.post(
  '/forget-password',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '3h',
      });
      user.resetToken = token;
      await user.save();

      //reset link
      console.log(`${baseUrl()}/reset-password/${token}`);

      mailgun()
        .messages()
        .send(
          {
            from: 'Savoré Café Shop <savorecafeshop@xuandat.id.vn>',
            to: `${user.name} <${user.email}>`,
            subject: `Reset Password`,
            html: ` 
             <p>Please Click the following link to reset your password:</p> 
             <a href="${baseUrl()}/reset-password/${token}"}>Reset Password</a>
             `,
          },
          (error, body) => {
            console.log(error);
            console.log(body);
          }
        );
      res.send({ message: 'We sent reset password link to your email.' });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

userRouter.post(
  '/reset-password',
  expressAsyncHandler(async (req, res) => {
    jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        const user = await User.findOne({ resetToken: req.body.token });
        if (user) {
          if (req.body.password) {
            user.password = bcrypt.hashSync(req.body.password, 8);
            await user.save();
            res.send({
              message: 'Password reseted successfully',
            });
          }
        } else {
          res.status(404).send({ message: 'User not found' });
        }
      }
    });
  })
);

userRouter.put(
  '/:id',
  isAuth,
  isAdminOrStaff,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      user.isStaff = Boolean(req.body.isStaff);
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdminOrStaff,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === 'adminSavore@example.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' });
        return;
      }
      await user.deleteOne();
      res.send({ message: 'User Deleted' });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isStaff: user.isStaff,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isStaff: user.isStaff,
      token: generateToken(user),
    });
  })
);

export default userRouter;
