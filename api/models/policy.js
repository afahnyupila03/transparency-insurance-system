import mongoose, { Schema } from 'mongoose'

const PolicySchema = new Schema(
  {
    zone: {
      type: String,
      enum: ['A', 'B', 'C'],
      required: true
    },
    hpRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true }
    },
    type: {
      type: String, // Vehicle category.
      required: true
    },
    withTrailer: {
      type: Boolean,
      required: false
    },
    energy: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
)

const Policy = mongoose.model('Policy', PolicySchema)
export default Policy
