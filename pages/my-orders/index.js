import { PencilIcon } from "@heroicons/react/24/solid";
import { ArrowDownTrayIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../utils/dbconnect";
import axios from "axios";

const TABLE_HEAD = ["Order", "Order Time", "Payment Status", "Total Amount","Delivery Status","Zipcode"];
 

 
export default function OrdersPage() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

      const fetchOrders = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BACKEND_URL}api/v1/users/myorders`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data.data.orders);
        setLoading(false);
      }
  
      fetchOrders();
  },[]);


  return (
    <Card className="mt-6 w-3/4 py-4 mx-auto overflow-hidden shadow-2xl">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Your Orders
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              These are your orders placed till now
            </Typography>
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <div className="w-full md:w-72">
              <Input label="Search" icon={<MagnifyingGlassIcon className="h-5 w-5" />} />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-auto py-2 px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map( ({ createdAt,totalPrice,paymentMethod,shippingAddress,items,isPaid,_id,isDelivered }, index) => {
                const isLast = index === orders.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
 
                return (
                  <tr key={_id}>

                  
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={items[0].productId.image}
                          alt={name}
                          size="md"
                          className="border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                        />
                        <Typography variant="small" color="blue-gray" className="font-bold">
                          {items[0].productId.title.split(" ").slice(0, 2).join(" ")}
                        </Typography>
                      </div>
                    </td>


                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {createdAt}
                      </Typography>
                    </td>


                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          size="sm"
                          variant="ghost"
                          value={isPaid=== true ? "Paid" :"Not Paid"}
                          color={
                            isPaid === true ? "green" : isPaid === false ? "amber" : "red"
                          }
                        />
                      </div>
                    </td>
                  
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                      &#8377; {totalPrice/100}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          size="sm"
                          variant="ghost"
                          value={isDelivered=== true ? "Paid" : isDelivered === false ? "Pending" : "To be delivered"}
                          color={
                            isDelivered === true ? "green" : isDelivered === false ? "amber" : "red"
                          }
                        />
                      </div>
                    </td>

                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {shippingAddress.postalCode}
                      </Typography>
                    </td>

                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Button variant="outlined" color="blue-gray" size="sm">
          Previous
        </Button>
        <div className="flex items-center gap-2">
          <IconButton variant="outlined" color="blue-gray" size="sm">
            1
          </IconButton>
          <IconButton variant="text" color="blue-gray" size="sm">
            2
          </IconButton>
          <IconButton variant="text" color="blue-gray" size="sm">
            3
          </IconButton>
          <IconButton variant="text" color="blue-gray" size="sm">
            ...
          </IconButton>
          <IconButton variant="text" color="blue-gray" size="sm">
            8
          </IconButton>
          <IconButton variant="text" color="blue-gray" size="sm">
            9
          </IconButton>
          <IconButton variant="text" color="blue-gray" size="sm">
            10
          </IconButton>
        </div>
        <Button variant="outlined" color="blue-gray" size="sm">
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}