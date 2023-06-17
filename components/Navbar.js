import Link from "next/link";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Avatar, Button, Menu, MenuHandler, MenuItem, MenuList, Typography } from "@material-tailwind/react";

import {
  CubeTransparentIcon,
  UserCircleIcon,
  CodeBracketSquareIcon,
  Square3Stack3DIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  RocketLaunchIcon,
  Bars2Icon,
} from "@heroicons/react/24/outline";



import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductData } from "../store/products-actions";

const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
    url: "/profile"
  },
  {
    label: "Edit Profile",
    icon: Cog6ToothIcon,
    url: "/edit-profile"
  },
  {
    label: "My Orders",
    icon: InboxArrowDownIcon,
    url: "/my-orders"
  },
  {
    label: "Developer",
    icon: LifebuoyIcon,
    url: "/developer"
  },
  {
    label: "Sign Out",
    icon: PowerIcon,
    url: "/signout"
  },
];
 
function ProfileMenu({data}) {

  const router= useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
 
  return (
    
      <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
        <MenuHandler>
          <Button
            variant="text"
            color="blue-gray"
            className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
          >
            <Avatar
              variant="circular"
              size="sm"
              alt="candice wu"
              className="border border-blue-500 p-0.5"
              src={data.image}
            />
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`h-3 w-3 transition-transform ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </MenuHandler>
        <MenuList className="p-1">

          {profileMenuItems.slice(0,profileMenuItems.length-1).map(({ label, icon,url }, key) => {
            const isLastItem = key === profileMenuItems.length - 1;
            return (
              <MenuItem
                key={label}
                onClick={ ()=>{router.push(url)}}
                className={`flex items-center gap-2 rounded ${
                  isLastItem
                    ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                    : ""
                }`}
              >

                {React.createElement(icon, {
                  className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                  strokeWidth: 2,
                })}
                <Typography
                  as="span"
                  variant="small"
                  className="font-normal"
                  color={isLastItem ? "red" : "inherit"}
                >
                  {label}
                </Typography>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
 
  );
}


function Navbar({ user }) {
  const { data: session, status } = useSession();
  const [keyword,setKeyword] = useState('')
  const loading = status === "loading";

  const router = useRouter();

  const submitHandler = (e) => {
    e.preventDefault()

    if(keyword.trim()){
        router.push(`/search/?query=${keyword}`)
    }
    else{
      router.push(`/`)
    }
  }

  const dispatch = useDispatch();

  const productState = useSelector((state) => state.products);
  const { products, prodloading=loading } = productState;

  useEffect(() => {
    if(products.length === 0) dispatch(fetchProductData());
  }, [dispatch]);

  const distinctCategory = [...new Set(products.map((product) => product.category))];


  return (
    <nav className="flex flex-row justify-around py-2 px-4 bg-white-200 relative gap-4 shadow-xl z-50">


      <div className="flex items-center flex-grow w-1/12">
        {/* <Link href="/"> */}
          <img src="/logo4.png" className="h-12 mr-3" alt="Logo" />
        {/* </Link> */}
      </div>

<div className="w-6/12 h-full flex justify-center gap-x-6">
      <form className="relative w-1/2" onSubmit={submitHandler}>
        <div onClick={submitHandler} className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          type="text"
          id="default-search"
          className="block w-full py-3 pl-10 text-sm text-gray-900 border border-gray-300 outline-none rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search Laptops, Keyboards..."
          onChange={e => setKeyword(e.target.value)}
        />
      </form>

      {
        
            <div className="my-auto">
              <Menu
                animate={{
                  mount: { y: 0 },
                  unmount: { y: 25 },
                }}
                >
                  <MenuHandler>
                    <Button variant="outlined" size="sm">Select Category</Button>
                  </MenuHandler>
                  <MenuList>
                    {products.length > 0 && distinctCategory.map((category) => (
                      <MenuItem key={category} onClick={() => router.push(`/search/?category=${category}`)}>{category}</MenuItem>
                    ))}
                  </MenuList>
              </Menu>
            </div>
          
        }

</div>
      

      <ul className={`flex w-3/12 items-center justify-end pr-4 ${ !session && loading ? "opacity-0" : "opacity-100"} transition-opacity`}>

    

        <li>
          <Link href="/">
            <div className="py-2 px-4 text-gray-700 hover:text-blue-500">
              Home
            </div>
          </Link>
        </li>
      
        <li>
          <Link href="/cart">
            <div className="py-2 px-4 text-gray-700 hover:text-blue-500">
              Cart
            </div>
          </Link>
        </li>

        {!loading && !session && (
          <li>
            <Link href="/login">
              <div className="py-2 px-4 text-gray-700 hover:text-blue-500">
                Sign In
              </div>
            </Link>
          </li>
        )}

    
        {session && (
          <li>
            {session?.user &&  session.user.image &&  session.user.name && (
              <ProfileMenu data={session.user}/>
              // <div className="flex items-center gap-2 ml-4">
              // <Avatar src={`${session.user.image}`} alt="avatar" size="sm" />
              //   <Typography variant="h6">{session.user.name.split(" ")[0]}</Typography>
              // </div> 
            )}
          </li>
        )}

      </ul>
    </nav>
  );
}

export default Navbar;
