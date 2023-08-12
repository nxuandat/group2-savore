import jwt from 'jsonwebtoken';
import mg from 'mailgun-js';

export const baseUrl = () =>
  process.env.BASE_URL
    ? process.env.BASE_URL
    : process.env.NODE_ENV !== 'production'
    ? 'http://localhost:5500'
    : 'https://savore.onrender.com';

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

// Place Order
export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

// Admin Validation Check for Dashboard Screen Permission
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};

// Staff Validation Check for Dashboard Screen Permission
export const isStaff = (req, res, next) => {
  if (req.user && req.user.isStaff) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Staff Token' });
  }
};

export const mailgun = () =>
  mg({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

export const payOrderEmailTemplate = (order) => {
  return `<h1>Thanks for choosing us!</h1>
    <p>
    Hi ${order.user.name},</p>
    <p>Your order has been successfully processed! Here are the details:</p>
    <h2>[Order ${order._id}] (${order.createdAt
    .toString()
    .substring(0, 10)})</h2>
    <table>
    <thead>
    <tr>
    <td><strong>Product</strong></td>
    <td><strong>Quantity</strong></td>
    <td><strong>Size</strong></td>
    <td><strong align="right">Price</strong></td>
    </thead>
    <tbody>
    ${order.orderItems
      .map(
        (item) => `
      <tr>
      <td>${item.name}</td>
      <td align="center">${item.quantity}</td>
      <td align="center">${item.size}</td>
      <td align="right"> $${item.totalPriceProduct.toFixed(2)}</td>
      </tr>
    `
      )
      .join('\n')}
    </tbody>
    <tfoot>
    <tr>
    <td colspan="3">Items Price:</td>
    <td align="right"> $${order.itemsPrice.toFixed(2)}</td>
    </tr>
    <tr>
    <td colspan="3">Shipping Price:</td>
    <td align="right"> $${order.shippingPrice.toFixed(2)}</td>
    </tr>
    <tr>
    <td colspan="3"><strong>Total Price:</strong></td>
    <td align="right"><strong> $${order.totalPrice.toFixed(2)}</strong></td>
    </tr>
    <tr>
    <td colspan="3">Payment Method:</td>
    <td align="right">${order.paymentMethod}</td>
    </tr>
    <tr>
    <td colspan="3">Shipping Method:</td>
    <td align="right">${order.shippingAddress.shippingMethod}</td>
    </tr>
    </table>
    <h2>Shipping address</h2>
    <p>
    ${order.shippingAddress.fullName},<br/>
    ${order.shippingAddress.address},<br/>
    ${order.shippingAddress.city},<br/>
    ${order.shippingAddress.country},<br/>
    ${order.shippingAddress.postalCode}<br/>
    </p>
    <hr/>
    <p>
    Your order is currently being prepared and will be delivered to you at the earliest convenience. We appreciate your patronage and hope you enjoy your drinks! <br/>
    Best regards,<br/>
    Savoré Café Shop
    </p>
    `;
};
