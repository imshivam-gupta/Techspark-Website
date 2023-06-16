import { productsActions } from "./products-slice";

export const fetchProductData = () => {

    return async (dispatch) => {
        
        const fetchData = async () => {
            const response = await fetch(
                `/api/products/`
            );
            console.log(response)
            if (!response.ok) {
              throw new Error('Could not fetch products data!');
            }
            const data = await response.json();
            return data;
        };

        try {
            const productsData = await fetchData();
            console.log(productsData)
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