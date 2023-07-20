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
            const prods= action.payload.items;
            const new_state = prods.map(product => ({
                _id: product._id.toString(),
                main_image: product.image,
                price: product.price,
                name: product.title,
                brand: product.brand,
                rating: product.rating,
                images: product.other_images,
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

