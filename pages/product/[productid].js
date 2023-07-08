import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Textarea, Button, Rating, CardHeader, CardBody, Card, Avatar,Typography, Spinner, Input} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductData } from "../../store/products-actions";
import { cartActions } from "../../store/cart-slice";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../../utils/dbconnect";

const ReviewBox = ({review}) => {
  return(
    <Card color="transparent" shadow={false} className="w-full  border-2 border-purple-200 px-6">
    <CardHeader
      color="transparent"
      floated={false}
      shadow={false}
      className="mx-0 flex items-center gap-4 pt-0 pb-4"
    >
      <Avatar
        size="lg"
        variant="circular"
        src={review.image}
        alt="candice wu"
      />
      <div className="flex w-full flex-col gap-0.5">
        <div className="flex items-center justify-between">
          <Typography variant="h5" color="blue-gray">
              {review.name}
          </Typography>
        
        </div>

      </div>
    </CardHeader>
    <CardBody className="mb-6 p-0">
      <Typography>
        {review.comment}
      </Typography>
    </CardBody>
  </Card>
)}

const ProductDetails = (props) => {


  const showToast = (msg) =>
  toast(msg, {
    hideProgressBar: true,
    autoClose: 5000,
    type: "error",
    position: toast.POSITION.TOP_CENTER,
  });


  const [currentImage, setCurrentImage] = useState(0);
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [Qty, SetQty] = useState(1);
  const [adding_to_cart, setAdding_to_cart] = useState(false);
  const [submitting_review, setSubmitting_review] = useState(false);
  const [error, setError] = useState(null);
  let notuserReview = true;

  
  let isAuthenticated = false;
  if(localStorage.getItem("token")!==null) isAuthenticated = true;

  
  const router = useRouter();
  const dispatch = useDispatch();
  
  const prodStateRedux = useSelector((state) => state.products);
  const userStateRedux = useSelector((state) => state.user);
  const { products,loading } = prodStateRedux;
  const product = products.find((product) => product._id === router.query.productid);

  useEffect(() => {
    if(products.length === 0) dispatch(fetchProductData());
  }, [dispatch]);


  const handleImageClick = (index) => {
    setCurrentImage(index);
  };


  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if(!isAuthenticated){
      showToast("Please Login to add a review");
    } else{

      if(title === "" || comment === ""){
        showToast("Please fill all the fields");
        return;
      }

      if(rating < 1 || rating > 5){
        showToast("Please select a valid rating between 1 and 5");
        return;
      }

      if(comment.length < 30){
        showToast("Please enter a comment of atleast 30 characters");
        return; 
      }

      setSubmitting_review(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${BACKEND_URL}api/v1/products/${router.query.productid}/review`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify({title,rating,comment })
      })

      
      const data = await res.json();

      if(data.status === "success"){
        setReviewBox(false);
        setTitle("");
        setRating(1);
        setComment("");
        dispatch(fetchProductData());
      } else{
        showToast(data.message);
      };
      

      setSubmitting_review(false);
    };
  }


  const addToCartHandler = async () => {
    if(!isAuthenticated){
      showToast("Please Login to add to cart");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else{

        const prod = {
          productId:product._id,
          productName:product.name,
          productPrice:product.price,
          productImage:product.main_image,
          qty:Qty,
          countInStock:product.countInStock,
        }
        dispatch(cartActions.addItemToCart(prod));
        const token = localStorage.getItem("token");
        
        setAdding_to_cart(true);
        fetch(`${BACKEND_URL}api/v1/cart/item`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product._id,
            qty: 1,
          }),
        }).then((res) => router.push("/cart"));
    }
  };
 

  if (adding_to_cart || submitting_review ) {
    return(
      <Spinner color="blue" size="xl" className="mt-32 mx-auto" />
    )
  }
  if (submitting_review ) {
    return(
      <Spinner color="blue" size="xl" className="mt-32 mx-auto" />
    )
  }
  if (loading) {
    return(
      <Spinner color="blue" size="xl" className="mt-32 mx-auto" />
    )
  }


  if(userStateRedux.email!=="" && product){
    if(product.reviews.find((review) => review.user_email === userStateRedux.email)){
      notuserReview = false;
    }
  }



  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 flex flex-row px-6 mt-4">
          <div className="flex flex-col">
            {product?.images.map((image, index) => (
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
            src={product?.images[currentImage]}
            alt={`Product Image`}
            className="object-contain h-3/4 mx-auto mb-auto mt-10 w-3/4 mr-6 border-2 border-purple-100"
          />
        </div>


        <div className="md:w-1/2 pl-6 pr-16 py-8">
          <div className="flex flex-row mb-4">
            <div className="flex flex-col my-auto">
              <h2 className="text-2xl h-1/2 font-bold mb-2">
                {product?.name}
              </h2>
              <div className="text-2xl h-1/2 font-bold mb-4">
                {" "}
                &#8377; {product?.price}
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
                  {product?.rating}
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
              {[...Array(product?.countInStock).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </select>
            </div>

            <Button onClick={addToCartHandler} variant="gradient" color="purple" className="mb-4">Add to Cart</Button>
          </div>
          

          <p className="text-gray-700 mb-4">{product?.tagline}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Sample Offer Cards */}
            {product?.offers.map((offer, index) => (
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

            {product?.description.map((item, index) => (
              <span key={index} className="text-gray-700 block my-2">
                {item}
              </span>
            ))}
          </div>
        </div>



       

      </div>




      <div className="px-6 flex flex-row justify-between">

         { isAuthenticated && userStateRedux && notuserReview && <div className="w-3/12">
             
      

              <div className="flex flex-col gap-y-4">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-900 dark:text-white">Select rating</label>
                  <select 
                  id="rating" 
                  className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-blue-500"
                  onChange={(e)=>setRating(e.target.value)}
                  >
                    <option value="1">Poor</option>
                    <option value="2">Fair</option>
                    <option value="3">Good</option>
                    <option value="4">Very Good</option>
                    <option value="5">Excellent</option>
                  </select>


                <Input size="lg" color="purple" label="Enter your review title"  onChange={(e)=>setTitle(e.target.value)}/>
                <Textarea label="Review" size="md" color="purple" className="p-4" onChange={(e)=>setComment(e.target.value)}/>

                <Button
                  variant="gradient"
                  color="purple"
                  onClick={handleSubmitReview}
                >
                  Post
                </Button>
              </div>
            
          </div>
}

        <div className={`${ (notuserReview) ? "w-8/12" : "w-10/12" } mt-4 w-screen-md px-10 py-4`}>
          <div>
            {product?.reviews.length > 0 ? (
              <ul className={`${ isAuthenticated?"grid-cols-1 ":"grid-cols-2"} w-full grid gap-4`}>
                {product?.reviews.map((review, index) => (
                  <ReviewBox review={review} />
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



export default dynamic(() => Promise.resolve(ProductDetails), {ssr: false});;
