import { Button, Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react"
import { fetchProductData } from "../store/products-actions";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useState,useEffect } from "react";


export const SearchBar = () => {

    const [keyword,setKeyword] = useState('')
    const router = useRouter();
    const dispatch = useDispatch();
    const productState = useSelector((state) => state.products);
    const { products } = productState;
  

    const submitHandler = (e) => {
        e.preventDefault()
        if(keyword.trim()) router.push(`/search/?query=${keyword}`)
        else router.push(`/`)
    }

    useEffect(() => {
      if(products.length === 0) dispatch(fetchProductData());
    }, [dispatch]);
  
    const distinctCategory = [...new Set(products.map((product) => product.category))];
  

    return(
        <div className="w-full lg:w-6/12 h-full flex justify-center gap-x-6">
            <form className="relative w-full lg:w-1/2" onSubmit={submitHandler}>
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
                
                    <div className="my-auto hidden lg:block">
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
    );
}