import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'savore',
      email: 'adminSavore@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'yen',
      email: 'userSavore@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
    {
      name: 'test',
      email: 'testSavore@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: 'Expresso',
      slug: 'expresso',
      category: 'Coffee',
      image: '/images/p1.jpg',
      price: 5,
      countInStock: 0,
      brand: 'ThienLan',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality coffee',
      sizes: ['Small', 'Medium', 'Large'], // Thêm thông tin về kích thước
    },
    {
      name: 'Cappuccino',
      slug: 'cappuccino',
      category: 'Coffee',
      image: '/images/p2.jpg',
      price: 7,
      countInStock: 9,
      brand: 'PhucLong',
      rating: 4.9,
      numReviews: 4,
      description: 'high quality capuccino',
      sizes: ['Small', 'Medium', 'Large'], // Thêm thông tin về kích thước
    },
    {
      name: 'Green Tea Freeze',
      slug: 'greentea',
      category: 'Tea',
      image: '/images/p3.jpg',
      price: 6,
      countInStock: 17,
      brand: 'Highland',
      rating: 4.6,
      numReviews: 18,
      description: 'high quality latte',
      sizes: ['Small', 'Medium', 'Large'], // Thêm thông tin về kích thước
    },
    {
      name: 'Mocha',
      slug: 'mocha',
      category: 'Coffee',
      image: '/images/p4.jpg',
      price: 3,
      countInStock: 17,
      brand: 'TrungNguyen',
      rating: 4.9,
      numReviews: 12,
      description: 'high quality mocha',
      sizes: ['Small', 'Medium', 'Large'], // Thêm thông tin về kích thước
    },
  ],
};
export default data;
