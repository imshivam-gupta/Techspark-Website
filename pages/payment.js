import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { Country, State, City }  from 'country-state-city';
import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
  ListItemSuffix,
} from "@material-tailwind/react";

const Payment = ({ cart }) => {

  const router = useRouter();
  const { data: session, status } = useSession();

  const [email,setEmail]=useState("");
  const [name,setName]=useState("");

  const [cardNumber,setCardNumber]=useState("");
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvc, setCvc] = useState("");

  const handleExpiryMonthChange = (e) => {
    setExpiryMonth(e.target.value);
  };

  const handleExpiryYearChange = (e) => {
    setExpiryYear(e.target.value);
  }



  useEffect(() => {
    const fetchSession = async () => {
      if (status === "loading" ) return;
      if (!session) {
        router.push("/login");
      } else {
        setEmail(session.user ? session.user.email : session.data.user.email);
        setName(session.user ? session.user.name : session.data.user.name);
      }
    };

    fetchSession();
  }, [session, router]);


  const handleCvcChange = (e) => {
    const { value } = e.target;
    // Limit the length of cvc to maximum 4 characters
    setCvc(value.slice(0, 4));
  };

 

  const [cartState, setCartState] = useState(cart);

  const [card, setCard] = useState(true);

 
  return (
    <>
      
      <div className="flex flex-row sm:px-10 lg:px-10 xl:px-20 lg:gap-20 mt-4 justify-between">
       
      
        <Card className="w-3/12 h-fit py-6">

          <Typography variant="h6" color="blue-gray" className="text-center">
            Your Order
          </Typography>

        <List>

        {cartState.items &&
              cartState.items.map((item) => (
                <ListItem key={item.productId} className="px-8 cursor-default">
                  <ListItemPrefix>
                    <Avatar variant="rounded" alt="candice" src={item.productImage}  size="xl"/>
                  </ListItemPrefix>
                  
                  <div className="grid grid-cols-2 w-full">
                    <Typography variant="h6" color="blue-gray">
                      {item.productName}
                    </Typography>
                   

                  <ListItemSuffix>
                  <Typography variant="h6" color="blue-gray">
                  &#8377; {item.productPrice}
                    </Typography>
                  </ListItemSuffix>

                  </div>


        </ListItem>
        ))}

      </List>

        </Card>

        <div className="w-8/12 mx-auto">
     
      <div className="relative px-4 sm:px-6 lg:px-8 pb-8 w-full" x-data="{ card: true }">
        <div className="bg-white px-8 pb-6 rounded-b shadow-lg mt-8 w-1/2 mx-auto">
         
          <div className="flex justify-center mb-6">
            <div className="relative flex w-full p-1 bg-gray-50 rounded">
              <span className="absolute inset-0 m-1 pointer-events-none" aria-hidden="true">
                <span
                  className={`absolute inset-0 w-1/2 bg-white rounded border border-gray-200 shadow-sm transform transition duration-150 ease-in-out ${
                    card ? 'translate-x-0' : 'translate-x-full'
                  }`}
                ></span>
              </span>
              <button
                className="relative flex-1 text-sm font-medium p-1 transition duration-150 ease-in-out focus:outline-none focus-visible:ring-2"
                onClick={() => setCard(true)}
              >
                Pay With Card
              </button>
              <button
                className="relative flex-1 text-sm font-medium p-1 transition duration-150 ease-in-out focus:outline-none focus-visible:ring-2"
                onClick={() => setCard(false)}
              >
                Pay With PayPal
              </button>
            </div>
          </div>
          <div>
            {card && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="card-nr">
                    Card Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="card-nr"
                    className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
                    type="text"
                    placeholder="1234 1234 1234 1234"
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\s/g, '');
                      const cardNumber = rawValue
                        .replace(/\W/gi, '')
                        .replace(/(.{4})/g, '$1 ')
                        .trim();
                      // Limit to 16 digits
                      const formattedCardNumber = cardNumber.substr(0, 19);
                      e.target.value = formattedCardNumber;
                      setCardNumber(formattedCardNumber);
                    }}
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1" htmlFor="card-expiry">
                      Expiry Date <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-2">
            <select
              id="card-expiry-month"
              className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0"
              value={expiryMonth}
              onChange={handleExpiryMonthChange}
            >
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                <option key={month} value={month < 10 ? `0${month}` : month}>
                  {month < 10 ? `0${month}` : month}
                </option>
              ))}
            </select>
            <select
              id="card-expiry-year"
              className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0"
              value={expiryYear}
              onChange={handleExpiryYearChange}
            >
              <option value="">Year</option>
              {Array.from({ length: 15 }, (_, index) => {
                const year = new Date().getFullYear() + index;
                return (
                  <option key={year} value={year.toString().substr(2, 2)}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1" htmlFor="card-cvc">
                      CVC <span className="text-red-500">*</span>
                    </label>
                    <input
        id="card-cvc"
        type="text"
        value={cvc}
        onChange={handleCvcChange}
        className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
        maxLength={4} // Set the maximum length to 4
      />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="card-name">
                    Name on Card <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="card-name"
                    className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
                    type="text"
                    placeholder="John Doe"
                  />
                </div>
                
              </div>
            )}
            <div className="mt-6">
              <div className="mb-4">
                <button className="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out w-full bg-indigo-500 hover:bg-indigo-600 text-white focus:outline-none focus-visible:ring-2">
                  Pay $253.00
                </button>
              </div>
              <div className="text-xs text-gray-500 italic text-center">
                You'll be charged $253, including $48 for VAT in Italy
              </div>
            </div>
          </div>
          <div x-show="!card" x-cloak>
            <div>
              <div className="mb-4">
                <button className="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out w-full bg-indigo-500 hover:bg-indigo-600 text-white focus:outline-none focus-visible:ring-2">
                  Pay with PayPal - $253.00
                </button>
              </div>
              <div className="text-xs text-gray-500 italic text-center">
                You'll be charged $253, including $48 for VAT in Italy
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
       

      </div>
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);

  // console.log(session.email);

  if (session) {
    const req_sample = await fetch(`https://techspark.vercel.app/api/cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        user_email: session.email,
      },
    });
    const data = await req_sample.json();
    const cart_res = data.ans;

    const cartTotal = cart_res && cart_res.items.reduce(
      (total, item) => total + item.qty * item.productId.price,
      0
    );

    return {
      props: {
        cart: {
          _id:  cart_res && cart_res._id.toString(),
          totalCost: cartTotal,
          items: cart_res && cart_res.items.map((item) => ({
            productId: item.productId._id,
            productName: item.productId.name,
            productPrice: item.productId.price,
            productImage: item.productId.main_image,
            qty: item.qty,
            countInStock: item.productId.countInStock,
          })),
        },
      },
    };
  } else {
    return {
      props: {
        cart: {
          _id: "",
          items: [],
        },
      },
    };
  }
};

export default Payment;
