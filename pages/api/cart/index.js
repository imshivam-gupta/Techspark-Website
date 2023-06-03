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
          try {
            const user = User.findOne({ email: user_email });
            const cart = await Cart.findOne({ user :user._id });
    
            if (cart) {
              const ans = await cart.populate("items.productId");
              res.status(200).json({ success: true, ans });
            } else {
              res
                .status(200)
                .json({ success: false, message: "Cart does not exist" });
            }
          } catch (err) {
            console.log(err);
            res
              .status(500)
              .json({ success: false, message: "Internal Server Error" });
          }
    
          break;
    
        case "POST":
          try {
            const user = User.findOne({ email: user_email });
            const cart = await Cart.findOne({ user: user._id });

            
    
            const { productId, qty } = req.body;
            const product = await Product.findOne({ _id: productId });

            if (!product)
              res
                .status(404)
                .json({ success: false, message: "Product not found" });
    
            if (cart) {
              const itemIndex = cart.items.findIndex(
                (p) => p.productId.toString() === productId.toString()
              );
    
              if (itemIndex > -1) {
                const productItem = cart.items[itemIndex];
                productItem.qty = qty;
                cart.items[itemIndex] = productItem;
              } else {
                cart.items.push({ productId, qty });
              }
    
              await cart.save();
              const ans = await cart.populate("items.productId");
              res.status(200).json({ success: true, cart: ans });
            } else {
              const newCart = await Cart.create({
                items: [{ productId, qty }],
                user: user._id,
              });
    
              const ans = await newCart.populate("items.productId");
              res.status(200).json({ success: true, cart: ans });
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
