import { cartActions } from './cart-slice';

export const fetchCartData = (email) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(
        'api/cart',{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            user_email: email,
        },
        }
      );
      if (!response.ok) {
        throw new Error('Could not fetch cart data!');
      }
      const data = await response.json();
      console.log(data.cart);
      return data.cart;
    };

    try {
      const cartData = await fetchData();
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
