import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

function AdminLayout({ children }) {   
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const router = useRouter();
    if(localStorage.getItem('token')===null){
        router.push('/login');
    }
  return (
    <>
     <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">

        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">

          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main>
            <div className="mx-auto max-w-screen-2xl px-4 pb-4 md:p-6 2xl:p-10">
                <div>{children}</div>
            </div>
          </main>

        </div>

      </div>
    </div>

        <ToastContainer />
    </>
  );
}

export default dynamic(() => Promise.resolve(AdminLayout), {ssr: false});
// export default AdminLayout;