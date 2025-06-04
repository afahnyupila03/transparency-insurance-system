import mongoose, { Schema } from 'mongoose'

const carSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    // ssdtId: {
    //   type: String,
    //   unique: true,
    //   required: true,
    //   match: /^[A-Z]\d{7}$/, // Ensures format: one uppercase letter followed by seven digits,
    //   immutable: true
    // },
    regNum: {
      required: true,
      unique: true,
      type: String,
      match: /^[A-Z]{2} \d{3} [A-Z]{2}$/
    },
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true,
      match: /^[A-Z]{2,}$/
    },
    genre: {
      type: String,
      required: true,
      match: /^[A-Z]{2,}$/
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
    // body: {
    //   type: String,
    //   required: true,
    //   match: /^[A-Z]{2,}$/
    // },
    chassisNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[A-HJ-NPR-Z0-9]{17}$/, // /^[A-Z]{2}\d{3}[A-Z]{3}\d{2}[A-Z]{1}\d{6}$/
      immutable: true
    },
    energy: {
      type: String,
      trim: true,
      required: true,
      match: /^[A-Z]{2,}$/
    },
    hpRating: {
      type: Number,
      required: true,
      immutable: true
    },
    numberOfSeats: {
      type: Number,
      required: true,
      immutable: true
    },
    // netWeight: {
    //   type: Number,
    //   required: true,
    //   immutable: true
    // },
    // authorizedLoad: {
    //   type: Number,
    //   required: true,
    //   immutable: true
    // },
    carryingCapacity: {
      type: Number,
      required: true
      // immutable: true
    },
    // body: {
    //   type: String,
    //   required: true,
    //   immutable: true
    // },
    // leanOnVehicle: {
    //   type: String,
    //   required: true,
    //   immutable: true
    // },
    firstYear: {
      type: Date,
      required: true,
      immutable: true
    },
    status: {
      type: String,
      enum: ['enabled', 'disabled', 'deleted'],
      default: 'enabled'
    },
    policy: [{
      type: Schema.Types.ObjectId,
      ref: 'Policy'
    }]
  },
  { timestamps: true }
)

const Car = mongoose.model('Car', carSchema)
export default Car
