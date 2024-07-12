import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('Connecetd to MongoDB:', conn.connection.host);
  } catch (err) {
    console.log('Error connecting database:', err);
  }
}

export default connectDB;