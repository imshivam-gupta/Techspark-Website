import mongoose from 'mongoose';

export const BACKEND_URL = 'https://blue-weary-hippo.cyclic.app/'
// export const BACKEND_URL = 'http://localhost:8000/'


const connectDB = handler => async (req, res) => {
  if (mongoose.connections[0].readyState) {
    // Use current db connection
    return handler(req, res);
  }
  // Use new db connection
  await mongoose.connect(process.env.DB_URL);
  return handler(req, res);
};

export default connectDB;