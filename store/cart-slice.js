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
        const cart_res = action.payload.data.cart;
        const cartTotal = cart_res.items.reduce((total, item) => total + item.qty * item.productId.price, 0);
        state.totalCost = cartTotal;
        state._id = cart_res._id;
        state.items = cart_res.items.map((item) => ({
            productId: item.productId._id,
            productName: item.productId.title,
            productPrice: item.productId.price,
            productImage: item.productId.image,
            qty: item.qty,
            countInStock: item.productId.count_in_stock,
        }));
        state.loading = false;
        state.changed = true;
    },

    addItemToCart(state, action) {
        const newItem = action.payload;

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
        const cartTotal = state.items.reduce((total, item) => total + item.qty * item.productPrice, 0);
        state.totalCost = cartTotal;
      } 
      else {
        existingItem.qty=newItem.qty;
        const cartTotal = state.items.reduce((total, item) => total + item.qty * item.productPrice, 0);
        state.totalCost = cartTotal;
      }
    },
    removeItemFromCart(state, action) {
        const newItemId = action.payload;
        state.items = state.items.filter((item) => item.productId !== newItemId);
        const cartTotal = state.items.reduce((total, item) => total + item.qty * item.productPrice, 0);
        state.totalCost = cartTotal;
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice;