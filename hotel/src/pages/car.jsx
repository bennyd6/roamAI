import { useState } from 'react';
import './car.css';

export default function Car() {
    // Sample car data with additional details (driver, phone number, and registration number)
    const carData = [
        {
            name: 'Tesla Model S',
            image: 'https://link-to-tesla-image.jpg', // Replace with actual image URL
            price: '$100/day',
            description: 'A luxury electric car with amazing performance and technology.',
            driver: 'John Doe',
            phone: '123-456-7890',
            regNo: 'ABC1234',
            place: 'Hyderabad',
        },
        {
            name: 'BMW 5 Series',
            image: 'https://link-to-bmw-image.jpg', // Replace with actual image URL
            price: '$80/day',
            description: 'A stylish sedan with a focus on comfort and performance.',
            driver: 'Jane Smith',
            phone: '987-654-3210',
            regNo: 'XYZ5678',
            place: 'Hyderabad',
        },
        {
            name: 'Audi Q7',
            image: 'https://link-to-audi-image.jpg', // Replace with actual image URL
            price: '$90/day',
            description: 'A luxurious SUV perfect for long trips with ample space.',
            driver: 'Sam Wilson',
            phone: '555-123-4567',
            regNo: 'LMN6789',
            place: 'Bangalore',
        },
        {
            name: 'Honda Civic',
            image: 'https://link-to-honda-image.jpg', // Replace with actual image URL
            price: '$50/day',
            description: 'A reliable and fuel-efficient car, great for city drives.',
            driver: 'Alice Brown',
            phone: '444-888-9999',
            regNo: 'DEF3456',
            place: 'Bangalore',
        }
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCars, setFilteredCars] = useState(carData);

    // Handle search input change
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Filter the cars based on place
        const filtered = carData.filter(car =>
            car.place.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCars(filtered);
    };

    // Handle "Book Now" action
    const handleBookNow = (carName) => {
        alert(`You have selected to book the ${carName}. Proceed to booking.`);
    };

    return (
        <div className="car-main">
            <h1>Choose Your Car</h1>
            
            {/* Search Bar */}
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-bar"
                placeholder="Search by place (e.g. Hyderabad)"
            />

            <div className="car-cards-container">
                {filteredCars.map((car, index) => (
                    <div key={index} className="car-card">
                        <img src={car.image} alt={car.name} className="car-image" />
                        <div className="car-details">
                            <h2>{car.name}</h2>
                            <p>{car.description}</p>
                            <p className="car-price">{car.price}</p>

                            {/* Additional Car Details */}
                            <div className="car-info">
                                <p><strong>Driver:</strong> {car.driver}</p>
                                <p><strong>Phone:</strong> {car.phone}</p>
                                <p><strong>Registration No:</strong> {car.regNo}</p>
                            </div>

                            {/* Book Now Button */}
                            <button
                                className="book-now-btn"
                                onClick={() => handleBookNow(car.name)}
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
