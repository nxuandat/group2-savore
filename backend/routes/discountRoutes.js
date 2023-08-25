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
      code: 'sample code',
      isPercent: true,
      amount: 5, // if is percent, then number must be ≤ 100, else it’s amount of discount
      expireDate: '',
      isActive: true,
    });
    const discount = await newDiscount.save();
    res.send({ message: 'Discount Created', discount });
  })
);

discountRouter.put(
  '/:id',
  isAuth,
  isAdminOrStaff,
  expressAsyncHandler(async (req, res) => {
    const discountId = req.params.id;
    const discount = await Discount.findById(discountId);
    if (discount) {
      discount.code = req.body.code;
      d;
      discount.isPercent = req.body.isPercent;
      discount.amount = req.body.amount;
      discount.expireDate = req.body.expireDate;
      discount.expireDate = req.body.expireDate;
      discount.isActive = req.body.isActive;
      await discount.save();
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
    const discount = await Discount.findById(req.params.id);
    if (discount) {
      await discount.deleteOne();
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
//     const discountId = req.params.id;
//     const discount = await Discount.findById(discountId);
//     if (discount) {
//       if (discount.reviews.find((x) => x.name === req.user.name)) {
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

    const discounts = await Discount.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countDiscounts = await Discount.countDocuments();
    res.send({
      discounts,
      countDiscounts,
      page,
      pages: Math.ceil(countDiscounts / pageSize),
    });
  })
);

// discountRouter.get(
//   '/search',
//   expressAsyncHandler(async (req, res) => {
//     const { query } = req;
//     const pageSize = query.pageSize || PAGE_SIZE;
//     const page = query.page || 1;
//     const category = query.category || '';
//     const price = query.price || '';
//     const rating = query.rating || '';
//     const order = query.order || '';
//     const searchQuery = query.query || '';

//     const queryFilter =
//       searchQuery && searchQuery !== 'all'
//         ? {
//             name: {
//               $regex: searchQuery,
//               $options: 'i',
//             },
//           }
//         : {};
//     const categoryFilter = category && category !== 'all' ? { category } : {};
//     const ratingFilter =
//       rating && rating !== 'all'
//         ? {
//             rating: {
//               $gte: Number(rating),
//             },
//           }
//         : {};
//     const priceFilter =
//       price && price !== 'all'
//         ? {
//             // 1-20
//             price: {
//               $gte: Number(price.split('-')[0]),
//               $lte: Number(price.split('-')[1]),
//             },
//           }
//         : {};
//     const sortOrder =
//       order === 'featured'
//         ? { featured: -1 }
//         : order === 'lowest'
//         ? { price: 1 }
//         : order === 'highest'
//         ? { price: -1 }
//         : order === 'toprated'
//         ? { rating: -1 }
//         : order === 'newest'
//         ? { createdAt: -1 }
//         : { _id: -1 };

//     const Discounts = await Discount.find({
//       ...queryFilter,
//       ...categoryFilter,
//       ...priceFilter,
//       ...ratingFilter,
//     })
//       .sort(sortOrder)
//       .skip(pageSize * (page - 1))
//       .limit(pageSize);

//     const countDiscounts = await Discount.countDocuments({
//       ...queryFilter,
//       ...categoryFilter,
//       ...priceFilter,
//       ...ratingFilter,
//     });
//     res.send({
//       Discounts,
//       countDiscounts,
//       page,
//       pages: Math.ceil(countDiscounts / pageSize),
//     });
//   })
// );

// DiscountRouter.get(
//   '/categories',
//   expressAsyncHandler(async (req, res) => {
//     const categories = await Discount.find().distinct('category');
//     res.send(categories);
//   })
// );

discountRouter.get('/slug/:slug', async (req, res) => {
  const discount = await Discount.findOne({ slug: req.params.slug });
  if (discount) {
    res.send(discount);
  } else {
    res.status(404).send({ message: 'Discount Not Found' });
  }
});
discountRouter.get('/:id', async (req, res) => {
  const discount = await Discount.findById(req.params.id);
  if (discount) {
    res.send(discount);
  } else {
    res.status(404).send({ message: 'Discount Not Found' });
  }
});

export default discountRouter;
