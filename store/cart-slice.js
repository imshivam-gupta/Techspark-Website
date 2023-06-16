import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    _id: "",
    totalCost: 0,
    items: [],
    changed: false,
    loading: true
  },
  reducers: {

    replaceCart(state, action) {
        const cart_res = action.payload.data;
        const cartTotal = cart_res.items.reduce((total, item) => total + item.qty * item.productId.price, 0);
        state.totalCost = cartTotal;
        state._id = cart_res._id.toString();
        state.items = cart_res.items.map((item) => ({
            productId: item.productId._id,
            productName: item.productId.name,
            productPrice: item.productId.price,
            productImage: item.productId.main_image,
            qty: item.qty,
            countInStock: item.productId.countInStock,
        }));
        state.loading = false;
    },

    addItemToCart(state, action) {
        const newItem = action.payload;
        console.log(newItem)

      const existingItem = state.items.find((item) => item.productId === newItem.productId);
      if (!existingItem) {
        state.items.push({
            productId: newItem.productId,
            productName: newItem.productName,
            productPrice: newItem.productPrice,
            productImage: newItem.productImage,
            qty: newItem.qty,
            countInStock: newItem.countInStock,
        });
      } 
      else {
        existingItem.qty=newItem.qty;
        state.totalCost = state.totalCost + existingItem.productPrice;
      }
    },
    removeItemFromCart(state, action) {
        const newItemId = action.payload;
        state.items = state.items.filter((item) => item.productId !== newItemId);
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice;