import React, { useRef } from 'react'
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { XMarkIcon,UserIcon} from "@heroicons/react/24/outline";
import { io } from 'socket.io-client';
import { useEffect, useState } from "react";
import { Textarea, IconButton, Typography } from "@material-tailwind/react";
import { fetchuserdata } from '../store/user-actions';
const serverURL = 'https://socket-server-tech.onrender.com/';
let socket
import dynamic from "next/dynamic";

const ChatBox = ({setIsChatOpen,isChatOpen}) => {

    const ISSERVER = typeof window === "undefined";
    let isAuthenticated = true;
    if(!ISSERVER) if(localStorage.getItem("token")===null) isAuthenticated=false;
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    if(isAuthenticated && user?.image==='') dispatch(fetchuserdata());
    const [isChatBoxSmall, setIsChatBoxSmall] = useState(false);
    const [inputMessage, setInputMessage] = useState("");
    socket = io(serverURL);

    const chatContainerRef = useRef(null);
    const [messages, setMessages] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
   

    useEffect(() => {
        if (isChatOpen) {
          const adminMessage = {
            id: messages.length + 1,
            type: "admin",
            content: `
                Hello! How can I assist you today? I will be built completely using Machine Learning and Artificial Intelligence but currently you can select only from the available options.
                1. I want to buy a product.
                2. I want to sell a product.
                3. I want to know more about the website.
                4. I want to know more about the technology used.
            `,
          };
          setMessages((prevMessages) => [...prevMessages, adminMessage]);
          scrollToBottom();
        }
    }, [isChatOpen]);


    const scrollToBottom = () => {
        console.log("scrolling");
    };


    useEffect(() => {
        socket.emit('loadMessages',user.email);
    }, []);
    
    useEffect(() => {
        socket.once('loadedMessages', (messages) => {
            setMessages(messages);
            setIsLoading(false);
            const adminMessage = {
                id: messages.length + 1,
                type: "admin",
                content: `
                Hello! I'm here to assist you using cutting-edge Machine Learning and Artificial Intelligence technologies. For now, you can choose from the following options:
                    1. I want to buy a product.
                    2. I want to sell a product.
                    3. I want to know more about the website.
                    4. I want to know more about the technology used.
                `,
              };
            setMessages((prevMessages) => [...prevMessages, adminMessage]);
            scrollToBottom();
        });
        return () => {
            socket.disconnect();
        }
    }, []);


    useEffect(() => {
        socket.on('newMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            scrollToBottom();
        });
    
        return () => {
          socket.disconnect();
        };
    }, []);

   
  const handleChatToggle = () => {
    if (!isChatOpen) {
        setIsChatOpen(true);
        setIsChatBoxSmall(false);
        scrollToBottom();
    } else {
        setIsChatBoxSmall(true);
        setTimeout(() => {
          setIsChatOpen(false);
        }, 400); // Adjust the delay (in milliseconds) to match your transition duration
      }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      const newMessage = { type: "user", content: inputMessage,email:user?.email,name:user?.name,image:user?.image };
      socket.emit('newMessage', newMessage);
      setInputMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

 

  return (
    <motion.div
        ref={chatContainerRef}
        initial={{ x: 300, opacity: 0 }}
        animate={isChatBoxSmall ? { x: 0, opacity: 0.5, scale: 0.2 } : { x: 0, opacity: 1, scale: 1 }}
        exit={{ x: 0, opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
        transition={{ duration: 0.3 }}
        className={`fixed bottom-0 right-5 bg-white rounded-t-lg shadow-xl border-x-2 border-t-2 border-purple-500 w-96 h-[65vh] flex flex-col ${
            isChatBoxSmall ? "pointer-events-none" : ""
        }`}
    >

    {/* Header */}
    <div className="flex-start flex justify-between items-center rounded-t-lg mb-4 px-6 py-3 bg-gray-100 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-purple-500">Chat with Techspark</h2>
        <button
          onClick={handleChatToggle}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <XMarkIcon className="h-6 w-6 bg-gray-100 text-xl text-black-200" />
        </button>
    </div>

    {/* Messages */}
   {isLoading ? 
   
   <div className='flex-1 overflow-y-auto mb-4 hide-scrollbar px-4 flex justify-center items-center'>
      <motion.div
        className='loading-content animate-bounce'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
      >
        <Typography variant={"h2"} className="text-center" color="purple">Welcome to Techspark Chat</Typography>
    </motion.div>
    </div>
   
   : 
   
   <div className="flex-1 overflow-y-auto mb-4 hide-scrollbar px-4">
        {messages.map((message) => (
            <div key={message.id} className='py-1'>
                
                    {message.type === 'admin' && (
                        <div className="flex items-center mb-2">
                            <UserIcon height={20} />
                            <p className="ml-2 text-sm text-gray-500">{"Techspark Admin"}</p>
                        </div>
                    )}

                    <div
                        className={`p-2 rounded-lg my-3 ${
                        message.type === 'admin'
                            ? 'bg-[#ECECEC] text-black flex items-start w-4/5'
                            : 'bg-[#9350e6] text-white flex items-end w-4/5 ml-auto'
                        }`}
                        style={
                            message.type === 'admin'
                            ? {
                                top: '-2rem', // Position the admin message slightly above the icon
                                borderTopRightRadius: '0.75rem', // Rounded top-right for admin bubble
                                borderBottomLeftRadius: '0.75rem', // Rounded bottom-left for admin bubble
                            }
                            : {
                                borderTopLeftRadius: '0.75rem', // Rounded top-left for user bubble
                                borderBottomRightRadius: '0.75rem', // Rounded bottom-right for user bubble
                            }
                        }
                    >
                    <div className="ml-2">
              {message.content.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
                    </div>
                </div>


      
            </div>
    ))}


    </div>}

    {/* Footer */}
    <div className="flex items-center px-2 py-4 bg-gray-100 border-t border-gray-200">
        <div className="flex w-full flex-row items-center gap-2 rounded-[99px] border border-blue-gray-500/20 bg-gray-100 px-2">
     
        <Textarea
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            rows={2}
            resize={true}
            placeholder="Your Message"
            className="min-h-full !border-0 focus:border-transparent hide-scrollbar py-2 text-lg"
            containerProps={{className: "grid h-full",}}
            labelProps={{
            className: "before:content-none after:content-none",
            }}
        />
        <div>
            <IconButton variant="text" className="rounded-full text-purple-400 text-2xl h-20" onClick={handleSendMessage}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                className="h-5 w-5"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
            </svg>
            </IconButton>
        </div>
        </div>
    </div>


</motion.div>

  )
}

export default dynamic(() => Promise.resolve(ChatBox), { ssr: false });
