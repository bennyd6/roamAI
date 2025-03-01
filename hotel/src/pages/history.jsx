import { useEffect, useState } from "react";
import "./history.css";

export default function History() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true); // ✅ Add loading state
    const [error, setError] = useState(null); // ✅ Add error state

    useEffect(() => {
        const fetchBookings = async () => {
            const token = localStorage.getItem("authToken"); // Retrieve token from storage
            if (!token) {
                console.error("No token found! User not authenticated.");
                return;
            }
    
            try {
                const response = await fetch("http://localhost:3000/api/hotels/gethotelbookings", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": `${token}` // ✅ Attach token
                    },
                });
    
                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }
    
                const data = await response.json();
                setBookings(data.bookings);
            } catch (error) {
                console.error("Error fetching bookings:", error.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchBookings();
    }, []);
    

    return (
        <div className="history-container">
            <h2>Hotel Booking History</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            <div className="booking-cards">
                {bookings.length > 0 ? (
                    bookings.map((booking, index) => (
                        <div key={index} className="booking-card">
                            <h3>Hotel ID: {booking.hotelId}</h3>
                            <p><strong>User:</strong> {booking.userName} ({booking.userEmail})</p>
                            <p><strong>Rooms:</strong> {booking.rooms}</p>
                            <p><strong>Dates:</strong> {booking.dates.join(", ")}</p>
                            <p><strong>Status:</strong> {booking.status}</p>
                        </div>
                    ))
                ) : (
                    <p>No bookings found</p>
                )}
            </div>
        </div>
    );
}
