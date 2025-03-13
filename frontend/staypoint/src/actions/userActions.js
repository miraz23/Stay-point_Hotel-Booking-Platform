import axios from "axios";
import { USER_LOGIN_REQUEST, USER_LOGIN_FAIL, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_SIGNIN_FAIL, USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESS } from "../constants/userConstants";
import { toast } from "react-hot-toast";

export const signin = (fname, lname, email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_SIGNIN_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.post(
            "/api/users/signin/",
            { fname, lname, email, password },
            config
        );

        dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
        localStorage.setItem("userInfo", JSON.stringify(data));
        toast.success("Registration successful! Please check your email for activation.");

    } catch (error) {
        dispatch({ type: USER_SIGNIN_FAIL });

        const errorMessage = error.response && error.response.data.detail
            ? error.response.data.detail
            : "Registration failed. Please try again.";

        toast.error(errorMessage);
    }
};

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.post(
            "/api/users/login/",
            { username: email, password },
            config
        );

        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
        localStorage.setItem("userInfo", JSON.stringify(data));
        toast.success("Logged in successfully!");

    } catch (error) {
        dispatch({ type: USER_LOGIN_FAIL });

        const errorMessage = error.response && error.response.data.detail
            ? error.response.data.detail
            : "Login failed. Please check your credentials.";

        toast.error(errorMessage);
    }
};

export const logout = () => (dispatch) => {
    localStorage.removeItem("userInfo");
    dispatch({ type: USER_LOGOUT });
    toast.success("Logged out successfully!");
};
