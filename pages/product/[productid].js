import { useState } from "react";
import { MongoClient } from "mongodb";
import {  useRouter } from "next/router";
import { useSession } from "next-auth/react";

const ProductDetails = (props) => {
  const images = props.product.images;
  const router = useRouter();

  const reviews = [];

  const [currentImage, setCurrentImage] = useState(0);


  const handleImageClick = (index) => {
    setCurrentImage(index);
  };

  const session =  useSession();
  const [Qty,SetQty] = useState(1);

  console.log(session);

  

  const addToCartHandler = async () => {

    let email;
    if(session.user) email = session.user.email;
    else email = session.data.user.email;
    if (session) {
      await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          user_email: email,
        },
        body: JSON.stringify({
          productId: props.product.id,
          qty: Qty,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          router.push("/cart");
          })
    } else{
      router.push("/login");
    }
  };

  console.log(props.product);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 flex flex-row px-6 mt-4">
          <div className="flex flex-col">
            {images.map((image, index) => (
              <div
                key={index}
                className={`mb-2 cursor-pointer w-20 ${
                  currentImage === index ? "border-2 border-purple-500" : ""
                }`}
                onClick={() => handleImageClick(index)}
              >
                <img
                  src={image}
                  alt={`Product Image ${index + 1}`}
                  className="object-contain h-20 w-20 cursor-pointer"
                />
              </div>
            ))}
          </div>

          <img
            src={images[currentImage]}
            alt={`Product Image`}
            className="object-contain h-3/4 mx-auto my-auto w-3/4 mr-6 border-2 border-purple-100"
          />
        </div>

        <div className="md:w-1/2 px-4 py-8">
          <h2 className="text-2xl font-bold mb-2">{props.product.name}</h2>
          <div className="text-2xl font-bold mb-4">${props.product.price}</div>
          <p className="text-gray-700 mb-4">{props.product.tagline}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Sample Offer Cards */}
            {props.product.offers.map((offer, index) => (
              <div className="bg-white-100 border-2 rounded p-4" key={index}>
              <h4 className="font-bold">{offer.offer}</h4>
              <p className="text-gray-700">{offer.description}</p>
            </div>
            ))
            }
            
          </div>
          <hr />

          <div className="py-2 flex flex-row gap-6">
            <div className="flex flex-col items-center justify-between">
              <img
                src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarmV3/free-shipping._CB592228481_.jpg"
                alt=""
                className="h-10 w-10"
              />
              <p className="text-xs text-purple-400 font-semibold text-center">
                Free Delivery
              </p>
            </div>

            <div className="flex flex-col items-center justify-between">
              <img
                src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarmV3/top-brand._CB592228481_.jpg"
                alt=""
                className="h-10 w-10"
              />
              <p className="text-xs text-purple-400 font-semibold text-center">
                Top Brand
              </p>
            </div>

            <div className="flex flex-col items-center justify-between">
              <img
                src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarmV3/returns._CB592228481_.jpg"
                alt=""
                className="h-10 w-10"
              />
              <p className="text-xs text-purple-400 font-semibold text-center">
                7 Days Replacement
              </p>
            </div>

            <div className="flex flex-col items-center justify-between">
              <img
                src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarmV3/warranty._CB592228481_.jpg"
                alt=""
                className="h-10 w-10"
              />
              <p className="text-xs text-purple-400 font-semibold text-center">
                1 Year Warranty
              </p>
            </div>
          </div>

          <hr />
          <div className="bg-white-100 rounded p-4">
            <h4 className="text-xl font-bold mb-2">About this item</h4>

            {props.product.description.map((item, index) => (
              <span key={index} className="text-gray-700 block my-2">
                {item}
              </span>
            ))}
           
          </div>
        </div>

        <div className="md:w-1/6 px-4 h-max py-4 bg-gray-100 mt-6 mr-4">
          <div className="text-black-400 font-semibold text-md text-center rounded px-4 mb-4">
            Sold By: Reliance Electronics
          </div>
          <div className="text-black-400 font-semibold text-md text-center rounded px-4 mb-4">
            In Stock
          </div>
          <div className="flex items-center mb-4">
            <span className="mr-2">Quantity:</span>
            <select
                className="border border-gray-400 p-1 h-8 text-sm rounded"
                value={Qty}
                onChange={(e) =>
                  SetQty(e.target.value)
                }
              >
                {[...Array(props.product.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
                           
            </select>
        
          </div>
          <div className="flex flex-col items-center mt-4 gap-2">
            <div className="bg-orange-500 w-full text-white font-bold rounded-2xl py-2 px-4">
              Buy Now
            </div>
            <div className="bg-yellow-500 w-full text-white font-bold rounded-2xl py-2 px-4 cursor-pointer" onClick={addToCartHandler}>
              Add to Cart
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16 px-20">
        <h3 className="text-2xl font-bold mb-4">Product Reviews</h3>
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review, index) => (
              <li key={index} className="mb-4">
                {review}
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}
        <form className="mt-4">
          <textarea
            placeholder="Write a review"
            className="w-full p-2 border border-gray-400 mb-2"
          ></textarea>
          <button
            type="submit"
            className="bg-purple-500 text-white rounded py-2 px-4"
          >
            Add Review
          </button>
        </form>
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  const client = await MongoClient.connect(process.env.DB_URL);
  const db = client.db();
  const productCollection = db.collection("products");
  const products = await productCollection.find({}, { _id: 1 }).toArray();

  return {
    fallback: false,
    paths: products.map((product) => ({
      params: { productid: product._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {

  const req_sample = await fetch(
    `http://localhost:3000/api/products/${context.params.productid}`,
    {
      method: "GET",
    }
  );
  const data = await req_sample.json();

  let offers=[];

  if(data.offers.length>0) offers= data.offers;
  else{
    offers.push({
      "offer":"Bank Offer",
      "description":"Flat INR 3000 Instant Discount on HDFC Bank Credit Card Transactions. Min purchase value INR 34999"
  })
    offers.push({
        "offer":"Cashback Offer",
       "description":"Get ₹ 30 cashback if you buy with other items in cart"
   })
  } 

  console.log(offers);

  return {
    props: {
      product: {
        id: data._id,
        name: data.name,
        price: data.price,
        images: data.all_images,
        tagline: data.tagline,
        description: data.description,
        offers: offers,
        countInStock: data.countInStock,
      },
    },
    revalidate: 60,
  };
}

export default ProductDetails;
