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

export const roomDeleteReducer = (state = {rooms: []}, action) => {
    switch (action.type) {
        case 'ROOM_DELETE_SUCCESS':
            return {
                ...state,
                rooms: state.rooms.filter(room => room.id !== action.payload)
            }
        case 'ROOM_DELETE_FAIL':
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
}

export const hotelDeleteReducer = (state = {hotels: []}, action) => {
    switch (action.type) {
        case 'HOTEL_DELETE_REQUEST':
            return {
                ...state,
                loading: true
            }
        case 'HOTEL_DELETE_SUCCESS':
            return {
                ...state,
                loading: false,
                hotels: state.hotels.filter(hotel => hotel.id !== action.payload)
            }
        case 'HOTEL_DELETE_FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default:
            return state;
    }
}