import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { hotelListReducer, hotelDetailsReducer } from './reducers/hotelReducers';

const reducer = combineReducers({
    hotelsList: hotelListReducer,
    hotelDetails: hotelDetailsReducer
});

const initialState = {};
const middleware = [thunk];
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;