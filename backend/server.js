import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';

// Staff Routes
import productRouter2 from './routes/productRoutes2.js';
import userRouter2 from './routes/userRoutes2.js';
import orderRouter2 from './routes/orderRoutes2.js';
import uploadRouter2 from './routes/uploadRoutes2.js';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pay-Pal Order
app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

app.use('/api/upload', uploadRouter);
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
// Staff
app.use('/api/upload2', uploadRouter2);
app.use('/api/products2', productRouter2);
app.use('/api/users2', userRouter2);
app.use('/api/orders2', orderRouter2);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// Tạo port
const port = process.env.PORT || 5500;
app.listen(port, () => {
  console.log(`server at http://localhost:${port}`);
});
