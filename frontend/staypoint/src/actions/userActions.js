import axios from "axios";
import { toast } from "react-hot-toast";
import { 
    USER_LOGIN_REQUEST, 
    USER_LOGIN_FAIL, 
    USER_LOGIN_SUCCESS, 
    USER_LOGOUT, 
    USER_SIGNIN_FAIL, 
    USER_SIGNIN_REQUEST, 
    USER_SIGNIN_SUCCESS, 
    USER_FORGOT_PASSWORD_REQUEST, 
    USER_FORGOT_PASSWORD_SUCCESS, 
    USER_FORGOT_PASSWORD_FAIL,
    USER_RESET_PASSWORD_REQUEST, 
    USER_RESET_PASSWORD_SUCCESS, 
    USER_RESET_PASSWORD_FAIL 
} from "../constants/userConstants";

export const signin = (formData) => async (dispatch) => {
    try {
        dispatch({ type: USER_SIGNIN_REQUEST });

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };

        const { data } = await axios.post(
            "/api/users/signin/",
            formData,
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

export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: USER_FORGOT_PASSWORD_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.post("/api/users/forgot-password/", { email }, config);

    dispatch({ type: USER_FORGOT_PASSWORD_SUCCESS, payload: data.message });

    toast.success("Password reset email sent! Check your inbox.");

  } catch (error) {
    dispatch({ type: USER_FORGOT_PASSWORD_FAIL });
    toast.error(error.response?.data?.error || "Something went wrong.");
  }
};

export const resetPassword = (uid, token, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_RESET_PASSWORD_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.post(`/api/users/reset-password/${uid}/${token}/`, { password }, config);
    
    dispatch({ type: USER_RESET_PASSWORD_SUCCESS });
    toast.success("Password reset successful! You can now log in.");

  } catch (error) {
    dispatch({ type: USER_RESET_PASSWORD_FAIL });
    toast.error(error.response?.data?.error || "Something went wrong.");
  }
};