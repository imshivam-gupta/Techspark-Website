import mongoose from "mongoose";
import User from "../../../models/user";
import Order from "../../../models/order";

export default async function handler(req, res) {
  try {
    const { method } = req;
    await mongoose.connect(process.env.DB_URL);
    console.log(req.body);
    switch (method) {
      case "GET":
        break;

      case "POST":
        try {
          const user_email = req.headers.user_email;
          const temp = await User.findOne({ email: user_email });

          

          const {
            items,
            shippingAddress,
          } = req.body;
          const order = new Order({
            user: temp._id,
            items,
            shippingAddress
          });

          const createdOrder = await order.save();
          res.status(200).json({ success: true, order: createdOrder });
        } catch (error) {
          console.log(error);
          res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }

        break;
      
      default:
        res.status(400).json({ success: false });
        break;
    }
  } catch (error) {
    console.log(error);
  } finally {
    mongoose.connection.close();
  }
}
