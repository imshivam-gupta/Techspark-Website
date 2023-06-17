import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { Country, State, City }  from 'country-state-city';
import axios from "axios";

const Shipping = ({ cart }) => {

  const router = useRouter();
  const { data: session, status } = useSession();

  const [email,setEmail]=useState("");
  const [name,setName]=useState("");
  const [address, setAddress] = useState("");
  const [selectedCountry, setSelectedCountry] = useState({ name: "India", isoCode: "IN" });
  const [selectedState, setSelectedState] = useState({ name: "Delhi", isoCode: "DL" });
  const [selectedCity, setSelectedCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [cartState, setCartState] = useState(cart);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchCountries = () => {
      const allCountries = Country.getAllCountries();
      setCountries(allCountries);
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchStates = () => {
      // console.log(selectedCountry);
      const allStates = State.getStatesOfCountry(selectedCountry.isoCode);
      // console.log(allStates);
      setStates(allStates);
    };

    fetchStates();
  }, [selectedCountry]);

  useEffect(() => {
   
    // console.log(selectedCountry.isoCode,selectedState.isoCode)
    const fetchCities = () => {
      const allCities = City.getCitiesOfState(
        selectedCountry.isoCode,
        selectedState.isoCode
      );
      setCities(allCities);
    };

    fetchCities();
  }, [selectedCountry, selectedState]);


  useEffect(() => {
    const fetchSession = async () => {
      if (status === "loading" ) return;
      if (!session) {
        router.push("/login");
      } else {
        setEmail(session.user && session.user.email);
        setName(session.user && session.user.name);
      }
    };

    fetchSession();
  }, [session, router]);

  const redirectToCheckout = async () => {
    try {
      const data = await axios.post('/api/checkout', {
        items: Object.entries(cart.items).map(
          ([_, { qty,productName,productId,productImage,productPrice }]) => ({
            price_data:{
              currency:'INR',
              product_data:{
                name: productName,
                images: [productImage],
                metadata: { productId: productId},
              },
              unit_amount: Number(productPrice)*100,
            },
            quantity: Number(qty),
            tax_rates:['txr_1NFXChSHS6cBSQ8V3ta64dXl'],
        })),
      });
      
      router.push(data.data.url)
    } catch (error) {
      console.log(error)
    }

  };

  const validateForm = () => {
    let errors = {};

    if (email.length < 5) {
      errors.email = "Email should be at least 5 characters long.";
    } else {
      errors.email = "";
    }

    if (name.length === 0) {
      errors.name = "Name is required.";
    } else {
      errors.name = "";
    }

    if (address.length === 0) {
      errors.address = "Address is required.";
    } else {
      errors.address = "";
    }

    if (!selectedCountry.name) {
      errors.country = "Country is required.";
    } else {
      errors.country = "";
    }

    if (!selectedState.name) {
      errors.state = "State is required.";
    } else {
      errors.state = "";
    }

    if (selectedCity.length === 0) {
      errors.city = "City is required.";
    } else {
      errors.city = "";
    }

    if (postalCode.length === 0) {
      errors.postalCode = "Postal code is required.";
    } else {
      errors.postalCode = "";
    }

    setFormErrors(errors);

    return Object.values(errors).every((error) => error === "");
  };



  const placeOrderHandler = async (e) => {
    e.preventDefault();

    const isValidForm = validateForm();
    if (!isValidForm) {
      return;
    }
  
    try {
      await axios.post("https://techspark.vercel.app/api/order", {
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: {
          address: address,
          country: selectedCountry.name,
          state: selectedState.name,
          city: selectedCity,
          postalCode: postalCode,
        },
      }, {
        headers: {
          "Content-Type": "application/json",
          "user_email": session.user ? session.user.email : session.data.user.email,
        },
      });
  
      redirectToCheckout();
    } catch (error) {
      console.log(error);
    }
  };
  

 
  return (
    <>
      
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32 lg:gap-20 mt-4">
       
        <div className="px-4 pt-8">
          <p className="text-xl font-medium text-center">Order Summary</p>
          <p className="text-gray-400 text-center">
            Check your items. And select a suitable shipping method.
          </p>

          <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
            {cartState.items &&
              cartState.items.map((item) => (
                <div
                  className="flex flex-col rounded-lg bg-white sm:flex-row"
                  key={item.productId}
                >
                  <img
                    className="m-2 h-24 w-28 rounded-md object-cover object-center"
                    src={item.productImage}
                    alt=""
                  />
                  <div className="flex w-full flex-col px-4 py-4">
                    <span className="font-semibold">{item.productName}</span>
                    <p className="text-lg font-bold">
                      {" "}
                      &#8377; {item.productPrice}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
          <p className="text-xl font-medium text-center">Shipping Details</p>
          <p className="text-gray-400 text-center">
            Complete your order by providing your shipment details.
          </p>
          <div className="">



         <label htmlFor="email" className="mt-4 mb-2 block text-sm font-medium">
        Email
      </label>
      <div className="relative">
        <input
          type="text"
          id="email"
          name="email"
          className={`w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500 ${
            formErrors.email ? "border-red-500" : ""
          }`}
          placeholder={email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 12a4 4 0 10-8 0 4 4 0 018 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6a4 4 0 100 8 4 4 0 000-8z"
            />
          </svg>
        </div>
      </div>
      {formErrors.email && (
        <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
      )}


            <label
              for="card-holder"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="card-holder"
                name="card-holder"
                className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder={name}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                  />
                </svg>
              </div>
            </div>


            <label
              for="billing-address"
              className="mt-6 mb-2 block text-sm font-medium"
            >
              Shipping Address
            </label>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-y-4">


              <div className="relative flex-shrink-0 sm:w-7/12 lg:w-full">
                <input
                  type="text"
                  id="billing-address"
                  name="billing-address"
                  className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Street Address"
                  onChange={(e) => setAddress(e.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                  <img
                    className="h-4 w-4 object-contain"
                    src="https://flagpack.xyz/_nuxt/4c829b6c0131de7162790d2f897a90fd.svg"
                    alt=""
                  />
                </div>
              </div>

              <div className="w-full flex justify-between">

              <select
                type="text"
                name="shipping-country"
                className="w-6/12 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => {
                  const selectedCountryName = e.target.value;
                  const selectedCountryObject = countries.find(
                    (country) => country.name === selectedCountryName
                  );
                  const new_country = {name: selectedCountryName, isoCode: selectedCountryObject.isoCode}
                  setSelectedCountry(new_country);
                }}
              >
                <option value={""}>{"Select Country"}</option>
                {countries.map((country) => (
                  <option key={country.countryCode} value={country.countryCode}>
                    {country.name}
                  </option>
                ))}
              </select>

              <select
                type="text"
                name="shipping-state"
                className="w-5/12 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => {
                  const selectedStateName = e.target.value;
                  const selectedStateObject = states.find(
                    (state) => state.name === selectedStateName
                  );
                  const new_country = {name: selectedStateObject.name, isoCode: selectedStateObject.isoCode}
                  setSelectedState(new_country);
                }}
              >
                <option value={""}>{"Select State"}</option>
                {states.map((state) => (
                  <option value={state.stateCode}>{state.name}</option>
                ))}
              </select>
              </div>
              
              <div className="w-full flex justify-between">
              <select
                type="text"
                name="shipping-city"
                className="w-6/12 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => {setSelectedCity(e.target.value)}}
              >
                <option value={""}>{"Select City"}</option>
                {cities.map((city) => (
                  <option value={city.cityCode}>{city.name}</option>
                ))}
              </select>

              <input
                type="text"
                name="shipping-zip"
                className="w-5/12 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Postal Code"
                onChange={(e) => setPostalCode(e.target.value)}
               />

              </div>


    
            </div>

            <div className="mt-6 border-t border-b py-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Subtotal</p>
                <p className="font-semibold text-gray-900">&#8377; {cartState.totalCost}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Shipping</p>
                <p className="font-semibold text-gray-900">&#8377; {cartState.totalCost > 500 ? 0 : 100}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Total</p>
              <p className="text-xl font-semibold text-gray-900"> &#8377; {cartState.totalCost}</p>
            </div>
          </div>

            <button className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white" onClick={placeOrderHandler}>
              Place Order
            </button>
          </div>
       

      </div>
    </>
  );
};




export const getServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    try {
      const response = await axios.get("https://techspark.vercel.app/api/cart", {
        headers: {
          "Content-Type": "application/json",
          user_email: session.email,
        },
      });
            

    const cart_res = response.data.cart;

    const cartTotal = cart_res && cart_res.items.reduce((total, item) => total + item.qty * item.productId.price,0);

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
  } catch (error) {
    console.log(error);
  }

  } else {
    return {
      props: {
        cart: {
          _id: "",
          totalCost: 0,
          items: [],
        },
      },
    };
  }


};

export default Shipping;
