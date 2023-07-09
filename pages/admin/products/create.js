import { Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/AdminLayout";
import { BACKEND_URL } from "../../../utils/dbconnect";

const SimpleInput = ({ label, type, placeholder,important,className,outer_className ,setState}) => {
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
    const [description, setDescription] = useState([]);
    const [offers, setOffers] = useState([]);

    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {

        setLoading(true);
        e.preventDefault();
        console.log(title, image, brand, category, price, count_in_stock, seller_name, seller_email, tagline, description, offers);

        const offerObj=[]
        offers.forEach((offer) => {
            offerObj.push({
               offer: offer.split(':')[0],
                description:offer.split(':')[1]
            })
        })

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


        let res = await axios.post(`${BACKEND_URL}api/v1/products`, formData, {
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

        if(description.length===0 || offers.length===0){
            toast("New Product Created Successfully without any offers and secription", {
                autoClose: 5000,
                type     : 'success'
            })
        } else {
            if(fulfilled1){
                const id = res.data.data.data._id;

                res = await axios.patch(`${BACKEND_URL}api/v1/products/${id}`, {
                    description,
                    offers: offerObj
                }, {
                    headers: {
                        'content-type': 'application/json',
                        'authorization': `Bearer ${token}`
                    }
                }
                ).catch((err) => {
                    toast(err.response.data.message, {
                        autoClose: 5000,
                        type     : 'error'
                    }
                    )
                    setLoading(false);
                    fulfilled1 = false;
                })

            }
        }
      

        setTitle("");
        setImage(null);
        setBrand("");
        setCategory("");
        setPrice(0);
        setCount_in_stock(0);
        setSeller_name("");
        setSeller_email("");
        setTagline("");
        setDescription([]);
        setOffers([]);
        setLoading(false);
        toast("New Product Created Successfully", {
            autoClose: 5000,
            type     : 'success'
        })
    }



    if(loading) return <Spinner color="blue" size="large" className="mt-20" />



  return (
    <>

    <div className="mb-6 px-4 md:px-6 xl:px-7.5">
            <h4 className="text-4xl font-semibold text-black text-center dark:text-white">
                Add new product to Techspark
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
                    placeholder="Enter product name"
                    important
                    setState={setTitle}
                />

                <SimpleInput
                    label="Product Image"
                    type="file"
                    placeholder="Enter product name"
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
                      placeholder="Enter brand of product"
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
                      placeholder="Enter product category"
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
                      placeholder="Enter price of product"
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
                      placeholder="Enter stock in inventory"
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
                      placeholder="Enter name of seller"
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
                      placeholder="Enter email of seller"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        onChange={(e) => setSeller_email(e.target.value)}
                    />
                  </div>

                 
                </div>

               <SimpleInput
                    label="Product Tagline"
                    type="text"
                    placeholder="Enter product tagline"
                    important
                    setState={setTagline}
                />

                

            <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Product Description
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Enter product description seperated by new line"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    onChange={(e)=>setDescription(e.target.value.split('\n'))}
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Product Offers
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Enter product offers seperated by new line"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    onChange={(e)=>setOffers(e.target.value.split('\n'))}
                  ></textarea>
                </div>

                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray" onClick={submitHandler}>
                  Add Product
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
