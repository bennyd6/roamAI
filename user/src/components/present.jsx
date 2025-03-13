import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './present.css';

export default function Present() {
  const [plan, setPlan] = useState(null);
  const [carBookings, setCarBookings] = useState([]);
  const [hotelBookings, setHotelBookings] = useState([]);  // State for hotel bookings
  const [hotelDetails, setHotelDetails] = useState({});  // To store hotel details

  const authToken = localStorage.getItem('authToken');
  const navigate = useNavigate(); // Initialize the navigate function

  // Fetch the user's plan
  useEffect(() => {
    fetch('http://localhost:3000/api/auth/getplan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': authToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPlan(data.plan);
        // Save the plan to localStorage
        localStorage.setItem('userPlan', JSON.stringify(data.plan));
      })
      .catch((error) => console.error('Error fetching plan:', error));
  }, [authToken]);

  // Fetching user's car bookings
  useEffect(() => {
    fetch('http://localhost:3000/api/auth/bookedcars', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': authToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched car bookings:", data);
        setCarBookings(data.bookedCars);
      })
      .catch((error) => console.error('Error fetching car bookings:', error));
  }, [authToken]);

  // Fetching user's hotel bookings
  useEffect(() => {
    fetch('http://localhost:3000/api/auth/gethotelbookings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': authToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched hotel bookings:", data);
        setHotelBookings(data.bookedHotels);
        
        // Fetch hotel details for each booking
        data.bookedHotels.forEach((booking) => {
          fetch(`http://localhost:3000/api/auth/gethoteldetails/${booking.hotel}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': authToken,
            },
          })
            .then((response) => response.json())
            .then((hotelData) => {
              setHotelDetails((prevDetails) => ({
                ...prevDetails,
                [booking._id]: hotelData,
              }));
            })
            .catch((error) => console.error('Error fetching hotel details:', error));
        });
      })
      .catch((error) => console.error('Error fetching hotel bookings:', error));
  }, [authToken]);

  // Handle button click for rescheduling
  const handleRescheduleClick = () => {
    navigate('/plan');  // Navigate to '/plan' route
  };

  return (
    <div className="present-main">
      {/* Plan Section */}
      <div className="pre-1">
        <h1>Your Plan</h1>
        <div className="plan">
          {plan ? (
            <div
              className="plan-content"
              dangerouslySetInnerHTML={{ __html: plan }}
            />
          ) : (
            <p>Loading plan...</p>
          )}
        </div>
        <button className="reschedule-btn" onClick={handleRescheduleClick}>
          Reschedule?
        </button>
      </div>

      {/* Car Bookings Section - Scrollable */}
      {/* // Car Bookings Section - Scrollable */}
<div className="bookings-container">
  <h2>Your Car Bookings</h2>
  {carBookings.length > 0 ? (
    carBookings.map((booking, index) => (
      <div key={index} className="booking-card">
        {/* Car Image */}
        {booking.carDetails && booking.carDetails.image ? (
          <img
            src={`http://localhost:3000${booking.carDetails.image}`}
            alt="Car"
            className="car-image"
          />
        ) : (
          <div className="no-image">No Image Available</div>
        )}

        <div className="booking-info">
          <h3>{booking.carDetails ? booking.carDetails.model : 'Unknown'}</h3>
          <p><strong>Provider:</strong> {booking.providerDetails ? booking.providerDetails.name : 'Unknown'}</p>
          <p><strong>Phone:</strong> {booking.providerDetails ? booking.providerDetails.phn : 'N/A'}</p> {/* Display phone number here */}
          <p><strong>Status:</strong> <span className={`status ${booking.status}`}>{booking.status}</span></p>
          <p><strong>Dates:</strong> {booking.dates.join(', ')}</p>
        </div>
      </div>
    ))
  ) : (
    <p className="no-bookings">No car bookings found</p>
  )}
</div>


      {/* Hotel Bookings Section - Scrollable */}
      <div className="bookings-container">
        <h2>Your Hotel Bookings</h2>
        {hotelBookings.length > 0 ? (
          hotelBookings.map((booking, index) => {
            const hotel = hotelDetails[booking._id];  // Get hotel details for each booking
            return (
              <div key={index} className="booking-card">
                {/* Hotel Image */}
                {hotel && hotel.image ? (
                  <img
                    src={`http://localhost:3000/${hotel.image.replace(/\\/g, "/")}`}
                    alt="Hotel"
                    className="hotel-image"
                  />
                ) : (
                  <div className="no-image">No Image Available</div>
                )}

                <div className="booking-info">
                  <h3>{hotel ? hotel.name : 'Unknown Hotel'}</h3>
                  <p><strong>Location:</strong> {hotel ? hotel.location : 'Unknown'}</p>
                  <p><strong>Status:</strong> <span className={`status ${booking.status}`}>{booking.status}</span></p>
                  <p><strong>Dates:</strong> {booking.dates.join(', ')}</p>
                  <p><strong>Rooms:</strong> {booking.rooms}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-bookings">No hotel bookings found</p>
        )}
      </div>
    </div>
  );
}
