import Cart from "../../../models/cart";
import Product from "../../../models/product";
import mongoose from "mongoose";
import User from "../../../models/user";

export default async function handler(req, res) {
 

  try {
    const { method } = req;
    const user_email = req.headers.user_email;
    await mongoose.connect(process.env.DB_URL);

    switch (method) {
        case "GET":
          break;
    
        case "POST":
          break;

        case "DELETE":
          try {
            const user = User.findOne({ email: user_email });
            const cart = await Cart.findOne({ user: user._id });
            const productId  = req.query.prodid;     
            const id = new mongoose.Types.ObjectId(productId);
            // console.log(id);
            const product = await Product.findOne({ _id: id });
            if (!product){
              res
                .status(404)
                .json({ success: false, message: "Product not found" });
                return;
            }
            if (cart) {
              const itemIndex = cart.items.findIndex(
                (p) => p.productId.toString() === productId.toString()
              );

               console.log(cart);
              if (itemIndex > -1) {
                cart.items.splice(itemIndex, 1);
                console.log(cart);
            }
    
              await cart.save();
              res.status(200).json({ success: true, message: "Item removed succesfully" });
            } else {
                res
                    .status(200)
                    .json({ success: false, message: "Cart does not exist" });
            }
             
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
