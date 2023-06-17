import { cartActions } from './cart-slice';
import axios from 'axios';

export const fetchCartData = (email) => {
  return async (dispatch) => {
    const fetchData = async () => {
      console.log(email)
      const response = await axios.get(
        `/api/cart`,
        {headers: {
          "Content-Type": "application/json",
          user_email: email,
        },}
      ).catch((err) => {
        console.log(err);
      });

      const data = await response.data;
      console.log(data);
      return data.cart;
    };

    try {
      // console.log("fetching cart data started")
      const cartData = await fetchData();
      console.log(cartData);
      // console.log("fetching cart data finished")
      dispatch(
        cartActions.replaceCart({
          data:cartData,
        })
      );
    } catch (error) {
        console.log(error);
    }
  };
};


export const sendCartData = (id,quant,email) => {
    return async (dispatch) => {
    
      const sendRequest = async () => {
        await fetch("/api/cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              user_email: email,
            },
            body: JSON.stringify({
              productId: id,
              qty: quant,
            }),
        })

        if (!response.ok) {
          throw new Error('Sending cart data failed.');
        }
      };
  
      try {
        await sendRequest();
      } catch (error) {
        console.log(error);
      }
    };
  };