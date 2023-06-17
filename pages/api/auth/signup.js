
import User from "../../../models/user";
const bcrypt = require("bcryptjs");
import dbConnect from "../../../lib/dbconnect";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const method = req.method;
  await mongoose.connect(process.env.DB_URL)
  let client;

  try{


    switch (method) {
      case "GET":
        break;
  
      case "POST":

        const { name, email, password } = req.body;
        const UserExists = await User.findOne({ email: email });
  
        if (UserExists) {
          res
          .status(401)
          .json({ success: false, message: "User already exists" });
        }
  
        else{

          const salt = bcrypt.genSaltSync(12);
          const hashedPassword = bcrypt.hashSync(password, salt);

          const user = await User.create({
            name,
            email,
            hash_password:hashedPassword
          });
 

          res.status(200).json({ success: true, message: "User created and signed in" });
        }

        break;
      
        default:
          res.status(400).json({ success: false });
        break;
    }
  }
  catch(error){
    console.error("Error connecting to the database:", error);
    res.status(500).json({ success: false, message: "Database connection failed" });
    return;
  }
  finally{
    if (client) {
      console.log("Database connection closed");
    }
  }


}
