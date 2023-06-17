import { useDispatch, useSelector } from "react-redux";
import { fetchuserdata } from "../store/user-actions";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  Avatar,
  Typography,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Tooltip,
  IconButton,
  Button,
} from "@material-tailwind/react";

// import {  } from "@heroicons/react/24/outline"

const Profile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status !== "loading" && !session) {
    router.push("/login");
  }

  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const {
    name,
    image,
    email,
    phone,
    main_address,
    addresses,
    orders,
    billing_address,
    birthday,
    gender,
    loading,
  } = userState;

  useEffect(() => {
    if (email === "") dispatch(fetchuserdata(session?.user?.email)), [dispatch];
  });

  return (
    <div className="w-full px-10 py-10 flex flex-col lg:flex-row gap-x-10">


        <div className="w-1/3">
            <Card className="w-96">
                <CardHeader floated={false} className="h-48">
                <img src={image} alt="profile-picture" />
                </CardHeader>

                <CardBody className="text-center">
                <Typography variant="h4" color="blue-gray" className="mb-2">
                    {name}
                </Typography>
                <Typography color="blue" className="font-medium" textGradient>
                    Premium User
                </Typography>
                </CardBody>
                <CardFooter className="flex justify-center gap-x-6 pt-0 w-2/3 mx-auto">
                
                    <Tooltip content="Instagram">
                    
                        <img
                        src="/instagram.svg"
                        alt=""
                        className="object-contain h-10 w-10"
                        />
                    </Tooltip>
                    <Tooltip content="Facebook">
                    
                        <img
                        src="/facebook.svg"
                        alt=""
                        className="object-contain h-10 w-10"
                        />
                    </Tooltip>

                    <Tooltip content="Github">
                    
                        <img
                        src="/github.svg"
                        alt=""
                        className="object-contain h-10 w-10"
                        />
                
                    </Tooltip>

                    <Tooltip content="Linkedin">

                        <img
                        src="/linkedin.svg"
                        alt=""
                        className="object-contain h-10 w-10"
                        />

                    </Tooltip>
                
                </CardFooter>
            </Card>

        </div>


    <div className="grid grid-cols-2 gap-x-3 gap-y-2 w-4/6">

      <Card className="mt-6 w-96 cursor-pointer" onClick={()=> router.push("/my-orders")}>
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



      <Card className="mt-6 w-96 cursor-pointer" onClick={()=> router.push("/security")}>
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
     
      <Card className="mt-6 w-96 cursor-pointer" onClick={()=>router.push("/edit-profile")}>
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
     
      <Card className="mt-6 w-96 cursor-pointer" onClick={()=>router.push("/developer")}>
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

export default Profile;
