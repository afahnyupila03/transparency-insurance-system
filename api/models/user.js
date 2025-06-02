import mongoose from 'mongoose'
const { Schema } = mongoose

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true
    },
    name: { type: String, trim: true },
    phone: { type: Number },
    status: {
      type: Boolean,
      enum: ['enabled', 'disabled'],
      default: 'enabled'
    },
    cars: {
      type: Schema.Types.ObjectId,
      ref: 'Car'
    }
  },
  { timeStamps: true }
)

const User = mongoose.model('User', userSchema)
export default User
