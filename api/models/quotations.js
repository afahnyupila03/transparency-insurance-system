import mongoose, { Schema } from 'mongoose'

const quotationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    car: {
      type: Schema.Types.ObjectId,
      ref: 'Car'
    },
    zone: {
      type: Schema.Types.ObjectId,
      ref: 'Zone'
    },
    total: { type: Number, required: true },
    vat: { type: Number, required: true },
    fc: { type: Number, required: true },
    tariff: { type: Number, required: true },
    discount: { type: Number, required: true },
    dta: { type: Number }
  },
  { timestamps: true }
)

const Quotation = mongoose.model('Quotation', quotationSchema)
export default Quotation
