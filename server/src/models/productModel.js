import mongoose from 'mongoose';
const productSchema = mongoose.Schema({
  campusID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campus',
    index: true,
    required: true
  },
  sellerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  title: {type: String, required: true},
  price: {type: Number, min: 0, required: true},
  description: {type: String},
  category: {type: String, index: true},
  images: [String],
  condition: {
    type: String,
    required: true,
    enum: ['new', 'like-new', 'good', 'fair', 'poor'],
    default: 'good'
  },
  status: {
    type: String,
    enum: ['Active', 'Reserved', 'Sold', 'Removed'],
    default: 'Active',
    index: true
  }
})
productSchema.index({campusID: 1, active: 1, createdAt: -1});
productSchema.index({title: 'text', description: 'text'})

export const productModel = mongoose.model('Product', productSchema)