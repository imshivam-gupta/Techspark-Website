import Navbar from '../components/Navbar'
import '../styles/globals.css'
import { SessionProvider } from "next-auth/react"

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';



export default function App({
  Component, pageProps: { session, ...pageProps }
}) {



  return (
    <SessionProvider session={session}>
      <Navbar />
      <Component {...pageProps}/>
      <ToastContainer />
      <footer className="w-full text-center p-4 absolute">
        <p className="text-gray-500 text-lg">
          &copy; 2023 <span> Shivam Gupta</span>
        </p>
      </footer>
    </SessionProvider>
  )
}