import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema(
  {
    code: { type: String, require: true, unique: true },
    isPercent: { type: Boolean, require: true, default: true },
    amount: { type: Number, required: true }, // if is percent, then number must be ≤ 100, else it’s amount of discount
    expireDate: { type: String, require: true, default: '' },
    isActive: { type: Boolean, require: true, default: true },
  },
  {
    timestamps: true,
  }
);

// DiscountCodesSchema.pre('save', function (next) {
//   var currentDate = new Date();
//   this.updated_at = currentDate;
//   if (!this.created_at) {
//     this.created_at = currentDate;
//   }
//   next();
// });

const Discount = mongoose.model('Discount', discountSchema);
export default Discount;
