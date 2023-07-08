import { Spinner, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { BACKEND_URL } from "../../utils/dbconnect";

 
const TABLE_HEAD = ["Price", "Discount", "Brand","Inventory","Seller"];

const TableRow = ({ image,title, price, discount, category, brand, count_in_stock }) => {
    return(
    <div className="grid grid-cols- border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
    <div className="col-span-2 flex items-center">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="h-12.5 w-15 rounded-md">
          <img src={image} alt="Product" />
        </div>
        <p className="text-sm text-black dark:text-white">
          {title}
        </p>
      </div>
    </div>
    <div className="col-span-1 hidden items-center sm:flex">
      <p className="text-sm text-black dark:text-white">{category}</p>
    </div>
    <div className="col-span-1 flex items-center">
      <p className="text-sm text-black dark:text-white">{price}</p>
    </div>
    <div className="col-span-1 flex items-center">
      <p className="text-sm text-black dark:text-white">{discount===0?"No Discount":`${discount} `}</p>
    </div>
    <div className="col-span-1 flex items-center">
      <p className="text-sm text-black dark:text-white">{brand}</p>
    </div>
    <div className="col-span-1 flex items-center">
      <p className="text-sm text-meta-3 dark:text-white">{count_in_stock}</p>
    </div>
  </div>
)}

const TableHeading = ({title}) => {
    return(
    <div className="col-span-1 flex items-center">
        <p className="font-medium">{title}</p>
    </div>
)}
 

export default function AdminUser() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

  
    useEffect(() => {
  
        const fetchProducts = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${BACKEND_URL}api/v1/products`, {
                headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
                },
            }).catch((error) => {
                console.log(error.response.data.message);
                setError(error.response.data.message);
                setLoading(false);
            });
                

            if(error===null){
                setProducts(response.data.data.docs);
                console.log(response.data.data.docs);
                setLoading(false);
            }
        }
            
        fetchProducts();

    
    },[]);
  

  return (
    loading? <Spinner color="blue" size="xl" className="mt-32 mx-auto" /> : error? <Typography variant="h3" color="blue-gray" className="text-center mt-32">Something went wrong</Typography>:
    <>


        <div className="mb-6 px-4 md:px-6 xl:px-7.5">
            <h4 className="text-4xl font-semibold text-black text-center dark:text-white">
                Products with us
            </h4>
        </div>
        
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
     

      <div className="grid grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">

        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Product</p>
        </div>

        <div className="col-span-1 hidden items-center sm:flex">
          <p className="font-medium">Category</p>
        </div>

        { TABLE_HEAD.map((item) => ( <TableHeading title={item}/> )) }
      
      </div>

        {
            products.map((product) => (
                <TableRow
                    key={product._id}
                    image={product.image}
                    title={product.title}
                    price={product.price}
                    discount={product.discount}
                    category={product.category}
                    brand={product.brand}
                    count_in_stock={product.count_in_stock}
                />
            ))
        }
     
    </div>
    </>
  );
}

AdminUser.getLayout = function getLayout(page) {
  return (
      <AdminLayout>{page}</AdminLayout>
  )
}