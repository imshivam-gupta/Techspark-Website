import { useDispatch, useSelector } from "react-redux";
import { fetchuserdata } from "../../store/user-actions";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {Typography,Card,CardHeader,CardBody,CardFooter,Tooltip, Input, Checkbox, Button, Avatar, Spinner} from "@material-tailwind/react";
import dynamic from "next/dynamic";
import axios from "axios";
import { BACKEND_URL } from "../../utils/dbconnect";


const cardData = [
  {
    name:"My Orders",
    desc:"View order details, track shipments, and effortlessly download invoices for your records. Simplify your order management and stay organized with ease.",
    imgsrc:"https://freesvg.org/img/Open-Cardboard-Box.png",
    link:"/my-orders"
  },
  {
    name:"Security and Privacy",
    desc:"Discover the robust security measures in place to protect your data, including encryption, secure connections, and strict access controls.",
    imgsrc:"https://cdn1.iconfinder.com/data/icons/checkout-flat/48/Ecommerce_Check_Out_Artboard_10-512.png",
    link:"/security"
  },
  {
    name:"Update Your Profile",
    desc:"Easily edit and modify your profile details, such as name, contact information. Take control of your online presence and ensure your profile accurately reflects who you are.",
    imgsrc:"https://cdn-icons-png.flaticon.com/512/166/166256.png",
    link:"/edit-profile"
  },
  {
    name:"Techspark Developer",
    desc:"Explore my profile to get a glimpse into my web development expertise and discover my portfolio of projects. I have worked for many freelance projects.",
    imgsrc:"https://thumbs.dreamstime.com/b/web-developer-design-concept-technology-icons-vector-illustration-eps-graphic-62575623.jpg",
    link:"https://shivam-gupta.vercel.app/"
  }
]


const CardComponent = ({link,imgsrc,name,desc}) => {
  const router = useRouter();

  return(
  <Card className="mt-6 hover:shadow-xl cursor-pointer" onClick={()=> router.push(link)}>
    <CardBody>
  
      <div className="flex flex-row gap-x-4">
          <img src={imgsrc} alt="" className="w-16 h-16"/>
          <Typography variant="h5" color="blue-gray" className="my-auto" >
              {name}
          </Typography>
      </div>

      <Typography className="mt-2">
          {desc}
      </Typography>
    </CardBody>
  </Card>
)}


const Profile = () => {

  const [name,setName] = useState(null);
  const [email,setEmail] = useState(null);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const popError = (msg) =>
  toast(msg, {
    hideProgressBar: true,
    autoClose: 3000,
    type: "error",
    position: toast.POSITION.TOP_CENTER,
});

  const router = useRouter();
  let isAuthenticated = true;
  if(localStorage.getItem("token")===null) isAuthenticated=false;
  if(!isAuthenticated) router.push("/login");
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  
  useEffect(() => {
    if(isAuthenticated && userState.email==="") dispatch(fetchuserdata()), [isAuthenticated,dispatch];
    if(name==="") setName(userState.name);
    if(email==="") setEmail(userState.email);
  });

  const submitHandler = async (e) => {
    setIsUploading(true);
    console.log("submitting",isUploading);
    e.preventDefault();
    const formData = new FormData();
    if(file!==null) formData.append('photo', file);
    if(name!==null) formData.append('name', name);
    const res = await axios.patch(
      `${BACKEND_URL}api/v1/users/updateMe`,formData,{
          headers: {
            'content-type': 'multipart/form-data',
            "authorization": `Bearer ${localStorage.getItem("token")}`,
          },
      }
    );

    const data = await res.data;

    if(data.status === "success"){
      dispatch(fetchuserdata());
      setName(null);
      setEmail(null);
      setFile(null);
    } else{
      popError("Error updating profile currently. Please try again later");
    }
    

    setIsUploading(false);
  }

  if(isUploading){
    return(
      <Spinner color="purple" size="xl" className="mt-32 mx-auto" />
    )
  }

  return (
    <div className="w-full px-10 py-10 flex flex-col lg:flex-row gap-x-10">

    {userState.email!=="" && <Card className="px-10 sm:w-96 sm:w-auto max-w-2/3 shadow-lg border border-gray-100 flex items-center py-6" color="transparent" >
      <Typography variant="h4" color="blue-gray">
        Your Profile
      </Typography>
      <Typography color="gray" className="mt-1 font-normal">
        Update your profile here
      </Typography>
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 px-6" onSubmit={submitHandler}>
        <div className="mb-4 flex flex-col gap-6">
          <div className="flex flex-row gap-4">
            <Avatar src={userState.image} alt="avatar" size="lg" />
            <input
              className="relative m-0 h-full my-auto block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
              id="img-file"
              type="file"
              name="img-file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
            <Input size="lg" label={userState.email} disabled/>
            <Input size="lg" label={userState.name} onChange={(e)=>setName(e.target.value)}/>
        </div>
      
        <Button className="mt-6" fullWidth onClick={submitHandler} disabled={isUploading}>
          Update
        </Button>
        <Typography color="gray" className="mt-4 text-center font-normal">
          You cannot update your email or password here. Please contact support for that.
        </Typography>
      </form>
    
    </Card>}
 

    <div className="grid sm:grid-cols-1 lg:grid-cols-2 place-items-center gap-x-3 gap-y-2 sm:w-full max-w-2/3 mx-auto">
      { cardData.map((item,index) => (<CardComponent name={item.name} desc={item.desc} imgsrc={item.imgsrc} link={item.link} key={index}/>))}
    </div>


    </div>
  );
};

export default dynamic(() => Promise.resolve(Profile), {ssr: false});
