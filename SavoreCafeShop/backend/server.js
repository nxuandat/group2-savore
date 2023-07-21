import express from 'express';
import data from './data.js';
const app = express();

// Lấy data từ file data.js của Backend
app.get('/api/products', (req, res) => {
  res.send(data.products);
});

// Tạo port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server at http://localhost:${port}`);
});
