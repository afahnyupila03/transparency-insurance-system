import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    name: { type: String, trim: true },
    phone: { type: Number },
    status: {
      type: String,
      enum: ['enabled', 'disabled'],
      default: 'enabled'
    },
    car: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Car'
      }
    ],
    isCarOwner: { type: Boolean, enum: [true, false], default: false },
    status: {
      type: String,
      enum: ['enabled', 'deleted', 'deactivated', 'disabled'],
      default: 'enabled'
    },
    deactivatedTime: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
)

const User = mongoose.model('User', userSchema)
export default User
