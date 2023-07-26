import { useRouter } from "next/router";
import Image from "next/image";
import { useFormik } from "formik";
import login_validate from "../lib/validate";
import { useState } from "react";
import { HiEye } from "react-icons/hi";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../utils/dbconnect";
import { userActions } from "../store/user-slice";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { Button, Input, Typography } from "@material-tailwind/react";

function LoginPage() {
  const jwt = require("jsonwebtoken");
  const dispatch = useDispatch();
  const router = useRouter();
  const [signingup, setSigningup] = useState(false);
  const [show, setShow] = useState({ password: false });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: login_validate,
  });

  let isAuthenticated = false;
  if (localStorage.getItem("token")) isAuthenticated = true;
  if (isAuthenticated) router.push("/");

  const redirect_to_signup = (e) => {
    e.preventDefault();
    router.push("/register");
  };

  const onLoginSuccess = async (par) => {
    const responsePayload = jwt.decode(par.credential);
    const decoded = responsePayload;
    console.log(decoded);
    const res = await fetch(`${BACKEND_URL}api/v1/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: decoded,
      }),
    });
    console.log(res);
    const data = await res.json();

    if (data.status === "success") {
      localStorage.setItem("token", data.token);
      dispatch(userActions.replaceUser(data.data.user));
      router.push("/");
    } else {
      toast("Incorrect Credentials. Try again or register yourself", {
        hideProgressBar: true,
        autoClose: 3000,
        type: "error",
        position: toast.POSITION.TOP_CENTER,
      });
    }

    setSigningup(false);
  };

  const onSubmitLocal = async (e) => {
    try {
      setSigningup(true);
      e.preventDefault();
      console.log(formik.values);
      const res = await fetch(`${BACKEND_URL}api/v1/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formik.values.email,
          password: formik.values.password,
        }),
      });

      const data = await res.json();

      if (data.status === "success") {
        localStorage.setItem("token", data.token);
        dispatch(userActions.replaceUser(data.data.user));
        router.push("/");
      } else {
        try {
          toast("Incorrect Credentials. Try again or register yourself", {
            hideProgressBar: true,
            autoClose: 3000,
            type: "error",
            position: toast.POSITION.TOP_CENTER,
          });
        } catch (error) {
          console.log(error);
        }
      }
      setSigningup(false);
    } catch (error) {
      console.log("Agya", error);
    }
  };

  if (signingup)
    return (
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
          <p className="text-xs text-[#002D74] text-center">
            If you are already a member, easily log in
          </p>

          <form
            action={onSubmitLocal}
            className="flex flex-col gap-4 w-3/4 mx-auto pt-6"
          >
            <div className="w-[28rem]">
              <Input
                className="bg-white rounded-b-xl outline-none w-full"
                size="lg"
                label="Email"
                type="email"
                name="email"
                autoComplete="on"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.errors.email}
                onBlur={formik.handleBlur}
              />

              {formik.errors.email && (
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center gap-1 font-normal py-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="-mt-px h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {formik.errors.email && formik.touched.email ? (
                    <span className="text-rose-500 text-sm">
                      {" "}
                      {formik.errors.email}{" "}
                    </span>
                  ) : (
                    <span className="text-rose-500 ">
                      {" "}
                      {"Please enter valid email id"}{" "}
                    </span>
                  )}
                </Typography>
              )}
            </div>

            <div className="w-[28rem]">
              <Input
                className="bg-white rounded-b-xl outline-none w-full"
                size="lg"
                label="Password"
                type={show.password ? "text" : "password"}
                name="password"
                autoComplete="on"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.errors.password}
                onBlur={formik.handleBlur}
                icon={
                  <HiEye
                    size={20}
                    onClick={() =>
                      setShow({ ...show, password: !show.password })
                    }
                  />
                }
              />

              {formik.errors.password && formik.touched.password && (
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center gap-1 font-normal py-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="-mt-px h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>

                  {formik.errors.password && formik.touched.password ? (
                    <span className="text-rose-500 text-sm ">
                      {" "}
                      {formik.errors.password}{" "}
                    </span>
                  ) : (
                    <span className="text-rose-500 ">
                      {" "}
                      {"Please enter valid password"}{" "}
                    </span>
                  )}
                </Typography>
              )}
            </div>

            <div className="w-[28rem] flex flex-row justify-cemter">
              <Button
                color="purple"
                onClick={onSubmitLocal}
                className="rounded-xl w-[95%] mx-auto"
              >
                Login
              </Button>
            </div>
          </form>

          <div className="mt-6 grid grid-cols-3 items-center text-gray-400 w-3/4 mx-auto">
            <hr className="border-gray-400" />
            <p className="text-center text-sm">OR</p>
            <hr className="border-gray-400" />
          </div>

          <div className="mx-auto w-full flex flex-row justify-center mt-6">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                onLoginSuccess(credentialResponse);
                // console.log(credentialResponse);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
              useOneTap
            />
          </div>

          <div className="mt-5 w-3/4 mx-auto text-xs border-b border-[#002D74] py-4 text-[#002D74]">
            <a href="#">Forgot your password?</a>
          </div>

          <div className="mt-3 w-3/4 mx-auto text-xs flex justify-between items-center text-[#002D74]">
            <p>Don't have an account?</p>

            <button
              className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300"
              onClick={redirect_to_signup}
            >
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

export default dynamic(() => Promise.resolve(LoginPage), { ssr: false });
