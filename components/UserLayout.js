import Navbar from "./Navbar";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Typography } from "@material-tailwind/react";
import { IconButton, SpeedDial,  SpeedDialHandler,SpeedDialContent, SpeedDialAction,} from "@material-tailwind/react";
import { PlusIcon, ChatBubbleBottomCenterTextIcon,HomeIcon, ArrowLeftIcon, ShoppingCartIcon} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GCLIENTID } from "../utils/dbconnect";
import { motion,AnimatePresence } from "framer-motion";
import {  useState } from "react";
import ChatBox from "./ChatBox";
import { fetchuserdata } from "../store/user-actions";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";

const Layout = ({ children }) => {

    const ISSERVER = typeof window === "undefined";
    let isAuthenticated = true;
    if(!ISSERVER) if(localStorage.getItem("token")===null) isAuthenticated=false;
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    if(isAuthenticated && user?.image==='') dispatch(fetchuserdata());

    const [isChatOpen, setIsChatOpen] = useState(true);
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

  const handleChatToggle = () => {
    if(!isAuthenticated) return router.push('/login');
    if (!isChatOpen) {
        setIsChatOpen(true);
      } else {
        setIsChatBoxSmall(true);
        setTimeout(() => {
          setIsChatOpen(false);
        }, 400); // Adjust the delay (in milliseconds) to match your transition duration
      }
  };




  return (
    <>
        <ToastContainer />
        <Navbar />

        <GoogleOAuthProvider clientId={`${GCLIENTID}`}>
            <main>{children}</main>
        </GoogleOAuthProvider>



        <footer className="w-full bg-white p-8 mt-20">
        <hr className="my-8 border-blue-gray-50" />
        <Typography color="blue-gray" className="text-center font-normal">
            &copy; 2023 Shivam Gupta
        </Typography>
        </footer>

        <div className="fixed bottom-10 right-10">
        <SpeedDial placement="bottom">
            <SpeedDialHandler>
            <IconButton size="lg" className="rounded-full">
                <PlusIcon className="h-5 w-5 transition-transform group-hover:rotate-45" />
            </IconButton>
            </SpeedDialHandler>

            <SpeedDialContent>
            <Link href="/">
                <SpeedDialAction>
                <HomeIcon className="h-5 w-5" />
                </SpeedDialAction>
            </Link>

            <div onClick={handleBack}>
                <SpeedDialAction>
                <ArrowLeftIcon className="h-5 w-5" />
                </SpeedDialAction>
            </div>

            <Link href="/cart">
                <SpeedDialAction>
                <ShoppingCartIcon className="h-5 w-5" />
                </SpeedDialAction>
            </Link>
            </SpeedDialContent>
        </SpeedDial>
        </div>
          
        <div className="fixed bottom-25 right-10">
        <motion.div
            className={`bg-blue-500 rounded-full p-3 shadow-lg cursor-pointer ${ isChatOpen ? 'hidden' : ''}`}
            onClick={handleChatToggle}
            animate={{ scale: 1 }}
        >
          <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-white" />
        </motion.div>
      </div>

      {isAuthenticated && <AnimatePresence>
        {isChatOpen && (
            <ChatBox setIsChatOpen={setIsChatOpen} isChatOpen={isChatOpen}/>
        )}
        </AnimatePresence>
      }


    </>
  );
}
export default dynamic(() => Promise.resolve(Layout), { ssr: false });
