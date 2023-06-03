import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { Country, State, City }  from 'country-state-city';
import Link from "next/link";

const Shipping = ({ cart }) => {

  const router = useRouter();
  const { data: session, status } = useSession();
  const [email,setEmail]=useState("");
  const [name,setName]=useState("");

  const [address, setAddress] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [selectedState, setSelectedState] = useState("DL");
  const [selectedCity, setSelectedCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  
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

 

  const [cartState, setCartState] = useState(cart);


  useEffect(() => {
    // Fetch countries
    const fetchCountries = () => {
      const allCountries = Country.getAllCountries();
      setCountries(allCountries);
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchStates = () => {
      const allStates = State.getStatesOfCountry(selectedCountry);
      setStates(allStates);
    };

    fetchStates();
  }, [selectedCountry]);

  useEffect(() => {
    // Fetch cities based on selected country and state
    console.log(selectedCountry,selectedState)
    const fetchCities = () => {
      const allCities = City.getCitiesOfState(
        selectedCountry,
        selectedState
      );
      setCities(allCities);
    };

    fetchCities();
  }, [selectedCountry, selectedState]);


 
  return (
    <>
      
      <div class="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32 lg:gap-20 mt-4">
       
        <div class="px-4 pt-8">
          <p class="text-xl font-medium text-center">Order Summary</p>
          <p class="text-gray-400 text-center">
            Check your items. And select a suitable shipping method.
          </p>

          <div class="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
            {cartState.items &&
              cartState.items.map((item) => (
                <div
                  class="flex flex-col rounded-lg bg-white sm:flex-row"
                  key={item.productId}
                >
                  <img
                    class="m-2 h-24 w-28 rounded-md object-cover object-center"
                    src={item.productImage}
                    alt=""
                  />
                  <div class="flex w-full flex-col px-4 py-4">
                    <span class="font-semibold">{item.productName}</span>
                    <p class="text-lg font-bold">
                      {" "}
                      &#8377; {item.productPrice}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div class="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
          <p class="text-xl font-medium text-center">Shipping Details</p>
          <p class="text-gray-400 text-center">
            Complete your order by providing your shipment details.
          </p>
          <div class="">
            <label for="email" class="mt-4 mb-2 block text-sm font-medium">
              Email
            </label>
            <div class="relative">
              <input
                type="text"
                id="email"
                name="email"
                class="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder={email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div class="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
            </div>


            <label
              for="card-holder"
              class="mt-4 mb-2 block text-sm font-medium"
            >
              Name
            </label>
            <div class="relative">
              <input
                type="text"
                id="card-holder"
                name="card-holder"
                class="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder={name}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div class="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-gray-400"
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
              class="mt-6 mb-2 block text-sm font-medium"
            >
              Shipping Address
            </label>
            <div class="flex flex-col sm:flex-row lg:flex-col gap-y-4">


              <div class="relative flex-shrink-0 sm:w-7/12 lg:w-full">
                <input
                  type="text"
                  id="billing-address"
                  name="billing-address"
                  class="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Street Address"
                  onChange={(e) => setAddress(e.target.value)}
                />
                <div class="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                  <img
                    class="h-4 w-4 object-contain"
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
                  setSelectedCountry(selectedCountryObject.isoCode);
                }}
              >
                {countries.map((country) => (
                  <option key={country.countryCode} value={country.countryCode}>
                    {country.name}
                  </option>
                ))}
              </select>

              <select
                type="text"
                name="shipping-state"
                class="w-5/12 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => {
                  const selectedStateName = e.target.value;
                  const selectedStateObject = states.find(
                    (state) => state.name === selectedStateName
                  );
                  setSelectedState(selectedStateObject.isoCode);
                }}
              >
                {states.map((state) => (
                  <option value={state.stateCode}>{state.name}</option>
                ))}
              </select>
              </div>
              
              <div className="w-full flex justify-between">
              <select
                type="text"
                name="shipping-city"
                class="w-6/12 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {cities.map((city) => (
                  <option value={city.cityCode}>{city.name}</option>
                ))}
              </select>

              <input
                type="text"
                name="shipping-zip"
                class="w-5/12 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Postal Code"
                onChange={(e) => setPostalCode(e.target.value)}
               />

              </div>


    
            </div>

            <div class="mt-6 border-t border-b py-2">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-gray-900">Subtotal</p>
                <p class="font-semibold text-gray-900">&#8377; {cartState.totalCost}</p>
              </div>
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-gray-900">Shipping</p>
                <p class="font-semibold text-gray-900">&#8377; {cartState.totalCost > 500 ? 0 : 100}</p>
              </div>
            </div>
            <div class="mt-6 flex items-center justify-between">
              <p class="text-sm font-medium text-gray-900">Total</p>
              <p class="text-xl font-semibold text-gray-900"> &#8377; {cartState.totalCost}</p>
            </div>
          </div>
            <Link href="/payment">
            <button class="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white">
              Place Order
            </button>
            </Link>
          </div>
       

      </div>
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);

  // console.log(session.email);

  if (session) {
    const req_sample = await fetch(`http://localhost:3000/api/cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        user_email: session.email,
      },
    });
    const data = await req_sample.json();
    const cart_res = data.ans;

    const cartTotal = cart_res.items.reduce(
      (total, item) => total + item.qty * item.productId.price,
      0
    );

    return {
      props: {
        cart: {
          _id: cart_res._id.toString(),
          totalCost: cartTotal,
          items: cart_res.items.map((item) => ({
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

export default Shipping;
