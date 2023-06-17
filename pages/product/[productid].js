import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Textarea, Button, Rating, CardHeader, CardBody, Card, Avatar,Typography} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductData } from "../../store/products-actions";
import { cartActions } from "../../store/cart-slice";


const ProductDetails = (props) => {

  const [reviewBox, setReviewBox] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [Qty, SetQty] = useState(1);


  const { data: session, status } = useSession();

  const router = useRouter();
  const dispatch = useDispatch();
  
  const prodStateRedux = useSelector((state) => state.products);
  const { products,loading } = prodStateRedux;
  const product = products.find((product) => product._id === router.query.productid);

  useEffect(() => {
    if(products.length === 0) dispatch(fetchProductData());
  }, [dispatch]);

  let has_Logged_In_user_reviewed = false;

  const handleImageClick = (index) => {
    setCurrentImage(index);
  };


  if(session){
    let user_email 
  
    if(session.user) user_email = session.user.email;
    else if(session.data) user_email = session.data.user.email;
    
    has_Logged_In_user_reviewed = props.product && props.product.reviews && props.product.reviews.length>0 && props.product.reviews.find(
      (r) => {
        console.log(r.email,user_email);
        return r.email === user_email
      }
    );
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    await fetch(`/api/products/${router.query.productid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user_email": session.user ? session.user.email : session.data.user.email,
      },
      body: JSON.stringify({
        rating,
        comment,
      }),
    }).then((res) => 
      window.location.reload()
    )
  };

  

  const addToCartHandler = async () => {
    const prod = {
      productId:product._id,
      productName:product.name,
      productPrice:product.price,
      productImage:product.main_image,
      qty:Qty,
      countInStock:product.countInStock,
    }
    dispatch(cartActions.addItemToCart(prod))
    router.push("/cart");
    if (session) {
      await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          user_email: session.user.email,
        },
        body: JSON.stringify({
          productId: product._id,
          qty: Qty,
        }),
      })
    } 
  };
 


  if(loading) return <div>Loader....</div>



  return (
    <div className="flex flex-col">


      <div className="flex flex-col md:flex-row">



        <div className="md:w-1/2 flex flex-row px-6 mt-4">


          <div className="flex flex-col">
            {product.images.map((image, index) => (
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
            src={product.images[currentImage]}
            alt={`Product Image`}
            className="object-contain h-3/4 mx-auto mb-auto mt-10 w-3/4 mr-6 border-2 border-purple-100"
          />
        </div>


        <div className="md:w-1/2 pl-6 pr-16 py-8">
          <div className="flex flex-row mb-4">
            <div className="flex flex-col my-auto">
              <h2 className="text-2xl h-1/2 font-bold mb-2">
                {product.name}
              </h2>
              <div className="text-2xl h-1/2 font-bold mb-4">
                {" "}
                &#8377; {product.price}
              </div>
            </div>

            <div className="my-4 rounded-xl bg-white py-2 px-4 shadow sm:my-0 sm:ml-auto">
              <div className="flex h-16 items-center text-2xl font-bold text-blue-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-center w-full text-3xl">
                  {" "}
                  {product.rating}
                </span>
              </div>
              <p className="text-sm text-gray-500">Average User Rating</p>
            </div>
          </div>

          <div className="flex justify-between mb-4 w-1/2">
            <div>
            <span className="mr-2">Quantity:</span>
            <select
              className="border border-gray-400 p-1 h-8 text-sm rounded"
              value={Qty}
              onChange={(e) => SetQty(e.target.value)}
            >
              {[...Array(product.countInStock).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </select>
            </div>

            <Button onClick={addToCartHandler} variant="gradient" color="purple" className="mb-4">Add to Cart</Button>
          </div>
          

          <p className="text-gray-700 mb-4">{product.tagline}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Sample Offer Cards */}
            {product.offers.map((offer, index) => (
              <div className="bg-white-100 border-2 rounded p-4" key={index}>
                <h4 className="font-bold">{offer.offer}</h4>
                <p className="text-gray-700">{offer.description}</p>
              </div>
            ))}
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

            {product.description.map((item, index) => (
              <span key={index} className="text-gray-700 block my-2">
                {item}
              </span>
            ))}
          </div>
        </div>



       

      </div>




      <div className="px-6 flex flex-row justify-between">

         { session && (session.user||session.data) && (!has_Logged_In_user_reviewed) && <div className="w-3/12">
              <Button
                  variant="gradient"
                  color="purple"
                  onClick={() => setReviewBox(!reviewBox)}
                  className="mb-6"
              >
                Write a review
                </Button>
           
            {reviewBox && (
              <div className="">
                {/* <ReviewInputBox /> */}
                <label for="rating" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select rating</label>
                  <select id="rating" className="bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-blue-500"
                  onChange={(e)=>setRating(e.target.value)}
                  >
                    <option value="1">Poor</option>
                    <option value="2">Fair</option>
                    <option value="3">Good</option>
                    <option value="4">Very Good</option>
                    <option value="5">Excellent</option>
                  </select>

                <Textarea label="Review" size="md" color="purple"className="mb-4" onChange={(e)=>setComment(e.target.value)}/>

                <Button
                  variant="gradient"
                  color="purple"
                  onClick={handleSubmitReview}
                >
                  Post
                </Button>
              </div>
            )}
          </div>
}

        <div className={`${ (session && (session.user||session.data)) ? "w-8/12" : "w-10/12" } mt-4 w-screen-md px-10 py-4`}>
          <div>
            {product.reviews.length > 0 ? (
              <ul className={`${ (session && (session.user||session.data)?"grid-cols-2 ":"grid-cols-3")} w-full grid gap-4`}>
                {product.reviews.map((review, index) => (
            
                  <Card
                    color="transparent"
                    shadow={false}
                    className="w-full max-w-[26rem] border-2 border-purple-200 px-6"
                  >
                    <CardHeader
                      color="transparent"
                      floated={false}
                      shadow={false}
                      className="mx-0 flex items-center gap-4 pt-0 pb-4"
                    >
                      <Avatar
                        size="lg"
                        variant="circular"
                        src={review.profile_image}
                        alt="candice wu"
                      />
                      <div className="flex w-full flex-col gap-0.5">
                        <div className="flex items-center justify-between">
                          <Typography variant="h5" color="blue-gray">
                              {review.name}
                          </Typography>
                          <Rating value={review.rating} readonly/>
                          {/* <div className="5 flex items-center gap-0">
              <StarIcon className="h-5 w-5 text-yellow-700" />
              <StarIcon className="h-5 w-5 text-yellow-700" />
              <StarIcon className="h-5 w-5 text-yellow-700" />
              <StarIcon className="h-5 w-5 text-yellow-700" />
              <StarIcon className="h-5 w-5 text-yellow-700" />
            </div> */}
                        </div>
              
                      </div>
                    </CardHeader>
                    <CardBody className="mb-6 p-0">
                      <Typography>
                        {review.comment}
                      </Typography>
                    </CardBody>
                  </Card>
 
                ))}
              </ul>
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>


      </div>
    </div>
  );
};


export default ProductDetails;
