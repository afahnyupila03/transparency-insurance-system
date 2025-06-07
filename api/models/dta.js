import mongoose, { Schema } from 'mongoose'

const dtaSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  hpRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  price: {
    type: Number,
    required: true
  }
}, {timestamps: true})

const DTA = mongoose.model('DTA', dtaSchema)
export default DTA
