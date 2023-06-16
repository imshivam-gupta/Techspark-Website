import Image from "next/image";
import { Button, Card, Carousel, IconButton, Rating, Typography } from "@material-tailwind/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline"
// import { motion } from "framer-motion"
import { useRouter } from "next/router";

export default function ProductCarousel({products}) {

  const tempcopy = products
  const topRatedProducts = tempcopy.slice().sort((a, b) => b.rating - a.rating).slice(0, 5);
  console.log(topRatedProducts)

  const router = useRouter();

  const handleProductClick = (id) => {
    router.push(`/product/${id}`);
  };


  
  return (
    <>
   
   <Carousel
      autoPlay={true}
      interval={3000}
      infiniteLoop={true}
      // transition= {{ type: "tween", duration: 0.5 }}
      prevArrow={({ handlePrev }) => (
        <IconButton
          variant="text"
          color="white"
          size="xl"
          onClick={handlePrev}
          className="!absolute top-2/4 -translate-y-2/4 left-4"
        >
          <ArrowLeftIcon strokeWidth={2} className="w-6 h-6" />
        </IconButton>
      )}
      nextArrow={({ handleNext }) => (
        <IconButton
          variant="text"
          color="white"
          size="xl"
          onClick={handleNext}
          className="!absolute top-2/4 -translate-y-2/4 !right-4"
        >
          <ArrowRightIcon strokeWidth={2} className="w-6 h-6" />
        </IconButton>
      )}
    >
    {
      topRatedProducts.map((product) => (
        <Card key={product._id} className="h-64 md:h-80 xl:h-84 w-full bg-gradient-to-br from-gray-500 to-gray-300 rounded-none px-6 mb-3 pb-5">
          <Card className="w-2/3 h-4/5 my-auto mx-auto bg-white flex flex-row justify-around">
            <img src={product.main_image} alt="" className="w-5/12 h-4/5 my-auto object-contain" />
            <div className="w-5/12 h-4/5 flex flex-col gap-y-4 justify-center my-auto">
              
              <div className="flex flex-row justify-around">
                <Typography color="black" variant={"h2"} className="text-center opacity-100 brightness-100">
                  {product.name.split(" ").slice(0, 2).join(" ")}  
                </Typography>
                <Rating value={product.rating} readonly />
              </div>
              
              <Typography color="black" variant={"h4"} className="text-center opacity-100 brightness-100 my-auto">
                &#8377; {product.price}
                </Typography>
              <Button onClick={()=>handleProductClick(product._id)} className="w-1/3">Buy Now</Button>
            </div>  

          </Card>
        </Card>
      ))
    }
     
    </Carousel>


   
    </>
  
  );
}
