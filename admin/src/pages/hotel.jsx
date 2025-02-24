import { useState } from 'react';
import './hotel.css';

export default function Hotel() {
    // Sample hotel data with additional details (address, contact number, available rooms)
    const hotelData = [
        {
            name: 'Hyatt Centric',
            image: 'https://link-to-hyatt-image.jpg', // Replace with actual image URL
            price: '$120/night',
            description: 'A luxurious 5-star hotel with premium amenities and a central location.',
            contact: '987-654-3210',
            roomsAvailable: 25,
            address: 'Hyderabad, India',
            city: 'Hyderabad',
        },
        {
            name: 'Marriott Hotel',
            image: 'https://link-to-marriott-image.jpg', // Replace with actual image URL
            price: '$100/night',
            description: 'A modern hotel with great service and facilities for both business and leisure.',
            contact: '123-456-7890',
            roomsAvailable: 15,
            address: 'Bangalore, India',
            city: 'Bangalore',
        },
        {
            name: 'The Oberoi',
            image: 'https://link-to-oberoi-image.jpg', // Replace with actual image URL
            price: '$200/night',
            description: 'An elegant hotel offering luxury and comfort with outstanding views.',
            contact: '555-888-9999',
            roomsAvailable: 10,
            address: 'New Delhi, India',
            city: 'New Delhi',
        },
        {
            name: 'Holiday Inn',
            image: 'https://link-to-holidayinn-image.jpg', // Replace with actual image URL
            price: '$80/night',
            description: 'A budget-friendly hotel offering comfortable rooms with great amenities.',
            contact: '444-555-6666',
            roomsAvailable: 30,
            address: 'Chennai, India',
            city: 'Chennai',
        }
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredHotels, setFilteredHotels] = useState(hotelData);

    // Handle search input change
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Filter hotels based on city
        const filtered = hotelData.filter(hotel =>
            hotel.city.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredHotels(filtered);
    };

    // Handle "Book Now" action
    const handleBookNow = (hotelName) => {
        alert(`You have selected to book the ${hotelName}. Proceed to booking.`);
    };

    return (
        <div className="hotel-main">
            <h1>Choose Your Hotel</h1>
            
            {/* Search Bar */}
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-bar"
                placeholder="Search by city (e.g. Hyderabad)"
            />

            <div className="hotel-cards-container">
                {filteredHotels.map((hotel, index) => (
                    <div key={index} className="hotel-card">
                        <img src={hotel.image} alt={hotel.name} className="hotel-image" />
                        <div className="hotel-details">
                            <h2>{hotel.name}</h2>
                            <p>{hotel.description}</p>
                            <p className="hotel-price">{hotel.price}</p>

                            {/* Additional Hotel Details */}
                            <div className="hotel-info">
                                <p><strong>Rooms Available:</strong> {hotel.roomsAvailable}</p>
                                <p><strong>Contact:</strong> {hotel.contact}</p>
                                <p><strong>Address:</strong> {hotel.address}</p>
                            </div>

                            {/* Book Now Button */}
                            <button
                                className="book-now-btn"
                                onClick={() => handleBookNow(hotel.name)}
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
