import { useState, useEffect } from "react";
import axios from "axios";
import "./home.css";

export default function Home() {
  const [hotel, setHotel] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:3000/api/hotels/getHotel", {
          headers: { "auth-token": token },
        });
        setHotel(response.data);
      } catch (error) {
        console.error("Error fetching hotel data:", error);
        setError("Failed to load hotel details.");
      }
    };

    const fetchPendingRequests = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:3000/api/bookings/getmyhotelpendingrequests", {
          headers: { "auth-token": token },
        });
        setPendingRequests(response.data.pendingRequests || []);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
        setError("Failed to load pending booking requests.");
      }
    };

    fetchHotel();
    fetchPendingRequests();
  }, []);


  
  // Function to handle Accept/Reject booking
  const handleStatusChange = async (bookingId, status) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        "http://localhost:3000/api/bookings/updatehotelbooking",
        { bookingId, status },
        { headers: { "auth-token": token } }
      );

      if (response.data.success) {
        // Update the UI by filtering out the updated booking
        setPendingRequests(pendingRequests.filter((request) => request._id !== bookingId));
      }
    } catch (error) {
      console.error(`Error updating booking status to ${status}:`, error);
    }
  };

  return (
    <div className="home-main">
      <h1>Your Hotel</h1>

      {error && <p className="error-message">{error}</p>}

      {hotel ? (
        <div className="hotel-card">
          <img src={`http://localhost:3000/${hotel.image}`} alt={hotel.name} className="hotel-image" />
          <div className="hotel-details">
            <h2>{hotel.name}</h2>
            <p><strong>Email:</strong> {hotel.email}</p>
            <p><strong>Phone:</strong> {hotel.phn}</p>
            <p><strong>Location:</strong> {hotel.location}</p>
            <p><strong>Address:</strong> {hotel.address}</p>
            <p><strong>Rent per night:</strong> ${hotel.rent}</p>
            <p><strong>Available Rooms:</strong> {hotel.rooms}</p>
          </div>
        </div>
      ) : (
        <p>Loading hotel details...</p>
      )}

      <h2>Pending Booking Requests</h2>
      {pendingRequests.length > 0 ? (
        <ul className="pending-requests">
          {pendingRequests.map((request, index) => (
            <li key={request._id || index} className="request-card">
              <h3>Booking Request</h3>
              <p><strong>User:</strong> {request.user.name} ({request.user.email})</p>
              <p><strong>Requested Dates:</strong> {request.dates.join(", ")}</p>
              <p><strong>Rooms Requested:</strong> {request.rooms}</p>
              <p><strong>Status:</strong> {request.status}</p>
              
              <div className="button-group">
                {request._id ? (
                  <>
                    <button className="accept-btn" onClick={() => handleStatusChange(request._id, "confirmed")}>
                      Accept
                    </button>
                    <button className="reject-btn" onClick={() => handleStatusChange(request._id, "canceled")}>
                      Reject
                    </button>
                  </>
                ) : (
                  <p style={{ color: "red" }}>Missing Booking ID</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending requests</p>
      )}
    </div>
  );
}
