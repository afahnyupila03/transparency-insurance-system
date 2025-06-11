import mongoose, { Schema } from 'mongoose'

const responsibilitySchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
}, {timestamps: true})

const Responsibility = mongoose.model('Responsibility', responsibilitySchema)
export default Responsibility
