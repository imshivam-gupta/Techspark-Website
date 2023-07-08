import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        name: "",
        email: "",
        phone: "",
        main_address: "",
        addresses: [],
        orders: [],
        billing_address: "",
        birthday: "",
        gender: "",
        image:"",
        loading: true
    },
    reducers: {
        replaceUser(state, action) {
            const user= action.payload;
            state.name = user?.name || "";
            state.email = user?.email || "";
            state.phone = user?.phone || "";
            state.main_address = user?.main_address || "";
            state.addresses = user?.addresses || [];
            state.orders = user?.orders || [];
            state.billing_address = user?.billing_address || "";
            state.image = user?.image || "";
            state.loading = false;
        }
    }
});


export const userActions = userSlice.actions;
export default userSlice;

