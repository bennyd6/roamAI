const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Hotel = require('../models/Hotel');
const multer = require('multer');
const path = require('path');
const fetchHotel = require('../middleware/fetchHotel');
const fetchhotel = require('../middleware/fetchHotel');
const fetchuser = require('../middleware/fetchuser');
const User = require('../models/User'); // Import User model
const mongoose=require('mongoose')

const JWT_SECRET = 'Bennyi$ag00dguy';

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save images in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage });



router.get('/gethotelbookings', fetchHotel, async (req, res) => {
  try {
    // Access the hotelId from the fetched hotel in the middleware
    const hotelId = req.hotel._id;

    // Ensure that the hotelId is an ObjectId when comparing with the User's bookedHotel
    const objectIdHotel = new mongoose.Types.ObjectId(hotelId); // Use 'new' here

    // Find all users who have booked this hotel
    const users = await User.find({
      'bookedHotel.hotel': objectIdHotel  // Find users who have this hotelId in their bookedHotel schema
    }).populate('bookedHotel.hotel');  // Populate the hotel field for each bookedHotel

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found for the given hotelId' });
    }

    // Extract the bookedHotel details for each user
    const bookedHotels = users.map(user => {
      return user.bookedHotel.filter(booked => booked.hotel._id.toString() === objectIdHotel.toString());
    }).flat();

    // Return the booked hotels for this hotelId
    res.json({ bookedHotels });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});



router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body;
    try {
      // Check if hotel exists
      let hotel = await Hotel.findOne({ email });
      if (!hotel) {
        return res.status(400).json({ error: "Incorrect credentials" });
      }
  
      // Compare password
      const passwordMatch = await bcrypt.compare(password, hotel.password);
      if (!passwordMatch) {
        return res.status(400).json({ error: "Incorrect credentials" });
      }
  
      // Prepare JWT payload
      const data = {
        hotel: { id: hotel.id }
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


// Hotel Registration Route (with image upload)
router.post('/createHotel', 
  upload.single('image'),
  [
    body('name', 'Enter a valid name').isLength({ min: 5 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
    body('phn', 'Enter a valid phone number').isLength({ min: 10 }),
    body('location'),
    body('address'),
    body('rent'),
    body('rooms').isNumeric().withMessage('Rooms must be a number')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phn, location, address, rent, rooms } = req.body;
    const image = req.file ? req.file.path : null; // Store uploaded image path

    try {
      let hotel = await Hotel.findOne({ email });

      if (hotel) {
        return res.status(400).json({ error: "A hotel with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      hotel = new Hotel({
        name,
        email,
        password: hashedPassword,
        phn,
        image,
        location,
        address,
        rent,
        rooms
      });

      await hotel.save();

      const payload = {
        hotel: {
          id: hotel.id
        }
      };

      jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token, imagePath: image });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.get('/getHotel', fetchHotel, async (req, res) => {
    try {
      res.json(req.hotel);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });  


  
  router.get("/getAllHotels", async (req, res) => {
    try {
      const hotels = await Hotel.find();
      res.json(hotels);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });
  
  router.post('/bookRooms', fetchuser, async (req, res) => {
    try {
        const { hotelId, startDate, endDate, numRooms } = req.body;
        const userId = req.user.id; // Extract userId from middleware

        if (!hotelId || !startDate || !endDate || !numRooms) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) return res.status(404).json({ error: 'Hotel not found' });

        const dates = [new Date(startDate), new Date(endDate)];

        const newBooking = {
            hotel: new mongoose.Types.ObjectId(hotelId),
            user: new mongoose.Types.ObjectId(userId),
            dates,
            rooms: numRooms,
            status: 'pending'
        };

        user.bookedHotel.push(newBooking);
        await user.save();

        res.status(201).json({ message: 'Booking request submitted successfully', booking: newBooking });
    } catch (error) {
        console.error('Error booking hotel:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

  


module.exports = router;
