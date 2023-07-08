import Link from "next/link";
import React, { useState } from "react";
import { Avatar, Button, Menu, MenuHandler, MenuItem, MenuList, Typography } from "@material-tailwind/react";
import { UserCircleIcon,ChevronDownIcon,Cog6ToothIcon,InboxArrowDownIcon,LifebuoyIcon,PowerIcon,} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { userActions } from "../store/user-slice";
import { SearchBar } from "./SearchBar";
import { fetchuserdata } from "../store/user-actions";

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
    url: "https://shivam-gupta.vercel.app/"
  },
  {
    label: "Sign Out",
    icon: PowerIcon,
    url: "/signout"
  },
];


const NavLink = ({ text, href }) => {
  return(
    <li className="hidden lg:block">
      <Link href={href}>
        <div className="py-2 px-4 text-gray-700 hover:text-blue-500">
          {text}
        </div>
      </Link>
    </li>
)};
  
 
const Logo = () => {
  return(
    <div className="items-center flex-grow w-1/12 hidden md:flex">
      <img src="/logo4.png" className="h-12 mr-3" alt="Logo" />
    </div>
)};


const ProfileMenu = ({data}) => {

  const router= useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const signOut = () =>{
    let user = {};
    localStorage.removeItem('token');
    dispatch(userActions.replaceUser(user));
    router.push("/login");
  }
 
  return (
    <li>
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

          <MenuItem
                key={"Sign Out"}
                onClick={() => signOut()}
                className="flex items-center gap-2 rounded hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                >

          {React.createElement(PowerIcon, {
                  className: "h-4 w-4 text-red-500",
                  strokeWidth: 2,
                })}
                <Typography
                  as="span"
                  variant="small"
                  className="font-normal"
                  color={"red"}
                >
                  Sign Out
            </Typography>

            </MenuItem>
                    
                
        </MenuList>
      </Menu>
      </li>
  );
}


const Navbar = () => {

  let isAuthenticated = true;
  if(localStorage.getItem("token")===null) isAuthenticated=false;
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  if(isAuthenticated && user?.image==='') dispatch(fetchuserdata());

  return (
    <nav className="flex flex-row justify-around py-2 px-4 bg-white-200 relative gap-4 shadow-xl z-50">

      <Logo />
      <SearchBar />
      
      <ul className={`flex w-3/12 items-center justify-end pr-4 opacity-100 transition-opacity`}>
        <NavLink text="Home" href="/" />
        <NavLink text="Developer" href="https://shivam-gupta.vercel.app/" />
        <NavLink text="Cart" href="/cart" />
        {!isAuthenticated && <NavLink text="Sign In" href="/login" />}
        {isAuthenticated &&  user?.image && <ProfileMenu data={user}/> }
      </ul>

    </nav>
  );
}


export default dynamic(() => Promise.resolve(Navbar), {ssr: false});
