import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import ProductContext from "../store/product-context";
import { Provider } from "react-redux";
import store from "../store/index";
import Layout from "../components/UserLayout";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GCLIENTID } from "../utils/dbconnect";
import Head from "next/head";


export default function App({ Component, pageProps: {  ...pageProps },}) {
  
  const renderWithLayout = Component.getLayout || function (page) { return <Layout>{page}</Layout> };


  return (
    <>
     <Head>
        <title>Techspark</title>
        <meta name="description" content="Home" />
        <link rel="icon" href="/favicon.png" />
      </Head>
    <GoogleOAuthProvider clientId={`${GCLIENTID}`}>
      <Provider store={store}>
        <ProductContext.Provider value={{first: 'Shivam'}}>
          { renderWithLayout(<Component {...pageProps} />)}
        </ProductContext.Provider>
      </Provider>
      </GoogleOAuthProvider>
    </>
  );
}
