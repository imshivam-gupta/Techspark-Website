import { BACKEND_URL } from "../utils/dbconnect";
import { userActions } from "./user-slice";

export const fetchuserdata = () => {

    return async (dispatch) => {
        
        const token = localStorage.getItem("token");
        const fetchData = async () => {
            const response = await fetch(
                `${BACKEND_URL}api/v1/users/me`,{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            console.log(data); 
            return data;
        };

        try {
            const userData = await fetchData();
            dispatch(
                userActions.replaceUser(userData.data.data)
            );
        } catch (error) {
            console.log(error);
        }

    };
}

