import Head from "next/head";
import ProductCarousel from "../components/Carousel";
import Product from "../components/Product";
import SkeletonCard from "../components/SkeletonCard";
import {  useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductData } from "../store/products-actions";
import { Typography } from "@material-tailwind/react";
import io from "socket.io-client";

let socket;

const HomePage = () => {

  useEffect(() => {
   
    socket = io("http://localhost:5000/");


    socket.emit("connection", (error) => {
      if (error) {
        alert(error);
      }
    });
  }, []);

  
  const dispatch = useDispatch();
  useEffect(() => {
    if(products.length === 0) dispatch(fetchProductData());
  }, [dispatch]);
  const productState = useSelector((state) => state.products);
  const { products, loading } = productState;
  const cards = ["1", "2", "3", "4", "5", "6", "7", "8"];


  return (

    <>
      <Head>
          <title>Home</title>
          <meta name="description" content="Home" />
          <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="mb-14">

        <ProductCarousel products={products}/>

        <div className="flex flex-row justify-between">
          <div className="w-full">
            
            <Typography variant="h2" color="gray" className="text-center my-6">Latest Products</Typography>
          
            <div className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 justify-items-center justify-center gap-y-4 gap-x-10 mt-10 mb-5">
              {
                loading ? 
              
                cards.map((card) => (
                      <div className="flex" key={card}>
                        <SkeletonCard />
                      </div>
                )) : 
                
                products.map((product) => (
                    <div key={product._id} className="flex">
                        <Product product={product} />
                    </div>
                ))
              }
      
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage;
