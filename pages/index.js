// import { MongoClient } from "mongodb";
import ProductCarousel from "../components/Carousel";
import Product from "../components/Product";

import {
  IconButton,
  SpeedDial,
  SpeedDialHandler,
  SpeedDialContent,
  SpeedDialAction,
} from "@material-tailwind/react";
import {
  PlusIcon,
  HomeIcon,
  CogIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
 

function HomePage(props) {
  
  return (
    <div className="mb-14">
      <ProductCarousel />

      <div className="flex flex-row justify-between">
        {/* <div className="w-3/12 bg-white-100"></div> */}
        <div className="w-full">
          <h1 className="text-3xl font-bold text-center mt-10 mb-5">Latest Products</h1>
          <div className='w-fit mx-auto grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 justify-items-center justify-center gap-y-4 gap-x-10 mt-10 mb-5'>
                {props.products.map(product => (
                  <div key={product._id} className='flex'>
                    <Product product={product} />
                  </div>
                ))}
          </div>
        </div>
      </div>

    

      
    </div>
  );
}

export async function getStaticProps() {

  // const client  = await MongoClient.connect(process.env.DB_URL);
  // const db = client.db();
  // console.log('connected');
  
  // const productCollection = db.collection('products');
  // const products = await productCollection.find().toArray();

  // const router = useRouter()

  try {
    const req_sample = await fetch(
      `http://localhost:3000/api/products/`,
      {
        method: "GET",
      }
    );
    const data = await req_sample.json();
    const products=data.data;
    // const res = await fetch('http://localhost:3000/api/products');
    // if (!res.ok) {
    //   return {
    //     redirect: {
    //       destination: '/custom'
    //     }
    //   }
    // }
    // const products = await res.json();
  
  
    return {
      props: {
        products: products.map(product => ({
          _id: product._id.toString(),
          main_image: product.main_image,
          price: product.price,
          name: product.name,
          brand: product.brand
        })),
      },
      revalidate: 60,
    }
  } catch (error) {
    return{
      props: {
        products: [],
      },
    }
  }

 
}

export default HomePage;
