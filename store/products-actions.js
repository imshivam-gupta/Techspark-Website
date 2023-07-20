import { BACKEND_URL } from "../utils/dbconnect";
import { productsActions } from "./products-slice";

export const fetchProductData = () => {

    return async (dispatch) => {
        
        const fetchData = async () => {
            const response = await fetch(`${BACKEND_URL}api/v1/products`);
            const data = await response.json();
            return data;
        };

        try {
            const productsData = await fetchData();
            dispatch(
                productsActions.replaceProducts({
                    items: productsData.data.docs || [],
                })
            );
        } catch (error) {
            console.log(error);
        }

    };
}