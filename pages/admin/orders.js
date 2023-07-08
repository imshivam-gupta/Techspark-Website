import { Spinner, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { BACKEND_URL } from "../../utils/dbconnect";
import Link from "next/link";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
 

const TABLE_HEAD = ["Created At", "Amount","Payment Status","Postal Code"," "];

const TableRow = ({ id,image,title,createdAt,totalPrice,paid_status,zipcode}) => {
    console.log(totalPrice)
    return(
    <div className="grid grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
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
      <p className="text-sm text-black dark:text-white">{createdAt}</p>
    </div>
    <div className="col-span-1 flex items-center">
      <p className="text-sm text-black dark:text-white">{totalPrice}</p>
    </div>
    <div className="col-span-1 flex items-center">
      <p className="text-sm text-black dark:text-white">{paid_status}</p>
    </div>
    <div className="col-span-1 flex items-center">
      <p className="text-sm text-black dark:text-white">{zipcode}</p>
    </div>
    <div className="col-span-1 flex items-center">
      <Link href ={`mailto: ${zipcode}`} className="text-sm text-black dark:text-white">Send Now</Link>
    </div>
    <div className="col-span-1 w-full flex flex-row items-center justify-center">
      <Link href={`/admin/products/edit/${id}`} className="">
      <p className="text-sm text-meta-3 dark:text-white w-full">
        <PencilSquareIcon className="h-6 w-6"/>
      </p>
      </Link>
    </div>
  </div>
)}


const TableHeading = ({title}) => {
    return(
    <div className="col-span-1 flex items-center">
        <p className="font-medium">{title}</p>
    </div>
)}
 

const AdminOrders = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

  
    useEffect(() => {
  
        const fetchOrders = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${BACKEND_URL}api/v1/orders`, {
                headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
                },
            }).catch((error) => {
                console.log(error.response.data.message);
                setError(error.response.data.message);
                setLoading(false);
            });
                
            // console.log(response.data.data.orders);

            if(error===null){
                setOrders(response.data.data.orders);
                setLoading(false);
            }
        }
            
        fetchOrders();

    
    },[]);
  


    
    return(
        loading? <Spinner color="blue" size="xl" className="mt-32 mx-auto" /> : error? <Typography variant="h3" color="purple" className="text-center mt-32">Something went wrong</Typography>:
        <div>

            <div className="mb-6 px-4 md:px-6 xl:px-7.5">
                <h4 className="text-4xl font-semibold text-black text-center dark:text-white">
                    All orders with Techspark
                </h4>
            </div>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
     

     <div className="grid grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">

       <div className="col-span-2 hidden items-center sm:flex">
         <p className="font-medium">Your Orders</p>
       </div>

       { TABLE_HEAD.map((item) => ( <TableHeading title={item}/> )) }
     
     </div>

       {
           orders.map(({createdAt,totalPrice,shippingAddress,items,isPaid,_id}) => (
               <TableRow
                    key={_id}
                    id={_id}
                    image={items[0]?.productId.image}
                    title={items[0]?.productId.title.split(" ").slice(0, 2).join(" ")}
                    createdAt={createdAt}
                    totalPrice={totalPrice}
                    paid_status={isPaid===true ? "Paid" : "Pending"}
                    zipcode={shippingAddress?.postalCode}
               />
           ))
       }
    
   </div>





            
        </div>
    )
}

AdminOrders.getLayout = function getLayout(page) {
    return (
        <AdminLayout>{page}</AdminLayout>
    )
}

export default AdminOrders;
