const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    model: { type: String, required: true },
    rent: { type: Number, required: true },
    bookedDates: { type: [Date], default: [] },
    regdNumber: { type: String, required: true },
    image: { type: String }  // Store image URL or file path
});

const carProviderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phn: { type: String, required: true },
    password: { type: String, required: true },
    cars: { type: [carSchema], default: [] }
});

const CarProvider = mongoose.model('carprovider', carProviderSchema);
module.exports = CarProvider;
