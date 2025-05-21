const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bloodGroup: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    approvedQuantity: {
        type: Number,
        default: 0
    },
    remark: {
        type: String
    },
    requestDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);