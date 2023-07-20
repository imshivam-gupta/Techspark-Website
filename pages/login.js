import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useRef } from "react";
import Image from "next/image";
import { useFormik } from "formik";
import login_validate from "../lib/validate"
import { useState } from "react";
import { HiEye } from "react-icons/hi";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../utils/dbconnect";
import { userActions } from "../store/user-slice";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";


function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  let isAuthenticated = false;
  if(localStorage.getItem("token")) isAuthenticated=true;
  if(isAuthenticated) router.push("/");

  const [signingup, setSigningup] = useState(false);


  const showToast = () =>
    toast("Incorrect Credentials. Try again or register yourself", {
      hideProgressBar: true,
      autoClose: 3000,
      type: "error",
      position: toast.POSITION.TOP_CENTER,
  });
  

  const [email, setEmail] = useState("");
  const [pass,setPass] = useState("");

  const redirect_to_signup = (e) => {
    e.preventDefault();
    router.push("/register");
  };


  
  const onSubmitLocal = async (e) => {
    setSigningup(true);
    e.preventDefault();
    const res = await fetch(`${BACKEND_URL}api/v1/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "email":email,
        "password":pass,
      }),
    });

  
    const data = await res.json();

    if(data.status === "success"){
      localStorage.setItem("token", data.token);
      dispatch(userActions.replaceUser( data.data.user));
      router.push("/");
    } else{
      showToast();
    }

    setSigningup(false);
  };

  
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: login_validate,
  });

  const [show, setShow] = useState({ password: false});

  const onSubmitGit = async (e) => {
    e.preventDefault();
    await signIn("github", { callbackUrl: "/",});
  };
  const onSubmitGoogle = async (e) => {
    e.preventDefault();
    await signIn("google", { callbackUrl: "/",});
  };

  if(signingup) return (
    <section className="mt-6 flex flex-row justify-center min-h-screen pt-6">
      Please wait while we log you in
    </section>
  );
  
  return (
    <section className="mt-6 flex flex-row justify-center min-h-screen pt-6">
      <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-6xl items-center h-max w-2/3 justify-stretch">
        <div className="md:w-2/3 px-8 md:px-16 py-6 ">
          <h2 className="font-bold text-2xl text-[#002D74] text-center">
            Login
          </h2>
          <p className="text-xs mt-4 text-[#002D74] text-center">
            If you are already a member, easily log in
          </p>

          <form action="" className="flex flex-col gap-4 w-3/4 mx-auto">

          <div
              className={`flex flex-row mt-8 ${
                formik.errors.email && formik.touched.email
                  ? "border-rose-600"
                  : ""
              } relative rounded-xl text-black border w-full bg-white`}
            >
              <input
                className="focus:outline-none rounded-xl px-4 w-full py-2 outline-none"
                type={"email"}
                name="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {formik.errors.email && formik.touched.email ? (
              <span className="text-rose-500 pl-6 text-sm -my-2">
                {formik.errors.email}
              </span>
            ) : (
              <></>
            )}

<div
              className={`flex flex-row ${
                formik.errors.password && formik.touched.password
                  ? "border-rose-600"
                  : ""
              } relative py-2 rounded-xl text-black border w-full bg-white`}
            >
              <input
                className="w-11/12 focus:outline-none px-4"
                type={show.password ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={(e) => setPass(e.target.value)}
              />
              <span
                className={`icon flex items-center px-4 ${
                  show.password ? "text-[#002D74]" : "text-gray-400"
                }`}
                onClick={() => setShow({ ...show, password: !show.password })}
              >
                <HiEye size={25} />
              </span>
            </div>

            {formik.errors.password && formik.touched.password ? (
              <span className="text-rose-500 pl-6 text-sm -my-2">
                {formik.errors.password}
              </span>
            ) : (
              <></>
            )}


      
            <button
              onClick={onSubmitLocal}
              className="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300"
            >
              Login
            </button>
          </form>

          {/* <div className="mt-6 grid grid-cols-3 items-center text-gray-400 w-3/4 mx-auto">
            <hr className="border-gray-400" />
            <p className="text-center text-sm">OR</p>
            <hr className="border-gray-400" />
          </div>

          <button  onClick={onSubmitGoogle} className="bg-white w-3/4 mx-auto border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#002D74]">
            <svg
              className="mr-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="25px"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
            Login with Google
          </button>

            <button  onClick={onSubmitGit} className="bg-white w-3/4 mx-auto border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#002D74]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              data-name="Layer 1"
              viewBox="0 0 24 24"
              id="github"
              width="25px"
              className="mr-3"
            >
              <path d="M12,2.2467A10.00042,10.00042,0,0,0,8.83752,21.73419c.5.08752.6875-.21247.6875-.475,0-.23749-.01251-1.025-.01251-1.86249C7,19.85919,6.35,18.78423,6.15,18.22173A3.636,3.636,0,0,0,5.125,16.8092c-.35-.1875-.85-.65-.01251-.66248A2.00117,2.00117,0,0,1,6.65,17.17169a2.13742,2.13742,0,0,0,2.91248.825A2.10376,2.10376,0,0,1,10.2,16.65923c-2.225-.25-4.55-1.11254-4.55-4.9375a3.89187,3.89187,0,0,1,1.025-2.6875,3.59373,3.59373,0,0,1,.1-2.65s.83747-.26251,2.75,1.025a9.42747,9.42747,0,0,1,5,0c1.91248-1.3,2.75-1.025,2.75-1.025a3.59323,3.59323,0,0,1,.1,2.65,3.869,3.869,0,0,1,1.025,2.6875c0,3.83747-2.33752,4.6875-4.5625,4.9375a2.36814,2.36814,0,0,1,.675,1.85c0,1.33752-.01251,2.41248-.01251,2.75,0,.26251.1875.575.6875.475A10.0053,10.0053,0,0,0,12,2.2467Z"></path>
            </svg>
            Login with Github
          </button> */}

          <div className="mt-5 w-3/4 mx-auto text-xs border-b border-[#002D74] py-4 text-[#002D74]">
            <a href="#">Forgot your password?</a>
          </div>

          <div className="mt-3 w-3/4 mx-auto text-xs flex justify-between items-center text-[#002D74]">
            <p>Don't have an account?</p>

            <button className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300" onClick={redirect_to_signup}>
              Register
            </button>
          </div>
        </div>

        <div
          className="md:block hidden w-1/3 self-stretch h-full"
          style={{ minHeight: "100%" }}
        >
          <Image
            src="/bkg.png"
            width={500}
            height={500}
            alt="Picture of the author"
            className="rounded-2xl object-cover"
            style={{ objectFit: "cover", minHeight: "100%" }}
          />
        </div>
      </div>
    </section>
  );
}

export default dynamic(() => Promise.resolve(LoginPage), {ssr: false});;
