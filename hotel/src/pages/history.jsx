import { useEffect, useState } from "react";
import "./history.css";

export default function History() {
  const [bookings, setBookings] = useState([]); // State for storing booking data
  const [users, setUsers] = useState([]); // State to store user data for each booking
  const [loading, setLoading] = useState(true); // State to indicate loading status
  const [error, setError] = useState(null); // State for handling errors

  // Function to fetch user details by userId
  const fetchUserDetails = async (userId, token) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/getuser", {
        method: "POST",
        headers: {
          "auth-token": token,
        },
        body: JSON.stringify({ userId }), // Sending the user ID to fetch specific user details
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const userData = await response.json();
      return userData; // Return user data for a specific userId
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to fetch bookings data
  const fetchBookings = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/api/hotels/gethotelbookings", {
        method: "GET",
        headers: {
          "auth-token": token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data.bookedHotels); // Store booking data in state

      // Fetch user details for each booking's user ID
      const usersData = [];
      for (const booking of data.bookedHotels) {
        const userDetails = await fetchUserDetails(booking.user, token);
        usersData.push(userDetails);
      }

      setUsers(usersData); // Store users data in state
      setLoading(false); // Stop loading after both bookings and users are fetched
    } catch (error) {
      setError(error.message);
      setLoading(false); // Stop loading even if there's an error
    }
  };

  // Fetch bookings and users data when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage

    if (!token) {
      setError("No authentication token found.");
      setLoading(false);
      return;
    }

    fetchBookings(token); // Fetch booking and user data
  }, []);

  return (
    <div className="history-container">
      <h2>Hotel Booking History</h2>

      {/* Show loading state or error */}
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="booking-cards">
        {/* Display each booking as a card */}
        {bookings.length > 0 ? (
          bookings.map((booking, index) => {
            const user = users[index]; // Get corresponding user data for each booking

            return (
              <div key={booking._id} className="booking-card">
                <div className="user-info">
                  {/* Display user image or default if missing */}
                  <img
                    src={user?.image || "/default-avatar.png"}
                    alt={user?.name || "User"}
                    className="user-image"
                  />
                  <p className="user-name">{user?.name}</p>
                </div>

                {/* Display booking details */}
                <h3>{booking.hotel.name}</h3>
                <p>Status: {booking.status}</p>
                <p>Rooms: {booking.rooms}</p>
                <p>Dates: {booking.dates.join(" - ")}</p>
              </div>
            );
          })
        ) : (
          <p>No bookings found</p>
        )}
      </div>
    </div>
  );
}
