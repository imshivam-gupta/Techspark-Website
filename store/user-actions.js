import { userActions } from "./user-slice";

export const fetchuserdata = (user_email) => {

    return async (dispatch) => {
        
        const fetchData = async () => {
            const response = await fetch(
                `/api/user/`,{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        user_email: user_email,
                    },
                }
            );
            const data = await response.json();
            return data;
        };

        try {
            const userData = await fetchData();
            dispatch(
                userActions.replaceUser({
                    data: userData || {},
                })
            );
        } catch (error) {
            console.log(error);
        }

    };
}