import { Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/AdminLayout";
import { BACKEND_URL } from "../../../utils/dbconnect";
import { useRouter } from "next/router";

const SimpleInput = ({ label, type, placeholder,important,className,outer_className ,setState,defaultValue}) => {
    return (
        <div className={`${!outer_className && 'mb-4.5'}`}>
        <div className={`${outer_className}`}>
            <label className="mb-2.5 block text-black dark:text-white">
            {label} {important && <span className="text-meta-1">*</span>}
            </label>
            <input
                onChange={(e) => {
                    if(type !== "file")
                        setState(e.target.value)
                    else
                        setState(e.target.files[0])
                }}
                type={type}
                placeholder={placeholder}
                defaultValue={defaultValue}
                className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${className}`}
            />
        </div>
      </div>
    )
}


const FormLayout = () => {
    

    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState(0);
    const [count_in_stock, setCount_in_stock] = useState(0);
    const [seller_name, setSeller_name] = useState("");
    const [seller_email, setSeller_email] = useState("");
    const [tagline, setTagline] = useState("");


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const router = useRouter();
  
    const { prodid } = router.query;


    useEffect(() => {

        if(prodid===undefined) return;

        const fetchProduct = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            console.log(router.query.prodid)
            const url = `${BACKEND_URL}api/v1/products/${router.query.prodid}`;
            console.log(url);
            const response = await axios.get(url).catch((error) => {
                console.log(error.response.data.message);
                setError(error.response.data.message);
                setLoading(false);
            });
                

            if(error===null){
                console.log(response.data.data.data);
                const product = response.data.data.data;
                setTitle(product.title);
                setImage(product.image);
                setBrand(product.brand);
                setCategory(product.category);
                setPrice(product.price);
                setCount_in_stock(product.count_in_stock);
                setSeller_name(product.seller_name);
                setSeller_email(product.seller_email);
                setTagline(product.tagline);
                setLoading(false);
            }
        }
            
        fetchProduct();

    
    },[prodid]);
  

    const submitHandler = async (e) => {

        const fetchProduct = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            console.log(router.query.prodid)
            const url = `${BACKEND_URL}api/v1/products/${router.query.prodid}`;
            console.log(url);
            const response = await axios.get(url).catch((error) => {
                console.log(error.response.data.message);
                setError(error.response.data.message);
                setLoading(false);
            });
                

            if(error===null){
                console.log(response.data.data.data);
                const product = response.data.data.data;
                setTitle(product.title);
                setImage(product.image);
                setBrand(product.brand);
                setCategory(product.category);
                setPrice(product.price);
                setCount_in_stock(product.count_in_stock);
                setSeller_name(product.seller_name);
                setSeller_email(product.seller_email);
                setTagline(product.tagline);
                setLoading(false);
            }
        }
            
        setLoading(true);
        e.preventDefault();
        console.log(title, image, brand, category, price, count_in_stock, seller_name, seller_email, tagline);

   

        if(title.length===0 || image===null || brand.length===0 || category.length===0 || price===0 || count_in_stock===0 || seller_name.length===0 || seller_email.length===0 || tagline.length===0){
            toast('Please fill all the fields', {
                autoClose: 5000,
                type: 'error'
            })
            setLoading(false);
            return;
        }


        const formData = new FormData();

        formData.append('title', title);
        formData.append('image', image);
        formData.append('brand', brand);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('count_in_stock', count_in_stock);
        formData.append('seller_name', seller_name);
        formData.append('seller_email', seller_email);
        formData.append('tagline', tagline);

        const token = localStorage.getItem('token');
        let fulfilled1 = true;


        let res = await axios.patch(`${BACKEND_URL}api/v1/products/${router.query.prodid}`, formData, {
            headers: {
                'content-type': 'multipart/form-data',
                'authorization': `Bearer ${token}`
            }
        }
        ).catch((err) => {
            toast(err.response.data.message, {
                    autoClose: 5000,
                    type: 'error'
                }
            )
            setLoading(false);
            fulfilled1=false;
        })

        if(!fulfilled1) return;

     
        await fetchProduct();
        setLoading(false);
        toast("Product Updated Successfully", {
            autoClose: 5000,
            type     : 'success'
        })
    }



    if(loading) return <Spinner color="blue" size="large" className="mt-20" />



  return (
    loading? <Spinner color="blue" size="xl" className="mt-32 mx-auto" /> : error? <Typography variant="h3" color="purple" className="text-center mt-32">Something went wrong</Typography>:
    <>


    <div className="mb-6 px-4 md:px-6 xl:px-7.5">
            <h4 className="text-4xl font-semibold text-black text-center dark:text-white">
                Edit product details
            </h4>
        </div>
        

      <div className="gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        
            <form action="#">
              <div className="p-6.5">

                <SimpleInput
                    label="Product Name"
                    type="text"
                    placeholder={title}
                    defaultValue={title}
                    important
                    setState={setTitle}
                />

                <SimpleInput
                    label="Product Image"
                    type="file"
                    placeholder="Enter new image"
                    important
                    className='p-0'
                    setState={setImage}
                />

            
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row w-full">
 

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Brand <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder={brand}
                      defaultValue={brand}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      onChange={(e) => setBrand(e.target.value)}
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Category <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder={category}
                      defaultValue={category}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                     onChange={(e) => setCategory(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row w-full">
 

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Price <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder={`$ ${price}`}
                      defaultValue={`${price}`}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Stock in Inventory <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="number"
                      defaultValue={count_in_stock}
                      placeholder={count_in_stock}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        onChange={(e) => setCount_in_stock(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row w-full">
 

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Seller Name <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      defaultValue={seller_name}
                      placeholder={seller_name}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        onChange={(e) => setSeller_name(e.target.value)}

                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Seller Email <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="email"
                      defaultValue={seller_email}
                      placeholder={seller_email}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        onChange={(e) => setSeller_email(e.target.value)}
                        disabled
                    />
                  </div>

                 
                </div>

               <SimpleInput
                    label="Product Tagline"
                    type="text"
                    placeholder={tagline}
                    defaultValue={tagline}
                    important
                    setState={setTagline}
                />
                

         
                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray" onClick={submitHandler}>
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </>
  );
};

FormLayout.getLayout = function getLayout(page) {
    return (
        <AdminLayout>{page}</AdminLayout>
    )
  }
export default FormLayout;
