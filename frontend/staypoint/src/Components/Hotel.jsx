import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { listHotelDetails } from '../actions/hotelActions';
import Loader from './Loader';
import Message from './Message';
import { MapPinIcon, StarIcon } from '@heroicons/react/24/solid';

const Hotel = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const hotelDetails = useSelector(state => state.hotelDetails);
    const { loading, error, hotel } = hotelDetails;

    useEffect(() => {
        dispatch(listHotelDetails(id));
    }, [dispatch, id]);

    return (
        <div className="text-center my-6 mx-10">
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <div className='w-full flex items-center gap-x-20'>
                    <div className='w-1/2 aspect-[3/2]'>
                        <img src={`http://127.0.0.1:8000/${hotel.image}`} alt={hotel.name} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div className='w-1/2 text-left'>
                        <div>
                          <div className='flex items-center'>
                            <h1 className='text-4xl font-semibold'>{hotel.name}</h1>
                            <div className="flex items-center mx-2">
                              <StarIcon className="h-5 w-5 text-yellow-500 mr-2"/>
                              <span className="text-gray-600 text-2xl font-semibold">{hotel.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center py-3">
                            <MapPinIcon className="h-6 w-6 text-blue-500 mr-2" />
                            <span className="text-gray-600">{hotel.location}</span>
                          </div>
                        </div>
                        <p className='text-xl'>{hotel.description}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Hotel;