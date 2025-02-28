import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './present.css';

export default function Present() {
  const [plan, setPlan] = useState(null);
  const [bookings, setBookings] = useState([]);

  const authToken = localStorage.getItem('authToken');
  const navigate = useNavigate(); // Initialize the navigate function

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
  

  // Fetching user's bookings
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
        console.log("Fetched bookings:", data);
        setBookings(data.bookedCars);
      })
      .catch((error) => console.error('Error fetching bookings:', error));
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

      {/* Bookings Section - Scrollable */}
      <div className="bookings-container">
        {bookings.length > 0 ? (
          bookings.map((booking, index) => (
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
                <p><strong>Status:</strong> <span className={`status ${booking.status}`}>{booking.status}</span></p>
                <p><strong>Dates:</strong> {booking.dates.join(', ')}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-bookings">No bookings found</p>
        )}
      </div>
    </div>
  );
}
