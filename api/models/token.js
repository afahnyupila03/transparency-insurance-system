import mongoose, { Schema } from 'mongoose'

const tokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600
  }
})

const Token = mongoose.model('Token', tokenSchema)
export default Token
