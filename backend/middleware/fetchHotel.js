const jwt = require('jsonwebtoken');
const Hotel = require('../models/Hotel');

const JWT_SECRET = 'Bennyi$ag00dguy';

const fetchHotel = async (req, res, next) => {
  // Get token from header
  const token = req.header('auth-token');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }

  try {
    // Verify token
    const data = jwt.verify(token, JWT_SECRET);
    
    // Find the hotel in the database
    const hotel = await Hotel.findById(data.hotel.id).select('-password');
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    // Attach hotel data to request object
    req.hotel = hotel;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = fetchHotel;
