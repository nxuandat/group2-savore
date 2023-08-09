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
      image: '/images/coffee/espresso.jpg',
      price: 5,
      countInStock: 0,
      brand: 'ThienLan',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality coffee',
      sizes: ['Small', 'Medium', 'Large'], // Thêm thông tin về kích thước
    },
    {
      name: 'Mix Pearl',
      slug: 'mixpearl',
      category: 'Topping',
      image: '/images/topping/mix_pearl.jpg',
      price: 5,
      countInStock: 24,
      brand: 'Savore',
      rating: 5.0,
      numReviews: 13,
      description: 'high quality topping',
      sizes: ['Small', 'Medium', 'Large'], // Thêm thông tin về kích thước
    },
    {
      name: 'Cappuccino',
      slug: 'cappuccino',
      category: 'Coffee',
      image: '/images/coffee/cappuccino.jpg',
      price: 7,
      countInStock: 9,
      brand: 'PhucLong',
      rating: 4.9,
      numReviews: 4,
      description: 'high quality capuccino',
      sizes: ['Small', 'Medium', 'Large'], // Thêm thông tin về kích thước
    },

    {
      name: 'Fruit Tea',
      slug: 'fruittea',
      category: 'Tea',
      image: '/images/tea/fruit.jpg',
      price: 8,
      countInStock: 5,
      brand: 'Savore',
      rating: 4.6,
      numReviews: 3,
      description: 'high quality fruit flavor',
      sizes: ['Small', 'Medium', 'Large'], // Thêm thông tin về kích thước
    },
    {
      name: 'Yellow Macaron',
      slug: 'macaron',
      category: 'Cake',
      image: '/images/cake/yellow_macaron.jpg',
      price: 4,
      countInStock: 17,
      brand: 'Savore',
      rating: 4.9,
      numReviews: 18,
      description: 'high quality cake',
      sizes: ['Small', 'Medium', 'Large'], // Thêm thông tin về kích thước
    },
    {
      name: 'Cheese Cake',
      slug: 'cheesecake',
      category: 'Cake',
      image: '/images/cake/cheesecake.jpg',
      price: 4,
      countInStock: 17,
      brand: 'Savore',
      rating: 5.0,
      numReviews: 12,
      description: 'high quality cake',
      sizes: ['Small', 'Medium', 'Large'], // Thêm thông tin về kích thước
    },
    {
      name: 'Pearl Milk Tea',
      slug: 'pearlmilktea',
      category: 'Milk Tea',
      image: '/images/milktea/pearl_tea.jpg',
      price: 6,
      countInStock: 22,
      brand: 'Savore',
      rating: 4.8,
      numReviews: 34,
      description: 'high quality milk tea',
      sizes: ['Small', 'Medium', 'Large'], // Thêm thông tin về kích thước
    },
    {
      name: 'Lemon Panna Cotta',
      slug: 'lemonpanna',
      category: 'Cake',
      image: '/images/cake/lemon_panna_cotta.jpg',
      price: 3,
      countInStock: 17,
      brand: 'Savore',
      rating: 5.0,
      numReviews: 10,
      description: 'high quality cake',
      sizes: ['Small', 'Medium', 'Large'], // Thêm thông tin về kích thước
    },
    {
      name: 'Mocha',
      slug: 'mocha',
      category: 'Coffee',
      image: '/images/coffee/mocha.jpg',
      price: 4,
      countInStock: 17,
      brand: 'TrungNguyen',
      rating: 4.9,
      numReviews: 12,
      description: 'high quality mocha',
      sizes: ['Small', 'Medium', 'Large'], // Thêm thông tin về kích thước
    },

    {
      name: 'Green Milk Tea',
      slug: 'greenmilktea',
      category: 'Milk Tea',
      image: '/images/milktea/green_milk_tea.jpg',
      price: 5,
      countInStock: 24,
      brand: 'Savore',
      rating: 5.0,
      numReviews: 13,
      description: 'high quality milk tea',
      sizes: ['Small', 'Medium', 'Large'], // Thêm thông tin về kích thước
    },
    {
      name: 'Creamy Milk Tea',
      slug: 'creamymilktea',
      category: 'Milk Tea',
      image: '/images/milktea/creamy_tea.jpg',
      price: 5,
      countInStock: 24,
      brand: 'Savore',
      rating: 5.0,
      numReviews: 13,
      description: 'high quality milk tea',
      sizes: ['Small', 'Medium', 'Large'], // Thêm thông tin về kích thước
    },
    {
      name: 'Bubble Milk Tea',
      slug: 'bubblemilktea',
      category: 'Milk Tea',
      image: '/images/milktea/bubble_tea.jpg',
      price: 5,
      countInStock: 24,
      brand: 'Savore',
      rating: 5.0,
      numReviews: 13,
      description: 'high quality milk tea',
      sizes: ['Small', 'Medium', 'Large'], // Thêm thông tin về kích thước
    },
    {
      name: 'Golden Milk Tea',
      slug: 'goldenmilktea',
      category: 'Milk Tea',
      image: '/images/milktea/milk_tea.jpg',
      price: 5,
      countInStock: 24,
      brand: 'Savore',
      rating: 5.0,
      numReviews: 13,
      description: 'high quality milk tea',
      sizes: ['Small', 'Medium', 'Large'], // Thêm thông tin về kích thước
    },

    {
      name: 'Black Pearl',
      slug: 'blackpearl',
      category: 'Topping',
      image: '/images/topping/black_pearl.jpg',
      price: 5,
      countInStock: 24,
      brand: 'Savore',
      rating: 5.0,
      numReviews: 13,
      description: 'high quality topping',
      sizes: ['Small', 'Medium', 'Large'], // Thêm thông tin về kích thước
    },
    {
      name: 'Golden Pearl',
      slug: 'goldenpearl',
      category: 'Topping',
      image: '/images/topping/golden_pearl.jpg',
      price: 5,
      countInStock: 24,
      brand: 'Savore',
      rating: 5.0,
      numReviews: 13,
      description: 'high quality topping',
      sizes: ['Small', 'Medium', 'Large'], // Thêm thông tin về kích thước
    },
    {
      name: 'Rose Pearl',
      slug: 'rosepearl',
      category: 'Topping',
      image: '/images/topping/rose_pearl.jpg',
      price: 5,
      countInStock: 24,
      brand: 'Savore',
      rating: 5.0,
      numReviews: 13,
      description: 'high quality topping',
      sizes: ['Small', 'Medium', 'Large'], // Thêm thông tin về kích thước
    },
    {
      name: 'Green Tea',
      slug: 'greentea',
      category: 'Tea',
      image: '/images/tea/green_2.jpg',
      price: 6,
      countInStock: 17,
      brand: 'Savore',
      rating: 4.6,
      numReviews: 18,
      description: 'high quality tea',
      sizes: ['Small', 'Medium', 'Large'], // Thêm thông tin về kích thước
    },
  ],
};
export default data;
