import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";
import { HiEye } from "react-icons/hi";
import { registerValidate } from "../lib/validate";
import { useFormik } from "formik";
import { toast } from "react-toastify";

export default function RegisterPage() {

  const router = useRouter();

  const showToast = () =>
    toast("Signup was successful. Now login to continue....", {
      hideProgressBar: false,
      autoClose: 5000,
      type: "success",
      position: toast.POSITION.TOP_CENTER,
    });
  
  const [show, setShow] = useState({ password: false, cpassword: false });

  const redirect_to_login = (e) => {
    e.preventDefault();
    router.push("/login");
  };

  const onSubmit = async (values) => {
    // console.log(values);

    await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((data) => {
        if(data){
            showToast();
            router.push("/login");
        }  
      });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      cpassword: "",
    },
    validate: registerValidate,
    onSubmit,
  });

  return (
    <section className="mt-6 flex flex-row justify-center min-h-screen pt-6">
      <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-6xl items-center h-max w-2/3 justify-stretch">
        <div className="md:w-2/3 px-8 md:px-16 py-6 ">
          <h2 className="font-bold text-2xl text-[#002D74] text-center">
            Register
          </h2>
          <p className="text-xs mt-4 text-[#002D74] text-center">
            If you are not a member already, easily sign up
          </p>

          <form
            action=""
            className="flex flex-col gap-4 w-3/4 mx-auto"
            onSubmit={formik.handleSubmit}
          >
            <div
              className={`mt-6 flex flex-row ${
                formik.errors.name && formik.touched.name
                  ? "border-rose-600"
                  : ""
              } relative rounded-xl text-black border w-full bg-white`}
            >
              <input
                className="focus:outline-none rounded-xl px-4 w-full py-2 outline-none"
                type={"text"}
                name="name"
                placeholder="Name"
                onChange={(e) => (name.current = e.target.value)}
                {...formik.getFieldProps("name")}
              />
            </div>

            {formik.errors.name && formik.touched.name ? (
              <span className="text-rose-500 pl-6 text-sm -my-2">
                {formik.errors.name}
              </span>
            ) : (
              <></>
            )}

            <div
              className={`flex flex-row ${
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
                onChange={(e) => (email.current = e.target.value)}
                {...formik.getFieldProps("email")}
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
                onChange={(e) => (pass.current = e.target.value)}
                {...formik.getFieldProps("password")}
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

            <div
              className={`flex flex-row ${
                formik.errors.cpassword && formik.touched.cpassword
                  ? "border-rose-600"
                  : ""
              } relative py-2 rounded-xl text-black border w-full bg-white`}
            >
              <input
                className="w-11/12 focus:outline-none px-4"
                type={show.cpassword ? "text" : "password"}
                name="cpassword"
                placeholder="Confirm Password"
                onChange={(e) => (pass.current = e.target.value)}
                {...formik.getFieldProps("cpassword")}
              />
              <span
                className={`icon flex items-center px-4 ${
                  show.cpassword ? "text-[#002D74]" : "text-gray-400"
                }`}
                onClick={() => setShow({ ...show, cpassword: !show.cpassword })}
              >
                <HiEye size={25} />
              </span>
            </div>

            {formik.errors.cpassword && formik.touched.cpassword ? (
              <span className="text-rose-500 pl-6 text-sm -my-1">
                {formik.errors.cpassword}
              </span>
            ) : (
              <></>
            )}

            <button
              className="bg-[#002D74] rounded-xl text-white py-2 mt-2 hover:scale-105 duration-300"
              onClick={formik.handleSubmit}
            >
              Register
            </button>
          </form>

          <div className="mt-6 grid grid-cols-3 items-center text-gray-400 w-3/4 mx-auto">
            <hr className="border-gray-400" />
            <p className="text-center text-sm">OR</p>
            <hr className="border-gray-400" />
          </div>

          <div className="mt-3 w-3/4 mx-auto text-xs flex justify-between items-center text-[#002D74]">
            <p>Already have an account?</p>
            <button className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300" onClick={redirect_to_login}>
              Login
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
