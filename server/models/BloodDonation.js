const mongoose = require('mongoose');

const bloodDonationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor',
        required: true
    },
    bloodGroup: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    bags: {
        type: Number,
        required: true,
        min: 1
    },
    donationDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('BloodDonation', bloodDonationSchema);