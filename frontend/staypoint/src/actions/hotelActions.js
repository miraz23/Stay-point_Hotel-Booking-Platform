import axios from 'axios';
import { HOTEL_LIST_REQUEST, HOTEL_LIST_SUCCESS, HOTEL_LIST_FAIL, HOTEL_DETAILS_REQUEST, HOTEL_DETAILS_SUCCESS, HOTEL_DETAILS_FAIL } from '../constants/hotelConstants';

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