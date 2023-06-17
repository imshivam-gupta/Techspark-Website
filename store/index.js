// import { createStore } from "redux";
import  {configureStore,createSlice} from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import cartSlice from "./cart-slice";
import productsSlice from "./products-slice";
import userSlice from "./user-slice";

// const initialState = {
//     count: 0,
//     showCounter: true
// };
const initialCounterState = {
    count: 0,
    showCounter: true
};

const initialOtherState = {
    name: 'Shivam'
};

const counterSlice = createSlice({
    name: 'count',
    initialState: initialCounterState,
    reducers: {
        increment(state) {
            state.count++;
        },
        decrement(state) {
            state.count--;
        },
        increase(state, action) {
            state.count = state.count + action.payload;
            // simply pass like.increment(10)
        },
        toggleCounter(state) {
            state.showCounter = !state.showCounter;
        }
    }
});

const otherSlice = createSlice({
    name: 'other',
    initialState: initialOtherState,
    reducers: {
        changeName(state, action) {
            state.name = action.payload;
        }
    }
});


// counterSlice.actions.increment();
export const counterActions = counterSlice.actions;
export const otherActions = otherSlice.actions;

const store = configureStore({
    // reducer: counterSlice.reducer
    reducer: {
        counter: counterSlice.reducer,
        other: otherSlice.reducer,
        products: productsSlice.reducer,
        cart: cartSlice.reducer,
        user: userSlice.reducer
    }
});




// const countReducer = (state = { count: 0 }, action) => {
//     switch (action.type) {
//         case "INCREMENT":
//             return { count: state.count + 1 };
//         case "DECREMENT":
//             return { count: state.count - 1 };
//         default:
//             return state;
//     }
// };


// const store = createStore(countReducer);

export default store;