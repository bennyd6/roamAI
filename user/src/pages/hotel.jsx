import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import './hotel.css';

export default function Hotel() {
    const [hotels, setHotels] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [bookingDetails, setBookingDetails] = useState({
        startDate: '',
        endDate: '',
        numRooms: 1,
    });

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const { data } = await axios.get('http://localhost:3000/api/hotels/getAllHotels');
                setHotels(data);
            } catch (error) {
                console.error('Error fetching hotels:', error);
            }
        };

        fetchHotels();
    }, []);

    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);

    const filteredHotels = useMemo(() => {
        return hotels.filter(hotel =>
            hotel.location?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [hotels, searchQuery]);

    // Handle form input changes
    const handleInputChange = (e) => {
        setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
    };

    const handleBookNow = async (hotelId) => {
        try {
            const authToken = localStorage.getItem('authToken'); // Get token
    
            if (!authToken) {
                alert('User not logged in');
                return;
            }
    
            const response = await axios.post(
                'http://localhost:3000/api/hotels/bookRooms',
                {
                    hotelId,
                    numRooms: bookingDetails.numRooms,
                    startDate: bookingDetails.startDate,
                    endDate: bookingDetails.endDate,
                },
                {
                    headers: { 'auth-token': authToken } // Send token in headers
                }
            );
    
            alert(response.data.message || 'Booking successful');
        } catch (error) {
            console.error('Error booking hotel:', error);
            alert(error.response?.data?.error || 'Booking failed');
        }
    };
    
    

    return (
        <div className="hotel-main">
            <h1>Choose Your Hotel</h1>

            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-bar"
                placeholder="Search by location (e.g. Hyderabad)"
            />

            <div className="hotel-cards-container">
                {filteredHotels.map((hotel) => (
                    <div key={hotel._id} className="hotel-card">
                        <img 
                            src={`http://localhost:3000/${hotel.image}`} 
                            alt={hotel.name} 
                            className="hotel-image" 
                        />
                        <div className="hotel-details">
                            <h2>{hotel.name}</h2>
                            <p>{hotel.address}</p>
                            <p className="hotel-price">Rent: ₹{hotel.rent}/night</p>

                            <div className="hotel-info">
                                <p><strong>Rooms Available:</strong> {hotel.rooms}</p>
                                <p><strong>Contact:</strong> {hotel.phn}</p>
                                <p><strong>Location:</strong> {hotel.location}</p>
                            </div>

                            {/* Booking Form */}
                            <div className="booking-form">
                                <label>Start Date:</label>
                                <input type="date" name="startDate" value={bookingDetails.startDate} onChange={handleInputChange} />

                                <label>End Date:</label>
                                <input type="date" name="endDate" value={bookingDetails.endDate} onChange={handleInputChange} />

                                <label>Number of Rooms:</label>
                                <input type="number" name="numRooms" min="1" value={bookingDetails.numRooms} onChange={handleInputChange} />

                                <button className="book-now-btn" onClick={() => handleBookNow(hotel._id)}>
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
