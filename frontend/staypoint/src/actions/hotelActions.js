import axios from 'axios';
import { HOTEL_LIST_REQUEST, HOTEL_LIST_SUCCESS, HOTEL_LIST_FAIL, HOTEL_DETAILS_REQUEST, HOTEL_DETAILS_SUCCESS, HOTEL_DETAILS_FAIL, ROOM_DETAILS_REQUEST, ROOM_DETAILS_SUCCESS, ROOM_DETAILS_FAIL } from '../constants/hotelConstants';

export const listHotels = () => async (dispatch) => {
    try {
        dispatch({ type: HOTEL_LIST_REQUEST });

        const { data } = await axios.get('/api/hotels/');

        dispatch({
            type: HOTEL_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: HOTEL_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
};

export const listHotelDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: HOTEL_DETAILS_REQUEST });

        const { data } = await axios.get(`/api/hotels/${id}`);

        dispatch({
            type: HOTEL_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: HOTEL_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
};

export const addRoom = (formData) => async (dispatch) => {
    try {
        dispatch({ type: ROOM_DETAILS_REQUEST });

        const { data } = await axios.post(`http://127.0.0.1:8000/api/rooms/add-room/`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "multipart/form-data",
            },
        });

        dispatch({
            type: ROOM_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ROOM_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
};