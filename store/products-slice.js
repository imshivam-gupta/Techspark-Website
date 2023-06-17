import { createSlice } from '@reduxjs/toolkit';

const productsSlice = createSlice({
    name: 'products',
    initialState: {
      products:[],
      changed: false,
      loading: true
    },
    reducers: {
        replaceProducts(state, action) {
            // console.log(action.payload)
            const prods= action.payload.items.data
            const new_state = prods.map(product => ({
                _id: product._id.toString(),
                main_image: product.main_image,
                price: product.price,
                name: product.name,
                brand: product.brand,
                rating: product.rating,
                images: product.all_images,
                description: product.description,
                tagline: product.tagline,
                category: product.category,
                numReviews: product.numReviews,
                countInStock: product.countInStock,
                reviews: product.reviews,
                offers: product.offers || [],
            }))
            state.products = new_state;
            state.loading = false;
        }
    }
});


export const productsActions = productsSlice.actions;
export default productsSlice;

