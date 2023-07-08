import { useDispatch, useSelector } from "react-redux";
import { fetchuserdata } from "../../store/user-actions";
import { useEffect } from "react";
import { useRouter } from "next/router";
import {Typography,Card,CardHeader,CardBody,CardFooter,Tooltip} from "@material-tailwind/react";
import dynamic from "next/dynamic";

const Profile = () => {

  const router = useRouter();
  let isAuthenticated = true;
  if(localStorage.getItem("token")===null) isAuthenticated=false;
  if(!isAuthenticated) router.push("/login");
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  
  useEffect(() => {
    if(isAuthenticated) dispatch(fetchuserdata()), [dispatch];
  });

  return (
    <div className="w-full px-10 py-10 flex flex-col lg:flex-row gap-x-10">

 

    <div className="grid grid-cols-2 place-items-center gap-x-3 gap-y-2 w-4/6 mx-auto">

      <Card className="mt-6 hover:shadow-xl w-96 cursor-pointer" onClick={()=> router.push("/my-orders")}>
      <CardBody>
        
        <div className="flex flex-row gap-x-4">
            <img src="https://freesvg.org/img/Open-Cardboard-Box.png" alt="" className="w-16 h-16"/>
            <Typography variant="h5" color="blue-gray" className="my-auto">
                Your Orders
            </Typography>
        </div>

        <Typography className="mt-2">
            View order details, track shipments, and effortlessly download invoices for your records. Simplify your order management and stay organized with ease.
        </Typography>
      </CardBody>
    </Card>



      <Card className="mt-6 hover:shadow-xl w-96 cursor-pointer" onClick={()=> router.push("/security")}>
      <CardBody>
        
        <div className="flex flex-row gap-x-4">
            <img src="https://cdn1.iconfinder.com/data/icons/checkout-flat/48/Ecommerce_Check_Out_Artboard_10-512.png" alt="" className="w-16 h-16"/>
            <Typography variant="h5" color="blue-gray" className="my-auto">
                Security and Privacy
            </Typography>
        </div>

        <Typography className="mt-2">
            Discover the robust security measures in place to protect your data, including encryption, secure connections, and strict access controls.
        </Typography>
      </CardBody>
    </Card>
     
      <Card className="mt-6 hover:shadow-xl w-96 cursor-pointer" onClick={()=>router.push("/edit-profile")}>
      <CardBody>
        
        <div className="flex flex-row gap-x-4">
            <img src="https://cdn-icons-png.flaticon.com/512/166/166256.png" alt="" className="w-16 h-16"/>
            <Typography variant="h5" color="blue-gray" className="my-auto">
            Update Your Profile
            </Typography>
        </div>

        <Typography className="mt-2 " >
            Easily edit and modify your profile details, such as name, contact information. Take control of your online presence and ensure your profile accurately reflects who you are. 
        </Typography>
      </CardBody>
    </Card>
     
      <Card className="mt-6 hover:shadow-xl w-96 cursor-pointer" onClick={()=>router.push("https://shivam-gupta.vercel.app/")}>
      <CardBody>
        
        <div className="flex flex-row gap-x-4">
            <img src="https://thumbs.dreamstime.com/b/web-developer-design-concept-technology-icons-vector-illustration-eps-graphic-62575623.jpg" alt="" className="w-16 h-16"/>
            <Typography variant="h5" color="blue-gray" className="my-auto">
                Techspark Developer
            </Typography>
        </div>

        <Typography className="mt-2">
            Explore my profile to get a glimpse into my web development expertise and discover my portfolio of projects. With a strong tech stack I have worked for many freelance projects.
        </Typography>
      </CardBody>
    </Card>
     
   
    
     


    </div>


    </div>
  );
};

export default dynamic(() => Promise.resolve(Profile), {ssr: false});
