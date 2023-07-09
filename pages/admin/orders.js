import { Spinner, Switch, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../../components/AdminLayout";
import { BACKEND_URL } from "../../utils/dbconnect";


const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const TABLE_HEAD = ["Created At", "Amount","Payment","Delivery","Postal Code","Delivery Succesfull"];

const TableRow = ({ id,image,title,createdAt,totalPrice,paid_status,zipcode,isdel_status}) => {
    
  const [del_status,setDel_status] = useState(isdel_status);

  const [just_changed,setJust_changed] = useState(false);

  const change_del_status = async (e) => {
   
    e.preventDefault();
      console.log("changing status");
      await axios.patch(`${BACKEND_URL}api/v1/orders/${id}`, {
        isDelivered: !del_status,
      },{
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${localStorage.getItem("token")}`
        }
      }
      ).then((res) => {
        if(res.status===200) setDel_status(!del_status);
        toast(
          "Delivery Status Changed, Now please wait for 10 seconds to change the status again",
          {
            type: "success",
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          }
        )
        console.log(res);
      }).catch((err) => {
        console.log(err);
      });
  };


    const date = new Date(createdAt);
    const timstamp = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
    return(
    <div className="grid grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
    <div className="col-span-2 flex items-center">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="h-12.5 w-15 rounded-md">
          <img src={image} alt="Product" className="rounded-lg"/>
        </div>
        <p className="text-sm text-black dark:text-white">
          {title}
        </p>
      </div>
    </div>
    <div className="col-span-1 hidden items-center sm:flex">
      <p className="text-sm text-black dark:text-white">{timstamp}</p>
    </div>
    <div className="col-span-1 flex items-center">
      <p className="text-sm text-black dark:text-white">&#8377; {totalPrice}</p>
    </div>
    <div className="col-span-1 flex items-center">
      <p className="text-sm text-black dark:text-white">{paid_status}</p>
    </div>
    <div className="col-span-1 flex items-center">
    <p className="text-sm text-black dark:text-white">{del_status===true ? "Delivered" : "Pending"}</p>
    </div>
    <div className="col-span-1 flex items-center">
      <p className="text-sm text-black dark:text-white">{zipcode}</p>
    </div>
    <div className="col-span-1 w-full flex flex-row items-center justify-center">
      <Switch id="purple" color="purple" checked={del_status} onChange={change_del_status} />
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
                console.log(error);
                setError(error.response.data.message);
                setLoading(false);
            });
                
            // console.log(response.data.data.orders);


            if(error===null){
                console.log(response.data)
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
           orders.map(({_id,createdAt,totalPrice,shippingAddress,items,isPaid,isDelivered}) => (
               <TableRow
                    key={_id}
                    id={_id}
                    image={items[0]?.productId.image}
                    title={items[0]?.productId.title.split(" ").slice(0, 2).join(" ")}
                    createdAt={createdAt}
                    totalPrice={totalPrice}
                    paid_status={isPaid===true ? "Paid" : "Pending"}
                    zipcode={shippingAddress?.postalCode}
                    isdel_status={isDelivered}
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
