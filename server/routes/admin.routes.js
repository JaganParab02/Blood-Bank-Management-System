const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const BloodDonation = require('../models/BloodDonation');
const BloodStock = require('../models/BloodStock');
const BloodRequest = require('../models/BloodRequest'); // Add this line

// Initialize default admin account
const initializeAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin', 12);
      const admin = new Admin({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@bloodbank.com'
      });
      await admin.save();
      console.log('Default admin account created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

initializeAdmin();

// Admin login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blood stock
router.get('/blood-stock', async (req, res) => {
    try {
        const stocks = await BloodStock.find();
        res.json(stocks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update blood stock
router.put('/blood-stock/:bloodGroup', async (req, res) => {
    try {
        const { quantity } = req.body;
        const { bloodGroup } = req.params;

        let stock = await BloodStock.findOne({ bloodGroup });
        
        if (stock) {
            stock.quantity = quantity;
            stock.lastUpdated = Date.now();
            await stock.save();
        } else {
            stock = new BloodStock({
                bloodGroup,
                quantity
            });
            await stock.save();
        }

        res.json(stock);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add blood donation
router.post('/donations', async (req, res) => {
    try {
        const { donorId, bloodGroup, bags } = req.body;
        
        // Create donation record
        const donation = new BloodDonation({
            donor: donorId,
            bloodGroup,
            bags
        });
        await donation.save();

        // Update blood stock
        let stock = await BloodStock.findOne({ bloodGroup });
        if (stock) {
            stock.quantity += bags;
            await stock.save();
        } else {
            stock = new BloodStock({
                bloodGroup,
                quantity: bags
            });
            await stock.save();
        }

        res.status(201).json(donation);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all donations
router.get('/donations', async (req, res) => {
    try {
        const donations = await BloodDonation.find()
            .populate('donor', 'name bloodGroup')
            .sort({ donationDate: -1 });
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all blood requests
router.get('/blood-requests', async (req, res) => {
    try {
        const requests = await BloodRequest.find()
            .populate('user', 'name email contactNumber')
            .sort({ requestDate: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update blood request status
router.put('/blood-requests/:requestId', async (req, res) => {
    try {
        const { status, approvedQuantity, remark } = req.body;
        const request = await BloodRequest.findById(req.params.requestId);
        
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = status;
        request.approvedQuantity = approvedQuantity || 0;
        request.remark = remark;
        await request.save();

        // If approved, update blood stock
        if (status === 'approved' && approvedQuantity > 0) {
            const stock = await BloodStock.findOne({ bloodGroup: request.bloodGroup });
            if (stock) {
                stock.quantity = Math.max(0, stock.quantity - approvedQuantity);
                await stock.save();
            }
        }

        res.json(request);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;