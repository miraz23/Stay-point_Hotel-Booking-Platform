import { 
    HOTEL_LIST_REQUEST, 
    HOTEL_LIST_SUCCESS, 
    HOTEL_LIST_FAIL, 
    HOTEL_DETAILS_REQUEST, 
    HOTEL_DETAILS_SUCCESS, 
    HOTEL_DETAILS_FAIL,
    ROOM_DETAILS_REQUEST, 
    ROOM_DETAILS_SUCCESS, 
    ROOM_DETAILS_FAIL,
} from "../constants/hotelConstants";

export const hotelListReducer = (state = { hotels: [] }, action) => {
    switch (action.type) {
        case HOTEL_LIST_REQUEST:
            return { loading: true, hotels: [] };
        case HOTEL_LIST_SUCCESS:
            return { loading: false, hotels: action.payload };
        case HOTEL_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export const hotelDetailsReducer = (state = {hotel: []}, action) =>{
    switch(action.type){
        case HOTEL_DETAILS_REQUEST:
            return {loading: true, ...state};
        case HOTEL_DETAILS_SUCCESS:
            return {loading: false, hotel: action.payload};
        case HOTEL_DETAILS_FAIL:
            return {loading: false, error: action.payload};
        default:
            return state;
    }
}

export const addRoomReducer = (state = {hotel: []}, action) =>{
    switch(action.type){
        case ROOM_DETAILS_REQUEST:
            return {loading: true, ...state};
        case ROOM_DETAILS_SUCCESS:
            return {loading: false, hotel: action.payload};
        case ROOM_DETAILS_FAIL:
            return {loading: false, error: action.payload};
        default:
            return state;
    }
}