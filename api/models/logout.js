import mongoose, { Schema } from 'mongoose'

const logoutSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
)

const Logout = mongoose.model('Logout', logoutSchema)
export default Logout
