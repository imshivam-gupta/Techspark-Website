import { getServerSession } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";

const CartScreen = ({ cart }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status !== "loading" && !session) {
    router.push("/login");
  }

  const shiftHandler = () => {
    router.push("/shipping");
  };

  const addToCartHandler = async (id, quant) => {
    if (session) {
      await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          user_email: session.user.email,
        },
        body: JSON.stringify({
          productId: id,
          qty: quant,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            const cart_res = data.cart;
            const cartTotal = cart_res.items.reduce(
              (total, item) => total + item.qty * item.productId.price,
              0
            );
            console.log(data);
            cart = {
              _id: cart_res._id.toString(),
              totalCost: cartTotal,
              items: cart_res.items.map((item) => ({
                productId: item.productId._id,
                productName: item.productId.name,
                productPrice: item.productId.price,
                productImage: item.productId.main_image,
                qty: item.qty,
                countInStock: item.productId.countInStock,
              })),
            };
            setCartState(cart);
          }
        });
    } else {
      router.push("/login");
    }
  };

  const [cartState, setCartState] = useState(cart);

  const deleteHandler = (id) => {
    const updatedItems = cartState.items.filter(
      (item) => item.productId !== id
    );
    setCartState({ ...cartState, items: updatedItems });

    if (session) {
      fetch(`/api/cart/${id}`, {
        method: "DELETE",
        headers: {
          user_email: session.user.email,
        },
      });
    }
  };

  console.log(cartState);

  return (
    <>
    <Head>
      <title>Cart</title>
      {/* Logo */}
      <link rel="icon" href="/logosvg.svg" />
    </Head>
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-10">
        <div className="flex">
          {/* Cart items */}

          {cartState.items.length === 0 ? (
            <div className="w-3/4 px-6  rounded-lg ">
              <div className="bg-white rounded-xl shadow-lg p-6 py-14">
                <div className="flex flex-col">
                  <div className="flex items-center justify-center">
                    <h2 className="text-3xl text-gray-500 font-bold">Your Cart is Empty</h2>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-3/4 px-6  rounded-lg ">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col">
                  {cartState.items &&
                    cartState.items.map((item) => (
                      <div
                        className="flex items-center mb-6"
                        key={item.productId}
                      >
                        <img
                          src={item.productImage}
                          alt="Product 1"
                          className="h-24 w-24 rounded-md mr-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h2 className="text-lg font-bold">
                              {item.productName}
                            </h2>
                            <span className="text-green-500 ml-2">
                              In Stock
                            </span>
                          </div>
                          <p className="text-gray-500">
                            Price: &#8377; {item.productPrice}
                          </p>
                          <div className="flex items-center mt-2">
                            <span className="mr-2">Quantity:</span>
                            <select
                              className="border border-gray-400 p-1 h-8 text-sm rounded"
                              onChange={(e) =>
                                addToCartHandler(item.productId, e.target.value)
                              }
                              value={item.qty}
                            >
                              {[...Array(item.countInStock).keys()].map((x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              ))}
                              {/*                          
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option> */}
                            </select>
                          </div>
                        </div>
                        <div>
                          <button
                            className="text-red-500 focus:outline-none"
                            onClick={() => deleteHandler(item.productId)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  {/* Cart item 1 */}
                </div>

                {/* Checkout button */}
                <div className="flex justify-end mt-8">
                  <button className="bg-purple-500 text-white px-6 py-2 rounded-md" onClick={shiftHandler}>
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Total information */}
          <div className="w-1/4 px-6 mt-6">
            <div className="bg-white rounded shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Total Information</h2>
              <div className="border-b border-gray-300 pb-4">
                <p className="text-gray-600">
                  Subtotal: &#8377; {cartState.totalCost}
                </p>
                <p className="text-gray-600">
                  Discount: - &#8377; {0.05 * cartState.totalCost}
                </p>
                <p className="text-gray-600">
                  Delivery Charges: &#8377; {cartState.totalCost > 500 ? 0 : 100}
                </p>
              </div>
              <div className="mt-4">
                <p className="text-xl font-bold">
                  Total Amount: &#8377;
                  {cartState.totalCost - 0.05 * cartState.totalCost}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);

  // console.log(session.email);

  if (session) {
    const req_sample = await fetch(`https://techspark.vercel.app/api/cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        user_email: session.email,
      },
    });
    const data = await req_sample.json();
    const cart_res = data.cart;

    const cartTotal = cart_res.items.reduce(
      (total, item) => total + item.qty * item.productId.price,
      0
    );

    return {
      props: {
        cart: {
          _id: cart_res._id.toString(),
          totalCost: cartTotal,
          items: cart_res.items.map((item) => ({
            productId: item.productId._id,
            productName: item.productId.name,
            productPrice: item.productId.price,
            productImage: item.productId.main_image,
            qty: item.qty,
            countInStock: item.productId.countInStock,
          })),
        },
      },
    };
  } else {
    return {
      props: {
        cart: {
          _id: "",
          items: [],
        },
      },
    };
  }
};

export default CartScreen;
