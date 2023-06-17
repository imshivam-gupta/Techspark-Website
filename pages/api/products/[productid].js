import { MongoClient, ObjectId } from "mongodb";
import mongoose from "mongoose";
import Product from "../../../models/product";
import User from "../../../models/user";

export default async function handler(req, res) {

    const { method } = req;
  
    switch (method) {
        case 'GET':
            await mongoose.connect(process.env.DB_URL);
            try {
                const prodId = req.query.productid;
                const objectId = new ObjectId(prodId);
                const product = await Product.findOne({_id: objectId});
                res.status(200).json(product);
            } catch (error) {
                console.log(error);
            } finally {
            }

            mongoose.connection.close();
           
            break;
        case 'POST':
            
            await mongoose.connect(process.env.DB_URL);
            try {

            
                const prodId = req.query.productid;
                const objectId = new ObjectId(prodId);
                const product = await Product.findOne({_id: objectId});
                const user_email = req.headers.user_email;

                if(!product){
                    res.status(404).json({success:false,message: 'Product not found'});
                    return;
                }
                else{

                    
                    const user =await User.findOne({ email: user_email });
                    const alreadyReviewd = product.reviews.find(r=> r.user.toString() === user._id.toString())

                    if(alreadyReviewd){
                        res.status(400).json({success:false, message: 'Already reviewed'})
                        return;
                    }

                    const {rating,comment} = req.body

                   
                    // console.log(user_email,rating,comment,user.name,user._id);
                    
                    const review = {
                        name: user.name,
                        rating: Number(rating),
                        comment,
                        email: user.email,
                        profile_image: user.image,
                    }

                    product.reviews.push(review)
                    product.numReviews= product.reviews.length
                    product.rating= product.reviews.reduce((acc,item)=> item.rating+acc,0)/product.reviews.length
                    await product.save()

                    res.status(201).json({success:true, message: 'Review Added'})
       
                }
            } catch (error) {
                console.log(error);
            } finally {
                
            }

            mongoose.connection.close();

            break;
        default:
            res.status(400).json({success: false});
            break;
    }
}
