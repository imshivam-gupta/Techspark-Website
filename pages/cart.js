import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartData } from "../store/cart-actions";
import { cartActions } from "../store/cart-slice";
import { fetchProductData } from "../store/products-actions";

const CartScreen = () => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const cartStateRedux = useSelector((state) => state.cart);
  const { _id, totalCost, items, changed, loading } = cartStateRedux;

  const prodStateRedux = useSelector((state) => state.products);
  const { products } = prodStateRedux;

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProductData());
  }, [dispatch]);

  useEffect(() => {
    if (session && loading) dispatch(fetchCartData(session.user.email));
  }, [dispatch, session]);

  const router = useRouter();

  if (status !== "loading" && !session) {
    router.push("/login");
  }

  const shiftHandler = () => {
    router.push("/shipping");
  };

  const addToCartHandler = async (
    productId,
    productName,
    productPrice,
    productImage,
    qty,
    countInStock
  ) => {
    const prod = {
      productId,
      productName,
      productPrice,
      productImage,
      qty,
      countInStock,
    };
    dispatch(cartActions.addItemToCart(prod));
    if (session) {
      await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          user_email: session.user.email,
        },
        body: JSON.stringify({
          productId: productId,
          qty: qty,
        }),
      });
    }
  };

  const deleteHandler = (id) => {
    dispatch(cartActions.removeItemFromCart(id));
    if (session) {
      fetch(`/api/cart/${id}`, {
        method: "DELETE",
        headers: {
          user_email: session.user.email,
        },
      });
    }
  };

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <>
      <Head>
        <title>Cart</title>
        <meta name="description" content="Cart" />
        <link rel="icon" href="/logosvg.svg" />
      </Head>
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto py-10">
          <div className="flex">
            {loading ? (
              <div
                role="status"
                class="w-3/4 p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                    <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                </div>
                <div class="flex items-center justify-between pt-4">
                  <div>
                    <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                    <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                </div>
                <div class="flex items-center justify-between pt-4">
                  <div>
                    <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                    <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                </div>
                <div class="flex items-center justify-between pt-4">
                  <div>
                    <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                    <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                </div>
                <div class="flex items-center justify-between pt-4">
                  <div>
                    <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                    <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                </div>
                <span class="sr-only">Loading...</span>
              </div>
            ) : items.length === 0 ? (
              <div className="w-3/4 px-6  rounded-lg ">
                <div className="bg-white rounded-xl shadow-lg p-6 py-14">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-center">
                      <h2 className="text-3xl text-gray-500 font-bold">
                        Your Cart is Empty
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-3/4 px-6  rounded-lg ">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex flex-col">
                    {items &&
                      items.map((item) => (
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
                                  addToCartHandler(
                                    item.productId,
                                    item.productName,
                                    item.productPrice,
                                    item.productImage,
                                    e.target.value,
                                    item.countInStock
                                  )
                                }
                                value={item.qty}
                              >
                                {[...Array(item.countInStock).keys()].map(
                                  (x) => (
                                    <option key={x + 1} value={x + 1}>
                                      {x + 1}
                                    </option>
                                  )
                                )}
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
                    <button
                      className="bg-purple-500 text-white px-6 py-2 rounded-md"
                      onClick={shiftHandler}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Total information */}

            {loading ? (
              <div
                role="status"
                class="w-1/4 px-6 ml-8 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700"
              >
                <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                
                <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>

                <span class="sr-only">Loading...</span>
              </div>
            ) : (
              <div className="w-1/4 px-6 mt-6">
                <div className="bg-white rounded shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Total Information</h2>
                  <div className="border-b border-gray-300 pb-4">
                    <p className="text-gray-600">
                      Subtotal: &#8377;{" "}
                      {Math.round((totalCost + Number.EPSILON) * 100) / 100}
                    </p>
                    <p className="text-gray-600">
                      Discount: - &#8377;{" "}
                      {Math.round((0.05 * totalCost + Number.EPSILON) * 100) /
                        100}
                    </p>
                    <p className="text-gray-600">
                      Delivery Charges: &#8377; {totalCost > 500 ? 0 : 100}
                    </p>
                  </div>
                  <div className="mt-4">
                    <p className="text-xl font-bold">
                      Total Amount: &#8377;
                      {totalCost - 0.05 * totalCost}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartScreen;
