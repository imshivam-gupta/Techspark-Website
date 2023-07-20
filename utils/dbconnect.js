import mongoose from 'mongoose';

export const BACKEND_URL = 'https://blue-weary-hippo.cyclic.app/'
// export const BACKEND_URL = 'http://localhost:8000/'


const connectDB = handler => async (req, res) => {
  if (mongoose.connections[0].readyState) {
    return handler(req, res);
  }

  await mongoose.connect(process.env.DB_URL);
  return handler(req, res);
};

export default connectDB;