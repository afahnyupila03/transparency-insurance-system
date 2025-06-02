import mongoose, { Schema } from 'mongoose'

const carSchema = new Schema(
  {
    ssdtId: {
      type: String,
      unique: true,
      required: true,
      match: /^[A-Z]\d{7}$/, // Ensures format: one uppercase letter followed by seven digits,
      immutable: true
    },
    regNum: {
      required: true,
      unique: true,
      type: String,
      match: /^[A-Z]{2} \d{3} [A-Z]{2}$/,
      immutable: true
    },
    name: {
      type: String,
      required: true
    },
    genre: {
      type: String,
      required: true,
      match: /^[A-Z]{2}$/
    },
    type: {
      type: String,
      required: true,
      trim: true,
      immutable: true
    },
    mark: {
      type: String,
      required: true,
      trim: true,
      match: /^[A-Z]{2,}$/,
      immutable: true
    },
    body: {
      type: String,
      required: true,
      match: /^[A-Z]{2,}$/
    },
    chassisNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[A-HJ-NPR-Z0-9]{17}$/,
      immutable: true // /^[A-Z]{2}\d{3}[A-Z]{3}\d{2}[A-Z]{1}\d{6}$/
    },
    energy: {
      type: Number,
      trim: true,
      required: true,
      match: /^[A-Z]{2,}$/
    },
    hpRating: {
      type: String,
      required: true,
      immutable: true
    },
    numberOfSeats: {
      type: Number,
      required: true,
      immutable: true
    },
    netWeight: {
      type: Number,
      required: true,
      immutable: true
    },
    authorizedLoad: {
      type: Number,
      required: true,
      immutable: true
    },
    carryingCapacity: {
      type: Number,
      required: true,
      immutable: true
    },
    body: {
      type: String,
      required: true,
      immutable: true
    },
    leanOnVehicle: {
      type: String,
      required: true,
      immutable: true
    },
    firstCirculation: {
      type: Date,
      required: true,
      immutable: true
    }
  },
  { timestamps: true }
)

const Car = mongoose.model('Car', carSchema)
export default Car
