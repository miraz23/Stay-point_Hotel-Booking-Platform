import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { IconCurrencyDollar, IconCalendarCheck, IconBed, IconStar } from '@tabler/icons-react';

const HotelAnalytics = ({ hotelId }) => {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    avgOccupancy: 0,
    avgRating: 0,
    revenueChange: 0,
    bookingsChange: 0,
    occupancyChange: 0,
    ratingChange: 0
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/api/hotels/${hotelId}/analytics/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnalytics(response.data);
      } catch (error) {
        toast.error('Failed to fetch analytics data');
      }
    };

    if (hotelId) {
      fetchAnalytics();
    }
  }, [hotelId]);

  const MetricCard = ({ title, value, icon, change, format = 'number' }) => {
    const formattedValue = format === 'currency' 
      ? `$${value.toLocaleString()}`
      : format === 'percentage'
      ? `${value}%`
      : format === 'rating'
      ? `${value}/5`
      : value.toLocaleString();

    const changeText = change > 0 ? `↑ ${change}%` : `↓ ${Math.abs(change)}%`;
    const changeColor = change > 0 ? 'text-green-600' : 'text-red-600';
    const changeDescription = change > 0 ? 'from last year' : 'from last month';

    return (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-start text-left">
          <div>
            <h3 className="text-gray-500 text-lg mb-2">{title}</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">{formattedValue}</span>
            </div>
            <div className="mt-2">
              <span className={`${changeColor} text-sm font-medium`}>
                {changeText}
              </span>
              <span className="text-gray-500 text-sm ml-2">
                {changeDescription}
              </span>
            </div>
          </div>
          <div className="p-3 bg-gray-100 rounded-full">
            {icon}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Total Revenue"
        value={analytics.totalRevenue}
        icon={<IconCurrencyDollar size={24} className="text-cyan-500" />}
        change={analytics.revenueChange}
        format="currency"
      />
      <MetricCard
        title="Total Bookings"
        value={analytics.totalBookings}
        icon={<IconCalendarCheck size={24} className="text-cyan-500" />}
        change={analytics.bookingsChange}
      />
      <MetricCard
        title="Avg. Occupancy"
        value={analytics.avgOccupancy}
        icon={<IconBed size={24} className="text-cyan-500" />}
        change={analytics.occupancyChange}
        format="percentage"
      />
      <MetricCard
        title="Avg. Rating"
        value={analytics.avgRating}
        icon={<IconStar size={24} className="text-cyan-500" />}
        change={analytics.ratingChange}
        format="rating"
      />
    </div>
  );
};

export default HotelAnalytics; 