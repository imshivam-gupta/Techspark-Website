import { productsActions } from "./products-slice";

export const fetchProductData = () => {

    return async (dispatch) => {
        
        const fetchData = async () => {
            const response = await fetch(
                `/api/products/`
            );
           
            const data = await response.json();
            return data;
        };

        try {
            const productsData = await fetchData();
            dispatch(
                productsActions.replaceProducts({
                    items: productsData || [],
                })
            );
        } catch (error) {
            console.log(error);
        }

    };
}