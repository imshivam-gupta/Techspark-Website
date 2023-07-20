import { Spinner, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { BACKEND_URL } from "../../utils/dbconnect";
import Link from "next/link";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import AdminOrders from "./orders";


const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const TABLE_HEAD = ["Role","Active", "Registered","Send Mail","Total Orders"," "];

const TableRow = ({ id,name,email, image, role, active,createdAt,orders }) => {
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
          {name}
        </p>
      </div>
    </div>
    <div className="col-span-1 hidden items-center sm:flex">
      <p className="text-sm text-black dark:text-white">{role.charAt(0).toUpperCase() + role.slice(1)}</p>
    </div>
    <div className="col-span-1 flex items-center">
      <p className="text-sm text-black dark:text-white">{active===true ? "Yes" : "No"}</p>
    </div>
    <div className="col-span-1 flex items-center">
      <p className="text-sm text-black dark:text-white">{timstamp}</p>
    </div>
    <div className="col-span-1 flex items-center">
      <Link href ={`mailto: ${email}`} className="text-sm text-black dark:text-white">Send Now</Link>
    </div>
    <div className="col-span-1 flex items-center">
      <p className="text-sm text-black dark:text-white">{orders.length}</p>
    </div>
    <div className="col-span-1 w-full flex flex-row items-center justify-center">
      <Link href={`/admin/users/edit/${id}`} className="">
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
 

export default function AdminUser() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

  
    useEffect(() => {
  
        const fetchusers = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${BACKEND_URL}api/v1/users`, {
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
                setUsers(response.data.data.docs);
                console.log(response.data.data.docs);
                setLoading(false);
            }
        }
            
        fetchusers();

    
    },[]);
  

  return (
    loading? <Spinner color="blue" size="xl" className="mt-32 mx-auto" /> : error? <Typography variant="h3" color="blue-gray" className="text-center mt-32">Something went wrong</Typography>:
    <>


        <div className="mb-6 px-4 md:px-6 xl:px-7.5">
            <h4 className="text-4xl font-semibold text-black text-center dark:text-white">
                Users Registered
            </h4>
        </div>
        
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
     

      <div className="grid grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">

        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">User</p>
        </div>

        { TABLE_HEAD.map((item) => ( <TableHeading title={item}/> )) }
      
      </div>

        {
            users.map((user) => (
                <TableRow
                    key={user._id}
                    id={user._id}
                    name={user.name}
                    email={user.email}
                    image={user.image}
                    role={user.role}
                    active={user.active}
                    createdAt={user.createdAt}
                    orders={user.orders}
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