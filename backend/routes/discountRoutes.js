import express from 'express';
//sidebar
import expressAsyncHandler from 'express-async-handler';
import Discount from '../models/discountModel.js';

// Manage Discounts
import { isAuth, isAdminOrStaff } from '../utils.js';

const discountRouter = express.Router();

discountRouter.get('/', async (req, res) => {
  const Discounts = await Discount.find();
  res.send(Discounts);
});

discountRouter.post(
  '/',
  isAuth,
  isAdminOrStaff,
  expressAsyncHandler(async (req, res) => {
    const newDiscount = new Discount({
      name: 'sample name ' + Date.now(),
      slug: 'sample-name-' + Date.now(),
      image: '/images/p1.jpg',
      price: 0,
      category: 'sample category',
      brand: 'sample brand',
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: 'sample description',
    });
    const Discount = await newDiscount.save();
    res.send({ message: 'Discount Created', Discount });
  })
);

discountRouter.put(
  '/:id',
  isAuth,
  isAdminOrStaff,
  expressAsyncHandler(async (req, res) => {
    const DiscountId = req.params.id;
    const Discount = await Discount.findById(DiscountId);
    if (Discount) {
      Discount.code = req.body.code;
      Discount.isPercent = req.body.isPercent;
      Discount.amount = req.body.amount;
      Discount.expireDate = req.body.expireDate;
      Discount.isActive = req.body.isActive;
      await Discount.save();
      res.send({ message: 'Discount Updated' });
    } else {
      res.status(404).send({ message: 'Discount Not Found' });
    }
  })
);

discountRouter.delete(
  '/:id',
  isAuth,
  isAdminOrStaff,
  expressAsyncHandler(async (req, res) => {
    const Discount = await Discount.findById(req.params.id);
    if (Discount) {
      await Discount.deleteOne();
      res.send({ message: 'Discount Deleted' });
    } else {
      res.status(404).send({ message: 'Discount Not Found' });
    }
  })
);

// discountRouter.post(
//   '/:id/reviews',
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const DiscountId = req.params.id;
//     const Discount = await Discount.findById(DiscountId);
//     if (Discount) {
//       if (Discount.reviews.find((x) => x.name === req.user.name)) {
//         return res
//           .status(400)
//           .send({ message: 'You already submitted a review' });
//       }

//       const review = {
//         name: req.user.name,
//         rating: Number(req.body.rating),
//         comment: req.body.comment,
//       };
//       Discount.reviews.push(review);
//       Discount.numReviews = Discount.reviews.length;
//       Discount.rating =
//         Discount.reviews.reduce((a, c) => c.rating + a, 0) /
//         Discount.reviews.length;
//       const updatedDiscount = await Discount.save();
//       res.status(201).send({
//         message: 'Review Created',
//         review: updatedDiscount.reviews[updatedDiscount.reviews.length - 1],
//         numReviews: Discount.numReviews,
//         rating: Discount.rating,
//       });
//     } else {
//       res.status(404).send({ message: 'Discount Not Found' });
//     }
//   })
// );

const PAGE_SIZE = 3;

// Manage Discount as Admin Role
discountRouter.get(
  '/admin',
  isAuth,
  isAdminOrStaff,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const Discounts = await Discount.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countDiscounts = await Discount.countDocuments();
    res.send({
      Discounts,
      countDiscounts,
      page,
      pages: Math.ceil(countDiscounts / pageSize),
    });
  })
);

discountRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            // 1-20
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const Discounts = await Discount.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countDiscounts = await Discount.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      Discounts,
      countDiscounts,
      page,
      pages: Math.ceil(countDiscounts / pageSize),
    });
  })
);

// discountRouter.get(
//   '/categories',
//   expressAsyncHandler(async (req, res) => {
//     const categories = await Discount.find().distinct('category');
//     res.send(categories);
//   })
// );

discountRouter.get('/slug/:slug', async (req, res) => {
  const Discount = await Discount.findOne({ slug: req.params.slug });
  if (Discount) {
    res.send(Discount);
  } else {
    res.status(404).send({ message: 'Discount Not Found' });
  }
});
discountRouter.get('/:id', async (req, res) => {
  const Discount = await Discount.findById(req.params.id);
  if (Discount) {
    res.send(Discount);
  } else {
    res.status(404).send({ message: 'Discount Not Found' });
  }
});

export default discountRouter;
