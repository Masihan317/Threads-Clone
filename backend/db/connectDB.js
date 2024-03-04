import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URL)
  } catch (err) {
    process.exit(1)
  }
}

export default connectDB