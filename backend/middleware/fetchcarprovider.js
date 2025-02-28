const CarProvider = require('../models/carProvider'); // Adjust the path as necessary
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Bennyi$ag00dguy';

const fetchcarprovider = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ error: "Please authenticate using a valid token" });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        console.log("Decoded token data:", data); // Log the decoded token for debugging
        
        const carProvider = await CarProvider.findById(data.carprovider.id);  // Use the farmer's ID from the token
        if (!carProvider) {
            return res.status(404).json({ error: "Car provider not found" });
        }
        
        req.carprovider = carProvider;
        next();
    } catch (error) {
        console.error("Token verification error:", error); // Log any verification issues
        return res.status(401).json({ error: "Please authenticate using a valid token" });
    }
};

module.exports = fetchcarprovider;
