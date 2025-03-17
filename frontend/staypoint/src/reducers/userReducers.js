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
    USER_RESET_PASSWORD_FAIL,
    USER_PROFILE_REQUEST, 
    USER_PROFILE_SUCCESS, 
    USER_PROFILE_FAIL 
} from "../constants/userConstants";

export const userSigninReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_SIGNIN_REQUEST:
            return { loading: true };
        case USER_SIGNIN_SUCCESS:
            return { loading: false, userInfo: action.payload };
        case USER_SIGNIN_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export const userLoginReducer = (state = {}, action) =>{
    switch(action.type){
        case USER_LOGIN_REQUEST:
            return {loading: true};
        case USER_LOGIN_SUCCESS:
            return {loading: false, userInfo: action.payload};
        case USER_LOGIN_FAIL:
            return {loading: false, error: action.payload};
        case USER_LOGOUT:
            return {};
        default:
            return state;
    }
}
  
export const forgotPasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_FORGOT_PASSWORD_REQUEST:
      return { loading: true };
    case USER_FORGOT_PASSWORD_SUCCESS:
      return { loading: false, success: true, message: action.payload };
    case USER_FORGOT_PASSWORD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const resetPasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_RESET_PASSWORD_REQUEST:
      return { loading: true };
    case USER_RESET_PASSWORD_SUCCESS:
      return { loading: false, success: true, message: action.payload };
    case USER_RESET_PASSWORD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_PROFILE_REQUEST:
      return { loading: true };
    case USER_PROFILE_SUCCESS:
      return { loading: false, success: true, message: action.payload };
    case USER_PROFILE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};