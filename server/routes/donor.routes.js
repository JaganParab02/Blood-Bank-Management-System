const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Donor = require('../models/Donor');
const auth = require('../middleware/auth');
const BloodDonation = require('../models/BloodDonation');

// Validation middleware
const donorValidationRules = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('age').isInt({ min: 18, max: 65 }).withMessage('Age must be between 18 and 65'),
    body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
    body('contactNumber').trim().notEmpty().withMessage('Contact number is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('bloodGroup').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood group'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Register donor
router.post('/register', donorValidationRules, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        
        let donor = await Donor.findOne({ email });
        if (donor) {
            return res.status(400).json({ message: 'Donor already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        donor = new Donor({
            ...req.body,
            password: hashedPassword
        });

        await donor.save();

        const token = jwt.sign(
            { id: donor._id, role: 'donor' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login donor
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const donor = await Donor.findOne({ email });
        if (!donor) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, donor.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: donor._id, role: 'donor' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get donor profile
router.get('/profile', auth, async (req, res) => {
    try {
        const donor = await Donor.findById(req.user.id).select('-password');
        res.json(donor);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Search donors
router.get('/search', async (req, res) => {
    try {
        const { bloodGroup, city } = req.query;
        const query = {};
        
        if (bloodGroup) query.bloodGroup = bloodGroup;
        if (city) query.city = new RegExp(city, 'i');
        
        const donors = await Donor.find(query)
            .select('-password')
            .sort({ createdAt: -1 });
            
        res.json(donors);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get donor's donation history
router.get('/donations', auth, async (req, res) => {
    try {
        const donations = await BloodDonation.find({ donor: req.user.id })
            .sort({ donationDate: -1 });
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;