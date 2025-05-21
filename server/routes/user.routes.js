const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const auth = require('../middleware/auth');

// Register user
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, contactNumber } = req.body;
        
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        user = new User({
            name,
            email,
            password: hashedPassword,
            contactNumber
        });

        await user.save();

        const token = jwt.sign(
            { id: user._id, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create blood request
router.post('/blood-request', auth, async (req, res) => {
    try {
        const { bloodGroup, quantity } = req.body;
        
        const request = new BloodRequest({
            user: req.user.id,
            bloodGroup,
            quantity
        });

        await request.save();
        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's blood requests
router.get('/blood-requests', auth, async (req, res) => {
    try {
        const requests = await BloodRequest.find({ user: req.user.id })
            .sort({ requestDate: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;