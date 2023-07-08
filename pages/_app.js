import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import ProductContext from "../store/product-context";
import { Provider } from "react-redux";
import store from "../store/index";
import Layout from "../components/UserLayout";



export default function App({ Component, pageProps: { session, ...pageProps },}) {
  
  const renderWithLayout = Component.getLayout || function (page) { return <Layout>{page}</Layout> };

  return (
    <>
      <SessionProvider session={session}>
      <Provider store={store}>
        <ProductContext.Provider value={{first: 'Shivam'}}>
          
          { renderWithLayout(<Component {...pageProps} />)}

        </ProductContext.Provider>
      </Provider>
      </SessionProvider>
    </>
  );
}
